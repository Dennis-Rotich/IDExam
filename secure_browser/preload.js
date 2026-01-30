const { contextBridge,ipcRenderer } = require('electron')

// Expose safe data/methods to the renderer process
contextBridge.exposeInMainWorld('proctorAPI', {
   // This allows the frontend to ask the main process to close
    submitExam: () => ipcRenderer.send('exam-finished'),    
    // Simple verification tag
    getVersion: () => '1.0.0-SECURE'
})
window.addEventListener('DOMContentLoaded', () => {
    // CODE TO RUN ON LOAD (e.g., Wipe Clipboard)
    console.log("Proctor Secure Bridge Loaded");
})