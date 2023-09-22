import { createContext, useContext, useReducer } from 'react';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};

const userContext = createContext(userReducer);

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <userContext.Provider value={[user, userDispatch]}>
      {props.children}
    </userContext.Provider>
  );
};

export const useUserValue = () => {
  const setAndDispatch = useContext(userContext);
  return setAndDispatch[0];
};

export const useUserDispatch = () => {
  const setAndDispatch = useContext(userContext);
  return setAndDispatch[1];
};
