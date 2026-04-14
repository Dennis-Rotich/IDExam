import mongoose from "mongoose";
import examModel from "../models/examModel.js";
import userModel from "../models/userModel.js";
import submissionModel from "../models/submissionModel.js";
import questionModel from "../models/questionModel.js";

// CREATE
const createExam = async (req, res) => {
  try {
    const {
      title,
      durationInMinutes,
      questions,
      courseCode,
      examCode,
      availableFrom,
      availableUntil,
      instructions,
      aiProctoringEnabled,
      aiGradingEnabled,
      assignedCohorts,
    } = req.body;

    const newExam = new examModel({
      title,
      createdBy: req.user.id,
      durationInMinutes,
      questions,
      courseCode,
      examCode,
      instructions,
      availableFrom,
      availableUntil,
      aiProctoringEnabled,
      aiGradingEnabled,
      assignedCohorts,
    });

    await newExam.save();
    res.status(201).json({
      success: true,
      message: "Exam created successfully!",
      examId: newExam._id,
    });
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({ success: false, message: "Failed to create exam" });
  }
};

// READ (Student - Sanitized)
const getExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id; 
    
    // 1. Fetch the user to get their assigned cohort string
    // (If your auth middleware already attaches req.user.cohort, you can skip this db call)
    const currentUser = await userModel.findById(userId);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    // 2. Find the Exam by _id or examCode
    let query;
    if (mongoose.Types.ObjectId.isValid(examId)) {
      query = { _id: examId };
    } else {
      query = { examCode: examId }; 
    }

    const exam = await examModel.findOne(query).populate('questions').lean();

    if (!exam || !exam.isActive) {
      return res.status(404).json({ success: false, message: "Exam not found or inactive." });
    }

    // --- 3. THE AUTHORIZATION GATEKEEPER ---
    const isInstructor = exam.createdBy.toString() === userId.toString();
    
    // Check if the student's cohort string exists inside the exam's assignedCohorts array
    // Assuming currentUser.cohort is a string like "CS401"
    const studentCohort = currentUser.cohort; 
    let isAssignedStudent = false;

    if (exam.assignedCohorts && exam.assignedCohorts.length > 0) {
      // If the exam has specific cohorts, check for a match
      isAssignedStudent = exam.assignedCohorts.includes(studentCohort);
    } else {
      // OPTIONAL: If assignedCohorts is empty, decide if the exam is "open to all" or "locked"
      // Right now, an empty array means no students can join.
      isAssignedStudent = false; 
    }

    if (!isInstructor && !isAssignedStudent) {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: Your cohort is not assigned to this exam." 
      });
    }
    // (Add any testCase masking logic here if needed)

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
    const exams = await examModel
      .find({ createdBy: req.user.id })
      .populate('questions')
      .sort({ createdAt: -1 });
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
    const exams = await examModel
      .find({
        isActive: true,
        assignedCohorts: student.cohort,
      })
      .populate("createdBy", "name")
      .lean();

    // 3. Fetch all submissions for THIS student
    const studentSubmissions = await submissionModel
      .find({ student: studentId })
      .lean();
    // 4. Create the O(1) lookup dictionary
    const submissionMap = {};
    studentSubmissions.forEach((sub) => {
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

      const fromDate = exam.availableFrom
        ? new Date(exam.availableFrom)
        : new Date(0);
      const untilDate = exam.availableUntil
        ? new Date(exam.availableUntil)
        : new Date(8640000000000000);

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
        instructorFeedback,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedExams,
    });
  } catch (error) {
    console.error("Get Assigned Exams Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching exams" });
  }
};

const getExamForEdit = async (req, res) => {
  try {
    const exam = await examModel.findById(req.params.examId);

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    // Authorization: Ensure the requester actually owns this exam
    if (
      exam.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not own this exam.",
      });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    console.error("Get Exam For Edit Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching exam" });
  }
};

// UPDATE
const updateExam = async (req, res) => {
  try {
    const { examId } = req.params;
    
    // 1. Clone the request body
    const updateData = { ...req.body };

    // 2. SECURITY: Prevent instructors from hijacking ownership or changing the ID
    const forbiddenFields = ['_id', 'createdBy'];
    forbiddenFields.forEach((field) => delete updateData[field]);

    // 3. Clean up undefined fields to prevent accidental null overwrites
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided for update." });
    }

    // 4. Update the document dynamically
    const updatedExam = await examModel.findByIdAndUpdate(
      examId,
      { $set: updateData },
      // Note: using returnDocument: 'after' to avoid the Mongoose deprecation warning
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedExam) {
      return res.status(404).json({ success: false, message: "Exam not found." });
    }

    res.status(200).json({
      success: true,
      message: "Exam updated successfully.",
      exam: updatedExam,
    });
  } catch (error) {
    console.error("Update Exam Error:", error);
    res.status(500).json({ success: false, message: "Server error updating exam." });
  }
};

const addQuestionToExam = async (req, res) => {
  try {
    const examId = req.params.examId;

    // 1. Verify Exam exists and User is authorized
    const exam = await examModel.findById(examId);
    if (!exam)
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });

    if (
      exam.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // 2. Create the Question, attaching the examId
    const newQuestion = new questionModel({
      ...req.body, // title, difficulty, points, test_cases, etc.
      examId: exam._id,
      createdBy: req.user.id,
    });

    const savedQuestion = await newQuestion.save();

    // FIX: Initialize the array if it's undefined (legacy document handling)
    if (!exam.questions) {
      exam.questions = [];
    }

    // 3. Push the new Question's ID into the Exam's questions array
    exam.questions.push(savedQuestion._id);
    await exam.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully.",
      question_id: savedQuestion._id,
    });
  } catch (error) {
    console.error("Add Question Error:", error);
    res.status(500).json({ success: false, message: "Failed to add question" });
  }
};

// DELETE
const deleteExam = async (req, res) => {
  try {
    const examId = req.params.examId;

    const exam = await examModel.findById(examId);
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    // Authorization Check
    if (
      exam.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot delete this exam.",
      });
    }

    await examModel.findByIdAndDelete(examId);

    res
      .status(200)
      .json({ success: true, message: "Exam deleted successfully." });
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
  addQuestionToExam,
  deleteExam,
};
