import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SwaggerService {
  async fetchSwaggerJson(): Promise<any> {
    const response = await axios.get('http://localhost:3000/api/docs-json', {
      auth: {
        username: 'admin',
        password: '12345',
      },
    });
    return response.data;
  }
}
