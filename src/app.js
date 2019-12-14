'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
// import serialport from 'serialport';

/**
 * The main App component.
 */
class App extends React.Component {

  // Methods:
  // listSerialPorts() {
  //   let ret = 'no serial port data';
  //   console.log('Listing serial ports');
  //   serialport.list((err, ports) => {
  //     ret = '';
  //     console.log('ports', ports);
  //     if (err) {
  //       console.err('Error listing serial ports: ' + err.message);
  //     }
  //     else {
  //       if (ports.length == 0) {
  //         console.log('No ports listed.');
  //         ret += 'No ports';
  //       } else {
  //         for (let i = 0; i = ports.length; i ++) {
  //           console.log('Found port ' + port);
  //           ret += 'Found port ' + port + '\n';
  //         }
  //       }
  //     }
  //   });
  //   const ret = 'Hello from React';
  //   return ret;
  // };

  render() {
    return (
      <div className="root">
        <h1>Hello</h1>
      </div>
     );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

