const SerialPort = require('serialport');
const port = new SerialPort('/dev/tty-usbserial1', { autoOpen: false });
const Readline = require('@serialport/parser-readline')

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }

  // Because there's no callback to write, write errors will be emitted on the port:
  port.write('main screen turn on');
})

// The open event is always emitted
port.on('open', function() {
  // open logic
});

// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
  console.log('Data:', port.read());
});

// Switches the port into "flowing mode"
port.on('data', function (data) {
  console.log('Data:', data);
})

// Pipe the data into another stream (like a parser or standard out)
const lineStream = port.pipe(new Readline());

