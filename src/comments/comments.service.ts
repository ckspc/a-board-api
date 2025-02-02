import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, createCommentDto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException(
        `Post with ID ${createCommentDto.postId} not found`,
      );
    }

    const comment = await this.prisma.comment.create({
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

    return comment;
  }
}
