'use client';

import { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export default function AdBanner({ className }: { className?: string }) {
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            const adUnitId = 'ca-app-pub-4761293834429137/8125648707'; // Real Ad Unit ID

            AdMob.showBanner({
                adId: adUnitId,
                adSize: BannerAdSize.BANNER,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
                isTesting: false
            }).catch(err => {
                console.error('AdMob show banner error:', err);
            });

            return () => {
                AdMob.removeBanner().catch(err => console.error('Error removing banner:', err));
            };
        }
    }, []);

    // Placeholder for web version or if ad fails to load
    if (Capacitor.isNativePlatform()) {
        return null; // Hide the placeholder on mobile since the real ad is an overlay
    }

    return (
        <div className={`w-full h-16 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 dashed border-2 rounded-lg flex items-center justify-center text-xs text-gray-400 uppercase tracking-widest ${className}`}>
            Espaço para Publicidade (Google AdSense)
        </div>
    );
}
