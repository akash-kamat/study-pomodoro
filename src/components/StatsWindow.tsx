import { useEffect, useState } from 'react';
import { Card } from 'pixel-retroui';
import { getStats, Stats } from '../utils/stats';
import '../App.css';

function StatsWindow() {
    const [stats, setStats] = useState<Stats>({
        totalSessions: 0,
        totalFocusTime: 0,
        totalShortBreaks: 0,
        totalLongBreaks: 0,
    });

    useEffect(() => {
        setStats(getStats());
    }, []);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hrs}h ${mins}m`;
    };

    return (
        <main className="stats-container">


            <div className="stats-content">
                <Card bg="#fbf1c7" textColor="#2c2c2c" borderColor="#454545" className="stat-card">
                    <h3>SESSIONS</h3>
                    <p className="stat-value">{stats.totalSessions}</p>
                </Card>

                <Card bg="#fbf1c7" textColor="#2c2c2c" borderColor="#454545" className="stat-card">
                    <h3>FOCUS TIME</h3>
                    <p className="stat-value">{formatTime(stats.totalFocusTime)}</p>
                </Card>

                <div className="stats-row">
                    <Card bg="#fbf1c7" textColor="#2c2c2c" borderColor="#454545" className="stat-card small">
                        <h3>SHORT</h3>
                        <p className="stat-value">{stats.totalShortBreaks}</p>
                    </Card>
                    <Card bg="#fbf1c7" textColor="#2c2c2c" borderColor="#454545" className="stat-card small">
                        <h3>LONG</h3>
                        <p className="stat-value">{stats.totalLongBreaks}</p>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default StatsWindow;
