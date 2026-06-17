import type { UseCountUpProps } from '@/Types';
import { useState, useEffect, useRef } from 'react';

export const useCountUp = ({ end, duration = 2 }: UseCountUpProps) => {
    const [count, setCount] = useState(0);
    const requestRef = useRef<number | null>(null);
    const startTime = useRef<number | null>(null);
    useEffect(() => {
        startTime.current = null; 
        const animate = (timestamp: number) => {
            if (!startTime.current) startTime.current = timestamp;
            const progress = timestamp - startTime.current;
            const percentage = Math.min(progress / (duration * 1000), 1);
            const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
            const currentCount = end * easeOutQuart(percentage);
            setCount(Math.floor(currentCount));
            if (progress < duration * 1000) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [end, duration]);
    return { count };
};