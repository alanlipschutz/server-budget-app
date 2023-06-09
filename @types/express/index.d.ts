import { Express, Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      cookies?: {
        token: string;
      };
    }
  }
}
