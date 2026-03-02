import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI || 'http://server.keshavinfotechdemo2.com:4017',
    headers: { 'X-Custom-Header': 'foobar' }
});

export default api;

