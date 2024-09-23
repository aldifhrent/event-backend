import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  private saltRounds = 10;
  private failedLoginAttempts = new Map<string, number>(); // Track failed login attempts

  public async loginUser(loginUserDTO: LoginUserDTO) {
    const { username, email, password } = loginUserDTO;

    if (!username && !email) {
      throw new UnprocessableEntityException('Username atau email harus diisi');
    }

    if (username && email) {
      throw new UnprocessableEntityException(
        'Harap isi username atau email saja, tidak keduanya',
      );
    }

    let user;
    if (email) {
      user = await this.prismaService.user.findUnique({ where: { email } });
    } else if (username) {
      user = await this.prismaService.user.findUnique({ where: { username } });
    }

    if (!user) {
      throw new UnprocessableEntityException(
        'Username, email, atau password tidak valid',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Track failed login attempts
      const key = email || username;
      const attempts = this.failedLoginAttempts.get(key) || 0;
      this.failedLoginAttempts.set(key, attempts + 1);

      if (attempts + 1 >= 5) {
        throw new ForbiddenException(
          'Akun terkunci karena terlalu banyak percobaan login yang gagal',
        );
      }

      throw new UnprocessableEntityException(
        'Username, email, atau password tidak valid',
      );
    }

    // Reset failed login attempts on successful login
    this.failedLoginAttempts.delete(email || username);

    const token = await this.jwtService.signAsync(
      {
        userId: user.userId,
      },
      { expiresIn: '1h' },
    ); // Set token expiry

    console.log('Login successful, generating token:', token); // Log token yang dihasilkan

    return {
      token,
    };
  }

  public async registerUser(registerUserDTO: RegisterUserDTO) {
    const { username, email, password } = registerUserDTO;

    if (password.length < 8) {
      throw new BadRequestException(
        'Password harus memiliki minimal 8 karakter',
      );
    }

    const checkUserEmail = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (checkUserEmail) {
      throw new UnprocessableEntityException('Email is already used');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const createdUser = await this.prismaService.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return createdUser;
  }
}
