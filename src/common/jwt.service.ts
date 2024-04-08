import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserRequest } from 'src/model/user.model';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  async signToken(payload: LoginUserRequest) {
    return this.jwtService.signAsync({ username: payload.username });
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      return payload;
    } catch {
      return 'token invalid';
    }
  }
}
