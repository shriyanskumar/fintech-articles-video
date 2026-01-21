import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkflows, getRecommendedResources } from '../services/api';

const Learn = () => {
    const [allWorkflows, setAllWorkflows] = useState([]);
    const [filteredWorkflows, setFilteredWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const navigate = useNavigate();

    const categories = ['All', 'Personal Finance', 'Tax', 'Credit', 'Investing'];

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const data = await getWorkflows('learn');
                setAllWorkflows(data);
                setFilteredWorkflows(data);
            } catch (error) {
                console.error('Failed to fetch workflows', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkflows();
    }, []);

    // Resources handling
    const [resources, setResources] = useState({ articles: [], videos: [] });
    const [loadingResources, setLoadingResources] = useState(false);

    useEffect(() => {
        fetchCategoryResources();
    }, [activeCategory]);

    const fetchCategoryResources = async () => {
        setLoadingResources(true);
        try {
            let query = "";
            if (activeCategory === 'All') query = "Financial literacy and money management basics India";
            else if (activeCategory === 'Personal Finance') query = "Personal Finance basics India budgeting";
            else if (activeCategory === 'Tax') query = "Income Tax and ITR India guide official";
            else if (activeCategory === 'Credit') query = "Credit scores CIBIL and loans India guide";
            else query = "Investing in mutual funds and stocks India guide";

            console.log("Fetching category resources for:", query);
            const res = await getRecommendedResources(query);

            if (res && res.resources) {
                setResources(res.resources);
            } else {
                setResources({ articles: [], videos: [] });
            }
        } catch (error) {
            console.error('Failed to fetch resources', error);
        } finally {
            setLoadingResources(false);
        }
    };

    const filterByCategory = (category) => {
        setActiveCategory(category);
        if (category === 'All') {
            setFilteredWorkflows(allWorkflows);
        } else {
            setFilteredWorkflows(allWorkflows.filter(w => w.category === category));
        }
    };

    const getWorkflowIcon = (title) => {
        const lower = title.toLowerCase();
        if (lower.includes('tax')) return '💰';
        if (lower.includes('credit') || lower.includes('loan')) return '💳';
        if (lower.includes('invest')) return '📈';
        if (lower.includes('budget')) return '📊';
        if (lower.includes('banking')) return '🏦';
        return '📚';
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
                    <span>📚</span>
                    <span>FINANCIAL EDUCATION</span>
                </div>
                <h1 className="hero-title">Learn Finance</h1>
                <p className="hero-subtitle">
                    Master your money with simple, easy-to-understand tutorials on essential financial concepts.
                    From taxes to investments, we've got you covered.
                </p>
            </header>

            <main className="main-content">
                {/* Category Selector - Restored */}
                <div className="section-header">
                    <span className="section-icon">📂</span>
                    <div>
                        <h2 className="section-title">Knowledge Hub</h2>
                        <p className="section-subtitle">FILTER TOPICS & RESOURCES BY CATEGORY</p>
                    </div>
                </div>

                <div className="category-selector" style={{ marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <div
                            key={cat}
                            className={`category-option ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => filterByCategory(cat)}
                            style={{ minWidth: '150px' }}
                        >
                            <div className="category-option-icon">
                                {cat === 'All' ? '🌐' : cat === 'Tax' ? '💰' : cat === 'Credit' ? '💳' : cat === 'Investing' ? '📈' : '📊'}
                            </div>
                            <div className="category-option-title">{cat}</div>
                        </div>
                    ))}
                </div>

                {/* Workflow Grid */}
                <div className="section-header" style={{ marginTop: '3rem' }}>
                    <span className="section-icon">📚</span>
                    <div>
                        <h2 className="section-title">Curated Tutorials</h2>
                        <p className="section-subtitle">MASTER THE BASICS OF FINANCE</p>
                    </div>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', padding: '4rem' }}>Loading tutorials...</p>
                ) : (
                    <div className="workflow-grid" style={{ marginTop: '2rem' }}>
                        {filteredWorkflows.map((workflow) => (
                            <div
                                key={workflow._id}
                                className="workflow-card"
                                onClick={() => navigate(`/workflow/${workflow._id}`)}
                            >
                                <div className="workflow-card-icon" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', color: '#7c3aed' }}>
                                    {getWorkflowIcon(workflow.title)}
                                </div>
                                <h3 className="workflow-card-title">{workflow.title}</h3>
                                <p className="workflow-card-description">{workflow.description}</p>
                                <span className="workflow-card-action" style={{ color: '#7c3aed' }}>
                                    Start Learning →
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recommended Resources Library - New Section */}
                <section style={{ marginTop: '5rem' }}>
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                        <span className="section-icon">🎥</span>
                        <div>
                            <h2 className="section-title">Education Library</h2>
                            <p className="section-subtitle">GENUINE ARTICLES & VIDEOS FOR {activeCategory.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="two-column" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        {/* Articles */}
                        <div>
                            <div className="resource-section-title">
                                <span>📄</span> Recommended Articles
                            </div>
                            {loadingResources ? (
                                <p>Finding best financial articles...</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {resources.articles && resources.articles.length > 0 ? (
                                        resources.articles.map((article, i) => (
                                            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" className="resource-card article" title={article.url}>
                                                <div className="resource-icon">📄</div>
                                                <div className="resource-title">{article.title}</div>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-muted">No expert articles found for this topic yet.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Videos */}
                        <div>
                            <div className="resource-section-title">
                                <span>🎥</span> Video Explainers
                            </div>
                            {loadingResources ? (
                                <p>Curating top explainers...</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {resources.videos && resources.videos.length > 0 ? (
                                        resources.videos.map((video, i) => (
                                            <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="resource-card video" title={video.url}>
                                                <div className="resource-icon">▶</div>
                                                <div className="resource-title">{video.title}</div>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-muted">No tutorial videos found for this topic yet.</p>
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

export default Learn;
