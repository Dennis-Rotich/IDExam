let currentStudentId = "Unknown Student"
let violationCount = 0
const MAX_VIOLATIONS = 4
let examActive = false

let clipboardInterval 

const examContainer = document.getElementById('exam-container')
const warningScreen = document.getElementById('warning-screen')
const reasonText = document.getElementById('warning-reason')
const countText = document.getElementById('warning-count')

async function clearClipboard() {
    try {
        await navigator.clipboard.writeText(' ')
    } catch (err) {
        console.error("Failed to clear clipboard in background. Relying on paste-blocker.")
    }
}

async function startExamFullscreen() {
    const idInputElement = document.getElementById('student-id-input')
    if (idInputElement && idInputElement.value.trim() !== "") {
        currentStudentId = idInputElement.value.trim()
    }

    examActive = true
    
    clearClipboard()
    clipboardInterval = setInterval(clearClipboard, 10000)

    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error("Fullscreen error:", err.message)
        })
    }
    
    try {
        const response = await fetch('exam.html')
        if (!response.ok) throw new Error("Failed to load exam content.")
        
        const examContent = await response.text();
        examContainer.innerHTML = examContent; 
    } catch (error) {
        console.error(error);
        examContainer.innerHTML = `<h2 style="color: red;">Error loading exam. Please check server.</h2>`
    }
}


function applyWatermark() {
    // 1. Check if a watermark already exists, and remove it so they don't stack up
    const existingWatermark = document.getElementById('security-watermark');
    if (existingWatermark) {
        existingWatermark.remove();
    }

    const watermark = document.createElement('div');
    watermark.id = 'security-watermark'; // Give it an ID
    
    watermark.style.position = 'fixed';
    watermark.style.top = '0';
    watermark.style.left = '0';
    watermark.style.width = '100vw';
    watermark.style.height = '100vh';
    watermark.style.pointerEvents = 'none'; 
    watermark.style.zIndex = '9998'; 
    
    // 2. Make it highly visible for testing! 
    watermark.style.opacity = '0.4'; // Increased visibility
    watermark.style.color = 'red';   // Force the text to be red
    
    watermark.style.display = 'flex';
    watermark.style.flexWrap = 'wrap';
    watermark.style.overflow = 'hidden';
    
    let watermarkText = '';
    const displayId = currentStudentId || "STU-TESTING";

    for(let i = 0; i < 150; i++) {
        watermarkText += `<span style="padding: 20px; font-size: 1.5rem; font-weight: bold; transform: rotate(-45deg); display: inline-block;">${displayId}</span>`;
    }
    
    watermark.innerHTML = watermarkText;
    document.body.appendChild(watermark);
}

function resumeExam() {
    warningScreen.style.display = 'none'
    if (examActive && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => console.log(e))
    }
}


document.addEventListener('paste', (event) => {
    if (examActive) {
        event.preventDefault()
        console.log("Pasting is disabled!")
        logViolation("User attempted to paste external content.");
    }
})

document.addEventListener("visibilitychange", () => {
    if (!examActive) return
    if (document.hidden) {
        logViolation("User switched tabs or minimized the browser.")
    }
})

window.addEventListener('blur', () => {
    if (!examActive) return
    logViolation("User switched applications or clicked outside the exam window.")
})

document.addEventListener('fullscreenchange', () => {
    if (!examActive) return;
    if (!document.fullscreenElement && warningScreen.style.display !== 'flex') {
        logViolation("User exited fullscreen mode.")
    }
})

window.addEventListener('beforeunload', (event) => {
    if (!examActive) return
    event.preventDefault()
    event.returnValue = ''
})

async function logViolation(reason) {
    violationCount++;
    try {
        const response = await fetch('http://localhost:3000/api/log-violation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: currentStudentId,
                reason: reason,
                violationCount: violationCount,
                timestamp: new Date().toISOString()
            })
        })
        if (!response.ok) throw new Error('Network response failed')
    } catch (error) {
        console.error('Server error:', error)
    }
    if (violationCount >= MAX_VIOLATIONS) {
        examActive = false
        clearInterval(clipboardInterval)
        warningScreen.style.display = 'none'
        if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen()
        }
        examContainer.innerHTML = `
            <h1 style="color: red;">Exam Terminated</h1>
            <p>You have exceeded the maximum allowed violations.</p>
        `
        return
    }
    reasonText.innerText = reason
    countText.innerText = `Violation ${violationCount} of ${MAX_VIOLATIONS}`
    warningScreen.style.display = 'flex'
}