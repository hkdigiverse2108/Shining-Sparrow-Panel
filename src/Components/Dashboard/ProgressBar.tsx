import React from 'react';

interface ProgressBarProps {
  percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => (
  <div className="dashboard-progress-track">
    <div className="dashboard-progress-fill" style={{ width: `${percent}%` }} />
  </div>
);

export default ProgressBar;
