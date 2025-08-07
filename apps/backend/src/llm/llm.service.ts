import {
  HumanMessage,
  MessageContent,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FileArraySchema, SchemaString } from 'src/zod/file-structure.zod';

@Injectable()
export class LlmService {
  // gemma3
  private model = new ChatOllama({
    baseUrl: 'http://localhost:11434',
    model: 'llama3.2',
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    stop: ['<|im_end|>'],
  });

  private openaiModel = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.5,
    topP: 0.9,
    streaming: true,
    maxTokens: 3000,
    apiKey:
      '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',
  });

  async *askStream(message: string): AsyncGenerator<MessageContent> {
    const stream = await this.model.stream([
      new SystemMessage('You are a helpful AI coding assistant.'),
      new HumanMessage(message),
    ]);

    for await (const chunk of stream) {
      // each chunk is a MessageChunk, extract `.content`
      yield chunk.content;
    }
  }

  async *askOpenaiStream(message: string): AsyncGenerator<MessageContent> {
    const stream = await this.openaiModel.stream([
      new SystemMessage('You are a helpful AI coding assistant.'),
      new HumanMessage(message),
    ]);

    for await (const chunk of stream) {
      // each chunk is a MessageChunk, extract `.content`
      yield chunk.content;
    }
  }

  private async askStructured(prompt: string): Promise<any> {
    const response = await this.openaiModel.invoke([
      new SystemMessage(
        'You are a full-stack AI assistant who generates production-ready frontend code.',
      ),
      new HumanMessage(prompt),
    ]);

    return response.content; // usually a string
  }

  async generateFrontendFromSwagger(swaggerJson: any, useOpenai = true) {
    const prompt = `
      Generate frontend files (React + Next.js App Router + TailwindCSS) from this Swagger JSON.

      Return ONLY a JSON array like:
      [
        { "filename": "app/users/page.tsx", "content": "..." },
        { "filename": "components/UserForm.tsx", "content": "..." }
      ]

      The structure MUST follow this JSON schema:
      ${JSON.stringify(SchemaString, null, 2)}

      Swagger:
      ${JSON.stringify(swaggerJson, null, 2)}
      `;

    const raw = useOpenai
      ? await this.askStructured(prompt)
      : await this.model
          .invoke([new HumanMessage(prompt)])
          .then((r) => r.content);

    try {
      const start = raw.indexOf('[');
      const end = raw.lastIndexOf(']');
      const cleanJson = raw.slice(start, end + 1);

      const parsed = JSON.parse(cleanJson);
      const valid = FileArraySchema.parse(parsed);

      await this.writeFiles(valid);
      return { success: true, count: valid.length };
    } catch (err) {
      console.error('❌ Failed to parse or validate AI response:', err.message);
      return { success: false, error: err.message };
    }
  }

  private async writeFiles(files: { filename: string; content: string }[]) {
    const baseDir = path.join(process.cwd(), 'generated-ui');

    for (const file of files) {
      const fullPath = path.join(baseDir, file.filename);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.content, 'utf-8');
      console.log(`✅ Created: ${file.filename}`);
    }
  }
}
