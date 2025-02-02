import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signUp', () => {
        const signUpDto = {
            username: 'testuser',
            password: 'password123',
            name: 'Test User',
            imageUrl: 'https://example.com/image.jpg',
        };

        it('should create a new user successfully', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const mockCreatedUser = {
                id: 1,
                username: signUpDto.username,
                name: signUpDto.name,
                imageUrl: signUpDto.imageUrl,
                signInStatus: false,
                password: 'hashedPassword',
            };

            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

            const result = await service.signUp(signUpDto);

            expect(result).toEqual({
                user: {
                    id: 1,
                    username: signUpDto.username,
                    name: signUpDto.name,
                    imageUrl: signUpDto.imageUrl,
                    signInStatus: false,
                },
            });
        });

        it('should throw ConflictException if username exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ username: signUpDto.username });

            await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('signIn', () => {
        const signInDto = {
            username: 'testuser',
            password: 'password123',
        };

        const mockUser = {
            id: 1,
            username: 'testuser',
            password: 'hashedPassword',
            name: 'Test User',
            imageUrl: 'https://example.com/image.jpg',
            signInStatus: false,
        };

        it('should sign in user successfully', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');
            mockPrismaService.user.update.mockResolvedValue({ ...mockUser, signInStatus: true });

            const result = await service.signIn(signInDto);

            expect(result).toEqual({
                token: 'mock-jwt-token',
                user: {
                    id: 1,
                    username: 'testuser',
                    name: 'Test User',
                    imageUrl: 'https://example.com/image.jpg',
                    signInStatus: true,
                },
            });
        });

        it('should throw UnauthorizedException if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                name: 'Test User',
                imageUrl: 'https://example.com/image.jpg',
                signInStatus: true,
                password: 'hashedPassword',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.getProfile(1);

            expect(result).toEqual({
                id: 1,
                username: 'testuser',
                name: 'Test User',
                imageUrl: 'https://example.com/image.jpg',
                signInStatus: true,
            });
        });

        it('should throw NotFoundException if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.getProfile(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('signOut', () => {
        it('should sign out user successfully', async () => {
            mockPrismaService.user.update.mockResolvedValue({
                id: 1,
                signInStatus: false,
            });

            const result = await service.signOut(1);

            expect(result).toEqual({
                success: true,
                message: 'Successfully signed out',
            });
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { signInStatus: false },
            });
        });
    });

    describe('handleDisconnection', () => {
        it('should update user status to offline', async () => {
            await service.handleDisconnection(1);

            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { signInStatus: false },
            });
        });
    });
});