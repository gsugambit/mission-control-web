import React from 'react';
import './StatusCircleChart.css';

interface StatusCircleChartProps {
  title: string;
  data: {
    label: string;
    count: number;
    color: string;
  }[];
}

const StatusCircleChart: React.FC<StatusCircleChartProps> = ({ title, data }) => {
  const total = data.reduce((acc, item) => acc + item.count, 0);
  
  // Simple circle chart using CSS gradients or SVG
  // For simplicity and matching the look, we'll use a CSS conic-gradient or multiple SVG circles.
  // Let's use SVG for better control.
  
  let cumulativePercent = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="status-circle-chart">
      <h3>{title}</h3>
      <div className="chart-container">
        <svg viewBox="0 0 100 100" className="circular-chart">
          {data.map((item, index) => {
            const percent = total > 0 ? (item.count / total) * 100 : 0;
            const strokeDasharray = `${(percent * circumference) / 100} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent * circumference) / 100);
            cumulativePercent += percent;

            return (
              <circle
                key={index}
                className="circle"
                stroke={item.color}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                cx="50"
                cy="50"
                r={radius}
              />
            );
          })}
        </svg>
        <div className="chart-overlay">
          <span className="total-count">{total}</span>
        </div>
      </div>
      <div className="chart-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: item.color }}></span>
            <span className="legend-label">{item.label} ({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusCircleChart;
