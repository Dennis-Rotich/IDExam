import mongoose from "mongoose";
import 'dotenv/config'; // Make sure you have dotenv installed to read your MONGO_URI
import questionModel from "./models/questionModel.js";
import examModel from "./models/examModel.js";

// --- CONFIGURATION ---
const EXAM_ID = "69da81304484b95ea14e01b0"; 
const INSTRUCTOR_ID = "69d533edd2cf8830892964f4"; 

const seedQuestions = [
  {
    title: "Time Complexity of QuickSort",
    description: "What is the worst-case time complexity of the QuickSort algorithm, and what condition causes it?",
    type: "MULTIPLE_CHOICE",
    difficulty: "Medium",
    topic: "Sorting Algorithms",
    pointsWeight: 5,
    createdBy: INSTRUCTOR_ID,
    options: [
      "O(N log N) - Occurs when the pivot is always the median.",
      "O(N^2) - Occurs when the array is already sorted and the last element is chosen as the pivot.",
      "O(N) - Occurs when all elements are identical.",
      "O(log N) - Occurs when the array is partitioned perfectly in half every time."
    ],
    correctAnswer: 1 // Index of the correct option
  },
  {
    title: "Graph Traversal Methods",
    description: "Explain the primary difference between Breadth-First Search (BFS) and Depth-First Search (DFS) in terms of data structures used for their implementation.",
    type: "SHORT_ANSWER",
    difficulty: "Easy",
    topic: "Graph Theory",
    pointsWeight: 10,
    createdBy: INSTRUCTOR_ID,
    correctAnswer: "BFS uses a Queue (FIFO), while DFS uses a Stack (LIFO) or recursion."
  },
  {
    title: "Dynamic Programming Property",
    description: "Dynamic programming can only be applied to problems that exhibit optimal substructure and overlapping subproblems.",
    type: "TRUE_FALSE",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    pointsWeight: 5,
    createdBy: INSTRUCTOR_ID,
    correctAnswer: true
  },
  {
    title: "Implement Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    type: "CODING",
    difficulty: "Medium",
    topic: "Hash Maps / Arrays",
    pointsWeight: 20,
    createdBy: INSTRUCTOR_ID,
    allowedLanguages: ["python", "javascript", "java"],
    starterCode: {
      "python": "def twoSum(nums, target):\n    # Write your code here\n    pass",
      "javascript": "function twoSum(nums, target) {\n    // Write your code here\n}"
    },
    referenceSolution: "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []",
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false, points: 5 },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false, points: 5 },
      { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true, points: 10 }
    ],
    timeLimitMs: 2000,
    memoryLimitKb: 256000
  },
  {
    title: "Longest Common Subsequence",
    description: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.",
    type: "CODING",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    pointsWeight: 25,
    createdBy: INSTRUCTOR_ID,
    allowedLanguages: ["python", "javascript"],
    starterCode: {
      "python": "def longestCommonSubsequence(text1, text2):\n    # Write your code here\n    pass"
    },
    referenceSolution: "def longestCommonSubsequence(text1, text2):\n    dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]\n    for i in range(1, len(text1) + 1):\n        for j in range(1, len(text2) + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[len(text1)][len(text2)]",
    testCases: [
      { input: "\"abcde\"\n\"ace\"", expectedOutput: "3", isHidden: false, points: 5 },
      { input: "\"abc\"\n\"abc\"", expectedOutput: "3", isHidden: false, points: 5 },
      { input: "\"abc\"\n\"def\"", expectedOutput: "0", isHidden: true, points: 15 }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // 1. Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 2. Verify Exam Exists
    const exam = await examModel.findById(EXAM_ID);
    if (!exam) {
      console.error(`Exam with ID ${EXAM_ID} not found. Are you sure you copied the right ID?`);
      process.exit(1);
    }

    // 3. Insert Questions into Question Bank
    console.log("Inserting 5 new algorithm questions into the Question Bank...");
    const insertedQuestions = await questionModel.insertMany(seedQuestions);
    
    // 4. Extract the new ObjectIds
    const questionIds = insertedQuestions.map(q => q._id);
    console.log(`Successfully created questions with IDs: ${questionIds.join(', ')}`);

    // 5. Update the Exam Manifest
    console.log(`Attaching questions to Exam: ${exam.title}...`);
    exam.questions = [...exam.questions, ...questionIds];
    
    // Optional: Auto-calculate the total duration if you want, or just save the array
    await exam.save();

    console.log("✅ Seeding complete! Your Advanced Algorithms Midterm is fully loaded.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();