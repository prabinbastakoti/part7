import { useQueryClient, useMutation } from '@tanstack/react-query';
import blogService from '../services/blogs';
import commentService from '../services/commentService';

const BlogDetail = ({ blog }) => {
  const queryClient = useQueryClient();

  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  const updateBlog = async (blog) => {
    try {
      updateBlogMutation.mutate(blog);
    } catch (error) {
      console.log('error', error.response.data.error);
    }
  };

  const commentBlogMutation = useMutation(commentService.createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  const increaseLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 };
    updateBlog(newBlog);
  };

  const addComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = '';
    const id = blog.id;
    commentBlogMutation.mutate({ id, comment });
  };

  return (
    <>
      <h2>{blog.title}</h2>
      <a href="#">{blog.url}</a>
      <p>
        {blog.likes} likes{' '}
        <button onClick={increaseLike} className="likeBtn">
          like
        </button>
      </p>

      <p>added by {blog.user.name}</p>

      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input name="comment" />
        <button>comment</button>
      </form>
      <ul>
        {blog.comments.length > 0 ? (
          blog.comments.map((comment) => {
            return <li key={comment.id}>{comment.comment}</li>;
          })
        ) : (
          <div>Empty</div>
        )}
      </ul>
    </>
  );
};

export default BlogDetail;
