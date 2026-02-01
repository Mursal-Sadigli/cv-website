import axios from 'axios';

// Try Groq first, fallback to OpenAI
const useGroq = true; // Change to false to use OpenAI

const apiKey = useGroq 
  ? process.env.GROQ_API_KEY?.trim()
  : process.env.OPENAI_API_KEY?.trim();

const baseURL = useGroq
  ? 'https://api.groq.com/openai/v1'
  : 'https://api.openai.com/v1';

if (!apiKey) {
  console.error(`❌ API Key Not Found! Please set ${useGroq ? 'GROQ_API_KEY' : 'OPENAI_API_KEY'} in .env`);
  process.exit(1);
}

console.log(`✓ Using ${useGroq ? 'Groq' : 'OpenAI'} API`);
console.log(`✓ API Key loaded: ${apiKey.substring(0, 10)}...`);
console.log(`✓ API Endpoint: ${baseURL}`);

const aiApi = axios.create({
  baseURL: baseURL,
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Add request interceptor for logging
aiApi.interceptors.request.use(
  config => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      endpoint: config.url,
      authHeader: config.headers.Authorization?.substring(0, 20) + '...'
    });
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for debugging
aiApi.interceptors.response.use(
  response => {
    console.log('✓ API Success Response:', response.status);
    return response;
  },
  error => {
    console.error('❌ API Error:');
    console.error('  Status:', error.response?.status, error.response?.statusText);
    console.error('  Message:', error.response?.data?.error?.message);
    console.error('  Full Error:', JSON.stringify(error.response?.data, null, 2));
    return Promise.reject(error);
  }
);

export default aiApi;