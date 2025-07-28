import { Body, Controller, Post } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller('chat')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('')
  async ask(@Body('message') message: string) {
    const response = await this.llmService.ask(message);
    return { result: response };
  }
}
