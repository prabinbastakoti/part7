import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/login';

const login = async (credentials) => {
  const request = await axios.post(baseUrl, credentials);
  return request.data;
};

export default { login };
