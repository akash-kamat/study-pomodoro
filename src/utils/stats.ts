export interface Stats {
    totalSessions: number;
    totalFocusTime: number; // in seconds
    totalShortBreaks: number;
    totalLongBreaks: number;
}

const STATS_KEY = 'pomo_stats';

const defaultStats: Stats = {
    totalSessions: 0,
    totalFocusTime: 0,
    totalShortBreaks: 0,
    totalLongBreaks: 0,
};

export const getStats = (): Stats => {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return defaultStats;
    try {
        return JSON.parse(stored);
    } catch {
        return defaultStats;
    }
};

export const saveStat = (type: 'focus' | 'short' | 'long', duration: number) => {
    const current = getStats();
    const newStats = { ...current };

    if (type === 'focus') {
        newStats.totalSessions += 1;
        newStats.totalFocusTime += duration;
    } else if (type === 'short') {
        newStats.totalShortBreaks += 1;
    } else if (type === 'long') {
        newStats.totalLongBreaks += 1;
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    return newStats;
};
