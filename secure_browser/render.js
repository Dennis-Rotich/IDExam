document.addEventListener('DOMContentLoaded', () => {
    const submitbtn = document.getElementById('submit_btn')
    const warningScreen = document.getElementById('blur-warning')
    
    let blurStartTime = 0
    let totalViolations = 0

    window.addEventListener('blur', () => {
        blurStartTime = Date.now()
        warningScreen.style.display = 'flex'
        console.log("Window focus lost. Exam hidden.")
    })

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
    })

    function reportViolation(duration, count) {
        const violationData = {
            type: 'window_blur',
            durationSeconds: duration,
            violationCount: count,
            timestamp: new Date().toISOString()
        };

        if (window.proctorAPI && window.proctorAPI.send) {
            window.proctorAPI.send('log-proctoring-event', violationData)
        } 
    }

    submitbtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        console.log('Submitting Exam')
        
        if (window.proctorAPI){
            window.proctorAPI.submitExam()
            console.log('Exam Submitted via API')
        } else {
            console.log('Proctor API not available, running in Electron?')  
        }
    })

    // FIX 4: Changed `.on` to `.receive` to match the preload script
    if (window.proctorAPI) {
        window.proctorAPI.receive('exam-terminated', (data) => {
            document.body.innerHTML = `<h1>Exam Terminated</h1><p>Reason: ${data.reason}</p>`
        })
    }
})