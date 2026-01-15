const http = require('http');
const { Server } = require('socket.io');
//const { instrument } = require('@socket.io/admin-ui');

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:8080"],
    credentials: true
  },
  pingInterval: 10000,
  pingTimeout: 5000
});

//instrument(io, { auth: false });

const ROOMS = ['Room1', 'Room2'];


let games = {};
const createGame = () => ({
  board: Array(9).fill(''),
  players: [],
  turn: 0,
  winner: null
});

ROOMS.forEach(r => games[r] = createGame());

io.of('/game').on('connection', (socket) => {
  console.log('Igrač povezan:', socket.id);

  socket.on('joinRoom', ({ room, username }, ack) => {
    //if (!ROOMS.includes(room)) return ack?.({ status: 'error', message: 'Nepostojeća soba' });
    if (!username || username.trim() === '') return ack?.({ status: 'error', message: 'Username obavezan' });

    const game = games[room];

    if (game.players.some(u => u.toLowerCase() === username.toLowerCase())) return ack?.({ status: 'taken', message: 'Username već postoji u sobi' });

    if (game.players.length >= 2) return ack?.({ status: 'full', message: 'Soba je puna' });

    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;
    game.players.push(username);

    if (ack) ack({ status: 'joined', board: game.board, players: game.players });

    socket.broadcast.to(room).emit('notification', `${username} se pridružio sobi ${room}`);
    io.of('/game').to(room).emit('gameUpdate', game);


    if (game.players.length === 2) {
      io.of('/game').to(room).emit('notification', `Igra počinje! Na potezu je ${game.players[game.turn]}`);
    }
  });


  socket.on('leaveRoom', (ack) => {
    const room = socket.data.room;
    const username = socket.data.username;
    if (!room || !games[room]) return;

    const game = games[room];

    const otherPlayers = game.players.filter(u => u !== username);
    otherPlayers.forEach(u => {
      const sockets = Array.from(io.of('/game').sockets.values()).filter(s => s.data.room === room && s.data.username === u);
      sockets.forEach(s => s.emit('notification', `${username} je napustio sobu, igra se prekida`));
    });

    game.players.forEach(u => {
      if (u === username) return;
      const sockets = Array.from(io.of('/game').sockets.values()).filter(s => s.data.room === room && s.data.username === u);
      sockets.forEach(s => {
        s.leave(room);
        s.data.room = null;
        s.emit('kicked', { message: 'Igrač je napustio sobu, vraćate se na početni ekran' });
      });
    });


    games[room] = createGame();
    io.of('/game').to(room).emit('gameUpdate', games[room]);

    if (ack) ack({ status: 'left' });
  });

  socket.on('makeMove', ({ index }, ack) => {
    const room = socket.data.room;
    const username = socket.data.username;
    if (!room || !games[room]) return;

    const game = games[room];

    if (game.players.length < 2) return ack?.({ status: 'waiting', message: 'Čekanje drugog igrača' });

    const playerIndex = game.players.indexOf(username);
    if (playerIndex === -1 || game.turn !== playerIndex || game.board[index] !== '' || game.winner) {
      return ack?.({ status: 'invalid' });
    }

    game.board[index] = playerIndex === 0 ? 'X' : 'O';

    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    winCombos.forEach(combo => {
      const [a, b, c] = combo;
      if (game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c]) {
        game.winner = game.board[a];
      }
    });

    if (game.winner) {
      io.of('/game').to(room).emit('notification', `Igra završena! Pobednik: ${username}`);
      games[room] = createGame();
      games[room].players = [...game.players];
      io.of('/game').to(room).emit('gameUpdate', games[room]);
    } else {
      game.turn = 1 - game.turn;
    }

    io.of('/game').to(room).emit('gameUpdate', games[room]);
    if (ack) ack({ status: 'ok' });
  });

  socket.on('disconnect', () => {
    const room = socket.data.room;
    const username = socket.data.username;
    if (!room || !games[room]) return;

    const game = games[room];

    const otherPlayers = game.players.filter(u => u !== username);
    otherPlayers.forEach(u => {
      const sockets = Array.from(io.of('/game').sockets.values()).filter(s => s.data.room === room && s.data.username === u);
      sockets.forEach(s => s.emit('notification', `${username} je napustio sobu, igra se prekida`));
    });

    game.players.forEach(u => {
      if (u === username) return;
      const sockets = Array.from(io.of('/game').sockets.values()).filter(s => s.data.room === room && s.data.username === u);
      sockets.forEach(s => {
        s.leave(room);
        s.data.room = null;
        s.emit('kicked', { message: 'Igrač je napustio sobu, vraćate se na početni ekran' });
      });
    });


    games[room] = createGame();
    io.of('/game').to(room).emit('gameUpdate', games[room]);
  });
});

server.listen(8080, () => console.log('Server radi na http://localhost:8080'));


