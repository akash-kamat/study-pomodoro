import { getCurrentWindow } from '@tauri-apps/api/window';
import { useState, useEffect } from 'react';

export default function TitleBar() {
    const appWindow = getCurrentWindow();
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const checkMaximized = async () => {
            setIsMaximized(await appWindow.isMaximized());
        };
        checkMaximized();

        // Listen for resize events to update state if needed, 
        // but for now we'll just toggle state on click.
        // A more robust solution would listen to window events.
    }, []);

    const handleMinimize = () => {
        appWindow.minimize();
    };

    const handleMaximize = async () => {
        await appWindow.toggleMaximize();
        setIsMaximized(await appWindow.isMaximized());
    };

    const handleClose = () => {
        appWindow.close();
    };

    return (
        <div
            data-tauri-drag-region
            className="titlebar"
            style={{
                height: '30px',
                background: '#323232',
                userSelect: 'none',
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000
            }}
        >
            <div className="titlebar-button" onClick={handleMinimize}>
                <svg width="10" height="10" viewBox="0 0 10.2 1">
                    <rect width="10.2" height="1" x="0" y="0" />
                </svg>
            </div>
            <div className="titlebar-button" onClick={handleMaximize}>
                {isMaximized ? (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                        <path d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z" />
                    </svg>
                ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                        <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" />
                    </svg>
                )}
            </div>
            <div className="titlebar-button" id="titlebar-close" onClick={handleClose}>
                <svg width="10" height="10" viewBox="0 0 10 10">
                    <polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" />
                </svg>
            </div>
        </div>
    );
}
