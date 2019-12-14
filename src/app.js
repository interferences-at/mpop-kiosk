'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import serialport from 'serialport';

/**
 * The main App component.
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastRfidRead: ' -- '
    };
    this.websocketClient = new WebSocket('ws://localhost:18188/websocket');
  }

  componentWillMount() {
    this.websocketClient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    this.websocketClient.onmessage = (message) => {
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

