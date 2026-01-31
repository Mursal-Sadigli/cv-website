import axios from 'axios';

console.log('Groq API Key loaded:', process.env.GROQ_API_KEY ? 'YES' : 'NO');

const groqApi = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default groqApi;