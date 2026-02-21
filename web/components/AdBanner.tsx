export default function AdBanner({ className }: { className?: string }) {
    return (
        <div className={`w-full h-16 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 dashed border-2 rounded-lg flex items-center justify-center text-xs text-gray-400 uppercase tracking-widest ${className}`}>
            Espaço para Publicidade (Google AdSense)
        </div>
    );
}
