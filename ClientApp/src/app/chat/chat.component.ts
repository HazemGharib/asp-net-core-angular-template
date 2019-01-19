import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';

// const divMessages: HTMLDivElement = document.querySelector('#divMessages');
// const tbMessage: HTMLInputElement = document.querySelector('#tbMessage');
// const btnSend: HTMLButtonElement = document.querySelector('#btnSend');

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  _hubConnection: signalR.HubConnection;
  tbMessage = '';
  messages = [];

  constructor() { }

  ngOnInit() {
    this._hubConnection = new signalR.HubConnectionBuilder().withUrl('/hubs/chat').build();

    this._hubConnection.on('messageReceived', (username: string, message: string) => {

      this.messages.push({ username: username, body: message });
    });

    this._hubConnection.start().then(() => console.log('Hub connected!')).catch(err => document.write(err));
  }

  send() {
    const username = new Date().getTime();
    this._hubConnection.send('newMessage', username, this.tbMessage)
      .then(() => this.tbMessage = '');
  }
}










