import { Session, Message } from '../types.js';

// Base anchor reference date: 2026-11-11
export const ANCHOR_DATE = new Date('2026-11-11T10:52:50-08:00');

export function getAnchorDate(): Date {
  return new Date(ANCHOR_DATE);
}

// Initial pre-seeded benchmark sessions for the hiring challenge test dataset
const INITIAL_SESSIONS: Session[] = [
  {
    id: 'benchmark-crm',
    title: 'Shortlisted CRM Tools (Monday, Nov 9)',
    createdAt: '2026-11-09T14:30:00.000Z',
    updatedAt: '2026-11-09T14:32:00.000Z',
    isBenchmark: true,
    benchmarkKey: 'crm',
    description: 'Shortlisted 5 CRM tools for a 20-person sales team with pricing as of Monday, Nov 9, 2026.',
    messages: [
      {
        id: 'crm-msg-1',
        role: 'user',
        content: 'On Monday we shortlisted 5 CRM tools for a 20-person sales team. What are the best options for our size, along with their pricing and recent features?',
        timestamp: '2026-11-09T14:30:00.000Z',
        displayTime: 'Monday, Nov 9, 2026 at 2:30 PM'
      },
      {
        id: 'crm-msg-2',
        role: 'assistant',
        content: `Here is our shortlisted breakdown of 5 top CRM platforms for your 20-person sales team, recorded on Monday, November 9, 2026:

1. **HubSpot Sales Hub (Professional)**
   - **Pricing**: $90/seat/month (billed annually) or $100/seat/month (billed monthly). For 20 users, this is ~$1,800/month ($21,600/year) plus a one-time onboarding fee (~$1,500).
   - **Key Features**: Strong inbound lead routing, deal pipeline automation, custom reporting, and Breeze AI sales copilot.

2. **Pipedrive (Advanced / Professional)**
   - **Pricing**: Advanced tier is $39–$44/seat/month; Professional tier is $59–$69/seat/month (billed annually vs monthly). For 20 users on Professional: ~$1,180–$1,380/month.
   - **Key Features**: Visual deal pipeline, activity scheduling, email sync, workflow automations, and AI Smart Docs.

3. **Close CRM (Growth / Pro)**
   - **Pricing**: Growth plan is $49/seat/month (billed annually); Pro plan is $99/seat/month. For 20 users on Growth: ~$980/month.
   - **Key Features**: Built for high-velocity inside sales; built-in VoIP calling, SMS, email sequences, and automated power dialer.

4. **Salesforce Sales Cloud (Enterprise / Pro Suite)**
   - **Pricing**: Pro Suite is $100/user/month; Enterprise is $165/user/month. For 20 users on Pro Suite: ~$2,000/month.
   - **Key Features**: Enterprise-grade custom objects, territory management, advanced forecasting, and Agentforce autonomous agents.

5. **Zoho CRM (Professional / Enterprise)**
   - **Pricing**: Professional tier is $23/user/month; Enterprise tier is $40/user/month. For 20 users on Professional: ~$460/month.
   - **Key Features**: Unmatched price-to-feature ratio, omnichannel communication, Zia AI predictions, and native suite integration.`,
        timestamp: '2026-11-09T14:31:15.000Z',
        displayTime: 'Monday, Nov 9, 2026 at 2:31 PM'
      }
    ]
  },
  {
    id: 'benchmark-postgres',
    title: 'Postgres Hosting Pricing (Tuesday, Nov 3)',
    createdAt: '2026-11-03T11:15:00.000Z',
    updatedAt: '2026-11-03T11:17:00.000Z',
    isBenchmark: true,
    benchmarkKey: 'postgres',
    description: 'Postgres hosting comparison asked on Tuesday, Nov 3, 2026 (Last Tuesday).',
    messages: [
      {
        id: 'pg-msg-1',
        role: 'user',
        content: 'I need managed Postgres hosting for our production application. Can you break down the top modern options and their current pricing?',
        timestamp: '2026-11-03T11:15:00.000Z',
        displayTime: 'Tuesday, Nov 3, 2026 at 11:15 AM'
      },
      {
        id: 'pg-msg-2',
        role: 'assistant',
        content: `Here is the comprehensive comparison of modern managed Postgres providers discussed on Tuesday, November 3, 2026:

1. **Supabase**
   - **Pricing**: Pro Plan starts at **$25/month** base. Includes 8 GB database storage, 100k Monthly Active Users, and 250 GB bandwidth.
   - **Compute Add-ons**: Micro ($10/mo), Small ($15/mo), Medium ($60/mo), Large ($110/mo). Dedicated compute options scale higher.
   - **Features**: Built-in Auth, Storage, Edge Functions, real-time subscriptions, and pgvector.

2. **Neon (Serverless Postgres)**
   - **Pricing**: Free tier (0.5 GiB storage); Launch tier at **$19/month**; Scale tier at **$69/month**.
   - **Compute Usage**: Scales to zero; active compute billed at $0.16 per compute unit (CU) hour.
   - **Features**: Instant git-like database branching, bottomless S3 storage separation, autoscaling.

3. **Crunchy Bridge (Crunchy Data)**
   - **Pricing**: Hobby tier at $10/mo; Standard production tiers start at **$35/month** (Standard-4), scaling up to $100–$250/mo with dedicated instances.
   - **Features**: Pure open-source PostgreSQL, high availability failover, extensive extension library, top-tier DBA support.

4. **Render PostgreSQL**
   - **Pricing**: Free tier (expires in 30 days); Starter tier at **$7/month**; Standard plans range from **$20/mo to $85/mo**.
   - **Features**: Fully integrated with Render web services, automated daily backups, 1-click read replicas.

5. **AWS Aurora Serverless v2 (PostgreSQL)**
   - **Pricing**: Billed per Aurora Capacity Unit (ACU) at ~$0.12 per ACU-hour + standard database storage ($0.10/GB-month) and I/O requests.
   - **Features**: Enterprise-scale, sub-second auto-scaling, Multi-AZ global distribution.`,
        timestamp: '2026-11-03T11:16:30.000Z',
        displayTime: 'Tuesday, Nov 3, 2026 at 11:16 AM'
      }
    ]
  }
];

class MemoryStore {
  private sessions: Map<string, Session> = new Map();

  constructor() {
    this.reset();
  }

  public reset() {
    this.sessions.clear();
    for (const s of INITIAL_SESSIONS) {
      // Deep clone to prevent mutations
      this.sessions.set(s.id, JSON.parse(JSON.stringify(s)));
    }
  }

  public listSessions(): Session[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  public createSession(title?: string): Session {
    const id = 'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const nowIso = new Date().toISOString();
    const session: Session = {
      id,
      title: title || 'New Conversation',
      createdAt: nowIso,
      updatedAt: nowIso,
      messages: []
    };
    this.sessions.set(id, session);
    return session;
  }

  public addMessage(sessionId: string, message: Message): Session {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = this.createSession();
      session.id = sessionId;
      this.sessions.set(sessionId, session);
    }
    session.messages.push(message);
    session.updatedAt = new Date().toISOString();
    if (session.messages.length === 1 && message.role === 'user') {
      session.title = message.content.slice(0, 42) + (message.content.length > 42 ? '...' : '');
    }
    return session;
  }

  public updateMessage(sessionId: string, messageId: string, updates: Partial<Message>): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    const msg = session.messages.find(m => m.id === messageId);
    if (!msg) return false;
    Object.assign(msg, updates);
    session.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Cross-session memory search:
   * Finds conversations by date match (e.g. 2026-11-03, 2026-11-09) or keyword match.
   */
  public searchMemoryByDateOrKeyword(targetDateIsoPrefix?: string, keywords: string[] = []): Array<{
    sessionId: string;
    sessionTitle: string;
    message: Message;
    relevance: string;
  }> {
    const results: Array<{
      sessionId: string;
      sessionTitle: string;
      message: Message;
      relevance: string;
    }> = [];

    for (const session of this.sessions.values()) {
      for (const msg of session.messages) {
        let match = false;
        let reason = '';

        if (targetDateIsoPrefix && msg.timestamp.startsWith(targetDateIsoPrefix)) {
          match = true;
          reason = `Exact date match (${targetDateIsoPrefix})`;
        } else if (keywords.length > 0) {
          const lower = (msg.content || '').toLowerCase();
          const matchedWords = keywords.filter(k => lower.includes(k.toLowerCase()));
          if (matchedWords.length > 0) {
            match = true;
            reason = `Keyword match: ${matchedWords.join(', ')}`;
          }
        }

        if (match) {
          results.push({
            sessionId: session.id,
            sessionTitle: session.title,
            message: msg,
            relevance: reason
          });
        }
      }
    }
    return results;
  }
}

export const memoryStore = new MemoryStore();
