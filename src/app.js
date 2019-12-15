'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

/**
 * The main App component.
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTagRead: ' -- '
    };
    this.websocketClient = undefined;
  }

  setupWebsocketClient() {
    this.websocketClient = io('http://localhost:18188', {
      path: '/pubsub'
    });
    this.websocketClient.on('tag', (value) => {
      console.log('websocket tag: ' + value);
      this.setState({
        'lastTagRead': value
      });
    });
    this.websocketClient.on('connection', (socket) => {
      console.log('Websocket connection');
    });
    this.websocketClient.on('reconnect_attempt', (socket) => {
      console.log('Websocket reconnect_attempt');
    });
    this.websocketClient.on('disconnect', (socket) => {
      console.log('Websocket disconnect');
    });
  }

  componentDidMount() {
    this.setupWebsocketClient();
  }

  render() {
    return (
      <div id="root">
        <h1>Hello</h1>
        <pre>{ this.state.lastTagRead }</pre>
      </div>
     );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

