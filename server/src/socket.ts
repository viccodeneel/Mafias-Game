import { Server, Socket } from 'socket.io';
import {
  createRoom,
  getRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  assignRoles,
  checkWinner,
  rooms,
  getParticipatingPlayers,
} from './rooms.js';
import { Role, DEFAULT_DISCUSSION_SECONDS } from './types.js';

export function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('create_room', (hostName: string) => {
      const hostId = socket.id;
      const room = createRoom(hostId, hostName, socket.id);
      socket.join(room.code);
      socket.emit('room_created', room);
      console.log(`Room created: ${room.code}`);
    });

    socket.on('join_room', (roomCode: string, playerName: string) => {
      const result = addPlayerToRoom(roomCode, socket.id, playerName, socket.id);
      if ('error' in result) {
        socket.emit('join_error', result.error);
        return;
      }
      const { room, player } = result;
      socket.join(room.code);
      socket.emit('player_joined', { room, player });
      io.to(room.code).emit('lobby_updated', room);
      console.log(`Player ${playerName} joined room ${roomCode}`);
    });

    socket.on('leave_room', (roomCode: string) => {
      console.log('Client leaving room:', roomCode);
      socket.leave(roomCode);
      const updatedRoom = removePlayerFromRoom(roomCode, socket.id);
      if (updatedRoom) {
        io.to(roomCode).emit('lobby_updated', updatedRoom);
      }
    });

    socket.on('start_game', (roomCode: string) => {
      const room = getRoom(roomCode);
      if (!room || room.hostId !== socket.id) return;
      const participatingPlayers = getParticipatingPlayers(room);
      if (participatingPlayers.length < 5) return;

      assignRoles(room);
      room.gameStarted = true;
      room.phase = 'ROLE_ASSIGNMENT';

      // Send private role info only to participating players
      participatingPlayers.forEach(player => {
        if (player.role === Role.MAFIA) {
          const mafiaPartner = participatingPlayers.find(
            p => p.role === Role.MAFIA && p.id !== player.id
          );
          io.to(player.socketId).emit('receive_role', {
            role: Role.MAFIA,
            partner: mafiaPartner?.name,
          });
        } else if (player.role === Role.CIVILIAN) {
          io.to(player.socketId).emit('receive_role', {
            role: Role.CIVILIAN,
          });
        }
      });

      io.to(room.code).emit('game_started', room);
      console.log(`Game started in room ${roomCode}`);
    });

    socket.on('start_timer', (roomCode: string) => {
      const room = getRoom(roomCode);
      if (!room || room.hostId !== socket.id) return;
      
      room.phase = 'DISCUSSION';
      room.discussionSeconds = DEFAULT_DISCUSSION_SECONDS;
      room.isTimerPaused = false;
      io.to(room.code).emit('lobby_updated', room);

      if (room.timerInterval) clearInterval(room.timerInterval);
      room.timerInterval = setInterval(() => {
        if (!room.isTimerPaused) {
          room.discussionSeconds--;
          io.to(room.code).emit('timer_tick', room.discussionSeconds);
          
          if (room.discussionSeconds <= 0) {
            if (room.timerInterval) clearInterval(room.timerInterval);
            room.timerInterval = null;
            room.phase = 'VOTING';
            io.to(room.code).emit('lobby_updated', room);
          }
        }
      }, 1000);
    });

    socket.on('pause_timer', (roomCode: string) => {
      const room = getRoom(roomCode);
      if (!room || room.hostId !== socket.id) return;
      room.isTimerPaused = true;
      io.to(room.code).emit('lobby_updated', room);
    });

    socket.on('resume_timer', (roomCode: string) => {
      const room = getRoom(roomCode);
      if (!room || room.hostId !== socket.id) return;
      room.isTimerPaused = false;
      io.to(room.code).emit('lobby_updated', room);
    });

    socket.on('reset_timer', (roomCode: string) => {
      const room = getRoom(roomCode);
      if (!room || room.hostId !== socket.id) return;
      room.discussionSeconds = DEFAULT_DISCUSSION_SECONDS;
      room.isTimerPaused = true;
      io.to(room.code).emit('lobby_updated', room);
    });

    socket.on('skip_to_voting', (roomCode: string) => {
      const room = getRoom(roomCode);
      if (!room || room.hostId !== socket.id) return;

      if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
      }
      room.discussionSeconds = 0;
      room.isTimerPaused = true;
      room.phase = 'VOTING';
      io.to(room.code).emit('lobby_updated', room);
    });

    socket.on('eliminate_player', (roomCode: string, playerId: string) => {
      const room = getRoom(roomCode);
      if (!room || room.hostId !== socket.id) return;
      
      const player = room.players.find(p => p.id === playerId);
      if (!player) return;

      player.alive = false;
      room.lastEliminatedId = playerId;
      room.phase = 'ELIMINATION_REVEAL';

      // Always show the elimination reveal first, even if this vote ends the
      // game. The transition to GAME_OVER happens when the host presses
      // Continue (see continue_after_elimination below), so we just record
      // the winner here without skipping the reveal screen.
      room.winner = checkWinner(room);

      io.to(room.code).emit('lobby_updated', room);
    });

    socket.on('continue_after_elimination', (roomCode: string) => {
      const room = getRoom(roomCode);
      if (!room || room.hostId !== socket.id) return;
      
      if (room.winner) {
        room.phase = 'GAME_OVER';
        io.to(room.code).emit('lobby_updated', room);
      } else {
        room.round++;
        room.phase = 'DASHBOARD';
        io.to(room.code).emit('lobby_updated', room);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Find which room this player was in
      let roomToUpdate: string | undefined;
      for (const [code, room] of rooms.entries()) {
        if (room.players.some(p => p.socketId === socket.id)) {
          roomToUpdate = code;
          break;
        }
      }

      if (roomToUpdate) {
        const updatedRoom = removePlayerFromRoom(roomToUpdate, socket.id);
        if (updatedRoom) {
          io.to(roomToUpdate).emit('lobby_updated', updatedRoom);
        }
      }
    });
  });
}
