import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import admin from './firebase/firebase-admin';

interface RequestWithUser {
  headers: {
    authorization?: string;
  };
  user?: admin.auth.DecodedIdToken;
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token: string = authHeader.replace('Bearer ', '');

    try {
      const decoded: admin.auth.DecodedIdToken = await admin
        .auth()
        .verifyIdToken(token);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
