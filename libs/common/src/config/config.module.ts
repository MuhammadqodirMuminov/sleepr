import { Module } from '@nestjs/common';
import {
    ConfigService,
    ConfigModule as NestjsConfigModule,
} from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        NestjsConfigModule.forRoot({
            validationSchema: Joi.object({
                MONGODB_URI: Joi.string(),
            }),
        }),
    ],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
