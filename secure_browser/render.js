//wait until the DOM is fully loaded to grab our button
document.addEventListener('DOMContentLoaded', () => {
    const submitbtn = document.getElementById('submit_btn')
    const warningScreen = document.getElementById('blur-warning')
    
    let blurStartTime = 0
    let totalViolations = 0

    // Triggered when the student clicks away from the exam window
    window.addEventListener('blur', () => {
        blurStartTime = Date.now()
        // Immediately hide the exam content to prevent reading while blurred
        warningScreen.style.display = 'flex'
        console.log("Window focus lost. Exam hidden.")
    })

    // Triggered when the student clicks back into the exam window
    window.addEventListener('focus', () => {
        if (blurStartTime > 0) { 
            const blurEndTime = Date.now()
            const durationInSeconds = ((blurEndTime - blurStartTime) / 1000).toFixed(2)
            totalViolations++
            
            warningScreen.style.display = 'none'
            blurStartTime = 0
            console.log(`Focus regained. Away for ${durationInSeconds} seconds. Total violations: ${totalViolations}`)
            
            reportViolation(durationInSeconds, totalViolations)
        }
    });

    function reportViolation(duration, count) {
        const violationData = {
            type: 'window_blur',
            durationSeconds: duration,
            violationCount: count,
            timestamp: new Date().toISOString()
        };

        // 2. Fixed the API name from 'window.api' to 'window.proctorAPI'
        if (window.proctorAPI && window.proctorAPI.send) {
            window.proctorAPI.send('log-proctoring-event', violationData)
        } 
    }

    submitbtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the form from submitting normally
        console.log('Submitting Exam')
        
        if (window.proctorAPI){
            window.proctorAPI.submitExam()
            console.log('Exam Submitted via API')
        } else {
            console.log('Proctor API not available, running in Electron?')
        }
    });
});