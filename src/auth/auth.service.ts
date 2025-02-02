import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async signUp(dto: SignUpDto) {
        const exists = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (exists) {
            throw new ConflictException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                password: hashedPassword,
                name: dto.name,
                imageUrl: dto.imageUrl,
                signInStatus: false,
            },
        });

        return {
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                imageUrl: user.imageUrl,
                signInStatus: user.signInStatus,
            },
        };
    }

    async signIn(dto: SignInDto) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: { signInStatus: true },
        });

        const token = this.jwtService.sign({ userId: user.id });

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                imageUrl: user.imageUrl,
                signInStatus: true,
            },
        };
    }

    async signOut(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { signInStatus: false },
        });

        return {
            success: true,
            message: 'Successfully signed out',
        };
    }

    async getProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            username: user.username,
            name: user.name,
            imageUrl: user.imageUrl,
            signInStatus: user.signInStatus,
        };
    }

    async handleDisconnection(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { signInStatus: false },
        });
    }
}