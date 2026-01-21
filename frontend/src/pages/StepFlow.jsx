import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkflowSteps, getWorkflows, generateExplanation, getRecommendedResources } from '../services/api';

const StepFlow = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [explanation, setExplanation] = useState('');
    const [resources, setResources] = useState({ articles: [], videos: [] });
    const [loadingAI, setLoadingAI] = useState(false);
    const [loadingResources, setLoadingResources] = useState(false);
    const [workflow, setWorkflow] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const getWorkflowIcon = (title) => {
        if (!title) return '📋';
        const lower = title.toLowerCase();
        if (lower.includes('pan')) return '📄';
        if (lower.includes('aadhaar')) return '🆔';
        if (lower.includes('driving')) return '🚗';
        if (lower.includes('voter')) return '🗳️';
        if (lower.includes('passport')) return '🛂';
        if (lower.includes('bank')) return '🏦';
        if (lower.includes('tax')) return '💰';
        if (lower.includes('credit') || lower.includes('loan')) return '💳';
        if (lower.includes('invest')) return '📈';
        if (lower.includes('budget')) return '📊';
        return '📋';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stepsData = await getWorkflowSteps(id);
                setSteps(stepsData);

                // Fetch workflow details
                const allWorkflows = await getWorkflows();
                const currentWorkflow = allWorkflows.find(w => String(w._id) === String(id));
                setWorkflow(currentWorkflow);

                // Check if saved
                const saved = JSON.parse(localStorage.getItem('savedGuides') || '[]');
                setIsSaved(saved.some(g => g.id === id));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (steps.length > 0 && workflow) {
            fetchAIExplanation();
        }
    }, [currentStepIndex, steps, workflow]);

    useEffect(() => {
        if (workflow) {
            fetchWorkflowResources();
        }
    }, [workflow]);

    const fetchWorkflowResources = async () => {
        setLoadingResources(true);
        try {
            // Use the workflow title to fetch specific, high-quality links for the entire process
            const query = `${workflow.title} India guide official website steps tutorials`;
            console.log("Fetching workflow resources for:", query);
            const resourcesRes = await getRecommendedResources(query);
            setResources(resourcesRes.resources || { articles: [], videos: [] });
        } catch (error) {
            console.error('Error fetching workflow resources:', error);
        } finally {
            setLoadingResources(false);
        }
    };

    const fetchAIExplanation = async () => {
        const currentStep = steps[currentStepIndex];
        if (!currentStep || !workflow) return;

        setLoadingAI(true);
        try {
            const explanationRes = await generateExplanation(currentStep.title, workflow.title);
            setExplanation(explanationRes.explanation || '');
        } catch (error) {
            console.error('Error fetching AI explanation:', error);
        } finally {
            setLoadingAI(false);
        }
    };

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem('savedGuides') || '[]');
        if (isSaved) {
            const updated = saved.filter(g => g.id !== id);
            localStorage.setItem('savedGuides', JSON.stringify(updated));
            setIsSaved(false);
        } else {
            saved.push({ id, title: workflow?.title || 'Guide' });
            localStorage.setItem('savedGuides', JSON.stringify(saved));
            setIsSaved(true);
        }
    };

    if (loading) {
        return (
            <div className="main-content" style={{ textAlign: 'center', padding: '4rem' }}>
                <p>Loading guide...</p>
            </div>
        );
    }

    if (steps.length === 0) {
        return (
            <div className="main-content">
                <div className="info-box danger">
                    <div className="info-box-title">No steps found</div>
                    <p className="info-box-text">This guide doesn't have any steps yet.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
            </div>
        );
    }

    const currentStep = steps[currentStepIndex];
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className="app-container">
            {/* Header */}
            <header className="hero-header" style={{ paddingBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }} onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <button className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'}`} style={isSaved ? { background: '#10b981', color: 'white', border: 'none' } : {}} onClick={handleSave}>
                        {isSaved ? '✓ Saved' : '🔖 Save Guide'}
                    </button>
                </div>
                <div className="hero-badge">
                    <span>{getWorkflowIcon(workflow?.title)}</span>
                    <span style={{ marginLeft: '0.5rem' }}>STEP {currentStepIndex + 1} OF {steps.length}</span>
                </div>
                <h1 className="hero-title">{workflow?.title}</h1>
                <p className="hero-subtitle">{workflow?.description}</p>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </header>

            <main className="main-content" style={{ maxWidth: '900px' }}>
                {/* Step Content */}
                <section className="card step-focused-card" style={{ marginBottom: '2rem', padding: '2.5rem' }}>
                    <div className="section-header">
                        <div className="step-number-circle" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                            {currentStepIndex + 1}
                        </div>
                        <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{currentStep.title}</h2>
                    </div>

                    <div className="info-box" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                        <p className="info-box-text" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                            {currentStep.description}
                        </p>
                    </div>

                    {currentStep.actionChecklist && currentStep.actionChecklist.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Action Checklist:</h4>
                            <div className="step-checklist">
                                {currentStep.actionChecklist.map((item, i) => (
                                    <div key={i} className="checklist-item" style={{ padding: '0.5rem 0' }}>
                                        <span className="checklist-icon">✓</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Explanation Integrated Directly */}
                    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                        <div className="section-header" style={{ marginBottom: '1rem' }}>
                            <span className="section-icon">🤖</span>
                            <h3 className="section-title" style={{ fontSize: '1.25rem' }}>Personalized Guidance</h3>
                        </div>
                        {loadingAI ? (
                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Analyzing details for you...</p>
                        ) : (
                            <div className="explanation-content">
                                {explanation.split('\n').map((para, i) => para ? <p key={i}>{para}</p> : null)}
                            </div>
                        )}
                    </div>
                </section>

                {/* Navigation Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                    <button
                        className="btn btn-secondary"
                        disabled={currentStepIndex === 0}
                        onClick={() => setCurrentStepIndex(prev => prev - 1)}
                    >
                        ← Previous Step
                    </button>
                    {currentStepIndex < steps.length - 1 ? (
                        <button className="btn btn-primary" onClick={() => setCurrentStepIndex(prev => prev + 1)}>
                            Next Step →
                        </button>
                    ) : (
                        <button className="btn btn-primary" style={{ background: 'var(--accent-green)' }} onClick={() => navigate('/')}>
                            Finish Guide 🎉
                        </button>
                    )}
                </div>

                {/* Recommended Resources (5-6 Articles & Videos separated as requested) */}
                <section style={{ marginBottom: '4rem' }}>
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                        <span className="section-icon">🔗</span>
                        <div>
                            <h2 className="section-title">Verified Resources</h2>
                            <p className="section-subtitle">LEARN FROM OFFICIAL SOURCES & EXPERTS</p>
                        </div>
                    </div>

                    <div className="two-column" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        {/* Articles */}
                        <div>
                            <div className="resource-section-title">
                                <span>📄</span> Recommended Articles
                            </div>
                            {loadingResources ? (
                                <p>Finding best official guides...</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {resources.articles.length > 0 ? (
                                        resources.articles.map((article, i) => (
                                            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" className="resource-card article" title={article.url}>
                                                <div className="resource-icon">📄</div>
                                                <div className="resource-title">{article.title}</div>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-muted">No guides found for this workflow yet.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Videos */}
                        <div>
                            <div className="resource-section-title">
                                <span>🎥</span> Video Tutorials
                            </div>
                            {loadingResources ? (
                                <p>Picking top expert tutorials...</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {resources.videos.length > 0 ? (
                                        resources.videos.map((video, i) => (
                                            <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="resource-card video" title={video.url}>
                                                <div className="resource-icon">▶</div>
                                                <div className="resource-title">{video.title}</div>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-muted">No video tutorials found for this workflow yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StepFlow;
