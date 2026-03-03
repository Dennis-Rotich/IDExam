const { app, BrowserWindow,globalShortcut,clipboard,ipcMain } = require('electron')

const path = require('path')


const dev_mode = process.env.IS_DEV_MODE === false
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title:'exam proctor system', 
    kiosk:!dev_mode,//full screen and locked down is not dev mode  
    alwaysOnTop:!dev_mode,//on top of all apps
    frame:false,//no close,minimize,maximize buttons
    fullscreen:!dev_mode,
    webPreferences: {
      preload:path.join(__dirname, 'preload.js'),
      contextIsolation:true,
      nodeIntegration: false
    }
  })
   // and load the index.html of the app.
mainWindow.loadFile(path.join(__dirname, 'index.html'))

mainWindow.on('blur', () => {
  console.log('OS detected focus lost.')
  // You can force the renderer to show the warning screen via IPC
  mainWindow.webContents.send('force-blur-warning')
  });
mainWindow.on('focus', () => {
  console.log('OS detected focus regained.')
  // Tell the renderer it's safe to resume
  mainWindow.webContents.send('remove-blur-warning') 
  })

if (!dev_mode) {
  setInterval(() => clipboard.clear(), 1000)
}  
}

function registerBlockers() {
  // I have removed the OS-protected shortcuts (Alt+Tab, Alt+F4, etc.) 
  // so they no longer throw warnings in your console.
  const combos = [
    'CommandOrControl+Shift+I', // DevTools
    'CommandOrControl+R',       // Reload
    'CommandOrControl+W',       // Close Window
    'CommandOrControl+Q',       // Quit
    'CommandOrControl+Tab',     // Tab switch
    'Alt+Tab',                  // OS-level app switch
    'Alt+F4',                   // OS-level close
    'F11','F5','F4','F10','F9'  // Various browser functions
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
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
//Add the usual activate handler so a new window is created if the dock icon is clicked.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});






