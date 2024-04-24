import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto) {
        const newUser = await this.userRepository.create(createUserDto);
        return newUser;
    }

    async findAll() {
        return await this.userRepository.find({});
    }

    async findOne(id: number) {
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
}
