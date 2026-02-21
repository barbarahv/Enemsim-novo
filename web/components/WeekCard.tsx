"use client";

import { Lock, Unlock, CheckCircle } from "lucide-react";
import Link from "next/link";

interface WeekCardProps {
    number: number;
    title: string;
    description: string;
    isUnlocked: boolean;
    isCompleted: boolean;
}

export default function WeekCard({ number, title, description, isUnlocked, isCompleted }: WeekCardProps) {
    // If locked, the card is not clickable (or just shows a message)
    // If unlocked, it links to the week's details page
    const CardContent = (
        <div className={`relative w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between
      ${isUnlocked
                ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-md hover:shadow-lg cursor-pointer'
                : 'bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-slate-700 opacity-75 cursor-not-allowed'
            }
    `}>
            {/* Left Side: Icon & Info */}
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
          ${isCompleted ? 'bg-green-100 text-green-600' : isUnlocked ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}
        `}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <span>{number}</span>}
                </div>

                <div className="flex flex-col">
                    <h3 className={`font-bold text-lg ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-gray-500'}`}>
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </div>

            {/* Right Side: Lock Status */}
            <div className="mr-2">
                {isUnlocked ? (
                    isCompleted ? <span className="text-green-600 text-xs font-bold uppercase">Concluído</span> : <Unlock className="w-5 h-5 text-blue-400" />
                ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                )}
            </div>
        </div>
    );

    if (isUnlocked) {
        return <Link href={`/enemsim/week/${number}`} className="w-full">{CardContent}</Link>;
    }

    return <div className="w-full">{CardContent}</div>;
}
