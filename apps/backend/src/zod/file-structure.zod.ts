import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const GeneratedFileSchema = z.object({
  filename: z
    .string()
    .describe("The relative file path to create, such as 'app/users/page.tsx'"),
  content: z
    .string()
    .describe(
      'The full contents of the file as a valid React/Next.js component. Every file must be complete and runnable.',
    ),
});

export const FileArraySchema = z.array(GeneratedFileSchema);

// ✅ Cast as any to bypass TS inference problem
export const SchemaString = zodToJsonSchema(FileArraySchema as any);
