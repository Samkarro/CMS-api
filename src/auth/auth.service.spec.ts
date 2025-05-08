import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/users.entity';
import { RegisterRequestDto } from '../common/dtos/register-request.dto';
import * as bcrypt from 'bcryptjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    jest.spyOn(mockUserRepository, 'create').mockReturnValue(user);

    // Act
    await service.register(registerRequestDto, 'en');

    // Assert
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      registerRequestDto.username,
      registerRequestDto.email,
      user.password, // TODO: Do test for jwt once ur done with the issue
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

    jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(user);

    // Act
    await service.login(loginRequest, 'en');

    // Assert
    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      email: 'serpentsfvng@gmail.com',
    });
  });
});
