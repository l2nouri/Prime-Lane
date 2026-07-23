'use client';

import { useEffect, useRef, useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  dbId?: string;
  feedback?: 'up' | 'down';
};

function getSessionId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  const stored = localStorage.getItem('lenava_session_id');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('lenava_session_id', id);
  return id;
}

function getLanguage(): 'en' | 'it' {
  if (typeof window === 'undefined') return 'en';
  return navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function TypingDots() {
  return (
    <span className="typing-dots" aria-label="typing">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [sessionId] = useState(getSessionId);
  const [language] = useState<'en' | 'it'>(getLanguage);
  const [isWidget, setIsWidget] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsWidget(params.get('widget') === 'true');

    const opening =
      language === 'it'
        ? '👋 Benvenuto su LENAVA AI! Aiuto le attività e-commerce a risparmiare tempo, ridurre i costi e aumentare le vendite. Cosa vorresti migliorare oggi?'
        : '👋 Welcome to LENAVA AI! We help e-commerce businesses save time, reduce costs, and increase sales. What would you like to improve today?';

    setMessages([
      {
        id: 'opening',
        role: 'assistant',
        content: opening,
        timestamp: new Date(),
      },
    ]);

    inputRef.current?.focus({ preventScroll: true });
  }, [language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsWaiting(true);
    setIsStreaming(true);

    const assistantId = crypto.randomUUID();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          source: 'web',
          language,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let firstToken = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === 'token') {
              if (firstToken) {
                setIsWaiting(false);
                firstToken = false;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: assistantId,
                    role: 'assistant',
                    content: event.content,
                    timestamp: new Date(),
                    isStreaming: true,
                  },
                ]);
              } else {
                assistantContent += event.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + event.content }
                      : m
                  )
                );
              }
              assistantContent = assistantContent || event.content;
            }

            if (event.type === 'done') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, isStreaming: false, dbId: event.messageId ?? undefined }
                    : m
                )
              );
            }

            if (event.type === 'error') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: 'Something went wrong. Please try again.', isStreaming: false }
                    : m
                )
              );
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch {
      setIsWaiting(false);
      setMessages((prev) => {
        const hasAssistant = prev.some((m) => m.id === assistantId);
        if (hasAssistant) {
          return prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'Something went wrong. Please try again.', isStreaming: false }
              : m
          );
        }
        return [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: 'Something went wrong. Please try again.',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsWaiting(false);
      setIsStreaming(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  }

  function sendFeedback(dbId: string, rating: 'up' | 'down') {
    setMessages((prev) =>
      prev.map((m) => (m.dbId === dbId ? { ...m, feedback: rating } : m))
    );
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: dbId, rating }),
    }).catch(() => {
      // best-effort; UI already reflects the click
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: var(--font-geist-sans, 'Geist Sans', system-ui, sans-serif);
          background: #FFFFFF;
          color: #0A0A0A;
        }

        .chat-root {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          background: #FFFFFF;
        }

        .top-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 56px;
          background: #FFFFFF;
          border-bottom: 1px solid #D4D4D4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 10;
        }

        .top-bar.hidden {
          display: none;
        }

        .brand-name {
          font-family: var(--font-geist-mono, 'Geist Mono', monospace);
          font-size: 13px;
          letter-spacing: 0.2em;
          color: #0A0A0A;
          font-weight: 500;
        }

        .online-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #737373;
        }

        .online-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          padding-top: 80px;
          padding-bottom: 100px;
        }

        .messages-area.widget-mode {
          padding-top: 24px;
        }

        .messages-inner {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
        }

        .message-wrapper.user {
          align-items: flex-end;
        }

        .message-wrapper.assistant {
          align-items: flex-start;
        }

        .bubble {
          padding: 16px;
          border-radius: 16px;
          max-width: 80%;
          line-height: 1.5;
          font-size: 15px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .bubble.assistant {
          background: #F4F4F2;
          color: #2A2A2A;
        }

        .bubble.user {
          background: #7C3AED;
          color: #FFFFFF;
        }

        .timestamp {
          font-family: var(--font-geist-mono, 'Geist Mono', monospace);
          font-size: 11px;
          color: #737373;
        }

        .message-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }

        .feedback-buttons {
          display: flex;
          gap: 2px;
        }

        .feedback-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #737373;
          cursor: pointer;
          transition: background 150ms, color 150ms;
        }

        .feedback-btn:hover {
          background: #F4F4F2;
          color: #2A2A2A;
        }

        .feedback-btn.active {
          color: #7C3AED;
          background: #7C3AED1A;
        }

        .typing-dots {
          display: inline-flex;
          gap: 4px;
          align-items: center;
          padding: 4px 2px;
        }

        .typing-dots span {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #737373;
          animation: bounce 1.2s infinite;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        .input-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #FFFFFF;
          border-top: 1px solid #D4D4D4;
          padding: 16px 24px;
          z-index: 10;
        }

        .input-inner {
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .text-input {
          flex: 1;
          height: 44px;
          padding: 0 14px;
          background: #FFFFFF;
          border: 1px solid #D4D4D4;
          border-radius: 12px;
          font-size: 14px;
          font-family: inherit;
          color: #0A0A0A;
          outline: none;
          transition: border-color 150ms;
        }

        .text-input:focus {
          border-color: #7C3AED;
        }

        .text-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .text-input::placeholder {
          color: #737373;
        }

        .send-button {
          width: 44px;
          height: 44px;
          background: #7C3AED;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 150ms;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          background: #6D28D9;
        }

        .send-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .messages-area {
            padding: 16px;
            padding-top: 72px;
            padding-bottom: 88px;
          }
          .input-bar {
            padding: 12px 16px;
          }
          .top-bar {
            padding: 0 16px;
          }
        }
      `}</style>

      <div className="chat-root">
        {!isWidget && (
          <div className="top-bar">
            <span className="brand-name">L E N A V A</span>
            <div className="online-indicator">
              <div className="online-dot" />
              <span>Online</span>
            </div>
          </div>
        )}

        <div className={`messages-area${isWidget ? ' widget-mode' : ''}`}>
          <div className="messages-inner">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.role}`}>
                <div className={`bubble ${msg.role}`}>
                  {msg.content}
                </div>
                <div className="message-footer">
                  <span className="timestamp">{formatTime(msg.timestamp)}</span>
                  {msg.role === 'assistant' && msg.dbId && !msg.isStreaming && (
                    <div className="feedback-buttons">
                      <button
                        type="button"
                        aria-label="Good response"
                        className={`feedback-btn${msg.feedback === 'up' ? ' active' : ''}`}
                        onClick={() => sendFeedback(msg.dbId!, 'up')}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M7 22H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3M7 22l3.5-1.5h6a2 2 0 0 0 2-1.7l1-6a2 2 0 0 0-2-2.3h-4l.7-4.2a1.5 1.5 0 0 0-2.6-1.2L7 11v11Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label="Bad response"
                        className={`feedback-btn${msg.feedback === 'down' ? ' active' : ''}`}
                        onClick={() => sendFeedback(msg.dbId!, 'down')}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M17 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3M17 2l-3.5 1.5h-6a2 2 0 0 0-2 1.7l-1 6a2 2 0 0 0 2 2.3h4l-.7 4.2a1.5 1.5 0 0 0 2.6 1.2L17 13V2Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isWaiting && (
              <div className="message-wrapper assistant">
                <div className="bubble assistant">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="input-bar">
          <div className="input-inner">
            <input
              ref={inputRef}
              className="text-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'it' ? 'Scrivi un messaggio...' : 'Type a message...'}
              disabled={isStreaming}
              autoComplete="off"
            />
            <button
              className="send-button"
              onClick={() => sendMessage(input)}
              disabled={isStreaming || !input.trim()}
              aria-label="Send"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 15L15 9L3 3V7.5L11 9L3 10.5V15Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
