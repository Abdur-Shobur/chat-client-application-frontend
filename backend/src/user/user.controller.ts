import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseHelper } from 'src/helper';
import { AuthGuard } from 'src/helper/auth-guard';
import { Role, Roles } from 'src/role/decorator';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * get categories
   */
  @Get()
  @Roles(Role.USER_ALL)
  async findAll(@Query('status') status?: string) {
    const result = await this.userService.findAll(status);

    // if not found
    if (!result) {
      return ResponseHelper.error('User not found');
    }

    // if found
    return ResponseHelper.success(result);
  }
}
