import submissionModel from "../models/submissionModel.js";
import examModel from "../models/examModel.js";
import axios from "axios";

const checkJudge0Status = async(token)=>{
    const api_key = process.env.JUDGE0_API_KEY;
    while(true){
        const {data} = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`,{headers:{'X-RapidAPI-Key': api_key}})

        if(data.status.id !== 1 && data.status.id !== 2){
            return data;
        }
        await new Promise(resolve => setTimeout(resolve, 500))
    }
}

const studentSubmit = async(req, res)=>{
    try {
        const {studentId, languageId, sourceCode} = req.body
        const {examId, problemId} = req.params

        const exam = await examModel.findById(examId)
        const problem = exam.problems.id(problemId)

        if(!problem) return res.status(404).json({success:false, message:"Problem not found"});
        
        let testResults = [];
        let passedAll = true;
        let totalScore = 0

        for (const testCase of problem.testCases) {
            const submissionRes = await axios.post(
                'https://judge0-ce.p.rapidapi.com/submissions',
                {
                    source_code: sourceCode,
                    language_id: languageId,
                    stdin: testCase.input,
                    expected_output: testCase.expectedOutput
                },
                {headers:{'X-RapidAPI-Key':process.env.JUDGE0_API_KEY}}
            );

            const result = await checkJudge0Status(submissionRes.data.token)

            const isPassed = result.status.id === 3;
            if(!isPassed) passedAll = false;
            if(isPassed) totalScore += testCase.points;

            testResults.push({
                testCaseId: testCase._id,
                passed: isPassed,
                actualOutput: result.stdout || null,
                executionTimeMs: result.time ? parseFloat(result.time) * 1000 : 0,
                errorMessage: result.stderr || result.compile_output || result.status.description
            })

            let overallStatus = 'Accepted';
            if(!passedAll){
                const firstError = testResults.find(tr => !tr.passed);
                overallStatus = firstError ? firstError.errorMessage : "Wrong Answer";
            }

            const newProblemSubmission = {
                problemId: problemId,
                language: languageId,
                code: sourceCode,
                status: overallStatus,
                testResults: testResults,
                score: totalScore
            }

            await submissionModel.findOneAndUpdate(
                {exam: examId, student:studentId},
                {
                   $push: {problemSubmissions: newProblemSubmission},

                },
                {upsert: true, new:true} // Create if doesn't exist
            )

            res.json({
                success:true,
                status: overallStatus,
                score: totalScore,
                // only return results for PUBLIC test cases
                results: testResults.filter(tr => {
                    const originalTestCase = problem.testCases.id(tr.testCaseId);
                    return !originalTestCase.isHidden
                })
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Failed to evaluate code"})
    }
}

export {studentSubmit}