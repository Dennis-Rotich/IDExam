import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/mongodb.js';
import examRouter from './routes/examRoute.js';
import submissionRouter from './routes/submissionRoute.js';

// app config
const app = express();
const PORT = process.env.PORT || 3000
const server = http.createServer(app)
const io = new Server(server)
connectDB()

//middlewares
app.use(express.static('public'));
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/exam', examRouter)
app.use('/api/submission', submissionRouter)

// Store active exam sessions
const EXAM_ID = 'CS101';

// Store student states in memory
const studentStates = {};

function createStudentCard(studentId) {
    if (!studentStates[studentId]) {
        studentStates[studentId] = "";
    }
}

function updateView(studentId, newText) {
    // Emit reconstructed text to the teacher's dashboard
    io.to(`${EXAM_ID}_dashboard`).emit('student_update', {
        studentId,
        code: newText
    });
}

//Socket.io Connection Handler
io.on('connection', (socket) => {
    
    // 1. Identify the User Role (Student vs Teacher)
    socket.on('join_exam', (role)=>{
        if(role == 'teacher'){
            socket.join(`${EXAM_ID}_dashboard`);
            console.log(`Teacher joined dashboard for ${EXAM_ID}`);
        } else {
            socket.join(EXAM_ID);
            console.log(`Student ${socket.id} joined exam ${EXAM_ID}`);

            // Notify teacher a new student arrived
            io.to(`${EXAM_ID}_dashboard`).emit('student_joined', socket.id);
        }
    });

    // 1. Handle Delta Updates (UPDATED WITH LOGS)
    socket.on('student_delta', (data) => {
        // LOG 1: Did we receive anything at all?
        console.log("📥 DELTA RECEIVED from:", data.studentId);
        console.log("Raw changes array:", data.changes);

        // After — always has a valid ID
        const studentId = data.studentId || socket.id;
        const { changes } = data;
                
        if (!changes) {
            console.error("❌ ERROR: Changes array is undefined. Check student.html emit.");
            return;
        }

        createStudentCard(studentId);
        
        let newText = "";

        // Reconstruct the text safely
        changes.forEach((segment) => {
            const mode = segment[0];
            const text = segment[1];
            
            if (mode === 0 || mode === 1) { // 0 = keep, 1 = insert
                newText += text;
            }
            // If mode is -1 (delete), we do nothing, which effectively removes it
        });

        // LOG 2: Did the reconstruction work?
        console.log("🏗️ RECONSTRUCTED TEXT:", newText);

        studentStates[studentId] = newText;
        updateView(studentId, newText);
    });

    // Handle Full Sync
    socket.on('code_full_sync', (fullCode) => {
        io.to(`${EXAM_ID}_dashboard`).emit('student_full_sync', {
            studentId: socket.id,
            code: fullCode
        })
        console.log(fullCode);
    })

    // Handle disconnection
    socket.on('disconnect', ()=>{
        // Notify teacher if student leaves
        io.to(`${EXAM_ID}_dashboard`).emit('student_left', socket.id);
    });
})

app.get('/',(req,res)=>{
    res.send('API WORKING WELL')
})


server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});