
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

    // Handle Lightweight updates
    socket.on('code_delta', (data) => {
        io.to(`${EXAM_ID}_dashboard`).emit('student_delta', {
            studentId: socket.id,
            changes: data.changes
        })
        console.log(code);
    });

    // Handle Full Sync
    socket.on('code_full_sync', (fullCode) => {
        io.to(`${EXAM_ID}_dashboard`).emit('student_full_sync'), {
            studentId: socket.id,
            code: fullCode
        }
        console.log(code);
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