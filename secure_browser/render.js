const submitbtn=document.getElementById('submit_btn')
const { clipboard } = require('electron');
// Variables to track the violation
let blurStartTime = 0;
let totalViolations = 0;

function clearSystemClipboard() {
    // This effectively empties the clipboard
    clipboard.clear(); 
    console.log("Clipboard cleared for exam entry.");
}

// Call this as soon as the exam window loads or the 'Start' button is clicked
window.onload = clearSystemClipboard;

const warningScreen = document.getElementById('blur-warning');

// Triggered when the student clicks away from the exam window
window.addEventListener('blur', () => {
    blurStartTime = Date.now();
    
    // Immediately hide the exam content to prevent reading while blurred
    warningScreen.style.display = 'flex';
    
    console.log("Window focus lost. Exam hidden.");
});
// Triggered when the student clicks back into the exam window
window.addEventListener('focus', () => {
    // Only process if a blur actually occurred
    if (blurStartTime > 0) { 
        const blurEndTime = Date.now();
        const durationInSeconds = ((blurEndTime - blurStartTime) / 1000).toFixed(2);
        
        totalViolations++;
        
        // Remove the warning screen
        warningScreen.style.display = 'none';
        
        // Reset the timer
        blurStartTime = 0; 
        
        // Log the event locally
        console.log(`Focus regained. Away for ${durationInSeconds} seconds. Total violations: ${totalViolations}`);
        
        // Send the log to the Main Process or directly to your Express backend
        reportViolation(durationInSeconds, totalViolations);
    }
});

function reportViolation(duration, count) {
    const violationData = {
        type: 'window_blur',
        durationSeconds: duration,
        violationCount: count,
        timestamp: new Date().toISOString()
    };

    // If using Electron's IPC to pass to the Main Process:
    if (window.api && window.api.send) {
        window.api.send('log-proctoring-event', violationData);
    } 
    // OR if sending directly to your Express API:
    /*
    fetch('https://your-express-server.com/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violationData)
    });
    */
}
submitbtn.addEventListener('click',()=>{
    console.log('Submitting Exam')
    //this 'proctorAPI' comes from preload.js
    if (window.proctorAPI){
        window.proctorAPI.submitExam()
        console.log('Exam Submitted via API')
    } else {
        console.log('Proctor API not available,running in Electron?')
    }
})



