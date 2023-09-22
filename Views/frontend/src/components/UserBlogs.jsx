import { useMatch } from 'react-router-dom';

const UserBlogs = ({ users }) => {
  const match = useMatch('/users/:id');
  const selectUser = match
    ? users.find((user) => user.id === match.params.id)
    : null;

  return (
    <>
      <h2>{selectUser.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {selectUser.blogs.length > 0 ? (
          selectUser.blogs.map((blog) => {
            return <li key={blog.id}>{blog.title}</li>;
          })
        ) : (
          <p>Empty</p>
        )}
      </ul>
    </>
  );
};

export default UserBlogs;
