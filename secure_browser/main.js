const { app, BrowserWindow,globalShortcut,clipboard } = require('electron')
const { glob } = require('fs')
const path = require('path')

const dev_mode = process.env.IS_DEV_MODE 
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

   //prevent closing window
  mainWindow.on('close',(e)=>{
    if(!dev_mode){
      e.preventDefault()
      console.log('i see you wanna leave')
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
//block shortcuts to leave app
  if (!dev_mode){
    globalShortcut.register('Alt+Tab', () => { return false; });
    globalShortcut.register('Alt+F4', () => { return false; });
    globalShortcut.register('CommandOrControl+Shift+I', () => { return false; });// Block DevTools
    globalShortcut.register('CommandOrControl+R', () => { return false; });// Block Refresh
    globalShortcut.register('CommandOrControl+W', () => { return false; });// Block Close Window
    globalShortcut.register('CommandOrControl+Q', () => { return false; });// Block Quit
    globalShortcut.register('CommandOrControl+Tab', () => { return false; });// Block Switching tabs
    globalShortcut.register('CommandOrControl+Escape', () => { return false; });// Block windoes taskbar popup
    globalShortcut.register('CommandOrControl+Shift+Escape', () => { return false; });// Block Task Manager
    globalShortcut.register('Escape', () => {app.quit();});// allow escape, but not in production

    }

})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})





