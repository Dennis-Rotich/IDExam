import examModel from "../models/examModel.js";

// CREATE
const createExam = async (req, res) => {
    try {
        const { title, durationInMinutes, problems } = req.body;

        const newExam = new examModel({
            title, 
            createdBy: req.user.id, 
            durationInMinutes, 
            problems
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