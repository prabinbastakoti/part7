const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SETUSER':
      return action.payload;
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};

export const setUser = (payload) => {
  return { type: 'SETUSER', payload };
};

export const clearUser = (payload) => {
  return { type: 'CLEAR' };
};

export default userReducer;
