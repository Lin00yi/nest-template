import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { Result } from 'src/utils/result';
import { CheckUsernameDto } from './dto/checkusername.dto';

@ApiTags('用户')
// @Controller('user')
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '检查用户名' })
  @Get('checkUsername')
  CheckUsername(@Body() userInfo: CheckUsernameDto) {
    return this.userService.checkUsername(userInfo);
  }

  @ApiOperation({ summary: '登录注册' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @ApiOperation({ summary: '查询个人信息' })
  @Get('getUserInfo')
  getUserInfo(@Req() request: Request): Promise<Result<User>> {
    const authHeader = request.headers['token'];
    // LogUtil.log(`authHeader: ${authHeader}`);
    return this.userService.findUserByToken(authHeader);
  }
  @ApiOperation({ summary: '退出登录' })
  @Post('logout')
  async logout(@Body() { userId }): Promise<Result<null>> {
    // 假设请求中包含用户信息，比如用户ID
    return await this.userService.logout(userId);
  }

  @ApiOperation({ summary: '创建用户' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '查询用户' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '查询单个用户' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: '更新用户' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
