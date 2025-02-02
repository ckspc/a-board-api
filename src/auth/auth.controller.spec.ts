import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signUp: jest.fn(),
        signIn: jest.fn(),
        getProfile: jest.fn(),
        signOut: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signUp', () => {
        it('should create a new user', async () => {
            const signUpDto: SignUpDto = {
                username: 'testuser',
                password: 'password123',
                name: 'Test User',
                imageUrl: 'https://example.com/image.jpg',
            };

            const expectedResult = {
                user: {
                    id: 1,
                    username: 'testuser',
                    name: 'Test User',
                    imageUrl: 'https://example.com/image.jpg',
                    signInStatus: false,
                },
            };

            mockAuthService.signUp.mockResolvedValue(expectedResult);

            const result = await controller.signUp(signUpDto);
            expect(result).toEqual(expectedResult);
            expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
        });
    });

    describe('signIn', () => {
        it('should sign in a user and return token', async () => {
            const signInDto: SignInDto = {
                username: 'testuser',
                password: 'password123',
            };

            const expectedResult = {
                token: 'mock-jwt-token',
                user: {
                    id: 1,
                    username: 'testuser',
                    name: 'Test User',
                    imageUrl: 'https://example.com/image.jpg',
                    signInStatus: true,
                },
            };

            mockAuthService.signIn.mockResolvedValue(expectedResult);

            const result = await controller.signIn(signInDto);
            expect(result).toEqual(expectedResult);
            expect(authService.signIn).toHaveBeenCalledWith(signInDto);
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const mockRequest = {
                user: { userId: 1 },
            };

            const expectedResult = {
                id: 1,
                username: 'testuser',
                name: 'Test User',
                imageUrl: 'https://example.com/image.jpg',
                signInStatus: true,
            };

            mockAuthService.getProfile.mockResolvedValue(expectedResult);

            const result = await controller.getProfile(mockRequest);
            expect(result).toEqual(expectedResult);
            expect(authService.getProfile).toHaveBeenCalledWith(1);
        });
    });

    describe('signOut', () => {
        it('should sign out user', async () => {
            const mockRequest = {
                user: { userId: 1 },
            };

            const expectedResult = {
                success: true,
                message: 'Successfully signed out',
            };

            mockAuthService.signOut.mockResolvedValue(expectedResult);

            const result = await controller.logout(mockRequest);
            expect(result).toEqual(expectedResult);
            expect(authService.signOut).toHaveBeenCalledWith(1);
        });
    });
});