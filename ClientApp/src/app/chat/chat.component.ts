import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  _hubConnection: signalR.HubConnection;
  username = '';
  messages = [];
  isLoggedIn = false;
  @ViewChild('chatMessages') chatMessages: ElementRef;
  @ViewChild('message') message: ElementRef;

  constructor() { }

  ngOnInit() {
    this._hubConnection = new signalR.HubConnectionBuilder().withUrl('/hubs/chat').build();

    this._hubConnection.on('messageReceived', (username: string, message: string) => {
      this.messages.push({ username: username, body: message });
    });

  }

  scrollMessages() {
    this.chatMessages.nativeElement.scrollTop = Number.MAX_SAFE_INTEGER;
  }

  login() {
    if (this.username !== '') {
      this._hubConnection.start()
        .then(() => {
          this._hubConnection.invoke('newMessage', `${this.username} has just connected`, '');
          this.isLoggedIn = true;
        })
        .catch(err => {
          document.write(err);
          this.isLoggedIn = false;
          alert(`Cannot connect now try again later`);
        });
      return;
    }
    alert(`Username can't be empty`);
  }

  onLogin(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  send() {
    this._hubConnection
      .invoke('newMessage', this.username, this.message.nativeElement.value)
      .then(() => {
        this.message.nativeElement.value = '';
        this.message.nativeElement.focus();
      });
  }

  onMessageKeydown(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }
}










