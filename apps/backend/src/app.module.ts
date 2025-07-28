import { Module } from '@nestjs/common';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
