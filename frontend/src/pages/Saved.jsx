import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Saved = () => {
    const navigate = useNavigate();
    const [savedGuides, setSavedGuides] = useState([]);

    useEffect(() => {
        // Unify with StepFlow.jsx key
        const saved = JSON.parse(localStorage.getItem('savedGuides') || '[]');
        setSavedGuides(saved);
    }, []);

    const removeGuide = (id) => {
        const updated = savedGuides.filter(g => g.id !== id);
        setSavedGuides(updated);
        localStorage.setItem('savedGuides', JSON.stringify(updated));
    };

    const getWorkflowIcon = (title) => {
        const lower = title.toLowerCase();
        if (lower.includes('pan')) return '📄';
        if (lower.includes('aadhaar')) return '🆔';
        if (lower.includes('driving')) return '🚗';
        if (lower.includes('voter')) return '🗳️';
        if (lower.includes('passport')) return '🛂';
        if (lower.includes('bank')) return '🏦';
        return '📑';
    };

    return (
        <div className="app-container">
            {/* Header */}
            <header className="hero-header" style={{ paddingBottom: '3rem' }}>
                <button
                    className="btn btn-secondary"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', marginBottom: '2rem' }}
                    onClick={() => navigate('/')}
                >
                    ← Back to Home
                </button>
                <div className="hero-badge">
                    <span>❤️</span>
                    <span>PERSONAL BOOKMARKS</span>
                </div>
                <h1 className="hero-title">My Saved Guides</h1>
                <p className="hero-subtitle">
                    Quickly access the tutorials and application guides you've bookmarked for later.
                </p>
            </header>

            <main className="main-content">
                <div className="section-header">
                    <span className="section-icon">📌</span>
                    <div>
                        <h2 className="section-title">Your Collection</h2>
                        <p className="section-subtitle">{savedGuides.length} GUIDES SAVED</p>
                    </div>
                </div>

                {savedGuides.length === 0 ? (
                    <div className="info-box" style={{ marginTop: '2rem', padding: '3rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't saved any guides yet.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>Explore Guides</button>
                    </div>
                ) : (
                    <div className="workflow-grid" style={{ marginTop: '2rem' }}>
                        {savedGuides.map((guide) => (
                            <div
                                key={guide.id}
                                className="workflow-card"
                                onClick={() => navigate(`/workflow/${guide.id}`)}
                            >
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeGuide(guide.id); }}
                                        style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                        title="Remove"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="workflow-card-icon">
                                    {getWorkflowIcon(guide.title)}
                                </div>
                                <h3 className="workflow-card-title">{guide.title}</h3>
                                <p className="workflow-card-description">Ready to continue where you left off?</p>
                                <span className="workflow-card-action">
                                    Continue Guide →
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Saved;
