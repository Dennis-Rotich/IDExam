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