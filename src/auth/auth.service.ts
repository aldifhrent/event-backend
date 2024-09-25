import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  private saltRounds = 10;

  public async loginUser(loginUserDTO: LoginUserDTO) {
    const { email, password } = loginUserDTO;

    // Find user by email.
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    // If user is not found, throw an UnauthorizedException.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare provided password with the stored hash.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload and token.
    const payload = {
      userId: user.id,
      username: user.username,
      sessionId: uuidv4(),
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Store the session in the database with expiration.
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prismaService.session.create({
      data: {
        userId: user.id,
        sessionToken: token,
        expires: expiresAt,
      },
    });

    return { ...user, token };
  }

  public async registerUser(registerUserDTO: RegisterUserDTO) {
    const { name, username, email, password } = registerUserDTO;

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
        name,
      },
    });

    return createdUser;
  }
}
