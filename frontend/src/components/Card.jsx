import React from 'react';
import './Card.css';

const Card = ({ title, icon: Icon, value, subtitle, trend, trendColor }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          {Icon && <div className="card-icon"><Icon /></div>}
          <h3 className="card-title">{title}</h3>
        </div>
      </div>
      <div className="card-body">
        <h2 className="card-value">{value}</h2>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {trend && (
          <span className={`card-trend trend-${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
