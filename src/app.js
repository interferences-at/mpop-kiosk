'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { w3cwebsocket as W3CWebSocket } from "websocket";
// import serialport from 'serialport';
const websocketClient = new W3CWebSocket('ws://localhost:18188');

/**
 * The main App component.
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastRfidRead: ' -- '
    };
  }

  componentWillMount() {
    websocketClient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    websocketClient.onmessage = (message) => {
      console.log(message);
      this.setState({
        lastRfidRead: message
      });
    };
  }

  render() {
    return (
      <div className="root">
        <h1>Hello</h1>
        <pre>{ this.state.lastRfidRead }</pre>
      </div>
     );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

