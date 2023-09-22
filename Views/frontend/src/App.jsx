import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import NewBlogForm from './components/newBlogForm';
import Togglable from './components/togglable';
import LoginForm from './components/loginForm';
import {
  useNotificationDispatch,
  useNotificationValue,
} from './context/notificationContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserDispatch, useUserValue } from './context/userContext';

const App = () => {
  const user = useUserValue();

  const setUser = useUserDispatch();

  const notification = useNotificationValue();

  const dispatch = useNotificationDispatch();

  const queryClient = useQueryClient();

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  const removeBlogMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInValue');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser({ type: 'SET', payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return <div>Loading data...</div>;
  }

  const blogs = result.data;

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

  const handleCreate = async (object) => {
    newBlogMutation.mutate(object);
    successMessage(`a new blog ${object.title} added`);
  };

  const successMessage = (message) => {
    dispatch({ type: 'SET', payload: message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR' });
    }, 5000);
  };

  const errorMessage = (message) => {
    dispatch({ type: 'SET', payload: message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR' });
    }, 5000);
  };

  const BlogForm = () => {
    return (
      <Togglable label="Create new Blog">
        <NewBlogForm handleCreate={handleCreate} />
      </Togglable>
    );
  };

  const LoginFormFunction = () => {
    return <LoginForm handleSubmit={handleSubmit} />;
  };

  const updateBlog = async (blog) => {
    try {
      updateBlogMutation.mutate(blog);
    } catch (error) {
      console.log('error', error.response.data.error);
    }
  };

  const handleRemove = async (blog) => {
    try {
      removeBlogMutation.mutate(blog);
    } catch (error) {
      console.log('error', error.response.data.error);
    }
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

  return (
    <div>
      <h2>blogs</h2>
      {notification && <h2 className="success">{notification}</h2>}
      <h2>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </h2>
      {BlogForm()}
      {sortedblogs.map((blog) => (
        <div className="blog" key={blog.id}>
          <Blog
            blog={blog}
            updateBlog={updateBlog}
            remove={handleRemove}
            user={user.username}
          />
        </div>
      ))}
    </div>
  );
};

export default App;
