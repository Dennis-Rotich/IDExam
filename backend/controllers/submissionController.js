import submissionModel from "../models/submissionModel.js";
import examModel from "../models/examModel.js";
import axios from "axios";

// to handle frequent API saves
const autosave = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { problemId, language, answer } = req.body;

    if (!problemId || answer === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Attempt to update the existing answer for this problem
    let result = await submissionModel.findOneAndUpdate(
      {
        sessionId: sessionId,
        "answers.problemId": problemId,
        status: "IN_PROGRESS",
      },
      {
        $set: {
          "answers.$.answer": answer,
          "answers.$.language": language,
        },
      },
      { new: true },
    );

    // If the answer object doesn't exist in the array yet, push it
    if (!result) {
      result = await submissionModel.findOneAndUpdate(
        { sessionId: sessionId, status: "IN_PROGRESS" },
        {
          $push: {
            answers: { problemId, language, answer },
          },
        },
        { new: true },
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Session not found or exam submitted.",
        });
      }
    }

    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Autosave Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to autosave" });
  }
};

const studentSubmit = async (req, res) => {
  try {
    // replaced examId and problemId with sessionId since the session is where everything happens
    const { sessionId } = req.params;
    // replaced studentId with problemId
    const { problemId, language, code } = req.body;

    // Get submission session first to ensure it's active and fetch the examId
    const submission = await submissionModel.findOne({
      sessionId,
      status: "IN_PROGRESS",
    });
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Active submission session not found.",
      });
    }

    const exam = await examModel.findById(submission.exam);
    if (!exam)
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });

    const problem = exam.problems.id(problemId);
    if (!problem)
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });

    let testResults = [];
    let passedAll = true;
    let totalScore = 0;

    for (const testCase of problem.testCases) {
      const pistonPayload = {
        language: language, // Must be the string name e.g., 'python', 'javascript'
        version: "*",
        files: [{ name: "main", content: code }],
        stdin: testCase.input || "", // Test input
        run_timeout: 3000,
        compile_timeout: 3000,
      };

      const { data } = await axios.post(
        "http://68.210.224.3/api/v2/execute",
        pistonPayload,
      );

      const compileCode = data.compile ? data.compile.code : 0;
      const compileOutput = data.compile ? data.compile.output : "";

      const runCodeStatus = data.run ? data.run.code : 0;
      const runOutput = data.run ? data.run.output : "";

      const exitCode = data.run ? data.run.code : 1;
      
      const actualOutputClean = runOutput.trim();
      const expectedOutputClean = testCase.expectedOutput.trim();

      const isPassed =
        compileCode === 0 &&
        runCodeStatus === 0 &&
        actualOutputClean === expectedOutputClean;

      // Determine exact error message
      let errorMessage = null;
      if (!isPassed) {
        if (data.message) errorMessage = data.message;
        else if (compileCode !== 0)
          errorMessage = compileOutput; // Give them the compiler trace
        else if (runCodeStatus !== 0)
          errorMessage = runOutput; // Give them the runtime crash trace
        else
          errorMessage = `Expected: ${expectedOutputClean}, Got: ${actualOutputClean}`; // Logic error
      }
      if (isPassed) totalScore += testCase.points;

      testResults.push({
        testCaseId: testCase._id,
        passed: isPassed,
        actualOutput: runOutput,
        // Piston doesn't give granular ms execution time easily, so we estimate or default to 0
        executionTimeMs: 0,
        errorMessage: isPassed
          ? null
          : errorMessage ||
            `Expected: ${expectedOutputClean}, Got: ${actualOutputClean}`,
      });
    }

    let overallStatus = "Accepted";
    if (!passedAll) {
      const firstError = testResults.find((tr) => !tr.passed);
      if (
        firstError.errorMessage &&
        firstError.errorMessage.includes("compile")
      ) {
        overallStatus = "Compilation Error";
      } else if (
        firstError.errorMessage &&
        !firstError.errorMessage.includes("Expected")
      ) {
        overallStatus = "Runtime Error";
      } else {
        overallStatus = "Wrong Answer";
      }
    }

    // evaluatedAnswer
    const newProblemSubmission = {
      problemId: problemId,
      language: language,
      code: code,
      status: overallStatus,
      testResults: testResults,
      score: totalScore,
    };

    // Remove the old autosaved answer to prevent duplicates, then push the graded one
    await submissionModel.updateOne(
      { sessionId: sessionId },
      { $pull: { answers: { problemId: problemId } } },
    );

    await submissionModel.findOneAndUpdate(
      { sessionId: sessionId },
      {
        $push: { answers: evaluatedAnswer },
        // Note: isGraded is removed here because evaluating one problem does not mean the entire exam is graded.
        $inc: { totalScore: totalScore },
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      status: overallStatus,
      score: totalScore,
      // Only return results for PUBLIC test cases so students can't cheat the hidden ones
      results: testResults.filter((tr) => {
        const originalTestCase = problem.testCases.id(tr.testCaseId);
        return !originalTestCase.isHidden;
      }),
    });
  } catch (error) {
    console.error("Evaluation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to evaluate code.",
    });
  }
};

const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const pistonPayload = {
      language: language, // Must be the string name e.g., 'python', 'javascript'
      version: "*",
      files: [{ name: "main", content: code }],
      run_timeout: 3000,
      compile_timeout: 3000,
    };

    //const { data } = await axios.post('http://68.210.224.3/api/v2/execute', pistonPayload)
    const { data } = await axios.post(
      "http://127.0.0.1:2000/api/v2/execute",
      pistonPayload,
    );

    // Explicitly check compile vs run status
    const compileCode = data.compile ? data.compile.code : 0;
    const compileOutput = data.compile ? data.compile.output : "";

    const runCodeStatus = data.run ? data.run.code : 0;
    const runOutput = data.run ? data.run.output : "";

    const exitCode = data.run ? data.run.code : 1;
    // It is an error if either compilation or execution fails
    const isError = compileCode !== 0 || runCodeStatus !== 0;

    // If compilation failed, send compileOutput. Otherwise, send runOutput.
    const actualOutputClean =
      compileCode !== 0 ? compileOutput.trim() : runOutput.trim();

    // Fallback for edge cases where Piston returns a top-level message (e.g., language not found)
    const finalOutput = data.message ? data.message.trim() : actualOutputClean;

    res.status(200).json({
      success: true,
      isError,
      output: finalOutput,
    });
  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({
      success: false,
      message: "Error during code execution.",
    });
  }
};

// 
const getSubmission = async (req, res) => {
    try {
        const { sessionId } = req.params;
        let submission = await submissionModel.findOne({ sessionId });

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        // LAZY EVALUATION: If the exam is marked IN_PROGRESS but the time has passed
        if (submission.status === 'IN_PROGRESS' && new Date() > submission.endsAt) {
            
            // Force it to be completed
            submission = await submissionModel.findOneAndUpdate(
                { sessionId },
                { 
                    $set: { 
                        status: 'COMPLETED', 
                        submittedAt: submission.endsAt // They "submitted" exactly when time ran out
                    } 
                },
                { new: true }
            );
            
            // Note: You would trigger your auto-grader function here asynchronously
        }

        res.status(200).json({ success: true, submission });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { studentSubmit, runCode, autosave, getSubmission };
