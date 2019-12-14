// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

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
      zoomFactor: 1.0, // default is 1.0
      nodeIntegration: true, // Allows us to use any NodeJS module
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

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


const socketio = require('socket.io')
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
const EventEmitter = require('events');

// Constants
const WEBSOCKET_PORT = 18188;

class ReadRfidEvent extends EventEmitter {
  onReadSomeRfid(data) {
    this.emit('read', data);
  }
}

let readEvent = new ReadRfidEvent();

// Global objects
const rfidReader = new SerialPort('/dev/ttyUSB0', { autoOpen: false });
let websocketServer = socketio(WEBSOCKET_PORT);

rfidReader.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }

  // Because there's no callback to write, write errors will be emitted on the port:
  rfidReader.write('main screen turn on');
})

// The open event is always emitted
rfidReader.on('open', function() {
  // open logic
  console.log('Opened rfid reader.');
});

// Read data that is available but keep the stream in "paused mode"
rfidReader.on('readable', function () {
  let data = rfidReader.read();
  console.log('Data:', data);
  readEvent.onReadSomeRfid(data);
});

// Switches the port into "flowing mode"
rfidReader.on('data', function (data) {
  console.log('Data:', data);
})

// Pipe the data into another stream (like a parser or standard out)
const lineStream = rfidReader.pipe(new Readline());

websocketServer.on('connection', function (socket) {
  // socket.broadcast.emit('user connected');
  socket.on('message', function () {
    // Nothing to do
  });
  socket.on('disconnect', function () {
    // Nothing to do
  });
  readEvent.on('read', (data) => {
    socket.broadcast.emit(data);
  });
});

