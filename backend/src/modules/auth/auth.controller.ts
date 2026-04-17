import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUserId } from './current-user.decorator';
import { LoginDto, RegisterDto } from './auth.dto';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(OptionalJwtAuthGuard)
  me(@CurrentUserId() userId?: number) {
    if (!userId) {
      return { user: null };
    }

    return this.authService.findPublicUser(userId);
  }
}
