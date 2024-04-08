const Post = require('../models/Post');
const User = require('../models/User');


class PostController {
  static async getAllPosts(req, res) {
    try {
        const posts = await Post.findAll({ include: User });
        const loggedIn = req.session.loggedIn || false; 
        const postsData = posts.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            authorUsername: post.User.username,
            createdAt: post.createdAt
        }));
        console.log(postsData)
        res.render('posts', { posts: postsData, loggedIn });
    } catch (error) {
      console.log(error)
        res.render('error', { error: 'Internal server error' });
    }
}

static async createPostPage(req, res) {
  const loggedIn = req.session.loggedIn || false; 

  res.render('createPost',{loggedIn});
}
static async dashboard(req, res) {
  const userId = req.session.userId;
  if (!userId) {
      return res.render('error', { error: 'Internal server error' });
  }

  try {
      const posts = await Post.findAll({ where: { authorId: userId } });

      const loggedIn = req.session.loggedIn || false; 

      let postsData = [];
      if (posts && posts.length > 0) {
          postsData = posts.map(post => post.get({ plain: true }));
      }

      res.render('dashboard', { posts: postsData, loggedIn });
  } catch (error) {
      console.error(error);
      res.render('error', { error: 'Internal server error' });
  }
}


  static async createPost(req, res) {
    const authorId = req.session.userId;
    const loggedIn = req.session.loggedIn || false;

    try {
      const { title, content } = req.body;
      const newPost = await Post.create({ title, content, authorId });
      res.redirect('/posts');
    } catch (error) {
      res.render('error', { error: error.message });
    }
  }

  static async renderEditPostForm(req, res) {
    const loggedIn = req.session.loggedIn || false; 

    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId, {
            attributes: ['id', 'title', 'content'] 
        });
        res.render('editPost', { post, loggedIn });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



  static async getPost(req, res) {
    const loggedIn = req.session.loggedIn || false; 

    try {
        const postId = req.params.postId;
        const post = await Post.findByPk(postId);
        
        if (!post) {
            return res.render('error', { error: 'Post not found' });
        }
        
        const postData = post.get({ plain: true });
        
        res.render('post', { post: postData, loggedIn });
    } catch (error) {
        res.render('error', { error: 'Internal server error' });
    }
}

  static async updatePost(req, res) {
    try {
      const postId = req.params.postId;
      const { title, content } = req.body;
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.render('error', { error: 'Post not found' });
      }
      post.title = title;
      post.content = content;
      await post.save();
      res.redirect(`/posts/${postId}`); 
    } catch (error) {
      res.render('error', { error: error.message });
    }
  }

  static async deletePost(req, res) {
    try {
      const postId = req.params.postId;
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.render('error', { error: 'Post not found' });
      }
      await post.destroy();
      res.redirect('/posts'); 
    } catch (error) {
      res.render('error', { error: 'Internal server error' });
    }
  }
}

module.exports = PostController;
