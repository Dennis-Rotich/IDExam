const { log } = require('console');
const express = require('express');
const http = require('http')
const {Server} = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = new Server(server)

//Serve statsic files from "public" directory
app.use(express.static('public'));

// Store active exam sessions
const EXAM_ID = 'CS101';

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

    // 2. The Pipeline: Receive Code -> Forward to Teacher
    socket.on('code_change', (code)=>{
        // ONLY send to teache dashboard
        io.to(`${EXAM_ID}_dashboard`).emit('update_student_view', {
            studentId: socket.id,
            code: code,
            timestamp: new Date().toISOString()
        });
    })

    // Handle disconnection
    socket.on('disconnect', ()=>{
        // Notify teacher if student leaves
        io.to(`${EXAM_ID}_dashboard`).emit('student_left', socket.id);
    });
})

// Start the server
const PORT = 3000;
server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});