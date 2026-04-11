import questionModel from "../models/questionModel.js";

// @desc    Create a new question
export const createQuestion = async (req, res) => {
  try {
    const instructorId = req.user.id; // From your auth middleware

    const newQuestion = new questionModel({
      ...req.body,
      createdBy: instructorId,
    });

    const savedQuestion = await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: savedQuestion,
    });
  } catch (error) {
    console.error("Create Question Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error creating question" });
  }
};

// @desc    Get all questions (with optional filtering for 'My Questions')
export const getInstructorQuestions = async (req, res) => {
  try {
    // Fetch all questions for the bank. 
    // The frontend currently handles the "My Questions" vs "All" filtering.
    // If your bank gets too large, you should move that filtering here using query params.
    const questions = await questionModel.find()
      .populate("createdBy", "name email") // Adjust fields based on your User model
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Get Questions Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching questions" });
  }
};

// @desc    Update a question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user.id;

    // Optional: Verify the user owns the question before allowing update
    const question = await questionModel.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    if (question.createdBy.toString() !== instructorId) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this question" });
    }

    const updatedQuestion = await questionModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error("Update Question Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error updating question" });
  }
};

// @desc    Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user.id;

    const question = await questionModel.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    if (question.createdBy.toString() !== instructorId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this question" });
    }

    await questionModel.findByIdAndDelete(id);

    // Optional: You may want to check if this question is used in any active exams 
    // before allowing deletion to prevent breaking existing tests.

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete Question Error:", error);
    res.status(500).json({ success: false, message: "Server error deleting question" });
  }
};