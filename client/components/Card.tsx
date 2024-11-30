import React from 'react';
import './Card.css';

const Card: React.FC = () => {
    return (
        <div className="card">
            <img className="card-image" src="/assets/giga-chad.jpg" alt="card component" />
            <h2 className="card-title">Giga Chad</h2>

            {/* Container for the pills */}
            <div className="pill-container">
                <h3 className="pill-shape">Confident</h3>
                <h4 className="pill-shape">Sigma</h4>
                <h5 className="pill-shape">Alpha</h5>
            </div>

            <p className="card-text">
                Giga Chad reeks of peak masculinity — rizzing him up is nearly impossible.
            </p>

            <a href="/call">
                <button className="card-call">
                    Call
                </button>
            </a>

        </div>
    );
};

export default Card;
