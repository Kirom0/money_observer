import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthDto } from './dto/auth.dto';
import { VkService } from './vk/vk.service';
import { UserDto } from './dto/user.dto';
import { RecordDto } from './dto/record.dto';
import { VK_CLIENT_ID, VK_REDIRECT_URI } from './config';

interface AuthResponse {
  user_id: number;
  token: string;
  name: string;
  error: string;
  balance: number;
  success: boolean;
  vk_oauth_uri: string;
}

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly vkService: VkService,
  ) {}

  @Get('records/get/:from-:to/:token')
  async recordsGet(
    @Param('from') from: string,
    @Param('to') to: string,
    @Param('token') token: string,
  ) {
    console.log(from, to, token);
    const auth = await this.appService.getAuth(token);
    if (!auth) {
      return { error: 'Invalid authorization data' };
    }
    const { user_id } = auth;
    return await this.appService.recordGet(user_id, from, to);
  }

  @Post('auth')
  async auth(@Body() authDto: AuthDto): Promise<AuthResponse> {
    const initialAnswer: AuthResponse = {
      user_id: 0,
      error: '',
      name: '',
      token: '',
      balance: 0,
      success: false,
      vk_oauth_uri:
        'https://oauth.vk.com/authorize?' +
        new URLSearchParams({
          client_id: VK_CLIENT_ID,
          redirect_uri: VK_REDIRECT_URI,
          scope: '65536',
          display: 'popup',
          response_type: 'code',
        }).toString(),
    };
    try {
      const userDto: UserDto = await this.appService.getAuth(authDto.token);
      if (userDto) {
        const { user_id, token, access_token, balance } = userDto;
        const name = await this.vkService.getUsername(user_id, access_token);
        return {
          ...initialAnswer,
          user_id,
          token,
          name,
          balance,
          success: true,
        };
      }
      const oauthRes = await this.vkService.oauth(authDto.token);
      if (oauthRes.error) {
        throw new Error('VK:' + oauthRes.error_description);
      }
      const { access_token, user_id } = oauthRes;

      const name = await this.vkService.getUsername(user_id, access_token);
      const token = authDto.token;

      const { balance } = await this.appService.auth({
        user_id,
        access_token,
        token,
        balance: 0,
      });
      return { ...initialAnswer, user_id, token, name, success: true, balance };
    } catch (e) {
      console.log(e.message);
      return {
        ...initialAnswer,
        error: 'Авторизация не удалась. Попробуйте снова.',
      };
    }
  }

  @Post('records/new')
  async recordsNew(@Body() recordDto: RecordDto) {
    console.log('recordsNew', recordDto);
    const auth = await this.appService.getAuth(recordDto.token);
    if (!auth) {
      return { error: 'Invalid authorization data' };
    }
    const { user_id } = auth;
    return await this.appService.recordNew(recordDto, user_id);
  }

  @Put('records/update')
  async recordsUpdate(@Body() recordDto: RecordDto & { id: string }) {
    const auth = await this.appService.getAuth(recordDto.token);
    if (!auth) {
      return { error: 'Invalid authorization data' };
    }
    const { id } = recordDto;
    delete recordDto.id;
    await this.appService.recordUpdate(id, recordDto);
    return {};
  }

  @Delete('records/delete')
  async recordsDelete(@Body() req: { id: string; token: string }) {
    const auth = await this.appService.getAuth(req.token);
    if (!auth) {
      return { error: 'Invalid authorization data' };
    }
    const { id } = req;
    return await this.appService.recordDelete(id);
  }
}
