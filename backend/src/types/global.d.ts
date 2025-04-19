// src/types/global.d.ts

declare namespace Express {
    export interface Request {
      user?: {
        userId: string;
        role: string;
        [key: string]: any;
      };
    }
  }
  