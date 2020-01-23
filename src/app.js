'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import OneHundredSlider from './components/OneHundredSlider';
import LanguageSwitcher from './components/LanguageSwitcher';
//import remote from 'electron';



const sliderMarks = [
  { value: 0, },
  { value: 10, },
  { value: 20, },
  { value: 30, },
  { value: 40, },
  { value: 50, },
  { value: 60, },
  { value: 70, },
  { value: 80, },
  { value: 90, },
  { value: 100, },
];

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

    const MPOP_MODE = window.MPOP_MODE;
    console.log('MPOP_MODE : ' + MPOP_MODE);
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
        <LanguageSwitcher />
        <pre>{ this.state.lastTagRead }</pre>
        <p>Croyez-vous que de meilleurs investissements dans les institutions suivantes sont importantes dans la réduction du taux de criminalité?</p>
        <br />
        <OneHundredSlider aria-label="More or less" defaultValue={50} marks={sliderMarks} valueLabelDisplay="on" />
      </div>
     );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

