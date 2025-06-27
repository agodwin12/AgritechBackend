const { Post, User, Comment, Like } = require('../models');
const path = require('path');

// GET all posts (with user & comments)
exports.getPosts = async (req, res) => {
    console.log('\n📥 [GET] /api/posts called');
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'full_name', 'profile_image']
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['id', 'full_name', 'profile_image']
                    }
                }
            ]
        });

        console.log(`✅ ${posts.length} post(s) retrieved.`);
        res.json({ success: true, data: posts });
    } catch (error) {
        console.error('❌ Error in getPosts:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// CREATE new post
exports.createPost = async (req, res) => {
    console.log('\n✉️ [POST] /api/posts called');
    try {
        const { user_id, title, text } = req.body;
        let image_url = null;

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
            console.log('🖼️ Image will be saved as:', image_url);
        }

        const newPost = await Post.create({
            user_id,
            title,
            text,
            image_url
        });

        console.log('✅ Post saved with ID:', newPost.id);

        const postWithUser = await Post.findByPk(newPost.id, {
            include: {
                model: User,
                attributes: ['id', 'full_name', 'profile_image']
            }
        });

        res.status(201).json({ success: true, data: postWithUser });
    } catch (error) {
        console.error('❌ Error in createPost:', error);
        res.status(500).json({ success: false, message: 'Failed to create post', error });
    }
};

// CREATE comment on a post
exports.createComment = async (req, res) => {
    console.log('\n💬 [POST] /api/comments called');
    try {
        const { user_id, post_id, text } = req.body;

        console.log(`➡️ Creating comment for post_id ${post_id} by user ${user_id}`);

        const comment = await Comment.create({
            user_id,
            post_id,
            text
        });

        const commentWithUser = await Comment.findByPk(comment.id, {
            include: {
                model: User,
                attributes: ['id', 'full_name', 'profile_image']
            }
        });

        console.log('✅ Comment created:', commentWithUser.id);
        res.status(201).json({ success: true, data: commentWithUser });
    } catch (error) {
        console.error('❌ Error in createComment:', error);
        res.status(500).json({ success: false, message: 'Failed to create comment', error });
    }
};

// LIKE a post
exports.likePost = async (req, res) => {
    console.log(`\n❤️ [POST] /api/posts/${req.params.postId}/like called`);
    try {
        const { user_id } = req.body;
        const { postId } = req.params;

        console.log(`🔎 Finding post ID ${postId}`);
        const post = await Post.findByPk(postId);

        if (!post) {
            console.log('❌ Post not found.');
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        console.log(`👍 Current likes: ${post.likes_count}`);
        await Like.create({
            user_id,
            post_id: postId
        });

        post.likes_count += 1;
        await post.save();

        console.log(`✅ Post likes incremented to: ${post.likes_count}`);
        res.json({ success: true, message: 'Post liked', likes: post.likes_count });
    } catch (error) {
        console.error('❌ Error in likePost:', error);
        res.status(500).json({ success: false, message: 'Failed to like post', error });
    }
};

// LIKE a comment
exports.likeComment = async (req, res) => {
    console.log(`\n❤️ [POST] /api/comments/${req.params.commentId}/like called`);
    try {
        const { user_id } = req.body;
        const { commentId } = req.params;

        console.log(`🔎 Finding comment ID ${commentId}`);
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            console.log('❌ Comment not found.');
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        console.log(`👍 Current likes: ${comment.likes_count}`);
        await Like.create({
            user_id,
            comment_id: commentId
        });

        comment.likes_count += 1;
        await comment.save();

        console.log(`✅ Comment likes incremented to: ${comment.likes_count}`);
        res.json({ success: true, message: 'Comment liked', likes: comment.likes_count });
    } catch (error) {
        console.error('❌ Error in likeComment:', error);
        res.status(500).json({ success: false, message: 'Failed to like comment', error });
    }
};
