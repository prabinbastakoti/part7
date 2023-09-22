import { useState } from 'react';

const LoginForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const addUser = (event) => {
    event.preventDefault();
    handleSubmit({ username, password });
  };

  return (
    <form onSubmit={addUser}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
