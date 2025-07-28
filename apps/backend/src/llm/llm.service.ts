import {
  HumanMessage,
  MessageContent,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatOllama } from '@langchain/ollama';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  private model = new ChatOllama({
    baseUrl: 'http://localhost:11434',
    model: 'gemma3',
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    stop: ['<|im_end|>'],
  });

  async ask(message: string): Promise<MessageContent> {
    const response = await this.model.call([
      new SystemMessage('You are a helpful AI coding assistant.'),
      new HumanMessage(message),
    ]);

    return response.content;
  }
}
