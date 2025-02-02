import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtUser } from '../auth/interfaces/user.interface';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createCommentDto: CreateCommentDto = {
      content: 'Test comment',
      postId: 1,
    };

    const mockUser: JwtUser = {
      userId: 1,
    };

    const expectedResult = {
      id: 1,
      content: 'Test comment',
      postId: 1,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        signInStatus: true,
        imageUrl: null,
      },
    };

    it('should create a comment', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(mockUser, createCommentDto);

      expect(service.create).toHaveBeenCalledWith(
        mockUser.userId,
        createCommentDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
