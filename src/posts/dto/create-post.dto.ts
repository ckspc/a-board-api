import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PostCategory } from '@prisma/client';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsEnum(PostCategory)
    category: PostCategory;
}