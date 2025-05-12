import { User } from 'src/shared/types/user';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
