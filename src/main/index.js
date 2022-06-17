import { app, BrowserWindow, ipcMain, Menu } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Channels from '../common/ipc-channels';
import RequestDispatcher from './request-dispatcher';
import FileHandler from './file-handler/file-handler';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\'); // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(Channels.SEND_REQUEST, async (event, args) => {
  try {
    const response = await RequestDispatcher.handle(args);
    event.sender.send(Channels.RECEIVE_RESPONSE, response);
  } catch (error) {
    event.sender.send(Channels.UNEXPECTED_ERROR, error.message);
  }
});

ipcMain.on(Channels.CANCEL_REQUEST, async event => {
  try {
    event.sender.send(Channels.REQUEST_CANCELLED);
  } catch (error) {
    event.sender.send(Channels.UNEXPECTED_ERROR, error.message);
  }
});

ipcMain.on(Channels.FILE_SAVE, async (event, payload) => {
  const fileSaveResult = await new FileHandler(payload).save();
  if (fileSaveResult.error) {
    event.sender.send(Channels.UNEXPECTED_ERROR, fileSaveResult.error.message);
  } else {
    event.sender.send(Channels.FILE_SAVE_RESULT, fileSaveResult);
  }
});

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
