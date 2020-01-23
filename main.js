// Modules to control application life and create native browser window
const dotenv = require('dotenv');
const dotenv_result = dotenv.config(); // Loads config from the .env file
// MPOP_MODE defines what kind of node this is.
// It's either 1 x 'welcome', 1 x 'byebye' (just questions) - N2 ODROID touch screen 15"
// or 4 x 'central-control'  - 27" touch screen with ODROID H2
// or 1 x 'central-dataviz' (one big i7 computer)
// There are 4 controls and 1 dataviz viewer. (it has 4 video output)
// The dataviz viewers have a projector output - either narrow or regular.
const MODE_WELCOME = 'welcome';
const MODE_CENTRAL_CONTROL = 'control';
const MODE_CENTRAL_DATAVIZ = 'dataviz';
const MODE_BYEBYE = 'bye';
const MPOP_MODE = process.env['MPOP_MODE'] || MODE_WELCOME;

const { app, BrowserWindow } = require('electron');
const path = require('path');
const RfidReader = require('./src/server/RfidReader');
const express = require('express');
const socketio = require('socket.io')
const http = require('http');

// Constants
const WEBSOCKET_PORT = 18188;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow () {
  const isDevMode = process.env.NODE_ENV === 'development';
  console.log('isDevMode: ' + isDevMode);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true, // FIXME: be able to toggle from GUI
    frame: false, // Hide the menubar TODO: be able to configure
    webPreferences: {
      devTools: isDevMode,
      defaultEncoding: 'UTF-8',
      allowRunningInsecureContent: true,
      zoomFactor: 1.0, // default is 1.0
      nodeIntegration: true, // Allows us to use any NodeJS module
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.MPOP_MODE = MPOP_MODE;

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  if (isDevMode) {
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//

// Check if we need to use the serial port reader
const checkIfMustUseSerialPort = function (kiosk_mode) {
  // Uses some global constants
  const MODES_WITH_SERIAL_PORT = [
    MODE_WELCOME,
    MODE_CENTRAL_CONTROL,
    MODE_BYEBYE,
  ];

  const ret = MODES_WITH_SERIAL_PORT.includes(MPOP_MODE);
  return ret;
};

const IS_USING_SERIAL_PORT = checkIfMustUseSerialPort(MPOP_MODE);

// Global objects
const expressServer = express();
const httpServer = http.createServer(expressServer);
const websocketServer = socketio(httpServer, {
  path: '/pubsub',
});

var rfidReader = null;

if (IS_USING_SERIAL_PORT) {
  rfidReader = new RfidReader();
}

httpServer.listen(WEBSOCKET_PORT, function() {
  console.log('Listening websocket on port ' + WEBSOCKET_PORT);
  
  if (rfidReader != null) {
    rfidReader.readRfidEvent.on('read', function (tagValue) {
      websocketServer.emit('tag', tagValue);
    });
  }
});

