import axios from 'axios';

export const browserApi = axios.create({ baseURL: '/api', timeout: 12_000 });
