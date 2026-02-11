import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.status === UserStatus.INACTIVE) {
            throw new UnauthorizedException('Account is deactivated');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}
