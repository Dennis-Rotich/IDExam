import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import examRouter from './routes/examRoute.js';
import submissionRouter from './routes/submissionRoute.js';
import userRouter from './routes/userRoute.js';

// app config
const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Enable CORS for Socket.io
const io = new Server(server, {
    cors: { origin: "*" } 
});

connectDB();

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// ==========================================
// GLOBAL API ROUTER
// ==========================================
const apiRouter = express.Router();

// Health Check: http://localhost:4000/api
apiRouter.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'API WORKING WELL' });
});

// Feature Routes: http://localhost:4000/api/exam, etc.
apiRouter.use('/exam', examRouter);
apiRouter.use('/submission', submissionRouter);
apiRouter.use('/user', userRouter);

// Mount the global router
app.use('/api', apiRouter);


// SOCKET.IO LOGIC
const EXAM_ID = 'CS101';
const studentStates = {};

function createStudentCard(studentId) {
    if (!studentStates[studentId]) {
        studentStates[studentId] = "";
    }
}

function updateView(studentId, newText) {
    io.to(`${EXAM_ID}_dashboard`).emit('student_update', {
        studentId,
        code: newText
    });
}

io.on('connection', (socket) => {
    
    socket.on('join_exam', (role) => {
        if (role === 'teacher') {
            socket.join(`${EXAM_ID}_dashboard`);
            console.log(`Teacher joined dashboard for ${EXAM_ID}`);
        } else {
            socket.join(EXAM_ID);
            console.log(`Student ${socket.id} joined exam ${EXAM_ID}`);
            io.to(`${EXAM_ID}_dashboard`).emit('student_joined', socket.id);
        }
    });

    socket.on('student_delta', (data) => {
        const studentId = data.studentId || socket.id;
        const { changes } = data;
                
        if (!changes) return;

        createStudentCard(studentId);
        
        let newText = "";
        changes.forEach((segment) => {
            const mode = segment[0];
            const text = segment[1];
            if (mode === 0 || mode === 1) newText += text;
        });

        studentStates[studentId] = newText;
        updateView(studentId, newText);
    });

    socket.on('code_full_sync', (fullCode) => {
        io.to(`${EXAM_ID}_dashboard`).emit('student_full_sync', {
            studentId: socket.id,
            code: fullCode
        });
    });

    socket.on('student_execution', (data) => {
        const { studentId, language, output, isError } = data;
        createStudentCard(studentId);

        // FIX: Emit this to the frontend. Do NOT use document.getElementById here.
        io.to(`${EXAM_ID}_dashboard`).emit('student_execution_result', {
            studentId,
            language,
            output,
            isError
        });
    });

    socket.on('disconnect', () => {
        io.to(`${EXAM_ID}_dashboard`).emit('student_left', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});