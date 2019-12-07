// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const electron = require('electron');
const currentWindow = electron.remote.getCurrentWindow();
const setWindowFullscreen = (value) => {
  currentWindow.setFullScreen(value);
};

currentWindow.once('did-finish-load', () => {
  setWindowFullScreen(true);
});


document.addEventListener('DOMContentLoaded', () => {
  setWindowFullScreen(true);
});

