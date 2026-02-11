import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials or account deactivated' })
    @ApiResponse({ status: 429, description: 'Too many requests' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
