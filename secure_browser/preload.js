const { contextBridge } = require('electron')

// Expose safe data/methods to the renderer process
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
})