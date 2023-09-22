import { useState } from 'react';

const NewBlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    handleCreate({ title, author, url });

    setTitle('');
    setAuthor('');
    setURL('');
  };

  return (
    <>
      <h1>Create new</h1>

      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="title"
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            className="author"
          />
        </div>
        <div>
          <label htmlFor="url">url</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={({ target }) => setURL(target.value)}
            className="url"
          />
        </div>
        <button type="submit" className="submitBtn">
          create
        </button>
      </form>
    </>
  );
};

export default NewBlogForm;
