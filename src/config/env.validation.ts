import { IsString, IsNumber, IsOptional, ValidateNested, validateSync } from 'class-validator';
import { Type, plainToInstance } from 'class-transformer';

class DatabaseConfig {
    @IsString()
    host: string;

    @IsNumber()
    port: number;

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    name: string;
}

class JwtConfig {
    @IsString()
    secret: string;

    @IsString()
    expiresIn: string;
}

export class EnvironmentVariables {
    @IsNumber()
    @IsOptional()
    PORT?: number;

    @ValidateNested()
    @Type(() => DatabaseConfig)
    database: DatabaseConfig;

    @ValidateNested()
    @Type(() => JwtConfig)
    jwt: JwtConfig;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const validationErrors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (validationErrors.length > 0) {
        throw new Error(validationErrors.toString());
    }
    return validatedConfig;
}