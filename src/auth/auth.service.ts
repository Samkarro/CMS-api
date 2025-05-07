import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AccessToken } from 'src/common/types/AccessToken';
import { RegisterRequestDto } from 'src/common/dtos/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const userExists = await this.findOneByEmail(user.email);
    if (userExists) {
      throw new BadRequestException(
        'User already exists. Re-enter valid credentials',
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return this.login(newUser);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }
  async login(user: User): Promise<AccessToken> {
    const searchedUser = await this.validateUser(user.email, user.password);

    const payload = { email: searchedUser.email, id: searchedUser.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async findOneByEmail(email): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    return user; // Returns no matter what to be handled outside of the method
  }
}
