"use client";

import { Lock, CheckCircle, BookOpen, Star } from "lucide-react";
import Link from "next/link";

interface WeekNodeProps {
    number: number;
    title: string;
    description: string;
    isUnlocked: boolean;
    isCompleted: boolean;
    position: "left" | "center" | "right";
    basePath?: string;
    nodeLabel?: string;
}

export default function WeekNode({ number, title, description, isUnlocked, isCompleted, position, basePath = "/enemsim", nodeLabel = "SEMANA" }: WeekNodeProps) {

    // Dynamic positioning classes
    const positionClasses = {
        left: "self-start ml-10",
        center: "self-center",
        right: "self-end mr-10",
    };

    const NodeContent = (
        <div className={`flex flex-col items-center group relative z-10 ${positionClasses[position]}`}>

            {/* Circle Node */}
            <div className={`
        w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-xl transition-transform transform active:scale-95
        ${isUnlocked
                    ? 'bg-white border-white hover:scale-105 cursor-pointer'
                    : 'bg-gray-200 border-gray-300 cursor-not-allowed grayscale'}
      `}>
                {isCompleted ? (
                    <CheckCircle className="w-10 h-10 text-green-500" />
                ) : isUnlocked ? (
                    <BookOpen className="w-10 h-10 text-blue-500" />
                ) : (
                    <Lock className="w-8 h-8 text-gray-400" />
                )}
            </div>

            {/* Label Pill */}
            <div className={`
        mt-3 px-4 py-2 bg-white rounded-full shadow-md text-center border border-gray-100 min-w-[120px]
        ${!isUnlocked && 'opacity-60'}
      `}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{nodeLabel} {number}</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{title}</p>
            </div>

            {/* Tooltip for Locked State */}
            {!isUnlocked && (
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-black/80 text-white text-xs p-2 rounded shadow-lg z-20 text-center">
                    Conclua todas as tarefas da semana anterior para acessar esta semana.
                </div>
            )}
        </div>
    );

    if (isUnlocked) {
        return (
            <Link href={`${basePath}/week/${number}`} className={`flex flex-col w-full max-w-sm ${position === 'left' ? 'items-start' : position === 'right' ? 'items-end' : 'items-center'}`}>
                {NodeContent}
            </Link>
        );
    }

    return (
        <div className={`flex flex-col w-full max-w-sm ${position === 'left' ? 'items-start' : position === 'right' ? 'items-end' : 'items-center'}`}>
            {NodeContent}
        </div>
    );
}
