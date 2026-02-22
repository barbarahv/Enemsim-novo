'use client';

import { useEffect } from 'react';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export default function AdMobInitializer() {
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            AdMob.initialize({
                initializeForTesting: false,
            }).catch(err => {
                console.error('AdMob initialization error:', err);
            });
        }
    }, []);

    return null;
}
