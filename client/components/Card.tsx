import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      {/* Card art is 446x344; .card-image keeps it fluid with height: auto. */}
      <Image
        className="card-image"
        src={imageSrc}
        alt={title}
        width={446}
        height={344}
        sizes="210px"
      />
      <h2 className="card-title">{title}</h2>

      <div className="pill-container">
        {tags.map((tag, index) => (
          <span key={index} className="pill-shape">{tag}</span>
        ))}
      </div>

      <p className="card-text">{description}</p>

      {disabled ? (
        <button className="card-call disabled" disabled>
          10000 Aura Points
        </button>
      ) : (
        <Link href="/call">
          <button className="card-call">Call</button>
        </Link>
      )}
    </div>
  );
};

export default Card;
