import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Blog posts', () => {
  let container;
  beforeEach(() => {
    const blog = {
      title: 'this is title',
      author: 'this is author',
      url: 'this is url',
      likes: 0,
      user: {
        username: 'test',
        name: 'test',
        id: 'agsfh3823892kjsdfsedf',
      },
      id: 'kjfabsiufy387y782g3iu23',
    };
    container = render(<Blog blog={blog} />).container;
  });
  test('renders content', () => {
    const element = screen.queryByText('this is title this is author');
    expect(element).toBeDefined();
  });

  test('url and likes doesnot show by default', () => {
    const element = container.querySelector('.showWhenVisible');
    expect(element).toHaveStyle({ display: 'none' });
  });

  test('after clicking the button , url , likes and author are visible', async () => {
    const user = userEvent.setup();

    const button = container.querySelector('.showBtn');

    await user.click(button);

    const element = container.querySelector('.showWhenVisible');
    expect(element).not.toHaveStyle({ display: 'none' });
  });

  test('after clicking like button twice the component receives twice props', async () => {
    const blog = {
      title: 'this is title',
      author: 'this is author',
      url: 'this is url',
      likes: 0,
      user: {
        username: 'test',
        name: 'test',
        id: 'agsfh3823892kjsdfsedf',
      },
      id: 'kjfabsiufy387y782g3iu23',
    };

    const mockHandler = jest.fn();

    container = render(<Blog blog={blog} updateBlog={mockHandler} />).container;

    const user = userEvent.setup();
    const button = container.querySelector('.likeBtn');
    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
