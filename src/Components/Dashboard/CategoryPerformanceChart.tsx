import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CommonCard } from '@/Components';
import { useAppSelector } from '@/Store/hooks';
import { fadeInUp } from '@/Utils/animations';

const barColors = ['#3a3a3a', '#838383', '#aeaeae', '#c9c9c9', '#e5e5e5'];

// Generates clean integer steps for the Y-axis (e.g., 5, 10, 20)
const getAxisConfig = (max: number) => {
  if (max <= 5) return { max: 5, step: 1 };
  if (max <= 10) return { max: 10, step: 2 };
  if (max <= 20) return { max: 20, step: 4 };
  const step = Math.ceil(max / 5);
  return { max: step * 5, step };
};

const CategoryPerformanceChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const courses = useAppSelector(state => state.courses.data);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    courses.forEach(c => {
      if (c.category) {
        const count = c.enrolledStudents?.length || c.enrollmentsCount || 0;
        map.set(c.category, (map.get(c.category) || 0) + count);
      }
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [courses]);

  const dataMax = Math.max(...categoryData.map(d => d.value), 1);
  const axisConfig = useMemo(() => getAxisConfig(dataMax), [dataMax]);

  // Chart dimensions
  const chartTop = 30;
  const chartBottom = 150;
  const chartHeight = chartBottom - chartTop; // 120px

  // Shared math function: Converts a data value to an exact Y coordinate
  const getY = (value: number) => chartBottom - (value / axisConfig.max) * chartHeight;

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard title="Top Categories" cardProps={{ className: "h-full bg-surface!" }}>
        <div className="dashboard-chart-container dashboard-chart-lg">
          <svg viewBox="0 0 400 180" className="dashboard-svg-full">
            
            {/* Generate Gridlines and Labels together so they NEVER misalign */}
            {Array.from({ length: (axisConfig.max / axisConfig.step) + 1 }).map((_, i) => {
              const value = i * axisConfig.step;
              const y = getY(value); // Exact Y coordinate for this value
              
              return (
                <g key={value}>
                  <line 
                    x1="40" y1={y} x2="380" y2={y} 
                    stroke={value === 0 ? "var(--border)" : "var(--foreground)"} 
                    strokeWidth={value === 0 ? 1.5 : 1} 
                    strokeOpacity={value === 0 ? 1 : 0.1} 
                  />
                  <text 
                    x="35" y={y} 
                    textAnchor="end" 
                    dominantBaseline="middle" // Perfectly centers text on the line
                    fill="var(--muted)" 
                    fontSize="8"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {categoryData.map((item, i) => {
              const barWidth = 36;
              const x = 65 + i * 68;
              const barHeight = (item.value / axisConfig.max) * chartHeight;
              const y = getY(item.value); // Exact top of the bar
              const color = barColors[i % barColors.length];

              return (
                <g key={item.name}>
                  {/* Background Bar */}
                  <rect x={x} y={chartTop} width={barWidth} height={chartHeight} fill="var(--border)" opacity="0.15" rx="4" />
                  
                  {/* Animated Bar: Scales from bottom up so it NEVER goes below X-axis */}
                  <motion.rect
                    x={x} 
                    y={y} 
                    width={barWidth} 
                    height={barHeight}
                    fill={color} 
                    rx="4" 
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                    style={{ originY: 1 }} // Anchors the animation to the bottom of the bar
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />

                  {hoveredIdx === i && (
                    <g>
                      <rect x={x - 4} y={y - 22} width={barWidth + 8} height="16" rx="4" fill="var(--foreground)" />
                      <text x={x + barWidth / 2} y={y - 10} fill="var(--surface)" fontSize="8" fontWeight="bold" textAnchor="middle">
                        {item.value} Students
                      </text>
                    </g>
                  )}

                  <text x={x + barWidth / 2} y="166" textAnchor="middle" fill="var(--muted)" fontSize="9">
                    {item.name.length > 8 ? `${item.name.substring(0, 7)}...` : item.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="dashboard-legends flex flex-wrap gap-3 mt-2">
          {categoryData.map((item, i) => (
            <div key={item.name} className="dashboard-legend-item flex items-center gap-1.5 text-xs text-muted">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: barColors[i % barColors.length] }} />
              {item.name}
            </div>
          ))}
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default CategoryPerformanceChart;