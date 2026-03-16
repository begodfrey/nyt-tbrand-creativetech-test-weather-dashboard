import type { WeatherMood } from '../types/weather';

interface MoodClasses {
  appBackground: string;
  cardBackground: string;
  accent: string;
  text: string;
  inputBackground: string;
}

const moodClassMap: Record<WeatherMood, MoodClasses> = {
  bright: {
    appBackground: 'from-sky-100 via-sky-50 to-amber-50',
    cardBackground: 'bg-white/80 border-sky-100',
    accent: 'bg-amber-100 text-amber-500',
    text: 'text-slate-900',
    inputBackground: 'bg-white/90 border-sky-200',
  },
  overcast: {
    appBackground: 'from-slate-700 via-slate-800 to-slate-900',
    cardBackground: 'bg-slate-900/80 border-slate-700',
    accent: 'bg-slate-800/80 text-sky-200',
    text: 'text-slate-50',
    inputBackground: 'bg-slate-900/80 border-slate-700',
  },
  stormy: {
    appBackground: 'from-slate-900 via-slate-950 to-indigo-950',
    cardBackground: 'bg-slate-950/80 border-indigo-700',
    accent: 'bg-indigo-900/80 text-indigo-300',
    text: 'text-slate-50',
    inputBackground: 'bg-slate-950/80 border-indigo-800',
  },
  night: {
    appBackground: 'from-slate-950 via-slate-900 to-slate-950',
    cardBackground: 'bg-slate-900/80 border-slate-800',
    accent: 'bg-slate-950/80 text-sky-300',
    text: 'text-slate-100',
    inputBackground: 'bg-slate-900/80 border-slate-700',
  },
  neutral: {
    appBackground: 'from-slate-900 via-slate-950 to-slate-900',
    cardBackground: 'bg-slate-900/80 border-slate-800',
    accent: 'bg-slate-900/80 text-emerald-300',
    text: 'text-slate-100',
    inputBackground: 'bg-slate-900/80 border-slate-700',
  },
};

export function resolveMoodClasses(mood: WeatherMood | null | undefined): MoodClasses {
  if (!mood) return moodClassMap.neutral;
  return moodClassMap[mood] ?? moodClassMap.neutral;
}

