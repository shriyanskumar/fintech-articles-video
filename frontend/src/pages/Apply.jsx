import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkflows, getRecommendedResources } from '../services/api';

const Apply = () => {
    const [allWorkflows, setAllWorkflows] = useState([]);
    const [filteredWorkflows, setFilteredWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const navigate = useNavigate();

    const categories = ['All', 'Government', 'Banking'];

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const data = await getWorkflows('apply');
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
            if (activeCategory === 'All') query = "Government Banking financial official guides India";
            else if (activeCategory === 'Government') query = "Government Documents official guides India";
            else query = "Banking and bank accounts India official guides";

            console.log("Fetching category resources for:", query);
            const res = await getRecommendedResources(query);

            // Defensive check to ensure we got data
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
        if (lower.includes('pan')) return '📄';
        if (lower.includes('aadhaar')) return '🆔';
        if (lower.includes('driving')) return '🚗';
        if (lower.includes('voter')) return '🗳️';
        if (lower.includes('passport')) return '🛂';
        if (lower.includes('bank')) return '🏦';
        return '📋';
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
                    <span>📄</span>
                    <span>ONLINE APPLICATIONS</span>
                </div>
                <h1 className="hero-title">Apply for Documents</h1>
                <p className="hero-subtitle">
                    Official step-by-step guides for important identity and financial applications.
                    Choose a category to filter the services.
                </p>
            </header>

            <main className="main-content">
                {/* Category Selector - Restored */}
                <div className="section-header">
                    <span className="section-icon">📂</span>
                    <div>
                        <h2 className="section-title">Select a Category</h2>
                        <p className="section-subtitle">FILTER SERVICES & RESOURCES BY TYPE</p>
                    </div>
                </div>

                <div className="category-selector" style={{ marginTop: '1.5rem' }}>
                    {categories.map(cat => (
                        <div
                            key={cat}
                            className={`category-option ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => filterByCategory(cat)}
                        >
                            <div className="category-option-icon">
                                {cat === 'All' ? '🌐' : cat === 'Government' ? '🏛️' : '🏦'}
                            </div>
                            <div className="category-option-title">{cat}</div>
                            <div className="category-option-subtitle">
                                {cat === 'All' ? 'View all services' : `View ${cat} services`}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Workflow Grid */}
                <div className="section-header" style={{ marginTop: '3rem' }}>
                    <span className="section-icon">📑</span>
                    <div>
                        <h2 className="section-title">Guided Workflows</h2>
                        <p className="section-subtitle">STEP-BY-STEP OFFICIAL PROCEDURES</p>
                    </div>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', padding: '4rem' }}>Loading services...</p>
                ) : (
                    <div className="workflow-grid" style={{ marginTop: '2rem' }}>
                        {filteredWorkflows.map((workflow) => (
                            <div
                                key={workflow._id}
                                className="workflow-card"
                                onClick={() => navigate(`/workflow/${workflow._id}`)}
                            >
                                <div className="workflow-card-icon">
                                    {getWorkflowIcon(workflow.title)}
                                </div>
                                <h3 className="workflow-card-title">{workflow.title}</h3>
                                <p className="workflow-card-description">{workflow.description}</p>
                                <span className="workflow-card-action">
                                    Start Guide →
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recommended Resources Library - New Section */}
                <section style={{ marginTop: '5rem' }}>
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                        <span className="section-icon">📚</span>
                        <div>
                            <h2 className="section-title">Expert Resource Library</h2>
                            <p className="section-subtitle">GENUINE ARTICLES & TUTORIALS FOR {activeCategory.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="two-column" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        {/* Articles */}
                        <div>
                            <div className="resource-section-title">
                                <span>📄</span> Recommended Articles
                            </div>
                            {loadingResources ? (
                                <p>Scraping latest guides...</p>
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
                                        <p className="text-muted">No official articles found yet. Please try another category.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Videos */}
                        <div>
                            <div className="resource-section-title">
                                <span>🎥</span> Essential Video Tutorials
                            </div>
                            {loadingResources ? (
                                <p>Curating expert tutorials...</p>
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
                                        <p className="text-muted">No tutorial videos found yet. Please try another category.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* FAQ / Info */}
                <section style={{ marginTop: '4rem' }}>
                    <div className="info-box success">
                        <div className="info-box-title">
                            <span>✅</span> Safe & Secure
                        </div>
                        <p className="info-box-text">
                            We do not collect your personal document data. Our role is to explain the process
                            and link you to the official government and bank portals where you handle your details safely.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Apply;
