import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-notepad-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OptionalJwtAuthGuard],
  exports: [AuthService, OptionalJwtAuthGuard, JwtModule],
})
export class AuthModule {}
