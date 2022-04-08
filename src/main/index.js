import { clone, equals } from 'ramda';
import fs from 'fs';
import { app, BrowserWindow, ipcMain, Menu } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Channels from '../common/ipc-channels';
import RequestDispatcher from './request-dispatcher';
import StateHistory from './history';
import { initialState } from '../renderer/store';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\'); // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : `file://${__dirname}/index.html`;
const stateHistory = new StateHistory();
const historyPath = '/tmp/.requestRockerHistory.json';

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
    fs.writeFile(historyPath, JSON.stringify(stateHistory.getStates()), err => {
      if (!err) mainWindow = null;
    });
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

app.on('ready', () => {
  createWindow();
  fs.access(historyPath, fs.F_OK, err => {
    if (!err) {
      const rawdata = fs.readFileSync(historyPath);
      stateHistory.setStates(JSON.parse(rawdata));
    }
  });
});

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

ipcMain.on(Channels.NEXT_STATE, async (event, state, forcePush = false) => {
  let newState;
  if (
    (!stateHistory.currentEquals(state) && !equals(state, initialState)) ||
    (forcePush && !equals(state, initialState))
  ) {
    stateHistory.push(clone(state));
    newState = stateHistory.nextState();
  } else {
    newState = stateHistory.nextState();
  }
  event.sender.send(Channels.SET_STATE, newState);
});

ipcMain.on(Channels.PREVIOUS_STATE, async (event, state) => {
  let newState;
  if (!stateHistory.currentEquals(state) && !equals(state, initialState)) {
    stateHistory.push(clone(state));
    newState = stateHistory.previousState();
  } else {
    newState = stateHistory.previousState();
  }
  event.sender.send(Channels.SET_STATE, newState);
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
