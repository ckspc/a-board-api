import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundException } from '@nestjs/common';
import { PostCategory } from '@prisma/client';

describe('CommentsService', () => {
  let service: CommentsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      findUnique: jest.fn() as jest.MockedFunction<
        typeof prismaService.post.findUnique
      >,
    },
    comment: {
      create: jest.fn() as jest.MockedFunction<
        typeof prismaService.comment.create
      >,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCommentDto: CreateCommentDto = {
      content: 'Test comment',
      postId: 1,
    };

    const authorId = 1;

    const mockPost = {
      id: 1,
      title: 'Test Post',
      content: 'Test content',
      category: PostCategory.HEALTH,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockComment = {
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

    it('should create a comment when post exists', async () => {
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(mockPost);
      jest
        .spyOn(prismaService.comment, 'create')
        .mockResolvedValue(mockComment);

      const result = await service.create(authorId, createCommentDto);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentDto.postId },
      });

      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: createCommentDto.content,
          author: {
            connect: { id: authorId },
          },
          post: {
            connect: { id: createCommentDto.postId },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              signInStatus: true,
              imageUrl: true,
            },
          },
        },
      });

      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      // Mock findUnique to return null immediately
      const findUniqueSpy = jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValue(null);

      // Create spy for comment.create but don't implement it
      const createCommentSpy = jest.spyOn(prismaService.comment, 'create');

      // Expect the service call to throw NotFoundException
      await expect(service.create(authorId, createCommentDto)).rejects.toThrow(
        new NotFoundException(
          `Post with ID ${createCommentDto.postId} not found`,
        ),
      );

      // Verify our mocks were called correctly
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: createCommentDto.postId },
      });
      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(createCommentSpy).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database error');
      jest.spyOn(prismaService.post, 'findUnique').mockRejectedValue(dbError);

      await expect(service.create(authorId, createCommentDto)).rejects.toThrow(
        dbError,
      );
    });
  });
});
