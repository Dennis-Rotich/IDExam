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
        }

        if (window.proctorAPI && window.proctorAPI.send) {
            window.proctorAPI.send('log-proctoring-event', violationData)
        } 
    }

    submitbtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        console.log('Submitting Exam...')
        
        // FIX 4: Grab the form data
        const formElement = document.querySelector('.exam-card')
        const formData = new FormData(formElement)
        
        // Map the inputs to a clean JavaScript object
        const answers = {
            q1: formData.get('q1'),            // Gets radio button value
            q2: formData.getAll('q2'),         // Gets array of checked boxes
            q3: formData.get('q3')             // Gets textarea text
        }

        if (window.proctorAPI){
            // Pass the answers through the bridge
            window.proctorAPI.submitExam(answers)
            console.log('Exam Submitted via API with data:', answers)
            
            // Optional: Update the UI to show success
            document.body.innerHTML = `<h1>Exam Submitted!</h1><p>Thank you. Your answers have been recorded.</p>`
        } else {
            console.log('Proctor API not available, running in normal browser context?')  
        }
    })

    if (window.proctorAPI) {
        window.proctorAPI.receive('exam-terminated', (data) => {
            document.body.innerHTML = `<h1>Exam Terminated</h1><p>Reason: ${data.reason}</p>`
        })
    }
})