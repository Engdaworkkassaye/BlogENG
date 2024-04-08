// routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const PostController = require('../controllers/postController');

// Homepage - Display existing blog posts


// Sign up a new user
router.post('/signup', UserController.signUp);

router.get('/signup', UserController.signUpPage);

// Sign in an existing user
router.post('/signin', UserController.signIn);
router.get('/signin', UserController.signInPage);

// Sign out the current user
router.get('/logout', UserController.checkAuthentication, UserController.signOut);
router.get('/posts', PostController.getAllPosts);
router.get('/dashboard', PostController.dashboard);

router.get('/createPost', PostController.createPostPage);


// Create a new blog post
router.post('/posts', UserController.checkAuthentication, PostController.createPost);

// View a specific blog post
router.get('/posts/:postId', PostController.getPost);
router.get('/editPost/:id', PostController.renderEditPostForm);

// Route to handle post edit submission
// router.post('/editPost/:id', postController.editPost);
// Update a specific blog post
router.post('/editPost/:postId', UserController.checkAuthentication, PostController.updatePost);

// Delete a specific blog post
router.delete('/posts/:postId', UserController.checkAuthentication, PostController.deletePost);


module.exports = router;
