import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SwaggerService {
  async fetchSwaggerJson(): Promise<any> {
    const response = await axios.get(
      'http://localhost:3000/api/v1-tournament/docs-json',
    );
    return response.data;
  }
}
