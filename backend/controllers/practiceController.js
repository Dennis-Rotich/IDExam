import questionModel from "../models/questionModel.js";
import submissionModel from "../models/submissionModel.js";

export const getPracticeDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Extract pagination and filters from query parameters
    const { page = 1, limit = 20, search, category, tag } = req.query;

    // 1. Build the Database Query
    // CRITICAL: Only fetch questions meant for the practice dashboard
    const query = { isPracticeAvailable: true };

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.topic = category;
    }
    if (tag) {
      query.tags = tag; // Mongoose automatically checks if the array contains this string
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 2. Fetch paginated questions and total count in parallel
    const [questions, totalItems] = await Promise.all([
      questionModel.find(query)
        .sort({ displayId: 1 }) // Sort by LeetCode number
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      questionModel.countDocuments(query)
    ]);

    // 3. Fetch student submissions to calculate progress
    const studentSubmissions = await submissionModel.find({ student: studentId }).lean();
    
    const solvedQuestionIds = new Set();
    const attemptedQuestionIds = new Set();

    studentSubmissions.forEach(sub => {
      if (sub.answers) {
        sub.answers.forEach(ans => {
          attemptedQuestionIds.add(ans.questionId.toString());
          // Mark as solved if accepted or given points
          if (ans.status === "Accepted" || ans.score > 0) {
            solvedQuestionIds.add(ans.questionId.toString());
          }
        });
      }
    });

    // 4. Map the data for the React UI
    const practiceData = questions.map((q) => {
      const qIdStr = q._id.toString();
      
      let status = "none";
      if (solvedQuestionIds.has(qIdStr)) {
        status = "solved";
      } else if (attemptedQuestionIds.has(qIdStr)) {
        status = "calendar";
      }

      return {
        _id: q._id,
        questionId: q.displayId || 0, 
        title: q.title,
        topic: q.topic || "Algorithms", 
        tags: q.tags || [],
        acceptanceRate: Math.floor(Math.random() * (90 - 30) + 30), // Replace with real analytics later
        difficulty: q.difficulty || "Medium",
        status: status
      };
    });

    // 5. Send payload matching the frontend interface
    res.status(200).json({
      success: true,
      data: practiceData,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / parseInt(limit)),
        totalItems
      },
      meta: {
        totalSolved: solvedQuestionIds.size // Powers the "X / Y Solved" UI
      }
    });

  } catch (error) {
    console.error("Get Practice Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching practice data" });
  }
};