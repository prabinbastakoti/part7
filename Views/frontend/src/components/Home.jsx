import { Link } from 'react-router-dom';
import Blog from './Blog';
import Togglable from './togglable';
import NewBlogForm from './newBlogForm';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import blogService from '../services/blogs';
import { useNotificationDispatch } from '../context/notificationContext';

const Home = ({ sortedblogs, user }) => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const BlogForm = () => {
    return (
      <Togglable label="Create new Blog">
        <NewBlogForm handleCreate={handleCreate} />
      </Togglable>
    );
  };

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

  const successMessage = (message) => {
    dispatch({ type: 'SET', payload: message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR' });
    }, 5000);
  };

  const handleCreate = async (object) => {
    newBlogMutation.mutate(object);
    successMessage(`a new blog ${object.title} added`);
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
  return (
    <>
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
    </>
  );
};

export default Home;
