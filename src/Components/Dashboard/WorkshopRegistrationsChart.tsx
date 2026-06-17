import React, { useMemo, useState } from 'react';
import { Tag } from 'antd';
import { motion } from 'motion/react';
import { CommonCard } from '@/Components';
import { useAppSelector } from '@/Store/hooks';
import { fadeInUp } from '@/Utils/animations';

const WorkshopRegistrationsChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const workshops = useAppSelector(state => state.workshops.data);

  const chartData = useMemo(() => {
    return workshops.slice(0, 6).map(w => ({
      name: w.title.split(' ').slice(0, 2).join(' '),
      value: w.registrations?.length || 0
    }));
  }, [workshops]);

  const maxVal = Math.max(...chartData.map(d => d.value), 1);
  const totalRegistrations = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard 
        title="Workshop Registrations" 
        extra={<Tag color="cyan">{totalRegistrations} Total</Tag>}
        cardProps={{ className: "h-full bg-surface!" }}
      >
        <p className="text-xs text-muted mb-4">Registration count across recent workshops</p>

        <div className="dashboard-chart-container dashboard-chart-md">
          {/* Increased viewBox width to 320 for more spacing */}
          <svg viewBox="0 0 320 110" className="dashboard-svg-full">
            <defs>
              <linearGradient id="workshopRegGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <line x1="20" y1="90" x2="300" y2="90" stroke="var(--border)" strokeWidth="1" />

            {chartData.length > 1 && (
              <>
                <path 
                  d={`M 20 ${90 - (chartData[0].value / maxVal) * 70} ${chartData.slice(1).map((d, i) => `L ${20 + (i + 1) * 52} ${90 - (d.value / maxVal) * 70}`).join(' ')} L ${20 + (chartData.length - 1) * 52} 90 L 20 90 Z`} 
                  fill="url(#workshopRegGradient)" 
                  opacity="0.4" 
                />
                <path 
                  d={`M 20 ${90 - (chartData[0].value / maxVal) * 70} ${chartData.slice(1).map((d, i) => `L ${20 + (i + 1) * 52} ${90 - (d.value / maxVal) * 70}`).join(' ')}`} 
                  fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                />
              </>
            )}

            {chartData.map((d, i) => {
              // Increased spacing from 42 to 52
              const x = 20 + i * 52;
              const y = 90 - (d.value / maxVal) * 70;

              return (
                <g key={d.name}>
                  <circle
                    cx={x} cy={y}
                    r={hoveredIdx === i ? 4.5 : 3}
                    fill="var(--surface)" stroke="#14b8a6" strokeWidth="2"
                    className="chart-line-point"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                  {/* Rotated text -45 degrees to prevent overlap */}
                  <text 
                    x={x} 
                    y="98" 
                    textAnchor="end" 
                    transform={`rotate(-45 ${x} 98)`}
                    className="chart-axis-text" 
                    fill="var(--muted)" 
                    fontSize="7"
                  >
                    {d.name}
                  </text>
                </g>
              );
            })}

            {hoveredIdx !== null && chartData[hoveredIdx] && (
              <g>
                <rect 
                  x={20 + hoveredIdx * 52 - 15} 
                  y={90 - (chartData[hoveredIdx].value / maxVal) * 70 - 18} 
                  width="30" height="12" rx="3" fill="var(--foreground)" 
                />
                <text 
                  x={20 + hoveredIdx * 52} 
                  y={90 - (chartData[hoveredIdx].value / maxVal) * 70 - 10} 
                  fill="var(--surface)" fontSize="7" fontWeight="bold" textAnchor="middle"
                >
                  {chartData[hoveredIdx].value}
                </text>
              </g>
            )}
          </svg>
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default WorkshopRegistrationsChart;