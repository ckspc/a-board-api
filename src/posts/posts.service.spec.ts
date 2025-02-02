import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostCategory } from '@prisma/client';
import { sign } from 'crypto';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated posts with search and category filters', async () => {
      const params = {
        page: 1,
        limit: 10,
        search: 'test',
        category: PostCategory.HEALTH,
      };

      const mockPosts = [
        {
          id: 1,
          title: 'Test Post',
          content: 'Test Content',
          category: PostCategory.HEALTH,
          author: {
            id: 1,
            username: 'testuser',
            name: 'Test User',
            signInStatus: true,
            imageUrl: 'test',
          },
          _count: {
            comments: 2,
          },
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await service.findAll(params);

      expect(result).toEqual({
        data: mockPosts,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const authorId = 1;
      const createPostDto = {
        title: 'Test Post',
        content: 'Test Content',
        category: PostCategory.HEALTH,
      };

      const mockPost = {
        id: 1,
        ...createPostDto,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: authorId,
          username: 'testuser',
          name: 'Test User',
          signInStatus: true,
          imageUrl: 'test',
        },
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.create(authorId, createPostDto);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findOne', () => {
    it('should return a post if it exists', async () => {
      const postId = 1;
      const mockPost = {
        id: postId,
        title: 'Test Post',
        content: 'Test Content',
        category: PostCategory.HEALTH,
        author: {
          id: 1,
          username: 'testuser',
          name: 'Test User',
          signInStatus: true,
          imageUrl: 'test',
        },
        comments: [],
        _count: {
          comments: 0,
        },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findOne(postId);
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      const postId = 999;
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findOne(postId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post if user is the author', async () => {
      const postId = 1;
      const userId = 1;
      const updatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      mockPrismaService.post.findUnique.mockResolvedValue({
        id: postId,
        authorId: userId,
      });

      const mockUpdatedPost = {
        id: postId,
        ...updatePostDto,
        authorId: userId,
        author: {
          id: userId,
          username: 'testuser',
          name: 'Test User',
          signInStatus: true,
          imageUrl: 'test',
        },
        _count: {
          comments: 0,
        },
      };

      mockPrismaService.post.update.mockResolvedValue(mockUpdatedPost);

      const result = await service.update(postId, userId, updatePostDto);
      expect(result).toEqual(mockUpdatedPost);
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const postId = 1;
      const userId = 2;
      const updatePostDto = {
        title: 'Updated Title',
      };

      mockPrismaService.post.findUnique.mockResolvedValue({
        id: postId,
        authorId: 1,
      });

      await expect(
        service.update(postId, userId, updatePostDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      const postId = 999;
      const userId = 1;
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.update(postId, userId, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a post if user is the author', async () => {
      const postId = 1;
      const userId = 1;

      mockPrismaService.post.findUnique.mockResolvedValue({
        id: postId,
        authorId: userId,
      });

      mockPrismaService.post.delete.mockResolvedValue({});

      const result = await service.remove(postId, userId);
      expect(result).toEqual({ message: 'Post deleted successfully' });
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const postId = 1;
      const userId = 2;

      mockPrismaService.post.findUnique.mockResolvedValue({
        id: postId,
        authorId: 1,
      });

      await expect(service.remove(postId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if post does not exist', async () => {
      const postId = 999;
      const userId = 1;
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.remove(postId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
