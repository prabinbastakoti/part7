import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BlogForm from './newBlogForm';

describe('Blog Form', () => {
  let container;
  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const handleCreate = jest.fn();
    const user = userEvent.setup();

    container = render(<BlogForm handleCreate={handleCreate} />).container;

    const title = container.querySelector('.title');
    const author = container.querySelector('.author');
    const url = container.querySelector('.url');
    const button = container.querySelector('.submitBtn');

    await user.type(title, 'this is title');
    await user.type(author, 'this is author');
    await user.type(url, 'this is url');

    await user.click(button);

    expect(handleCreate.mock.calls).toHaveLength(1);
    expect(handleCreate.mock.calls[0][0].title).toBe('this is title');
  });
});
