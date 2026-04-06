import cron from 'node-cron';
import submissionModel from '../models/submissionModel.js';
 
// a background task that sweeps the database every minute to find and force-close expired exams.
// This cron expression runs at the 0th second of every minute
export const startExamSweeper = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();

            // Find all submissions that are still IN_PROGRESS but their time is up
            const expiredSubmissions = await submissionModel.find({
                status: 'IN_PROGRESS',
                endsAt: { $lt: now } // endsAt is strictly in the past
            });

            if (expiredSubmissions.length === 0) return;

            console.log(`[Sweeper] Found ${expiredSubmissions.length} expired exams. Force closing...`);

            // 1. Bulk update their status to COMPLETED
            await submissionModel.updateMany(
                { status: 'IN_PROGRESS', endsAt: { $lt: now } },
                { 
                    $set: { 
                        status: 'COMPLETED',
                        submittedAt: now
                    } 
                }
            );

            // 2. Here is where you would loop through expiredSubmissions 
            // and push them to an auto-grading queue since they only have autosaves.
            
        } catch (error) {
            console.error("[Sweeper Error]:", error.message);
        }
    });
};