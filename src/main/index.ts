import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function createBrowserWindow(): void {
  const browserWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  browserWindow.on('ready-to-show', () => {
    browserWindow.show()
  })

  browserWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    browserWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    browserWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

async function main(): Promise<void> {
  // https://www.electronjs.org/docs/latest/tutorial/notifications#windows
  electronApp.setAppUserModelId('io.paveldubov.accountarchiver')

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  await app.whenReady()
  // https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createBrowserWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createBrowserWindow()
    }
  })
}

main()
