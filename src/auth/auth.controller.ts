import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  // @UseGuards(AuthGuard)
  public async login(@Body() loginUserDTO: LoginUserDTO) {
    return await this.authService.loginUser(loginUserDTO);
  }

  @Post('/register')
  // @UseGuards(AuthGuard)
  async register(@Body() registerUserDTO: RegisterUserDTO) {
    return await this.authService.registerUser(registerUserDTO);
  }
}
