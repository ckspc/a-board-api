import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { JwtUser } from '../auth/interfaces/user.interface';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() user: JwtUser, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(user.userId, createCommentDto);
  }
}
