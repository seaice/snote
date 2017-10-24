import { app, BrowserWindow, ipcMain, screen, Tray, nativeImage, Menu } from 'electron'
/**
* Set `__static` path to static files in production
* https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
*/
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

let tray = null

function createWindow () {
/**
* Initial window options
*/

    var size = screen.getPrimaryDisplay().workAreaSize

    mainWindow = new BrowserWindow({
        useContentSize: true,
        width: size.width,
        height: size.height,
        minWidth: 800,
        minHeight : 600,
        frame: false,
    // skipTaskbar: false,
    // fullscreen: true,
    // autoHideMenuBar: true,
    // titleBarStyle: 'hidden'


    // 是否允许访问load local resource
    // 例如：<img src="C:\Users\seaice\Pictures\880b532309f79052794be82e0af3d7ca7acbd5fe.jpg"/>
    // "webPreferences":{
    //   "webSecurity":false
    // }
    })

    mainWindow.loadURL(winURL)
    // mainWindow.maximize()

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    ipcMain.on('note:window:close', function (e) {
        // mainWindow.close()
        mainWindow.hide()
    })

    ipcMain.on('note:window:maximize', function (e) {
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize()
      } else {
          mainWindow.maximize()
      }
    })

    ipcMain.on('note:window:minimize', function (e) {
        mainWindow.minimize()
    })

    // const iconName = process.platform === 'win32'


    const path = require('path')
    const trayIcon = path.join(__dirname, '../renderer/assets/ico/tray.png');
    const nimage = nativeImage.createFromPath(trayIcon);

    tray = new Tray(nimage)
    const contextMenu = Menu.buildFromTemplate([
        {label: '设置', click: function() { console.log('todo: config'); }},
        {label: '退出', click: function() { mainWindow.close() }}
        ])
    tray.setToolTip('SNote记录每一天的成长')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})


/**
* Auto Updater
*
* Uncomment the following code below and install `electron-updater` to
* support auto updating. Code Signing with a valid certificate is required.
* https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
*/

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
autoUpdater.quitAndInstall()
})

app.on('ready', () => {
if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/
