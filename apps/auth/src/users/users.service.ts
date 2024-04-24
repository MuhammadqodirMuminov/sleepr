import {
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto) {
        await this.validateCreateUserDto(createUserDto);
        return await this.userRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
        });
    }

    async verifyUser(email: string, password: string) {
        console.log(email, password);

        const user = await this.userRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid.');
        }
        return user;
    }

    async findAll() {
        return await this.userRepository.find({});
    }

    async findOne(id: string) {
        return await this.userRepository.findOne({ _id: id.toString() });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const updatedUser = await this.userRepository.fundOneAndUpdate(
            {
                _id: id.toString(),
            },
            updateUserDto,
        );
        return updatedUser;
    }

    async remove(id: number) {
        return await this.userRepository.findOneAndDelete({
            _id: id.toString(),
        });
    }

    async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.userRepository.findOne({ email: createUserDto.email });
        } catch (error) {
            return;
        }
        throw new UnprocessableEntityException('Email already exists.');
    }
}
