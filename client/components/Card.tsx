import React from 'react';
import './Card.css';

interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
  tags: string[];
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({ imageSrc, title, description, tags, disabled = false }) => {
  return (
    <div className="card">
      <img className="card-image" src={imageSrc} alt={title} />
      <h2 className="card-title">{title}</h2>

      <div className="pill-container">
        {tags.map((tag, index) => (
          <span key={index} className="pill-shape">{tag}</span>
        ))}
      </div>

      <p className="card-text">{description}</p>

      <a href={disabled ? undefined : "/call"}>
        <button className={`card-call ${disabled ? 'disabled' : ''}`} disabled={disabled}>
          {disabled ? '10000 Aura Points' : 'Call'}
        </button>
      </a>
    </div>
  );
};

export default Card;


