import { Controller, Post, Headers, HttpException } from '@nestjs/common';
import admin from './firebase/firebase-admin';

@Controller('auth')
export class AuthController {
  @Post('verify')
  async verifyToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new HttpException('No token provided', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      return { message: 'User verified', user: decoded };
    } catch (err) {
      throw new HttpException('Token invalid', 401);
    }
  }
}
