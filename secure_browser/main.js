require('dotenv').config()
const { app, BrowserWindow, globalShortcut, clipboard, ipcMain } = require('electron')
const path = require('path')

// FIX 1: We now check if it's explicitly set to the string 'true'
const dev_mode = process.env.IS_DEV_MODE === 'true'

let mainWindow = null  
let violationCount = 0
const MAX_VIOLATIONS = 3

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'exam proctor system', 
    kiosk: !dev_mode, 
    alwaysOnTop: !dev_mode,
    frame: false,
    fullscreen: !dev_mode,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  mainWindow.on('blur', () => {
    console.log('OS detected focus lost.')
    mainWindow.webContents.send('force-blur-warning')
  })

  mainWindow.on('focus', () => {
    console.log('OS detected focus regained.')
    mainWindow.webContents.send('remove-blur-warning') 
  })

  if (!dev_mode) {
    setInterval(() => clipboard.writeText(''), 1000)
  }  
}

ipcMain.on('log-proctoring-event', (event, violation) => {
  violationCount++
  console.log(`Violation logged: ${violation.type}, Count: ${violationCount}`)
  if (violationCount >= MAX_VIOLATIONS) {
    if (mainWindow) {
        mainWindow.webContents.send('exam-terminated', { reason: 'Too many violations' })
        setTimeout(() => mainWindow.close(), 3000) 
    }
  }
})

// FIX 2: We kept only ONE of these listeners to handle the final submission
ipcMain.on('exam-finished', (event, answers) => {
  console.log('Exam successfully received in Main Process!')
  console.log('Student Answers:', answers)
  // TODO: Send answers to database/server here
})

if (require('electron-squirrel-startup')) {  
  app.quit()
}

function registerBlockers() {
  const combos = [
    'CommandOrControl+Shift+I', 
    'CommandOrControl+R',       
    'CommandOrControl+W',       
    'CommandOrControl+Q',       
    'CommandOrControl+Tab',     
    'Alt+Tab',                  
    'Alt+F4',                   
    'F11','F5','F4','F10','F9'  
  ]

  combos.forEach(accel => {
    if (!globalShortcut.register(accel, () => false)) {
      console.warn('could not register', accel)
    }
  })
}

app.whenReady().then(() => {
  createWindow()
  if (!dev_mode) registerBlockers()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})