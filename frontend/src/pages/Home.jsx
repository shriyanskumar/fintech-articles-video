import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [savedCount, setSavedCount] = useState(0);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedGuides') || '[]');
        setSavedCount(saved.length);
    }, []);

    return (
        <div className="app-container">
            {/* Hero Header */}
            <header className="hero-header">
                <div className="hero-badge">
                    <span>💡</span>
                    <span>FINANCIAL GUIDANCE PLATFORM • INDIA</span>
                </div>
                <h1 className="hero-title">FinGuide AI</h1>
                <p className="hero-subtitle">
                    Empowering you with step-by-step guidance for official documents and financial literacy.
                    Simple, secure, and built for first-time applicants.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/apply')}>
                        Get Started
                    </button>
                    {savedCount > 0 && (
                        <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }} onClick={() => navigate('/saved')}>
                            Saved Guides ({savedCount})
                        </button>
                    )}
                </div>
            </header>

            {/* Main Portal Sections */}
            <main className="main-content">
                <div className="section-header">
                    <span className="section-icon">🚀</span>
                    <div>
                        <h2 className="section-title">Select Your Path</h2>
                        <p className="section-subtitle">WHAT WOULD YOU LIKE TO DO TODAY?</p>
                    </div>
                </div>

                <div className="workflow-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', marginTop: '2rem' }}>
                    {/* Path 1: Apply */}
                    <div className="workflow-card" style={{ padding: '2.5rem' }} onClick={() => navigate('/apply')}>
                        <div className="workflow-card-icon" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>📄</div>
                        <h3 className="workflow-card-title" style={{ fontSize: '1.5rem' }}>Apply for Documents</h3>
                        <p className="workflow-card-description" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                            Step-by-step guidance for PAN, Aadhaar, Passport, Voter ID, and Driving Licenses.
                            We guide you through official government portals.
                        </p>
                        <span className="workflow-card-action">
                            Explore Applications →
                        </span>
                    </div>

                    {/* Path 2: Learn */}
                    <div className="workflow-card" style={{ padding: '2.5rem' }} onClick={() => navigate('/learn')}>
                        <div className="workflow-card-icon" style={{ width: '64px', height: '64px', fontSize: '2rem', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706' }}>📚</div>
                        <h3 className="workflow-card-title" style={{ fontSize: '1.5rem' }}>Learn Finance</h3>
                        <p className="workflow-card-description" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                            Master the basics of banking, taxes, investments, and budgeting.
                            Simple explanations for complex financial concepts.
                        </p>
                        <span className="workflow-card-action" style={{ color: '#d97706' }}>
                            Start Learning →
                        </span>
                    </div>
                </div>

                {/* Quick Info Section */}
                <section style={{ marginTop: '4rem' }}>
                    <div className="two-column">
                        <div className="left-column">
                            <div className="info-box success">
                                <div className="info-box-title">
                                    <span>✅</span> Official Resources
                                </div>
                                <p className="info-box-text">
                                    Our guides link directly to verified government and banking portals. No middlemen, no hidden fees.
                                </p>
                            </div>
                        </div>
                        <div className="right-column">
                            <div className="info-box">
                                <div className="info-box-title">
                                    <span>🤖</span> AI-Powered Insights
                                </div>
                                <p className="info-box-text">
                                    Get personalized explanations and curated video tutorials for every step of your journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Disclaimer */}
                <div className="disclaimer">
                    <p className="disclaimer-title">Disclaimer</p>
                    <p className="disclaimer-text">
                        FinGuide AI is an educational platform. We are not a government agency.
                        Always verify information on official websites (e.g., .gov.in domains).
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Home;
