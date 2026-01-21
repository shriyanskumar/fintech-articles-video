import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/';
const AI_URL = import.meta.env.VITE_AI_URL || 'http://127.0.0.1:5001/';

const api = axios.create({
    baseURL: API_URL,
});

const aiApi = axios.create({
    baseURL: AI_URL,
});

export const getWorkflows = async (type) => {
    const response = await api.get('workflows', { params: { type } });
    return response.data;
};

export const getWorkflowSteps = async (id) => {
    const response = await api.get(`workflows/${id}/steps`);
    return response.data;
};

// Workaround: Backend single-fetch route is misbehaving. Fetch all and find.
export const getWorkflow = async (id) => {
    // Fetch all workflows (no type filter returns all)
    const response = await api.get('workflows');
    const allWorkflows = response.data;
    return allWorkflows.find(w => w._id === id);
};

export const generateExplanation = async (topic, context) => {
    const response = await aiApi.post('generate-explanation', { topic, context });
    return response.data;
};

export const getRecommendedResources = async (topic) => {
    const response = await aiApi.post('recommend-resources', { topic });
    return response.data;
};

export default api;
