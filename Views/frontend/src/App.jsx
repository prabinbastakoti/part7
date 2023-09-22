import { useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';
import {
  useNotificationDispatch,
  useNotificationValue,
} from './context/notificationContext';
import { useQuery } from '@tanstack/react-query';
import { useUserDispatch, useUserValue } from './context/userContext';
import { Link, Route, Routes, useMatch } from 'react-router-dom';
import Users from './components/Users';
import LoginForm from './components/loginForm';
import Home from './components/Home';
import UserBlogs from './components/UserBlogs';
import BlogDetail from './components/BlogDetail';

const App = () => {
  const match = useMatch('/blogs/:id');

  const user = useUserValue();

  const setUser = useUserDispatch();

  const notification = useNotificationValue();

  const dispatch = useNotificationDispatch();

  const usersResponse = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  });

  const users = usersResponse.data;

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInValue');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser({ type: 'SET', payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const blogsResponse = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  if (blogsResponse.isLoading || usersResponse.isLoading) {
    return <div>Loading data...</div>;
  }

  const blogs = blogsResponse.data;

  const handleSubmit = async (object) => {
    const credentials = { ...object };
    console.log('Logging in with ', credentials.username, credentials.password);
    try {
      const user = await loginService.login(credentials);
      blogService.setToken(user.token);
      setUser({ type: 'SET', payload: user });

      window.localStorage.setItem('loggedInValue', JSON.stringify(user));
    } catch (error) {
      errorMessage('wrong username or password');
    }
  };

  const handleLogout = () => {
    console.log('logging out ', user.name);
    window.localStorage.clear();
    setUser({ type: 'CLEAR' });
  };

  const errorMessage = (message) => {
    dispatch({ type: 'SET', payload: message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR' });
    }, 5000);
  };

  const LoginFormFunction = () => {
    return <LoginForm handleSubmit={handleSubmit} />;
  };

  if (user === null) {
    return (
      <div>
        <h1>Login to Application</h1>
        {notification && <h2 className="error">{notification}</h2>}
        {LoginFormFunction()}
      </div>
    );
  }

  const sortedblogs = [...blogs].sort((a, b) => b.likes - a.likes);

  const selectBlog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null;

  return (
    <div>
      <nav>
        <ul
          style={{
            display: 'flex',
            listStyle: 'none',
            gap: '20px',
            backgroundColor: 'rgb(210,210,210)',
            padding: '10px',
          }}
        >
          <li>
            <Link to={'/'}>blogs</Link>
          </li>
          <li>
            <Link to={'/users'}>users</Link>
          </li>
          <li>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </li>
        </ul>
      </nav>
      <h2>blogs</h2>
      {notification && <h2 className="success">{notification}</h2>}

      <Routes>
        <Route path="/users" element={<Users users={users} />} />
        <Route
          path="/"
          element={<Home sortedblogs={sortedblogs} user={user} />}
        />
        <Route path="/users/:id" element={<UserBlogs users={users} />} />
        <Route path="/blogs/:id" element={<BlogDetail blog={selectBlog} />} />
      </Routes>
    </div>
  );
};

export default App;
