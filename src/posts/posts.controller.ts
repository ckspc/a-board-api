import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetPostsDto } from './dto/get-posts.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtUser } from '../auth/interfaces/user.interface';
import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: GetPostsDto) {
    return this.postsService.findAll(query);
  }

  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  findMyPosts(@User() user: JwtUser, @Query() query: GetPostsDto) {
    return this.postsService.findMyPost(query, user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() user: JwtUser, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user.userId, createPostDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtUser,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, user.userId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @User() user: JwtUser) {
    return this.postsService.remove(id, user.userId);
  }
}
