import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { User } from './models/User';
import { Pledge } from './models/Pledge';
// import { ISocketData, IJWTPayload, INewPledgeEvent, IStatsUpdateEvent, IPledgeUpdatedEvent } from '@donation-hub/types';
import config from './config';
import { logSecurityEvent } from './utils/logger';
import { maskPII } from './utils/maskPII';

export const setupSocketIO = (server: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: config.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        // Allow anonymous connections for public feed
        return next();
      }

      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as any;
      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data = {
        userId: user._id,
        userRole: user.role
      } as any;

      next();
    } catch (error) {
      logSecurityEvent('token_invalid', undefined, socket.handshake.address, {
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'socket_auth'
      });
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userRole = socket.data?.userRole;
    const userId = socket.data?.userId;

    logSecurityEvent('socket_connection', userId, socket.handshake.address, {
      userRole,
      socketId: socket.id
    });

    // Join appropriate rooms based on user role
    socket.join('public'); // Everyone can see public feed
    
    if (userRole === 'admin') {
      socket.join('admin'); // Only admins can see admin updates
    }

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logSecurityEvent('socket_disconnect', userId, socket.handshake.address, {
        reason,
        socketId: socket.id
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logSecurityEvent('socket_error', userId, socket.handshake.address, {
        error: error.message,
        socketId: socket.id
      });
    });
  });

  return io;
};

// Helper functions for emitting events
export const emitNewPledge = (io: SocketIOServer, pledge: any) => {
  const maskedPledge = maskPII(pledge);
  const event: any = { pledge: maskedPledge };
  
  io.to('public').emit('new-pledge', event);
  
  logSecurityEvent('socket_broadcast', undefined, 'system', {
    event: 'new-pledge',
    pledgeId: pledge._id
  });
};

export const emitStatsUpdate = async (io: SocketIOServer) => {
  try {
    const [totalCount, totalAmount] = await Promise.all([
      Pledge.countDocuments({ pledgeStatus: 'confirmed' }),
      Pledge.aggregate([
        { $match: { pledgeStatus: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalAmountValue = totalAmount.length > 0 ? totalAmount[0].total : 0;
    const event: any = {
      totalCount,
      totalAmount: totalAmountValue
    };

    io.to('public').emit('stats-update', event);
    
    logSecurityEvent('socket_broadcast', undefined, 'system', {
      event: 'stats-update',
      totalCount,
      totalAmount: totalAmountValue
    });
  } catch (error) {
    console.error('Error emitting stats update:', error);
  }
};

export const emitPledgeUpdated = (io: SocketIOServer, pledge: any) => {
  const event: any = { pledge };
  
  io.to('admin').emit('pledge-updated', event);
  
  logSecurityEvent('socket_broadcast', undefined, 'system', {
    event: 'pledge-updated',
    pledgeId: pledge._id
  });
};

export default setupSocketIO;

