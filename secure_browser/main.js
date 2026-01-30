const { app, BrowserWindow } = require('electron')
const path = require('path')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

//keeps from being locked in,change later
const IS_DEV_MODE=true

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title:'exam proctor system', 
    kiosk:!IS_DEV_MODE,//full screen and locked down is not dev mode  
    alwaysOnTop:!IS_DEV_MODE,//on top of all apps
    frame:false,//no close,minimize,maximize buttons
    alwaysOnTop:!IS_DEV_MODE,
    fullscreen:!IS_DEV_MODE,
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
    if(!IS_DEV_MODE){
      e.preventDefault()
      console.log('is see you wanna leave')
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
//block shortcuts to leave app
  if (!IS_DEV_MODE){
    globalShortcut.register('Alt+Tab', () => { return false; });
    globalShortcut.register('Alt+F4', () => { return false; });
    globalShortcut.register('CommandOrControl+Shift+I', () => { return false; }); // Block DevTools
    }
//press escape to exit in dev mode
    if (IS_DEV_MODE){
      globalShortcut.register('Escape', () => {
        app.quit();
      });
    }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})





