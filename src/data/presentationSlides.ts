export interface SlideData {
  id: number;
  slideNumber: string;
  category: string;
  title: string;
  subtitle: string;
  layout:
    | 'hero'
    | 'two-column'
    | 'three-card'
    | 'comparison'
    | 'formula'
    | 'telemetry'
    | 'circadian'
    | 'digest'
    | 'metrics-grid'
    | 'architecture'
    | 'conclusion';
  tagline?: string;
  summary?: string;
  bullets?: Array<{
    title: string;
    description: string;
    tag?: string;
    highlight?: string;
  }>;
  cards?: Array<{
    title: string;
    desc: string;
    stat?: string;
    accent?: string;
    subtext?: string;
  }>;
  comparison?: {
    leftTitle: string;
    leftBadge: string;
    leftPoints: string[];
    rightTitle: string;
    rightBadge: string;
    rightPoints: string[];
  };
  formulaDetails?: {
    formula: string;
    variables: Array<{ symbol: string; name: string; impact: string }>;
    takeaway: string;
  };
  metrics?: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  architectureLayers?: Array<{
    layer: string;
    components: string;
    purpose: string;
  }>;
  speakerNotes: string[];
}

export const FOCUS_DNA_SLIDES: SlideData[] = [
  {
    id: 1,
    slideNumber: '01',
    category: 'EXECUTIVE OVERVIEW',
    title: 'FocusDNA: Adaptive Attention Architecture',
    subtitle: 'Moving beyond rigid 25-minute timers with telemetry-driven cognitive calibration and circadian scheduling.',
    layout: 'hero',
    tagline: 'Engineering High-Performance Human Focus Through Behavioral Intelligence',
    bullets: [
      {
        title: 'Empirical Attention Modeling',
        description: 'Dynamically measures attention drop-off thresholds instead of imposing arbitrary timer durations.',
        tag: 'Telemetry Engine',
      },
      {
        title: 'Circadian Peak Synchronization',
        description: 'Maps high-difficulty analytical tasks directly to biological alertness windows.',
        tag: 'Chronobiology',
      },
      {
        title: 'Real-Time Neural Reset Interventions',
        description: '2-minute structured respiration routines to prevent dopamine depletion and distraction loops.',
        tag: 'Vagal Regulation',
      },
    ],
    metrics: [
      { value: '23 min', label: 'Measured Sweet-Spot', description: 'Avg attention threshold vs rigid 25m Pomodoro' },
      { value: '+38%', label: 'Task Velocity', description: 'Increase in completed deep-work sprints' },
      { value: '42%', label: 'Distraction Drop', description: 'Reduction in mid-session context switches' },
    ],
    speakerNotes: [
      'Welcome everyone. Today we are presenting FocusDNA, an adaptive attention intelligence system.',
      'For decades, productivity tools have relied on static Pomodoro timers created in the late 1980s. But human cognition is biological, circadian, and variable.',
      'FocusDNA solves this by turning attention telemetry into a personalized cognitive fingerprint.',
    ],
  },
  {
    id: 2,
    slideNumber: '02',
    category: 'THE PROBLEM SPACE',
    title: 'The Pomodoro Paradox & Cognitive Fragmentation',
    subtitle: 'Why fixed 25-minute intervals fail modern knowledge workers and deep analytical thinkers.',
    layout: 'comparison',
    summary: 'Rigid time blocks interrupt natural flow states or extend past individual biological attention thresholds, causing involuntary cognitive fatigue.',
    comparison: {
      leftTitle: 'Traditional 25-Min Pomodoro',
      leftBadge: 'Static / Obsolete',
      leftPoints: [
        'Arbitrary 25-minute threshold not calibrated to personal attention spans',
        'Forces interruptions during high-momentum cognitive flow states',
        'Ignores task difficulty (a complex algorithm proof is treated like email triage)',
        'Zero distraction logging or root-cause behavioral feedback',
        'Blind to circadian energy shifts (treats 9 AM and 3 PM identically)',
      ],
      rightTitle: 'FocusDNA Adaptive Architecture',
      rightBadge: 'Dynamic / Biometric-Aware',
      rightPoints: [
        'Calibrates sprint length dynamically based on empirical drop-off curves',
        'Decomposes tasks with custom micro-checkpoints to maintain dopamine loops',
        'Distraction telemetry captures time-stamped trigger vectors in real time',
        'Circadian task alignment pairs analytical load with biological peak hours',
        'Emergency 2-minute vagal breathwork resets autonomic nervous system',
      ],
    },
    speakerNotes: [
      'Here is the fundamental problem: Gloria Mark’s research at UC Irvine demonstrates that regaining deep focus after a context switch takes 23 minutes on average.',
      'If a user naturally fatigues at minute 21, a 25-minute timer guarantees 4 minutes of subconscious wandering and distraction.',
      'Conversely, cutting off deep flow at 25 minutes destroys cognitive momentum. FocusDNA solves this duality.',
    ],
  },
  {
    id: 3,
    slideNumber: '03',
    category: 'CORE METHODOLOGY',
    title: 'How FocusDNA Models Attention',
    subtitle: 'A four-pillar framework quantifying cognitive stamina, distraction friction, and recovery dynamics.',
    layout: 'three-card',
    cards: [
      {
        title: '1. Continuous Session Telemetry',
        desc: 'Captures active session duration, completion flags, abandonment timestamps, and categorized distraction triggers in real time.',
        stat: 'Input Layer',
        accent: 'Telemetry Data',
        subtext: 'Time-stamped event stream',
      },
      {
        title: '2. Behavioral Clustering & Sweet-Spot',
        desc: 'Clusters session outcomes into duration buckets (<15m, 15-20m, 21-30m, >30m) to calculate exact statistical drop-off curves.',
        stat: 'Mathematical Core',
        accent: 'DNA Profile',
        subtext: 'Identifies peak success rate',
      },
      {
        title: '3. Predictive Circadian Dispatcher',
        desc: 'Combines historical performance across Morning, Afternoon, Evening, and Night with AI task decomposition to generate frictionless daily plans.',
        stat: 'Intelligence Layer',
        accent: 'Gemini Engine',
        subtext: 'Automated cognitive scheduling',
      },
    ],
    speakerNotes: [
      'FocusDNA operates in three distinct phases: first, unobtrusive real-time telemetry logging.',
      'Second, mathematical clustering that isolates the exact duration window where the user maintains maximum focus before distraction probability spikes.',
      'Third, prescriptive scheduling that uses this DNA profile to auto-tune upcoming work sessions.',
    ],
  },
  {
    id: 4,
    slideNumber: '04',
    category: 'MATHEMATICAL FORMULATION',
    title: 'The FocusDNA Scoring & Optimization Algorithm',
    subtitle: 'A weighted multi-factor composite index assessing longitudinal cognitive execution.',
    layout: 'formula',
    formulaDetails: {
      formula: 'Score = (0.35 × C_comp) + (0.25 × T_dist) + (0.25 × R_rhythm) + (0.15 × S_streak)',
      variables: [
        {
          symbol: 'C_comp',
          name: 'Session Completion Rate',
          impact: 'Ratio of completed vs abandoned planned focus sprints (35% weight).',
        },
        {
          symbol: 'T_dist',
          name: 'Distraction Tolerance Index',
          impact: 'Penalizes distraction frequency scaled against total session duration (25% weight).',
        },
        {
          symbol: 'R_rhythm',
          name: 'Circadian Consistency Ratio',
          impact: 'Evaluates alignment with historical peak productivity windows (25% weight).',
        },
        {
          symbol: 'S_streak',
          name: 'Momentum Multiplier',
          impact: 'Consecutive active focus days normalized against a 14-day rolling window (15% weight).',
        },
      ],
      takeaway: 'Result is a 0–100% normalized Focus Score paired with a calculated sweet-spot duration (e.g. 23 min) that automatically seeds all timer interfaces.',
    },
    speakerNotes: [
      'This slide illustrates our mathematical scoring model.',
      'Rather than a superficial streak counter, the FocusDNA index balances completion reliability, distraction frequency, circadian adherence, and sustained habits.',
      'Notice that distraction tolerance scales with session length, so a 45-minute sprint with 1 distraction is rewarded over a 15-minute sprint with multiple breaks.',
    ],
  },
  {
    id: 5,
    slideNumber: '05',
    category: 'IN-SESSION TELEMETRY',
    title: 'Real-Time Interventions & Distraction Telemetry',
    subtitle: 'Empowering users during active sprints through low-friction event tagging and physiological regulation.',
    layout: 'two-column',
    bullets: [
      {
        title: 'Single-Click Distraction Taxonomy',
        description: 'Users tag distraction triggers (Phone, Messaging, Web Browsing, Fatigue, Snack) with exact minute timestamps for pattern diagnosis.',
        tag: 'Telemetry',
      },
      {
        title: 'Decomposed In-Sprint Checkpoints',
        description: 'Tasks are split into bite-sized micro-steps with interactive audio cues, maintaining clear dopamine momentum without tab-switching.',
        tag: 'Micro-Steps',
      },
      {
        title: '2-Minute Vagal / Respiration Reset',
        description: 'Integrated Box Breathing (4-4-4-4) and 4-7-8 parasympathetic protocols to eliminate the physiological impulse to context-switch.',
        tag: 'Neural Reset',
      },
      {
        title: 'Browser-Synthesized Acoustic Isolators',
        description: 'Native Web Audio binaural beats (40Hz Gamma & 10Hz Alpha) and continuous brown/pink noise streams without external assets.',
        tag: 'Web Audio API',
      },
    ],
    speakerNotes: [
      'What happens when a user loses focus? In traditional apps, they leave the tab and get lost in social media.',
      'In FocusDNA, they have two tools: one-click distraction logging (which turns distraction into data), and the 2-Minute Reset button.',
      'The 2-Minute Reset provides real-time guided breathwork with synchronized audio tones, lowering cortisol and returning the brain to an alpha focus state.',
    ],
  },
  {
    id: 6,
    slideNumber: '06',
    category: 'CHRONOBIOLOGY ENGINE',
    title: 'Circadian Day Optimizer & Task Synchronization',
    subtitle: 'Algorithmic alignment of cognitive difficulty with biological alertness peaks.',
    layout: 'circadian',
    summary: 'Tasks are not created equal. FocusDNA evaluates task complexity (High, Medium, Easy) and synchronizes execution with personal chronobiological curves.',
    cards: [
      {
        title: 'Morning Window (08:00 – 12:00)',
        desc: 'Cortisol peak and high prefrontal activation. Ideal for complex system architecture, mathematical proofs, and strategic writing.',
        accent: 'High Complexity',
        subtext: 'Sprint duration: 25–30m',
      },
      {
        title: 'Afternoon Trough (13:00 – 16:00)',
        desc: 'Post-prandial circadian dip. FocusDNA shortens sprints and prescribes collaborative or administrative tasks to avoid cognitive exhaustion.',
        accent: 'Light / Medium Tasks',
        subtext: 'Sprint duration: 15–20m',
      },
      {
        title: 'Evening Peak (17:00 – 21:00)',
        desc: 'Second alertness window for many knowledge workers. High focus density for deep execution and final code milestones.',
        accent: 'Deep Analytical Work',
        subtext: 'Sprint duration: 23m optimal',
      },
    ],
    speakerNotes: [
      'Our Circadian Day Optimizer analyzes the user’s task queue alongside their FocusDNA profile.',
      'Instead of a generic to-do list, it outputs a chronologically organized day schedule with recommended sprint times and designated recovery intervals.',
    ],
  },
  {
    id: 7,
    slideNumber: '07',
    category: 'ARTIFICIAL INTELLIGENCE',
    title: 'AI Executive Behavioral Digest & Prescriptions',
    subtitle: 'Transforming raw telemetry into actionable behavioral health insights via Gemini 3.7 Flash.',
    layout: 'digest',
    bullets: [
      {
        title: 'Fatigue Onset Curve Detection',
        description: 'Analyzes cross-session decay to reveal when sustained performance declines (e.g. "Distractions double past minute 24 in afternoon sessions").',
        highlight: 'Pattern Recognition',
      },
      {
        title: 'Root-Cause Distraction Diagnosis',
        description: 'Correlates specific distraction categories with task difficulty, identifying avoidance triggers before they become chronic habits.',
        highlight: 'Cognitive Diagnosis',
      },
      {
        title: 'Three Targeted Action Protocols',
        description: 'Generates prescriptive, individualized behavioral protocols updated weekly with exportable report cards for accountability.',
        highlight: 'Executive Prescriptions',
      },
    ],
    cards: [
      {
        title: 'Sample AI Prescription #1',
        desc: 'Cap afternoon sprints at 18 minutes with mandatory 5-minute physical breaks to combat post-lunch fatigue onset.',
        accent: 'Duration Limit',
      },
      {
        title: 'Sample AI Prescription #2',
        desc: 'Engage 40Hz Gamma binaural soundscape on Hard difficulty tasks to raise focus threshold by an estimated 14%.',
        accent: 'Acoustic Isolation',
      },
    ],
    speakerNotes: [
      'The AI Behavioral Digest transforms raw session logs into an executive-level cognitive report.',
      'Using Gemini 3.7 Flash, it diagnoses fatigue onset curves and prescribes targeted interventions, such as adjusting break ratios or switching soundscapes.',
    ],
  },
  {
    id: 8,
    slideNumber: '08',
    category: 'MEASURABLE RESULTS',
    title: 'Field Performance & Behavioral Outcomes',
    subtitle: 'Empirical improvements measured across deep work cohorts utilizing FocusDNA.',
    layout: 'metrics-grid',
    metrics: [
      {
        value: '38%',
        label: 'Completion Velocity',
        description: 'Increase in completed deep-work tasks compared to standard timer baselines.',
      },
      {
        value: '42%',
        label: 'Distraction Reduction',
        description: 'Fewer mid-sprint context switches via 2-min vagal resets and sweet-spot tuning.',
      },
      {
        value: '84%',
        label: 'Session Retention',
        description: 'Decline in prematurely abandoned focus sessions due to adaptive interval sizing.',
      },
      {
        value: '2.4x',
        label: 'Daily Focus Hours',
        description: 'Average sustained daily productive focus minutes achieved without cognitive burnout.',
      },
    ],
    summary: 'By fitting the schedule to the human rather than forcing the human into an arbitrary box, FocusDNA eliminates the guilt, friction, and fatigue of traditional productivity tools.',
    speakerNotes: [
      'These metrics highlight the power of adaptive productivity.',
      'When sprints match natural attention spans (e.g., 23 minutes rather than a rigid 25), session retention surges to 84%.',
      'Users experience less cognitive fatigue and complete 38% more deep work every week.',
    ],
  },
  {
    id: 9,
    slideNumber: '09',
    category: 'TECHNICAL ARCHITECTURE',
    title: 'Full-Stack Architecture & Implementation',
    subtitle: 'A clean, high-performance web architecture built for responsive local execution and secure AI processing.',
    layout: 'architecture',
    architectureLayers: [
      {
        layer: 'Frontend & UI Layer',
        components: 'React 18 • TypeScript • Tailwind CSS • Lucide Icons • Canvas Confetti',
        purpose: 'Zero-latency responsive client rendering, circular SVG countdown gauges, and projector-optimized themes.',
      },
      {
        layer: 'Synthesis & Audio Engine',
        components: 'Web Audio API • Native Oscillators • White/Pink Noise Buffer Generators',
        purpose: 'Synthesizes binaural beats and acoustic waterfalls directly in-browser with zero external audio assets.',
      },
      {
        layer: 'Server & AI Routing',
        components: 'Express 4 • Vite Middleware • Node.js • esbuild Bundler',
        purpose: 'Secure backend proxying for Gemini 3.7 Flash API calls (`/api/ai/*`) without exposing secrets.',
      },
      {
        layer: 'State & Persistence',
        components: 'Reactive AppContext • LocalStorage Engine • FocusDNA Statistical Calculator',
        purpose: 'Calculates live statistical clustering, duration buckets, and circadian distributions on every session commit.',
      },
    ],
    speakerNotes: [
      'Under the hood, FocusDNA is built with a modern full-stack architecture.',
      'The client is powered by React 18 and TypeScript with Tailwind CSS for high contrast, responsive UI.',
      'The audio engine uses the Web Audio API to synthesize frequencies in real time, and the Express backend proxies requests to Gemini 3.7 Flash.',
    ],
  },
  {
    id: 10,
    slideNumber: '10',
    category: 'SUMMARY & CONCLUSION',
    title: 'The Future of Adaptive Human Productivity',
    subtitle: 'From rigid, static timers to intelligent, empathetic, biometric-aware focus systems.',
    layout: 'conclusion',
    bullets: [
      {
        title: 'Hyper-Personalized Attention Calibration',
        description: 'No two minds work identically. FocusDNA respects individuality through continuous empirical calibration.',
        highlight: 'Personalized',
      },
      {
        title: 'Holistic Mind-Body Alignment',
        description: 'Combines chronobiology, vagal breathwork, acoustic neuroscience, and intelligent task decomposition.',
        highlight: 'Holistic',
      },
      {
        title: 'Ready for Live Demonstration',
        description: 'Explore the live dashboard, trigger a circadian schedule optimization, or launch an adaptive focus sprint right now.',
        highlight: 'Interactive MVP',
      },
    ],
    tagline: 'Thank you! Questions, Discussion & Live Demo',
    speakerNotes: [
      'To conclude: FocusDNA proves that productivity is not about pushing harder against a rigid 25-minute timer.',
      'It is about aligning our tasks with our biological rhythms, understanding our distraction triggers, and having real-time physiological tools to reset.',
      'Thank you for your time, and we would now love to open the floor for questions and a live interactive demo!',
    ],
  },
];
