import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { NotificationContextProvider } from './context/notificationContext';
import { UserContextProvider } from './context/userContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </QueryClientProvider>
  </UserContextProvider>
);
