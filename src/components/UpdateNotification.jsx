import React, { useState, useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import './UpdateNotification.css';

function UpdateNotification() {
    const [offlineReady, setOfflineReady] = useState(false);
    const [needRefresh, setNeedRefresh] = useState(false);
    const [registration, setRegistration] = useState(null);
    const [closed, setClosed] = useState(false);

    useEffect(() => {
        const updateSW = registerSW({
            onNeedRefresh() {
                setNeedRefresh(true);
            },
            onOfflineReady() {
                setOfflineReady(true);
            },
            onRegistered(r) {
                setRegistration(r);
                console.log('SW registered:', r);
            },
            onRegisterError(error) {
                console.log('SW registration error', error);
            },
        });

        // Store the updateSW function for later use
        window.updateSW = updateSW;
    }, []);

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
        setClosed(true);
    };

    const update = () => {
        if (window.updateSW) {
            window.updateSW(true);
        }
        close();
    };

    useEffect(() => {
        if (offlineReady || needRefresh) {
            setClosed(false);
        }
    }, [offlineReady, needRefresh]);

    if (closed || (!offlineReady && !needRefresh)) {
        return null;
    }

    return (
        <div className="update-notification">
            <div className="update-notification-content">
                {offlineReady ? (
                    <div>
                        <h3>App ready to work offline</h3>
                        <p>The app has been installed for offline use.</p>
                        <button onClick={() => close()}>Close</button>
                    </div>
                ) : null}

                {needRefresh ? (
                    <div>
                        <h3>New Version Available</h3>
                        <p>New content is available. Click "Update" to load the latest version.</p>
                        <div className="update-actions">
                            <button onClick={update}>Update</button>
                            <button className="secondary" onClick={() => close()}>Dismiss</button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default UpdateNotification;