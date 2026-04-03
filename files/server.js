const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000

// Middleware
app.use(cors()) // Allows the HTML page to communicate with this server
app.use(express.json()) // Parses incoming JSON data

// NEW: Tell Node to serve the static files (HTML, JS, CSS) in this folder
app.use(express.static(__dirname))

// The endpoint that receives the violation data
app.post('/api/log-violation', (req, res) => {
    const { studentId, reason, violationCount, timestamp } = req.body

    // Format the log entry
    const logEntry = `[${timestamp}] Student: ${studentId} | Violation: ${reason} | Total: ${violationCount}\n`

    // Print it to the server console in red
    console.log('\x1b[31m%s\x1b[0m', '🚨 CHEATING ATTEMPT DETECTED:')
    console.log(logEntry)

    // NEW: Define the path for our text file
    const logFilePath = path.join(__dirname, 'audit_log.txt')

    // NEW: Append the log entry to the text file
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error("Failed to write to log file:", err)
        } else {
            console.log("📝 Violation permanently saved to audit_log.txt")
        }
    })

    // NEW: Send a success response back to the browser!
    // This tells the fetch() request in script.js that it can finish waiting
    // and continue executing the rest of the code to show the warning screen.
    res.status(200).json({ success: true, message: "Violation logged successfully" })
})

// Start the server
app.listen(PORT, () => {
    console.log(`Proctoring Backend running on http://localhost:${PORT}`)
})