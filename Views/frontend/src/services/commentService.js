import axios from 'axios';

const createComment = async ({ id, comment }) => {
  const baseUrl = `http://localhost:3001/api/blogs/${id}/comment`;
  const response = await axios.post(baseUrl, { blog: id, comment });
  return response.data;
};

export default { createComment };
