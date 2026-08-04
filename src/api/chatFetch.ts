import { getAccessToken } from '@/services/tokenService'

export const CHAT_API_URL = `${import.meta.env.VITE_API_BASE_URL}/copilot/chat`

let interceptorInstalled = false

function isChatRequest(url: string) {
  return url.includes('/copilot/chat')
}

/**
 * Extract the latest user text from the widget's AI SDK request body
 * ({ messages: UIMessage[] }).
 */
function extractUserMessage(body: Record<string, unknown>): string {
  const messages = body.messages
  if (!Array.isArray(messages)) return ''

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i] as {
      role?: string
      content?: unknown
      parts?: { type?: string; text?: string }[]
    }

    if (message?.role !== 'user') continue

    const text =
      message.parts
        ?.filter((part) => part.type === 'text')
        .map((part) => part.text ?? '')
        .join('') ?? message.content

    if (typeof text === 'string' && text.trim()) return text.trim()
  }

  return ''
}

/**
 * Extract the assistant reply text from the backend's JSON response.
 * Handles `data` as a string or object, plus common reply field names.
 */
function extractReply(json: Record<string, unknown> | null): string {
  if (!json || typeof json !== 'object') return ''

  const data = json.data

  if (typeof data === 'string') return data.trim()

  if (data && typeof data === 'object') {
    const nested = data as Record<string, unknown>
    for (const key of [
      'message',
      'reply',
      'response',
      'text',
      'content',
      'answer',
      'result',
      'conversation',
    ]) {
      if (typeof nested[key] === 'string' && (nested[key] as string).trim()) {
        return (nested[key] as string).trim()
      }
    }
  }

  for (const key of ['message', 'reply', 'response', 'text', 'content']) {
    if (typeof json[key] === 'string' && (json[key] as string).trim()) {
      return (json[key] as string).trim()
    }
  }

  return ''
}

function toSse(chunk: unknown): string {
  return `data: ${JSON.stringify(chunk)}\n\n`
}

/**
 * Turn a plain-text reply into the AI SDK UI-message stream the widget expects.
 */
function buildReplyStream(reply: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const partId = `chat-${crypto.randomUUID()}`

  const chunks: string[] = [
    toSse({ type: 'start' }),
    toSse({ type: 'start-step' }),
    toSse({ type: 'text-start', id: partId }),
  ]

  for (let i = 0; i < reply.length; i += 40) {
    chunks.push(toSse({ type: 'text-delta', id: partId, delta: reply.slice(i, i + 40) }))
  }

  chunks.push(toSse({ type: 'text-end', id: partId }))
  chunks.push(toSse({ type: 'finish-step' }))
  chunks.push(toSse({ type: 'finish', finishReason: 'stop' }))
  chunks.push('data: [DONE]\n\n')

  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    },
  })
}

function buildErrorStream(message: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(toSse({ type: 'error', errorText: message })))
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
}

/**
 * Patch window.fetch so chat requests are sent to the authenticated backend.
 *
 * The ChatWidget speaks the AI SDK streaming protocol, but the backend expects
 * a plain `{ message }` request and returns a plain JSON reply. This adapter:
 *  1. reads the widget's request body and extracts the user message,
 *  2. POSTs `{ message }` to /copilot/chat with the bearer token (mirroring apiClient),
 *  3. converts the JSON reply into the AI SDK stream the widget renders.
 */
export function installChatAuthInterceptor() {
  if (interceptorInstalled || typeof window === 'undefined') return
  interceptorInstalled = true

  const originalFetch = window.fetch.bind(window)

  window.fetch = (input, init) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    if (!isChatRequest(url)) {
      return originalFetch(input, init)
    }

    return (async () => {
      const token = getAccessToken()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      let userMessage = ''

      try {
        const rawBody = init?.body
        const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : {}
        userMessage = extractUserMessage(body ?? {})
      } catch {
        userMessage = ''
      }

      const response = await originalFetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMessage }),
        signal: init?.signal,
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Chat request failed')
        return new Response(buildErrorStream(errorText), {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' },
        })
      }

      const json = (await response.json().catch(() => null)) as Record<string, unknown> | null
      const reply = extractReply(json)

      if (!reply) {
        return new Response(buildErrorStream('Sorry, I could not generate a response.'), {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' },
        })
      }

      return new Response(buildReplyStream(reply), {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      })
    })()
  }
}