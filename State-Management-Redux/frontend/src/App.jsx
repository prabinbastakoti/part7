import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import NewBlogForm from './components/newBlogForm';
import Togglable from './components/togglable';
import LoginForm from './components/loginForm';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearNotification,
  setErrorNotification,
  setSuccessNotification,
} from './reducers/notificationReducer';
import { setBlogs } from './reducers/blogReducer';
import { clearUser, setUser } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInValue');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  const handleSubmit = async (object) => {
    const credentials = { ...object };
    console.log('Logging in with ', credentials.username, credentials.password);
    try {
      const user = await loginService.login(credentials);
      blogService.setToken(user.token);
      dispatch(setUser(user));
      window.localStorage.setItem('loggedInValue', JSON.stringify(user));
    } catch (error) {
      errorMessage('wrong username or password');
    }
  };

  const handleLogout = () => {
    console.log('logging out ', user.name);
    window.localStorage.clear();
    dispatch(clearUser());
  };

  const handleCreate = async (object) => {
    await blogService.create({ ...object });
    const newBlogs = await blogService.getAll();
    dispatch(setBlogs(newBlogs));
    successMessage(`a new blog ${object.title} added`);
  };

  const successMessage = (message) => {
    dispatch(setSuccessNotification(message));

    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  const errorMessage = (message) => {
    dispatch(setErrorNotification(message));

    setTimeout(() => {
      dispatch(clearNotification());
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
      const response = await blogService.update(blog);
      const newBlogs = await blogService.getAll();
      dispatch(setBlogs(newBlogs));
    } catch (error) {
      console.log('error', error.response.data.error);
    }
  };

  const handleRemove = async (blog) => {
    try {
      const response = await blogService.remove(blog);
      const newBlogs = await blogService.getAll();
      dispatch(setBlogs(newBlogs));
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
