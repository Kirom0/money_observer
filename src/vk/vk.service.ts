import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class VkService {
  private static client_id = 7778112;
  private static client_secret = '4miLx4gZ8txBgUkWwEMy';
  private static redirect_uri = 'http://localhost:3000/';

  private static combine(method, params) {
    return `${method}?${new URLSearchParams(params).toString()}`;
  }

  async oauth(code: string) {
    return await fetch(
      'https://oauth.vk.com/' +
        VkService.combine('access_token', {
          client_id: VkService.client_id,
          client_secret: VkService.client_secret,
          redirect_uri: VkService.redirect_uri,
          code,
        }),
    ).then((res) => res.json());
    //access_token?client_id=7778112&client_secret=4miLx4gZ8txBgUkWwEMy&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&code=${authDto.code}`,
  }

  async method(method, params) {
    return await fetch(
      'https://api.vk.com/method/' + VkService.combine(method, params),
    ).then((res) => res.json());
  }

  async getUsername(user_id, access_token) {
    const vkResponse = await this.method('users.get', {
      user_ids: user_id,
      access_token,
      v: '5.130',
    });
    const { first_name, last_name } = vkResponse.response[0];
    return first_name + ' ' + last_name;
  }
}
