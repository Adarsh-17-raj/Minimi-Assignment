/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { ChatArea } from './components/ChatArea.js';
import { DesignDocModal } from './components/DesignDocModal.js';
import { MemoryInspectorModal } from './components/MemoryInspectorModal.js';
import { Session, AgentStep, GroundingData } from './types.js';

export default function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('benchmark-crm');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStreamingText, setCurrentStreamingText] = useState<string>('');
  const [currentLiveSteps, setCurrentLiveSteps] = useState<AgentStep[]>([]);
  const [currentLiveGrounding, setCurrentLiveGrounding] = useState<GroundingData | undefined>(undefined);

  // Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDesignDocOpen, setIsDesignDocOpen] = useState<boolean>(false);
  const [isMemoryInspectorOpen, setIsMemoryInspectorOpen] = useState<boolean>(false);

  // Load sessions from API
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions');
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      if (data.sessions && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
        if (!activeSessionId && data.sessions.length > 0) {
          setActiveSessionId(data.sessions[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  }, [activeSessionId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleNewSession = async () => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      const data = await res.json();
      if (data.session) {
        setSessions((prev) => [data.session, ...prev]);
        setActiveSessionId(data.session.id);
      }
    } catch (err) {
      console.error('Error creating new session:', err);
    }
  };

  const handleResetBenchmark = async () => {
    try {
      const res = await fetch('/api/sessions/reset', { method: 'POST' });
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
        setActiveSessionId('benchmark-crm');
      }
    } catch (err) {
      console.error('Error resetting benchmark sessions:', err);
    }
  };

  const handleSendMessage = async (text: string, targetSessionId?: string) => {
    const sessId = targetSessionId || activeSessionId || 'benchmark-crm';
    setIsLoading(true);
    setCurrentStreamingText('');
    setCurrentLiveSteps([]);
    setCurrentLiveGrounding(undefined);

    // Optimistically add user message to UI
    const tempUserMsgId = 'temp-user-' + Date.now();
    const tempUserMsg = {
      id: tempUserMsgId,
      role: 'user' as const,
      content: text,
      timestamp: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === sessId ? { ...s, messages: [...s.messages, tempUserMsg] } : s))
    );

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessId,
          message: text,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start chat stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (currentEvent === 'step' || parsed.id?.startsWith('step-')) {
                setCurrentLiveSteps((prev) => {
                  const existingIdx = prev.findIndex((s) => s.id === parsed.id);
                  if (existingIdx >= 0) {
                    const updated = [...prev];
                    updated[existingIdx] = parsed;
                    return updated;
                  }
                  return [...prev, parsed];
                });
              } else if (currentEvent === 'delta') {
                if (parsed.delta) {
                  setCurrentStreamingText((prev) => prev + parsed.delta);
                }
              } else if (currentEvent === 'grounding') {
                setCurrentLiveGrounding(parsed);
              } else if (currentEvent === 'done') {
                // Done event, refresh active session
                await fetchSessions();
              }
            } catch (e) {
              console.error('Error parsing SSE event data:', e, dataStr);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Streaming chat failed:', err);
      setCurrentStreamingText((prev) => prev + `\n\n*(Error: ${err.message || 'Stream interrupted'})*`);
    } finally {
      setIsLoading(false);
      await fetchSessions();
    }
  };

  const handleSelectBenchmarkPrompt = (prompt: string, sessionId?: string) => {
    if (sessionId) {
      setActiveSessionId(sessionId);
    }
    handleSendMessage(prompt, sessionId);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSession?.id || ''}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewSession={handleNewSession}
        onResetBenchmark={handleResetBenchmark}
        onSelectBenchmarkPrompt={handleSelectBenchmarkPrompt}
      />

      {/* Main chat column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          currentSession={activeSession}
          onOpenDesignDoc={() => setIsDesignDocOpen(true)}
          onOpenMemoryInspector={() => setIsMemoryInspectorOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <ChatArea
          messages={activeSession?.messages || []}
          isLoading={isLoading}
          currentStreamingText={currentStreamingText}
          currentLiveSteps={currentLiveSteps}
          currentLiveGrounding={currentLiveGrounding}
          onSendMessage={(text) => handleSendMessage(text)}
          onSelectPrompt={(prompt) => handleSendMessage(prompt)}
        />
      </div>

      {/* DESIGN.md Viewer Modal */}
      <DesignDocModal
        isOpen={isDesignDocOpen}
        onClose={() => setIsDesignDocOpen(false)}
      />

      {/* Memory Inspector Modal */}
      <MemoryInspectorModal
        isOpen={isMemoryInspectorOpen}
        onClose={() => setIsMemoryInspectorOpen(false)}
        sessions={sessions}
        onReset={handleResetBenchmark}
        onSelectSession={(id) => setActiveSessionId(id)}
      />
    </div>
  );
}
