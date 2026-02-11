import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        // Environment Configuration
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // Rate Limiting
        ThrottlerModule.forRoot([{
            ttl: 60000, // 1 minute
            limit: 10,  // 10 requests per minute
        }]),

        // Event System
        EventEmitterModule.forRoot(),

        // Static File Serving (for uploads)
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),

        // Database
        PrismaModule,

        // Feature Modules
        AuthModule,
        // UsersModule,
        // LeaveModule,
        // ArchiveModule,
        // Survey360Module,
        // NotificationModule,
    ],
})
export class AppModule { }
