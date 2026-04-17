import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest, JwtPayload } from './auth.types';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      return true;
    }

    const token = authorization.slice('Bearer '.length);

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
      };
    } catch {
      request.user = undefined;
    }

    return true;
  }
}
