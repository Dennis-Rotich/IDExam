import submissionModel from "../models/submissionModel.js";
import examModel from "../models/examModel.js";
import axios from "axios";


const studentSubmit = async(req, res) => {
    try {
        
        const {studentId, language, code} = req.body;
        const {examId, problemId} = req.params;

        const exam = await examModel.findById(examId);
        if(!exam) return res.status(404).json({success:false, message:"Exam not found"});

        const problem = exam.problems.id(problemId);
        if(!problem) return res.status(404).json({success:false, message:"Problem not found"});

        let testResults = [];
        let passedAll = true;
        let totalScore = 0;

        for (const testCase of problem.testCases){
            const pistonPayload = {
                language: language, // Must be the string name e.g., 'python', 'javascript'
                version: "*",
                files: [{ name: "main", content: code }],
                stdin: testCase.input || "", // Test input
                run_timeout: 3000,
                compile_timeout: 3000
            };

            const {data} = await axios.post('http://127.0.0.1:2000/api/v2/execute', pistonPayload)

            const compileOutput = data.compile ? data.compile.output : "";
            const runOutput = data.run ? data.run.output : "";
            const exitCode = data.run ? data.run.code : 1;
            const errorMessage = data.message || compileOutput || (exitCode !== 0 ? runOutput : null);

            const actualOutputClean = runOutput.trim();
            const expectedOutputClean = testCase.expectedOutput.trim();

            const isPassed = (exitCode === 0) && (actualOutputClean === expectedOutputClean);

            if (!isPassed) passedAll = false;
            if (isPassed) totalScore += testCase.points;

            testResults.push({
                testCaseId: testCase._id,
                passed: isPassed,
                actualOutput: runOutput,
                // Piston doesn't give granular ms execution time easily, so we estimate or default to 0
                executionTimeMs: 0, 
                errorMessage: isPassed ? null : (errorMessage || `Expected: ${expectedOutputClean}, Got: ${actualOutputClean}`)
            });
        }

        let overallStatus = 'Accepted';
        if(!passedAll){
            const firstError = testResults.find(tr => !tr.passed);
            if (firstError.errorMessage && firstError.errorMessage.includes('compile')) {
                overallStatus = 'Compilation Error';
            } else if (firstError.errorMessage && !firstError.errorMessage.includes('Expected')) {
                overallStatus = 'Runtime Error';
            } else {
                overallStatus = 'Wrong Answer';
            }
        }

        const newProblemSubmission = {
            problemId: problemId,
            language: language,
            code: code,
            status: overallStatus,
            testResults: testResults,
            score: totalScore
        }

        await submissionModel.findOneAndUpdate(
            { exam: examId, student: studentId },
            { 
                $push: { problemSubmissions: newProblemSubmission },
                $set: { isGraded: true }, // Mark as graded
                $inc: { totalScore: totalScore } // Add to their total exam score
            },
            { upsert: true, new: true } 
        );

        res.status(200).json({
            success: true,
            status: overallStatus,
            score: totalScore,
            // Only return results for PUBLIC test cases so students can't cheat the hidden ones
            results: testResults.filter(tr => {
                const originalTestCase = problem.testCases.id(tr.testCaseId);
                return !originalTestCase.isHidden;
            })
        });

    } catch (error) {
        console.error("Evaluation Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to evaluate code.'
        });
    }
}

const runCode = async(req, res) => {
    try {

        const { language, code} = req.body;

        const pistonPayload = {
                language: language, // Must be the string name e.g., 'python', 'javascript'
                version: "*",
                files: [{ name: "main", content: code }],
                run_timeout: 3000,
                compile_timeout: 3000
        };

        const { data } = await axios.post('http://127.0.0.1:2000/api/v2/execute', pistonPayload)

        const compileOutput = data.compile ? data.compile.output : "";
        const runOutput = data.run ? data.run.output : "";
        const exitCode = data.run ? data.run.code : 1;
        const isError = exitCode !== 0;

        const actualOutputClean = runOutput.trim();

        res.status(200).json({
            success:true,
            isError, output:actualOutputClean
        })

    } catch (error) {
        console.error("Execution Error:", error);
        res.status(500).json({
            success: false,
            message: 'Error during code execution.'
        });
    }
}

export {studentSubmit, runCode}