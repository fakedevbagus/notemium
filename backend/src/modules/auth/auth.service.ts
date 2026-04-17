import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../database/database.service';
import { InMemoryStore, StoredUser } from '../../database/in-memory.store';
import { LoginDto, RegisterDto } from './auth.dto';

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly store: InMemoryStore,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);
    const user = await this.createUser({
      email: registerDto.email.toLowerCase(),
      passwordHash,
      name: registerDto.name,
    });

    return this.toAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.findByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.toAuthResponse(user);
  }

  async findPublicUser(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new UnauthorizedException('User was not found');
    }

    return this.toPublicUser(user);
  }

  private async findByEmail(email: string) {
    const normalizedEmail = email.toLowerCase();

    if (this.database.isAvailable()) {
      const result = await this.database.query<UserRow>(
        `SELECT id, email, password_hash, name, avatar_url, created_at, updated_at
         FROM users
         WHERE lower(email) = $1`,
        [normalizedEmail],
      );

      return result.rows[0] ? this.mapRow(result.rows[0]) : null;
    }

    return (
      this.store.users.find((user) => user.email.toLowerCase() === normalizedEmail) ??
      null
    );
  }

  private async findById(id: number) {
    if (this.database.isAvailable()) {
      const result = await this.database.query<UserRow>(
        `SELECT id, email, password_hash, name, avatar_url, created_at, updated_at
         FROM users
         WHERE id = $1`,
        [id],
      );

      return result.rows[0] ? this.mapRow(result.rows[0]) : null;
    }

    return this.store.users.find((user) => user.id === id) ?? null;
  }

  private async createUser(userData: {
    email: string;
    passwordHash: string;
    name?: string;
  }) {
    if (this.database.isAvailable()) {
      const result = await this.database.query<UserRow>(
        `INSERT INTO users (email, password_hash, name)
         VALUES ($1, $2, $3)
         RETURNING id, email, password_hash, name, avatar_url, created_at, updated_at`,
        [userData.email, userData.passwordHash, userData.name ?? null],
      );

      return this.mapRow(result.rows[0]);
    }

    const timestamp = new Date().toISOString();
    const user: StoredUser = {
      id: this.store.nextUserId(),
      email: userData.email,
      passwordHash: userData.passwordHash,
      name: userData.name,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.users.push(user);

    return user;
  }

  private toAuthResponse(user: StoredUser) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
      user: this.toPublicUser(user),
    };
  }

  private toPublicUser(user: StoredUser) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapRow(row: UserRow): StoredUser {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      name: row.name ?? undefined,
      avatarUrl: row.avatar_url ?? undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}
