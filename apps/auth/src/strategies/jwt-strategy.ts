import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request?.cookies?.Authentication,
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate({ userId }: TokenPayload) {
        try {
            return await this.usersService.findOne(userId.toString());
        } catch (error) {
            throw new UnauthorizedException(error?.message);
        }
    }
}
