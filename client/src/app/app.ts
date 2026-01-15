import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  socket: Socket;
  username: string = '';
  currentRoom: string | null = null;
  board: string[] = Array(9).fill('');
  players: string[] = [];
  turn: number = 0;
  winner: string | null = null;
  notifications: string[] = [];

  constructor(private ngZone: NgZone, private cd: ChangeDetectorRef) {
    this.socket = io('http://localhost:8080/game', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
  }

  ngOnInit() {
    this.socket.on('gameUpdate', (game: any) => {
      this.ngZone.run(() => {
        if (!game) return;
        this.board = [...game.board];
        this.players = [...game.players];
        this.turn = game.turn;
        this.winner = game.winner;
        this.cd.detectChanges();
      });
    });

    this.socket.on('notification', (msg: string) => {
      this.ngZone.run(() => {
        this.notifications.push(msg);
        this.cd.detectChanges();
      });
    });

    this.socket.on('kicked', (data) => {
      alert(data.message);
      this.resetGameState();
    });
  }

  joinRoom(room: string) {
    const name = this.username?.trim();
    if (!name) return alert('Unesite ime');

    this.socket.emit('joinRoom', { room, username: name }, (res: any) => {
      if (res.status === 'joined') {
        this.board = res.board;
        this.players = res.players;
        this.notifications.push(`Pridruženi ste sobi ${room}`);
        this.currentRoom = room;
        this.board = Array(9).fill('');
        this.players = [];
        this.turn = 0;
        this.winner = null;
      } else if (res.status === 'full') {
        alert('Soba je puna!');
      } else if (res.status === 'taken') {
        alert('Ovo ime je već zauzeto u sobi');
      }
    });
  }

  leaveRoom() {
    if (!this.currentRoom) return;
    this.socket.emit('leaveRoom', (res: any) => {
      if (res.status === 'left') {
        this.notifications.push('Napustili ste sobu.');
        this.resetGameState();
      }
    });
  }

  makeMove(index: number) {
    if (!this.currentRoom) return;
    if (this.board[index] !== '' || this.winner) return;
    this.socket.emit('makeMove', { index }, (res: any) => {
      if (res.status === 'invalid') alert('Nevalidan potez');
      if (res.status === 'waiting') this.notifications.push(res.message);
    });
  }

  resetGameState() {
    this.currentRoom = null;
    this.board = Array(9).fill('');
    this.players = [];
    this.turn = 0;
    this.winner = null;
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
