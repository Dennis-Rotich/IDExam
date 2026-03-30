const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('proctorAPI', {
    send: (channel, data) => {
        const validChannels = ['log-proctoring-event']
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    receive: (channel, func) => {
        const validChannels = ['force-blur-warning', 'remove-blur-warning', 'exam-terminated'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    },
    // FIX 3: Added 'answers' parameter to carry data to main.js
    submitExam: (answers) => ipcRenderer.send('exam-finished', answers),
    getVersion: () => '1.0.0-SECURE'
})

window.addEventListener('DOMContentLoaded', () => {
    console.log("Proctor Secure Bridge Loaded")
})