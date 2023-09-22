const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    default:
      return state;
  }
};

export const setBlogs = (payload) => {
  return { type: 'SET', payload };
};

export default blogReducer;
