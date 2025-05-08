import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AccessToken } from '../common/types/AccessToken';
import { RegisterRequestDto } from '../common/dtos/register-request.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async register(user: RegisterRequestDto, lang: string): Promise<AccessToken> {
    const userExists = await this.findOneByEmail(user.email);
    if (userExists) {
      throw new BadRequestException(
        this.i18n.t('test.AUTH.USER_EXISTS', {
          lang,
        }),
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return this.login(newUser, lang);
  }

  async validateUser(
    email: string,
    password: string,
    lang: string,
  ): Promise<User> {
    const user: User = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('test.USER.NOT_FOUND_EMAIL', {
          lang,
        }),
      );
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        this.i18n.t('test.AUTH.PASSWORD', {
          lang,
        }),
      );
    }
    return user;
  }
  async login(user: User, lang: string): Promise<AccessToken> {
    const searchedUser = await this.validateUser(
      user.email,
      user.password,
      lang,
    );

    const payload = { email: searchedUser.email, id: searchedUser.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async findOneByEmail(email): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    return user; // Returns no matter what to be handled outside of the method
  }
}
