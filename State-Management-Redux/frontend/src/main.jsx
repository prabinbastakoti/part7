import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import userReducer from './reducers/userReducer';

const reducer = combineReducers({
  blogs: blogReducer,
  notification: notificationReducer,
  user: userReducer,
});

const store = createStore(reducer);

const root = ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
