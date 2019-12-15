const SerialPort = require('serialport');
const ParserReadline = require('@serialport/parser-readline')
const fs = require('fs');
const EventEmitter = require('events');

class ReadRfidEvent extends EventEmitter {
  onReadSomeRfid(data) {
    this.emit('read', data);
  }
}

const findFtdiSerialPort = function () {
  let ret = new Promise((resolve, reject) => {
    let success = false;
    for (let i = 0; i < 9; i ++) {
      let fileName = '/dev/ttyUSB' + i;
      console.log('Try to check if ' + fileName);
      stats = fs.statSync(fileName);
      if (stats.isCharacterDevice()) {
        console.log('Found FTDI device ' + fileName);
        resolve(fileName);
        success = true;
        break;
       } else {
          console.log('File ' + fileName + ' does not seem suitable');
       }
       if (! success) {
         console.log('Could not find FTDI device');
         reject('Could not find FTDI device.');
       }
    }
  });
  return ret;
}

class RfidReader {
  constructor() {
    // Pipe the data into another stream (like a parser or standard out)
    this.parserReadline = new ParserReadline();
    this.readRfidEvent = new ReadRfidEvent();
    this.rfidReader = undefined;
    this.lineStream = undefined;

    this.parserReadline.on('data', function (line) {
      console.log('RFID data:', line);
      // redisClient.set("tag", line);
      let tagValue = line.replace(/[\W_]+/g, ''); // Remove characters that are not word-characters
      this.readRfidEvent.onReadSomeRfid(tagValue);
    }.bind(this));

    findFtdiSerialPort().then(function(ftdiDevice) {
      this.rfidReader = new SerialPort(ftdiDevice, { autoOpen: false });
      this.rfidReader.open(function (err) {
        if (err) {
          return console.log('Error opening port: ', err.message);
        }
      });

      // The open event is always emitted
      this.rfidReader.on('open', function() {
        // open logic
        console.log('Opened RFID reader.');
      });

      this.lineStream = this.rfidReader.pipe(this.parserReadline);
    }.bind(this)).catch(function(err) {
      console.log("Failed to open a FTDI device." + err);
    });
  }
};

module.exports = RfidReader;

