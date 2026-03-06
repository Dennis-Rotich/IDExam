const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('proctorAPI', {
    send: (channel, data) => {
        const validChannels = ['log-proctoring-event'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        // FIX 4: Added 'exam-terminated' to the whitelist
        const validChannels = ['force-blur-warning', 'remove-blur-warning', 'exam-terminated'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    submitExam: () => ipcRenderer.send('exam-finished'),
    getVersion: () => '1.0.0-SECURE'
})

window.addEventListener('DOMContentLoaded', () => {
    console.log("Proctor Secure Bridge Loaded");
})