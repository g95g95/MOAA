import Anthropic from '@anthropic-ai/sdk';

export class ClaudeService {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required');
    }
    this.client = new Anthropic({ apiKey });
  }

  async generateDiff(description: string, fileContents: Map<string, string>): Promise<string> {
    const filesContext = Array.from(fileContents.entries())
      .map(([path, content]) => `=== ${path} ===\n${content}`)
      .join('\n\n');

    const systemPrompt = `You are an AI senior software engineer. Your task is to implement code changes based on user requests.

IMPORTANT RULES:
1. Return ONLY a unified git diff - no explanations, no markdown, no code blocks
2. Make minimal, safe changes that don't break existing functionality
3. Follow existing code patterns and style
4. Don't introduce security vulnerabilities
5. Keep changes small and focused

The diff should be in standard unified diff format that can be applied with 'git apply'.`;

    const userPrompt = `Here are the current files in the repository:

${filesContext}

---

User Request: ${description}

Generate a unified git diff to implement this change. Return ONLY the diff, nothing else.`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return this.extractDiff(textBlock.text);
  }

  private extractDiff(response: string): string {
    let diff = response.trim();

    if (diff.startsWith('```diff')) {
      diff = diff.slice(7);
    } else if (diff.startsWith('```')) {
      diff = diff.slice(3);
    }

    if (diff.endsWith('```')) {
      diff = diff.slice(0, -3);
    }

    return diff.trim();
  }
}
