import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { LlmService } from './llm.service';
import { Response } from 'express';
import { SwaggerService } from 'src/swagger/swagger.service';

@Controller('chat')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly swaggerService: SwaggerService,
  ) {}

  @Get('ask')
  @Header('Content-Encoding', 'identity')
  async ask(@Body('message') message: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const token of this.llmService.askStream(message)) {
      res.write(token);
      res.flush?.();
    }

    res.end();
  }

  @Get('ask-openai')
  @Header('Content-Encoding', 'identity')
  async askOpenai(@Body('message') message: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const token of this.llmService.askOpenaiStream(message)) {
      res.write(token);
      res.flush?.();
    }

    res.end();
  }

  @Get()
  async triggerGeneration(@Query('useOpenai') useOpenai: string) {
    const swagger = await this.swaggerService.fetchSwaggerJson();

    return this.llmService.generateFrontendFromSwagger(
      swagger,
      useOpenai === 'true',
    );
  }
}
