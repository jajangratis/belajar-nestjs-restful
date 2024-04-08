import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JWTService } from './jwt.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JWTService,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers['authorization'] as string;
    if (token) {
      // throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      const result = await this.jwtService.verifyToken(token);
      if (result != 'token invalid') {
        const user = await this.prismaService.user.findFirst({
          where: {
            username: result.username,
          },
        });
        req.username = result.username;
        req.user = user;
      }
    }
    next();
  }
}
