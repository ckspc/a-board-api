import { IsOptional, IsInt, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PostCategory } from '@prisma/client';

export class GetPostsDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(PostCategory)
    category?: PostCategory;
}