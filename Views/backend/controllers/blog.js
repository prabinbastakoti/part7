const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const middleware = require('../utils/middleware');

blogRouter.post('/:id/comment', async (request, response) => {
  const body = request.body;
  const id = request.params.id;
  const blog = await Blog.findById(id);
  const newComment = new Comment({
    blog: id,
    comment: body.comment,
  });
  const result = await newComment.save();
  blog.comments = blog.comments.concat(result._id);

  await blog.save();
  response.status(201).json(result);
});

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('comments', {
      comment: 1,
      id: 1,
    })
    .populate('user', {
      name: 1,
      username: 1,
      id: 1,
    });
  console.log(blogs);
  response.json(blogs);
});

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url } = request.body;

  const user = request.user;

  if (!title || !url) {
    return response.status(400).send({ error: 'Title or URL is missing' });
  }

  const newBlog = new Blog({
    title,
    author,
    url,
    likes: request.body.likes ? request.body.likes : 0,
    user: user.id,
  });

  const result = await newBlog.save();

  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const id = request.params.id;
    const user = request.user;
    const blog = await Blog.findById(id);
    if (blog.user.toString() !== user.id) {
      return response.status(401).json({ error: 'Invalid user' });
    }
    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  }
);

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const { title, author, url, likes } = request.body;

  const update = await Blog.findByIdAndUpdate(
    id,
    { title, author, url, likes },
    { new: true }
  );
  response.json(update);
});

module.exports = blogRouter;
