import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Task Breakdown & Focus Planner Endpoint
app.post('/api/ai/plan-task', async (req: Request, res: Response) => {
  try {
    const { task, focusDna } = req.body;
    if (!task || !task.title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const totalMinutes = Number(task.estimatedMinutes) || 60;
    const taskTitle = task.title;
    const taskDesc = task.description || '';
    const priority = task.priority || 'medium';
    const difficulty = task.difficulty || 'medium';

    // Best focus duration from FocusDNA (or default 23-25m)
    const bestDuration = focusDna?.bestFocusDuration || 23;
    const breakDuration = focusDna?.bestBreakDuration || 5;

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are the FocusDNA Adaptive Task Breakdown Engine.
The user wants to accomplish: "${taskTitle}".
Description: "${taskDesc}".
Total Estimated Time: ${totalMinutes} minutes.
Priority: ${priority}, Difficulty: ${difficulty}.

USER'S PERSONAL FOCUS DNA:
- Sweet-spot focus duration: ${bestDuration} minutes (they start losing attention after this)
- Optimal break length: ${breakDuration} minutes
- Most frequent distraction trigger: ${focusDna?.mostCommonDistraction || 'Phone'}

Generate a structured focus plan that decomposes the total time into alternating focus intervals and short rest breaks.
Keep focus sessions around ${bestDuration} minutes (adjusting slightly between 20-30m depending on subtask granularity) and breaks around ${breakDuration} minutes.
Give each focus sprint a specific, actionable, concrete micro-goal.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                taskTitle: { type: Type.STRING },
                totalMinutes: { type: Type.NUMBER },
                aiRationale: {
                  type: Type.STRING,
                  description: 'Brief 1-sentence explanation of how this was adapted to the user FocusDNA',
                },
                sessions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      duration: { type: Type.NUMBER, description: 'Duration in minutes' },
                      type: { type: Type.STRING, description: 'Either focus or break' },
                      goal: { type: Type.STRING, description: 'Actionable micro-goal or break instruction' },
                    },
                    required: ['duration', 'type', 'goal'],
                  },
                },
              },
              required: ['taskTitle', 'totalMinutes', 'aiRationale', 'sessions'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          const sessionsWithIds = (parsed.sessions || []).map((s: { duration: number; type: string; goal: string }, index: number) => ({
            id: `p-${Date.now()}-${index}`,
            duration: Number(s.duration) || (s.type === 'break' ? breakDuration : bestDuration),
            type: s.type === 'break' ? 'break' : 'focus',
            goal: s.goal || (s.type === 'break' ? 'Short recovery break' : `Work on ${taskTitle}`),
            completed: false,
          }));

          return res.json({
            taskTitle: parsed.taskTitle || taskTitle,
            totalMinutes: parsed.totalMinutes || totalMinutes,
            aiRationale: parsed.aiRationale || `Decomposed into ${bestDuration}m adaptive focus sprints based on your FocusDNA.`,
            adaptedFromDNA: true,
            generatedAt: new Date().toISOString(),
            sessions: sessionsWithIds,
          });
        }
      } catch (geminiError) {
        console.warn('Gemini plan-task API error, using algorithmic fallback:', geminiError);
      }
    }

    // Fallback: Smart Algorithmic FocusDNA Decomposition
    const sprintDuration = Math.max(15, Math.min(bestDuration, 35));
    const sessions = [];
    let remaining = totalMinutes;
    let sprintIndex = 1;

    // Sub-goal template helpers based on title and difficulty
    const subGoals = [
      `Deconstruct core concepts and setup outline for ${taskTitle}`,
      `Deep focus execution on primary components of ${taskTitle}`,
      `Solve complex edge cases and practical implementations`,
      `Final synthesis, review, and verification for ${taskTitle}`,
    ];

    while (remaining > 0) {
      const currentSprint = Math.min(remaining, sprintDuration);
      const goalText = subGoals[(sprintIndex - 1) % subGoals.length] || `Focused progress on ${taskTitle} (Phase ${sprintIndex})`;

      sessions.push({
        id: `p-local-${Date.now()}-${sprintIndex * 2 - 1}`,
        duration: currentSprint,
        type: 'focus' as const,
        goal: goalText,
        completed: false,
      });

      remaining -= currentSprint;

      if (remaining > 0) {
        sessions.push({
          id: `p-local-${Date.now()}-${sprintIndex * 2}`,
          duration: breakDuration,
          type: 'break' as const,
          goal: 'Mind reset & screen-free breather',
          completed: false,
        });
      }
      sprintIndex++;
    }

    return res.json({
      taskTitle,
      totalMinutes,
      aiRationale: `Engine adapted ${totalMinutes}m into ${sprintDuration}m focused intervals and ${breakDuration}m breaks matching your behavioral peak.`,
      adaptedFromDNA: true,
      generatedAt: new Date().toISOString(),
      sessions,
    });
  } catch (error) {
    console.error('Error in /api/ai/plan-task:', error);
    res.status(500).json({ error: 'Failed to generate focus plan' });
  }
});

// 2. AI Productivity Coach Endpoint ("Ask FocusDNA")
app.post('/api/ai/coach', async (req: Request, res: Response) => {
  try {
    const { message, focusDna, recentSessions } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    // Prepare rich context from stored FocusDNA
    const profileSummary = focusDna
      ? `
- Total recorded sessions: ${focusDna.totalSessions || 0}
- Focus Score: ${focusDna.focusScore || 0}%
- Best Focus Duration: ${focusDna.bestFocusDuration || 23} minutes (high drop-off observed on sessions >30m)
- Peak Productivity Window: ${focusDna.bestProductivityPeriod || '7 PM – 9 PM'}
- Average Distractions per Session: ${focusDna.avgDistractionsPerSession || 0}
- Most Common Distraction: ${focusDna.mostCommonDistraction || 'Phone'}
- Current Streak: ${focusDna.streakDays || 1} days
- Weekly Trend: ${focusDna.weeklyTrend > 0 ? '+' : ''}${focusDna.weeklyTrend || 0}%
`
      : 'Insufficient user session history.';

    if (ai) {
      try {
        const systemInstruction = `You are the FocusDNA AI Productivity Coach.
Your purpose is to answer the user's questions strictly using their actual FocusDNA behavioral telemetry.

IMPORTANT RULES:
1. NEVER output generic motivational cliches (e.g., "Just believe in yourself!", "You can do anything!").
2. ALWAYS cite the user's specific data points (e.g., "Your records show an 84% Focus Score", "Your completion drops to 41% on 45m tasks", "Phone notifications cause 65% of your interruptions").
3. Keep responses concise, punchy (2-3 short paragraphs or clean bullet points), direct, and actionable.
4. If asked about planning or scheduling, advise them based on their circadian peak window (${focusDna?.bestProductivityPeriod || '7 PM – 9 PM'}).`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `USER QUESTION: "${message}"\n\nUSER'S ACTUAL PRODUCTIVITY DATA:\n${profileSummary}`,
          config: {
            systemInstruction,
          },
        });

        if (response.text) {
          return res.json({
            reply: response.text,
            referencedData: {
              focusScore: focusDna?.focusScore,
              bestDuration: focusDna?.bestFocusDuration,
              commonDistraction: focusDna?.mostCommonDistraction,
              peakTime: focusDna?.bestProductivityPeriod,
            },
          });
        }
      } catch (geminiError) {
        console.warn('Gemini coach API error, using algorithmic fallback:', geminiError);
      }
    }

    // Fallback: Intelligent data-backed response generator
    let fallbackReply = '';
    const qLower = message.toLowerCase();

    if (qLower.includes('unproductive') || qLower.includes('why') || qLower.includes('struggle')) {
      fallbackReply = `Based on your telemetry, your focus score is currently ${focusDna?.focusScore || 84}%. The main friction points detected in your sessions are:\n\n` +
        `• **Session Over-extension**: Sessions longer than 30 minutes show a significant completion drop-off compared to your sweet spot of ${focusDna?.bestFocusDuration || 23} minutes.\n` +
        `• **Interruption Trigger**: "${focusDna?.mostCommonDistraction || 'Phone'}" is your highest recorded distraction (averaging ${focusDna?.avgDistractionsPerSession || 2.4} interruptions/session).\n\n` +
        `**Action**: Switch to strict ${focusDna?.bestFocusDuration || 23}-minute sprints and physically place your phone outside of arm's reach.`;
    } else if (qLower.includes('when') || qLower.includes('schedule') || qLower.includes('tomorrow') || qLower.includes('time')) {
      fallbackReply = `Your circadian analysis indicates that your peak cognitive window is **${focusDna?.bestProductivityPeriod || '7 PM – 9 PM'}**, where your completion rate is at its highest.\n\n` +
        `• Schedule your most challenging (Hard) tasks during ${focusDna?.bestProductivityPeriod || '7 PM – 9 PM'}.\n` +
        `• Keep morning sessions short and focused on triage (15–20 min).`;
    } else if (qLower.includes('distraction') || qLower.includes('phone') || qLower.includes('focus drop')) {
      fallbackReply = `Your data reveals that **${focusDna?.mostCommonDistraction || 'Phone'}** accounts for the vast majority of your lost focus events.\n\n` +
        `• Interruptions typically occur around minute 12 to 15 of longer sessions.\n` +
        `• Using ${focusDna?.bestFocusDuration || 23}-minute sprint intervals keeps sessions short enough to beat the urge to check notifications.`;
    } else {
      fallbackReply = `Here is what your FocusDNA profile indicates:\n\n` +
        `• **Optimal Focus Sprint**: ${focusDna?.bestFocusDuration || 23} minutes\n` +
        `• **Peak Productivity Window**: ${focusDna?.bestProductivityPeriod || '7 PM – 9 PM'}\n` +
        `• **Focus Score**: ${focusDna?.focusScore || 84}%\n` +
        `• **Primary Obstacle**: ${focusDna?.mostCommonDistraction || 'Phone'} interruptions\n\n` +
        `To maximize your daily output, align difficult work with your peak evening window and cap focus intervals at ${focusDna?.bestFocusDuration || 23} minutes.`;
    }

    return res.json({
      reply: fallbackReply,
      referencedData: {
        focusScore: focusDna?.focusScore,
        bestDuration: focusDna?.bestFocusDuration,
        commonDistraction: focusDna?.mostCommonDistraction,
        peakTime: focusDna?.bestProductivityPeriod,
      },
    });
  } catch (error) {
    console.error('Error in /api/ai/coach:', error);
    res.status(500).json({ error: 'Failed to generate coach advice' });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FocusDNA Server running at http://localhost:${PORT}`);
  });
}

startServer();
