const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SUCCESS':
      return action.payload;
    case 'ERROR':
      return action.payload;
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};

export const setSuccessNotification = (message) => {
  return { type: 'SUCCESS', payload: message };
};

export const setErrorNotification = (message) => {
  return { type: 'ERROR', payload: message };
};

export const clearNotification = () => {
  return { type: 'CLEAR' };
};

export default notificationReducer;
