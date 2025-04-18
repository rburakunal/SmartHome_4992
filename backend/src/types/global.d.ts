import type { Server as SocketIOServer } from 'socket.io';

declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      role: string;
      [key: string]: any;
    };
  }
}

// ✅ TypeScript 4+ için globalThis desteği
declare global {
  var io: SocketIOServer;
  interface GlobalThis {
    io: SocketIOServer;
  }
}

export { };

