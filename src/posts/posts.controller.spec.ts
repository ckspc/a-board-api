import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { PostCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Mock the User decorator
jest.mock('../auth/decorators/user.decorator', () => ({
  User: () => {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      return descriptor;
    };
  },
}));

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;

  const mockPostsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const query: GetPostsDto = {
        page: 1,
        limit: 10,
        search: 'test',
        category: PostCategory.HEALTH,
      };

      const expectedResult = {
        data: [
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
            },
            _count: {
              comments: 2,
            },
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockPostsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);
      expect(result).toEqual(expectedResult);
      expect(postsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test Content',
        category: PostCategory.HEALTH,
      };

      const user = { userId: 1 };

      const expectedResult = {
        id: 1,
        ...createPostDto,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: 1,
          username: 'testuser',
          name: 'Test User',
          signInStatus: false,
        },
      };

      mockPostsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(user, createPostDto);
      expect(result).toEqual(expectedResult);
      expect(postsService.create).toHaveBeenCalledWith(
        user.userId,
        createPostDto,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const postId = 1;
      const expectedResult = {
        id: postId,
        title: 'Test Post',
        content: 'Test Content',
        category: PostCategory.HEALTH,
        author: {
          id: 1,
          username: 'testuser',
          name: 'Test User',
          signInStatus: true,
        },
        comments: [],
        _count: {
          comments: 0,
        },
      };

      mockPostsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(postId);
      expect(result).toEqual(expectedResult);
      expect(postsService.findOne).toHaveBeenCalledWith(postId);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postId = 1;
      const user = { userId: 1 };
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      const expectedResult = {
        id: postId,
        ...updatePostDto,
        category: PostCategory.HEALTH,
        authorId: 1,
        author: {
          id: 1,
          username: 'testuser',
          name: 'Test User',
          signInStatus: true,
        },
        _count: {
          comments: 0,
        },
      };

      mockPostsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(postId, user, updatePostDto);
      expect(result).toEqual(expectedResult);
      expect(postsService.update).toHaveBeenCalledWith(
        postId,
        user.userId,
        updatePostDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      const postId = 1;
      const user = { userId: 1 };
      const expectedResult = { message: 'Post deleted successfully' };

      mockPostsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(postId, user);
      expect(result).toEqual(expectedResult);
      expect(postsService.remove).toHaveBeenCalledWith(postId, user.userId);
    });
  });
});
