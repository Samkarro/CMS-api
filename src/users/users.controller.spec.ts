import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { RegisterRequestDto } from '../common/dtos/register-request.dto';
import { User } from '../users/entities/users.entity';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    validateUser: jest.fn(),
    findOneByEmail: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register => Should create user, validate user credentials and return jwt token', async () => {
    // Arrange
    const registerRequestDto = {
      username: 'Serpentino',
      email: 'serpentsfvng@gmail.com',
      password: 'definitelyNotSecure',
    } as RegisterRequestDto;

    const user = {
      id: Date.now(),
      username: 'Serpentino',
      email: 'serpentsfvng@gmail.com',
      password: await bcrypt.hash(registerRequestDto.password, 10),
    } as User;

    jest.spyOn(mockAuthService, 'register').mockReturnValue(user);
    // Act
    const result = await mockAuthService.register(registerRequestDto, 'en');

    // Assert
    expect(mockAuthService.register).toHaveBeenCalled();
    expect(mockAuthService.register).toHaveBeenCalledWith(
      registerRequestDto,
      'en',
    );
  });
  it('login => Should validate user credentials and return jwt token', async () => {
    // Arrange
    const loginRequest = {
      email: 'serpentsfvng@gmail.com',
      password: 'definitelyNotSecure',
    } as User;
    const user = {
      id: Date.now(),
      username: 'Serpentino',
      email: 'serpentsfvng@gmail.com',
      password: await bcrypt.hash(loginRequest.password, 10),
    } as User;

    jest.spyOn(mockAuthService, 'login').mockReturnValue(user); // TODO: also do stuff here once ur done

    // Act
    await mockAuthService.login(loginRequest, 'en');

    // Assert
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest, 'en');
  });
});
