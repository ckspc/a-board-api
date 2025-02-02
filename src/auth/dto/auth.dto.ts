import { IsOptional, IsString, IsUrl, MinLength, IsBoolean } from 'class-validator';

export class SignUpDto {
    @IsString()
    @MinLength(4)
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name?: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsBoolean()
    @IsOptional()
    signInStatus?: boolean;
}

export class SignInDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}