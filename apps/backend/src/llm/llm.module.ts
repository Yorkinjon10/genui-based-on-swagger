import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { SwaggerService } from 'src/swagger/swagger.service';

@Module({
  imports: [],
  controllers: [LlmController],
  providers: [LlmService, SwaggerService],
})
export class LlmModule {}
