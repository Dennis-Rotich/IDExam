import examModel from "../models/examModel.js";
import userModel from "../models/userModel.js";
import submissionModel from "../models/submissionModel.js";

// CREATE
const createExam = async (req, res) => {
    try {
        const { title, durationInMinutes, questions } = req.body;

        const newExam = new examModel({
            title, 
            createdBy: req.user.id, 
            durationInMinutes, 
            questions
        });

        await newExam.save();
        res.status(201).json({ success: true, message: "Exam created successfully!", examId: newExam._id });

    } catch (error) {
        console.error("Create Exam Error:", error);
        res.status(500).json({ success: false, message: "Failed to create exam" });
    }
};

// READ (Student - Sanitized)
const getExam = async (req, res) => {
    try {
        const exam = await examModel.findById(req.params.examId).lean();

        if (!exam || !exam.isActive) {
            return res.status(404).json({ success: false, message: "Exam not found or inactive" });
        }

        // Sanitize test cases so students cannot see hidden inputs/outputs
        const sanitizedProblems = exam.problems.map(problem => {
            const safeTestCases = problem.testCases
                .filter(tc => !tc.isHidden)
                .map(tc => ({
                    _id: tc._id,
                    input: tc.input,
                }));
            return {
                ...problem,
                testCases: safeTestCases
            };
        });

        exam.problems = sanitizedProblems;

        res.status(200).json({ success: true, exam });

    } catch (error) {
        console.error("Get Exam Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching exam" });
    }
};

// READ (Teacher - Full Details & List)
const getTeacherExams = async (req, res) => {
    try {
        // Fetch all exams created by this specific teacher
        const exams = await examModel.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, exams });
    } catch (error) {
        console.error("Get Teacher Exams Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch exams" });
    }
};

export const getAssignedExams = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Get the student's cohort string
    const student = await userModel.findById(studentId).select("cohort");
    // If the student has no cohort, they get no exams.
    if (!student || !student.cohort) {
      return res.status(200).json({ success: true, data: [] });
    }
    // 2. Fetch active exams where the assignedCohorts array includes the student's cohort string
    const exams = await examModel.find({ 
      isActive: true,
      assignedCohorts: student.cohort 
    })
      .populate("createdBy", "name")
      .lean();

    // 3. Fetch all submissions for THIS student
    const studentSubmissions = await submissionModel.find({ student: studentId }).lean();
    // 4. Create the O(1) lookup dictionary
    const submissionMap = {};
    studentSubmissions.forEach(sub => {
      submissionMap[sub.exam.toString()] = sub;
    });

    const now = new Date();

    // 5. Map the exams and inject the submission context
    const formattedExams = exams.map((exam) => {
      const submission = submissionMap[exam._id.toString()];
      
      let availability = "available";
      let inProgress = false;
      let score;
      let instructorFeedback;

      const fromDate = exam.availableFrom ? new Date(exam.availableFrom) : new Date(0);
      const untilDate = exam.availableUntil ? new Date(exam.availableUntil) : new Date(8640000000000000);

      // check availability
      if (submission) {
        if (submission.status === "graded") {
          availability = "completed";
          score = submission.totalScore;
          instructorFeedback = submission.instructorFeedback; 
        } else if (submission.status === "submitted") {
          availability = "completed";
          score = null; 
        } else if (submission.status === "in-progress") {
          if (untilDate < now) {
            availability = "locked";
          } else {
            availability = "available";
            inProgress = true;
          }
        }
      } else {
        if (now < fromDate) {
          availability = "upcoming";
        } else if (now > untilDate) {
          availability = "locked";
        } else {
          availability = "available";
        }
      }

      // 6. Return exactly what the frontend expects
      return {
        id: exam._id,
        submission: submission || null,
        title: exam.title,
        subject: exam.subject || "General",
        instructorName: exam.createdBy?.name || "Instructor",
        availability,
        questionCount: exam.questions ? exam.questions.length : 0,
        durationMinutes: exam.durationInMinutes,
        availableFrom: exam.availableFrom,
        dueDate: exam.availableUntil,
        score,
        inProgress,
        instructorFeedback
      };
    });

    res.status(200).json({
      success: true,
      data: formattedExams
    });

  } catch (error) {
    console.error("Get Assigned Exams Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching exams" });
  }
};

const getExamForEdit = async (req, res) => {
    try {
        const exam = await examModel.findById(req.params.examId);

        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // Authorization: Ensure the requester actually owns this exam
        if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: You do not own this exam." });
        }

        res.status(200).json({ success: true, exam });
    } catch (error) {
        console.error("Get Exam For Edit Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching exam" });
    }
};

// UPDATE
const updateExam = async (req, res) => {
    try {
        const { title, durationInMinutes, problems, isActive } = req.body;
        const examId = req.params.examId;

        const exam = await examModel.findById(examId);
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // Authorization Check
        if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot edit this exam." });
        }

        const updatedExam = await examModel.findByIdAndUpdate(
            examId,
            { $set: { title, durationInMinutes, problems, isActive } },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: "Exam updated successfully.", exam: updatedExam });
    } catch (error) {
        console.error("Update Exam Error:", error);
        res.status(500).json({ success: false, message: "Failed to update exam" });
    }
};

// DELETE
const deleteExam = async (req, res) => {
    try {
        const examId = req.params.examId;

        const exam = await examModel.findById(examId);
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // Authorization Check
        if (exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot delete this exam." });
        }

        await examModel.findByIdAndDelete(examId);

        res.status(200).json({ success: true, message: "Exam deleted successfully." });
    } catch (error) {
        console.error("Delete Exam Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete exam" });
    }
};

export { 
    createExam, 
    getExam, 
    getTeacherExams, 
    getExamForEdit, 
    updateExam, 
    deleteExam 
};