'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import serialport from 'serialport';

/**
 * The main App component.
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTagRead: ' -- '
    };
    this.xhr = new XMLHttpRequest()
    // this.webdisWebsocketClient = new WebSocket('ws://localhost:7379/.json');
    // this.webdisWebsocketClient.onopen = function () {
    //   self.send(["SUBSCRIBE", "tag"]);
    //   self.send(["GET", "tag"]);
    //   self.send(["SET", "tag", "Hello"]);
    // };
    // this.webdisWebsocketClient.onmessage = function(messageEvent) {
    //   log("json-log", "received", messageEvent.data);
    //   let jsonData = JSON.parse(messageEvent.data);
    //   if (jsonData.SUBSCRIBE) {
    //     let subscribeData = jsonData.SUBSCRIBE;
    //     if (subscribeData[0] == "subscribe") {
    //       if (subscribeData[2] == 1) {
    //         console.log("succesfully subscribed");
    //       }
    //     } else if (subscribeData[0] == "message" && subscribeData[1] == "tag") {
    //       let tagValue = subscribeData[2]
    //       console.log("Got new tag value: " + tagValue);
    //       this_setState({
    //         lastTagRead: tagValue
    //       });
    //     }
    //   }
    // };

    // // this.websocketClient = new WebSocket('ws://localhost:18188/websocket');
    // let webdis_ws_host = "127.0.0.1";
    // let webdis_ws_port = 7379;
    // this.jsonSocket = new WebSocket("ws://" + webdis_ws_host + ":" + webdis_ws_port + "/.json");
    // 
    // this.jsonSocket.onopen = function() {
    //   this.send(["SET", "RFID", " teswts  "]);
    //   this.send(["GET", "RFID"]);
    // };
    // 
    // this.jsonSocket.onmessage = function(messageEvent) {
    //   log("json-log", "received", messageEvent.data);
    // };
    //

    this.websocketClient = io('http://localhost:18188', {
      path: '/pubsub'
    });
    this.websocketClient.on('tag', (value) => {
      console.log('websocket tag: ' + value);
      // this.setState(...this.state, {
      //   'tag': value
      // });
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

  setupWebdisClient() {
    let previous_response_length = 0
    let this_setState = this.setState.bind(this);

    this.xhr.open("GET", "http://127.0.0.1:7379/SUBSCRIBE/tag", true);

    this.xhr.onreadystatechange = function () {
      if (this.readyState == 3)  {
    	  let response = this.responseText;
    	  let chunk = response.slice(previous_response_length);

    	  previous_response_length = response.length;
    	  console.log('Received from webdis: ' + chunk);
        let jsonData = JSON.parse(chunk);
        if (jsonData.SUBSCRIBE) {
          let subscribeData = jsonData.SUBSCRIBE;
          if (subscribeData[0] == "subscribe") {
            if (subscribeData[2] == 1) {
              console.log("succesfully subscribed");
            }
          } else if (subscribeData[0] == "message" && subscribeData[1] == "tag") {
            let tagValue = subscribeData[2]
            console.log("Got new tag value: " + tagValue);
            this_setState({
              lastTagRead: tagValue
            });
          }
        } else {
        }
      }
    };
    this.xhr.send(null);
  }

//   send(data) {
//     let json = JSON.stringify(data);
//     this.jsonSocket.send(json);
//     log("json-log", "sent", json);
//   };

  componentDidMount() {
    this.setupWebdisClient();
  }

  render() {
    return (
      <div className="root">
        <h1>Hello</h1>
        <pre>{ this.state.lastTagRead }</pre>
      </div>
     );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

