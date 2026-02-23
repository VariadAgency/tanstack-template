import { createServerFn } from '@tanstack/react-start'
import { Anthropic } from '@anthropic-ai/sdk'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// Helper to call n8n Webhook from Server-Side to avoid Mixed Content (HTTP vs HTTPS) issues
export const callN8NWebhook = createServerFn({ method: 'POST' })
  .inputValidator((d: { prompt: string }) => d)
  .handler(async ({ data }) => {
    const N8N_WEBHOOK_URL = 'http://76.13.155.84:22612/webhook/843de30d-bcca-49f6-a8a2-9e5670add116';
    
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: data.prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Extract response text from n8n result
      let responseText = '';
      if (typeof result === 'string') {
        responseText = result;
      } else if (result.output) {
        responseText = result.output;
      } else if (result.response) {
        responseText = result.response;
      } else if (result.text) {
        responseText = result.text;
      } else {
        responseText = JSON.stringify(result, null, 2);
      }

      return { content: responseText };
    } catch (error) {
      console.error('Error in n8n server function:', error);
      throw new Error('Der n8n-Server ist nicht erreichbar oder hat ungültig geantwortet.');
    }
  });

const DEFAULT_SYSTEM_PROMPT = `You are TIM-KEK-AI, an AI assistant using Markdown for clear and structured responses.`

// Non-streaming implementation (Legacy/Anthropic)
export const genAIResponse = createServerFn({ method: 'GET', response: 'raw' })
  .inputValidator(
    (d: {
      messages: Array<Message>
      systemPrompt?: { value: string; enabled: boolean }
    }) => d,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('Missing API key')
    const anthropic = new Anthropic({ apiKey, timeout: 30000 })
    const formattedMessages = data.messages
      .filter(msg => msg.content.trim() !== '' && !msg.content.startsWith('Sorry'))
      .map(msg => ({ role: msg.role, content: msg.content.trim() }))

    try {
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: data.systemPrompt?.enabled ? `${DEFAULT_SYSTEM_PROMPT}\n\n${data.systemPrompt.value}` : DEFAULT_SYSTEM_PROMPT,
        messages: formattedMessages,
      })
      const encoder = new TextEncoder()
      const transformedStream = new ReadableStream({
        async start(controller) {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const chunk = { type: 'content_block_delta', delta: { type: 'text_delta', text: event.delta.text } }
              controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
            }
          }
          controller.close()
        },
      })
      return new Response(transformedStream, { headers: { 'Content-Type': 'application/x-ndjson' } })
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
  })
