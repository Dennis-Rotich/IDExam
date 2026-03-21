import examModel from "../models/examModel.js";

const createExam = async(req, res)=>{
    try {
        
        const {teacherId, title, durationInMinutes, problems} = req.body

        const newExam  = new examModel({
            title, createdBy: teacherId, durationInMinutes, problems
        })

        await newExam.save();
        res.status(201).json({success: true, message:"Exam created successfully!", examId: newExam._id});

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Failed to create exam"});
    }
}

const getExam = async(req, res)=>{
    try {
        
        const exam = await examModel.findById(req.params.examId).lean();

        if(!exam || !exam.isActive) {
            return res.status(404).json({success:false, message:"Exam not found or inactive"})
        }

        const sanitizedProblems = exam.problems.map(problem=>{
            const safeTestCases = problem.testCases
            .filter(tc => !tc.isHidden)
            .map(tc => ({
                _id: tc._id,
                input: tc.input,
            }))
            return {
                ...problem,
                testCases: safeTestCases
            }
        })

        exam.problems = sanitizedProblems;

        res.json({success:true, exam})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Server error fetching exam"});
    }
}

export {getExam, createExam}