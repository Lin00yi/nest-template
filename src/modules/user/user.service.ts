import { Injectable } from '@nestjs/common';
import { LogUtil } from '../../utils/log';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResultService } from 'src/utils/resultUtils';
import { Result } from 'src/utils/result';
import { CheckUsernameDto } from './dto/checkusername.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // 注入User实体类的Repository
    private jwtService: JwtService,
  ) {}

  checkUsername(userInfo: CheckUsernameDto): Result<any> {
    const { username, rootname } = userInfo;
    if (username && rootname) {
      return ResultService.success('Check successful', null);
    } else return ResultService.failure('Check failed');
  }

  /**
   *
   * @param { loginParam, code }
   * @returns
   */
  async login({ loginParam, code }: LoginDto): Promise<Result<any>> {
    // 实际的登录逻辑...
    // 返回用户信息或者认证令牌等
    LogUtil.log(`loginParam: ${loginParam}, code: ${code}`);
    if (!loginParam || !code) {
      return ResultService.failure();
    }
    let user = null;
    // 查找用户
    user = await this.userRepository.findOne({
      where: [{ mobile: loginParam }, { email: loginParam }],
    });
    //新增一个用户
    if (!user) {
      const newUser = this.userRepository.create({
        mobile: loginParam,
      });
      user = await this.userRepository.save(newUser);
    }

    // 验证码校验逻辑，这里简单起见直接通过--暂时关闭校验
    // if (code !== 'expectedCode') {
    //   return 'Invalid code';
    // }

    // 生成 JWT 令牌
    const payload = { loginParam: loginParam, sub: user.id };
    const token = this.jwtService.sign(payload);
    const tokenInfo = {
      tokenValue: token,
    };
    return ResultService.success(`Login successful`, { tokenInfo });
  }

  /**
   *
   * @param tokenValue Token value
   * @returns User
   */
  async findUserByToken(tokenValue: string): Promise<Result<User | null>> {
    try {
      // LogUtil.log(`tokenValue: ${tokenValue}`);
      if (!tokenValue) {
        return ResultService.failure('Token not found');
      }
      // 验证并解析 JWT 令牌
      const decodedToken = this.jwtService.verify(tokenValue);
      // 从解析后的令牌中获取用户 ID 或其他标识符
      const userId = decodedToken.sub;
      // 使用用户 ID 查找用户信息
      const user = await this.findOne(userId);
      return ResultService.success('Successful', user);
    } catch (error) {
      LogUtil.error(`error tokenValue: ${error}`);
      // 如果验证失败或令牌过期等，返回 null 或者抛出错误
      return ResultService.failure('Failed to fetch user information');
    }
  }

  async logout(userId: number): Promise<Result<null>> {
    // 清除用户的令牌、清空会话数据
    try {
      if (userId) {
        LogUtil.log(`User with ID ${userId} logged out successfully.`);
        //清除本地缓存的token
        this.jwtService.sign({ loginParam: null, sub: null });
        return ResultService.success('Logged out successfully');
      } else {
        return ResultService.failure('Failed to logout');
      }
    } catch (error) {
      LogUtil.error(`error userId: ${error}`);
      return ResultService.failure('Failed to logout');
    }
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
