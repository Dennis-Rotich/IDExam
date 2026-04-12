import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import examRouter from './routes/examRoute.js';
import submissionRouter from './routes/submissionRoute.js';
import userRouter from './routes/userRoute.js';
import practiceRouter from './routes/practiceRoute.js';
import questionRouter from './routes/questionRoute.js';

// app config
const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Enable CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: "https://idexam.duckdns.org", // MUST match the frontend URL exactly
    methods: ["GET", "POST"],
    credentials: true
  }
});

connectDB();

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// ==========================================
// GLOBAL API ROUTER
const apiRouter = express.Router();

// Health Check: http://localhost:4000/api
apiRouter.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'API WORKING WELL' });
});

// Feature Routes: http://localhost:4000/api/exam, etc.
apiRouter.use('/exam', examRouter);
apiRouter.use('/submission', submissionRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/practice', practiceRouter);
apiRouter.use('/question', questionRouter);

// Mount the global router
app.use('/api', apiRouter);


// ==========================================
// SOCKET.IO LOGIC
// We now scope state by examId: examStates[examId][studentId] = "code string"
const examStates = {};

function createStudentCard(examId, studentId) {
    if (!examStates[examId]) examStates[examId] = {};
    if (!examStates[examId][studentId]) examStates[examId][studentId] = "";
}

io.on('connection', (socket) => {
    // Dynamic Join
    socket.on('join_exam', (payload) => {
        // Payload is  an object: { role: 'teacher', examId: '12345' }
        const { role, examId } = payload;
        
        if (!examId) return;

        // Save context directly to the socket instance for future events/disconnects
        socket.examId = examId;
        socket.role = role;

        if (role === 'instructor') {
            socket.join(`${examId}_dashboard`);
            console.log(`Instructor joined dashboard for exam: ${examId}`);
        } else {
            socket.join(examId);
            console.log(`Student ${socket.id} joined exam: ${examId}`);
            // Notify the specific teacher dashboard
            io.to(`${examId}_dashboard`).emit('student_joined', socket.id);
        }
    });

    // 2. Dynamic Code Deltas
    socket.on('student_delta', (data) => {
        const examId = data.examId || socket.examId;
        const studentId = data.studentId || socket.id;
        const { changes } = data;
                
        if (!examId || !changes) return;

        createStudentCard(examId, studentId);
        
        let newText = "";
        changes.forEach((segment) => {
            const mode = segment[0];
            const text = segment[1];
            if (mode === 0 || mode === 1) newText += text;
        });

        examStates[examId][studentId] = newText;
        
        // Broadcast ONLY to the specific exam's dashboard
        io.to(`${examId}_dashboard`).emit('student_update', {
            studentId,
            code: newText
        });
    });

    // 3. Dynamic Full Sync
    socket.on('code_full_sync', (data) => {
        const examId = data.examId || socket.examId;
        if (!examId) return;

        io.to(`${examId}_dashboard`).emit('student_full_sync', {
            studentId: socket.id,
            code: data.code || data // Backwards compatibility if payload changes
        });
    });

    // 4. Dynamic Execution Results
    socket.on('student_execution', (data) => {
        const examId = data.examId || socket.examId;
        if (!examId) return;

        const { studentId, language, output, isError } = data;
        createStudentCard(examId, studentId);

        io.to(`${examId}_dashboard`).emit('student_execution_result', {
            studentId,
            language,
            output,
            isError
        });
    });

    // 5. Clean Disconnect
    socket.on('disconnect', () => {
        // Because we saved socket.examId on join, we know exactly who to notify
        if (socket.examId && socket.role !== 'teacher') {
            io.to(`${socket.examId}_dashboard`).emit('student_left', socket.id);
            
            // memory cleanup:
            if (examStates[socket.examId] && examStates[socket.examId][socket.id]) {
                delete examStates[socket.examId][socket.id];
            }
        }
    });
});


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
