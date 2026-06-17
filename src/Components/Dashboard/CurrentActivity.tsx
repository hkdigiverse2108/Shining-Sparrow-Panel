import React, { useMemo, useState } from 'react';
import { PlayCircleOutlined, RiseOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { useAppSelector } from '@/Store/hooks';

const CurrentActivity: React.FC = () => {
  const [hoveredActivityIdx, setHoveredActivityIdx] = useState<number | null>(null);
  const courses = useAppSelector(state => state.courses.data);
  const workshops = useAppSelector(state => state.workshops.data);

  const stats = useMemo(() => ({
    totalEnrollments: courses.reduce((sum, c) => sum + (c.enrollmentsCount || 0), 0),
    totalWorkshops: workshops.length
  }), [courses, workshops]);

  // Generate chart data from first 6 courses' enrollment counts
  const chartData = useMemo(() => {
    const months = ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5', 'Course 6'];
    const values = courses.slice(0, 6).map(c => c.enrollmentsCount || 0);
    while (values.length < 6) values.push(0);
    return months.map((label, i) => ({ label, value: values[i] }));
  }, [courses]);

  // Dynamic SVG path generation
  const maxVal = Math.max(...chartData.map(d => d.value), 1);
  const points = chartData.map((d, i) => ({
    x: 10 + i * 50,
    y: 90 - (d.value / maxVal) * 70
  }));
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length-1].x} 90 L ${points[0].x} 90 Z`;

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard 
        title="Current Activity"
        topContent={<span className="text-xs text-muted">Enrollments across top courses</span>}
        cardProps={{ className: "h-full bg-surface!" }}
      >
        <div className="dashboard-chart-container dashboard-chart-sm">
          <svg viewBox="0 0 300 100" className="dashboard-svg-full">
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            <line x1="0" y1="20" x2="300" y2="20" className="chart-grid-line" strokeOpacity="0.1" stroke="var(--foreground)" />
            <line x1="0" y1="50" x2="300" y2="50" className="chart-grid-line" strokeOpacity="0.1" stroke="var(--foreground)" />
            <line x1="0" y1="80" x2="300" y2="80" className="chart-grid-line" strokeOpacity="0.1" stroke="var(--foreground)" />

            <path d={areaPath} fill="url(#activityGradient)" />
            <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />

            {chartData.map((d, i) => {
              const x = 10 + i * 50;
              const y = 90 - (d.value / maxVal) * 70;

              return (
                <g key={d.label}>
                  <circle
                    cx={x}
                    cy={y}
                    r={hoveredActivityIdx === i ? 4.5 : 3}
                    fill="var(--surface)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    className="chart-line-point"
                    onMouseEnter={() => setHoveredActivityIdx(i)}
                    onMouseLeave={() => setHoveredActivityIdx(null)}
                  />
                  <text x={x} y="98" textAnchor="middle" className="chart-axis-text" fontSize="7" fill="var(--muted)">
                    {d.label.split(' ')[1]} 
                  </text>
                </g>
              );
            })}

            {hoveredActivityIdx !== null && (
              <g>
                <line x1={10 + hoveredActivityIdx * 50} y1="10" x2={10 + hoveredActivityIdx * 50} y2="85" stroke="var(--primary)" strokeOpacity="0.4" strokeDasharray="2 2" />
                <rect x={10 + hoveredActivityIdx * 50 - 20} y={90 - (chartData[hoveredActivityIdx].value / maxVal) * 70 - 20} width="40" height="14" rx="3" fill="var(--foreground)" />
                <text x={10 + hoveredActivityIdx * 50} y={90 - (chartData[hoveredActivityIdx].value / maxVal) * 70 - 10} fill="var(--surface)" fontSize="7" fontWeight="bold" textAnchor="middle">
                  {chartData[hoveredActivityIdx].value}
                </text>
              </g>
            )}
          </svg>
        </div>

        <div className="dashboard-mini-card-grid grid grid-cols-2 gap-4 mt-4">
          <div className="dashboard-mini-card dashboard-mini-card-yellow p-3 rounded-lg">
            <div>
              <span className="dashboard-mini-label text-xs text-white font-semibold block">Total Enrollments</span>
              <span className="dashboard-mini-value text-xl font-bold text-foreground">{stats.totalEnrollments}+</span>
            </div>
            <div className="dashboard-mini-footer flex justify-between items-center mt-2">
              <span className="dashboard-mini-footer-text text-xs text-white">All courses</span>
              <div className="dashboard-mini-icon text-warning">
                <RiseOutlined />
              </div>
            </div>
          </div>

          <div className="dashboard-mini-card dashboard-mini-card-pink p-3 rounded-lg">
            <div>
              <span className="dashboard-mini-label text-xs text-white font-semibold block">Active Workshops</span>
              <span className="dashboard-mini-value text-xl font-bold text-foreground">{stats.totalWorkshops}</span>
            </div>
            <div className="dashboard-mini-footer flex justify-between items-center mt-2">
              <span className="dashboard-mini-footer-text text-xs text-white">Live sessions</span>
              <div className="dashboard-mini-icon text-primary">
                <PlayCircleOutlined />
              </div>
            </div>
          </div>
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default CurrentActivity;