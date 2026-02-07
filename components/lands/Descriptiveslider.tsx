'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface DescriptiveSliderProps {
    label: string
    min: number
    max: number
    step: number
    value: [number, number]
    onValueChange: (v: [number, number]) => void
    unit: string
}

export function DescriptiveSlider({ label, min, max, step, value, onValueChange, unit }: DescriptiveSliderProps) {
    const formatNum = (n: number) => n.toLocaleString('en-US');
    const getPos = (val: number) => ((val - min) / (max - min)) * 100;

    return (
        <div className="flex flex-col w-full group">
            <div className="flex justify-between items-center mb-1">
                <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {label}
                </Label>
                <span className="text-[10px] font-bold text-primary">
                    {formatNum(value[0])} - {formatNum(value[1])}
                </span>
            </div>

            <div className="relative py-4 px-1">
                {/* Compact Floating Tooltips */}
                {[value[0], value[1]].map((val, i) => (
                    <div 
                        key={i}
                        className="absolute top-[-4px] -translate-x-1/2 px-1.5 py-0.5 bg-slate-800 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
                        style={{ left: `${getPos(val)}%` }}
                    >
                        {val >= 1000 ? `${val / 1000}k` : val}
                    </div>
                ))}

                <Slider
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onValueChange={(v) => onValueChange(v as [number, number])}
                    className="relative z-10 cursor-pointer"
                />

                {/* Simplified Scale - only start and end */}
                <div className="flex justify-between mt-1 px-0.5 pointer-events-none">
                    <span className="text-[8px] font-medium text-slate-300">{formatNum(min)}</span>
                    <span className="text-[8px] font-medium text-slate-300">{formatNum(max)}</span>
                </div>
            </div>
        </div>
    )
}