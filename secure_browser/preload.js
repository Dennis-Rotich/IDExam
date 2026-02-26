const { contextBridge,ipcRenderer } = require('electron')

// Expose safe data/methods to the renderer process
contextBridge.exposeInMainWorld('proctorAPI', {
    // Send data FROM Renderer TO Main
    send: (channel, data) => {
        const validChannels = ['log-proctoring-event']; // Whitelist for security
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    // Receive data FROM Main TO Renderer
    receive: (channel, func) => {
        const validChannels = ['force-blur-warning', 'remove-blur-warning'];
        if (validChannels.includes(channel)) {
            // Strip off the event object to prevent prototype pollution
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
   // This allows the frontend to ask the main process to close
    submitExam: () => ipcRenderer.send('exam-finished'),
    // Simple verification tag
    getVersion: () => '1.0.0-SECURE'
})
window.addEventListener('DOMContentLoaded', () => {
    // CODE TO RUN ON LOAD (e.g., Wipe Clipboard)
    console.log("Proctor Secure Bridge Loaded");
})
