const { VideoTip, VideoCategory, User } = require('../models');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const { authenticate } = require('../middleware/authMiddleware');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const videoController = {
    // ✅ Create a video tip
    async uploadVideo(req, res) {
        try {
            const { title, description, category_id } = req.body;
            const videoFile = req.files?.video_url?.[0];

            if (!videoFile) return res.status(400).json({ error: 'Video file required' });

            // Generate thumbnail
            const thumbnailPath = `uploads/thumbnails/${Date.now()}_thumbnail.png`;
            await new Promise((resolve, reject) => {
                ffmpeg(videoFile.path)
                    .on('end', resolve)
                    .on('error', reject)
                    .screenshots({
                        count: 1,
                        folder: path.dirname(thumbnailPath),
                        filename: path.basename(thumbnailPath),
                        size: '320x240',
                        timemarks: ['9']
                    });
            });

            const video = await VideoTip.create({
                title,
                description,
                video_url: videoFile.path,
                thumbnail_url: thumbnailPath,
                category_id,
                uploaded_by: req.user.id,
            });

            res.status(201).json({ message: 'Video uploaded and awaiting approval', video });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // ✅ Get all approved videos or filter by category
    async getApprovedVideos(req, res) {
        try {
            const whereClause = { is_approved: true };
            if (req.query.category) {
                whereClause['$VideoCategory.name$'] = req.query.category;
            }

            const videos = await VideoTip.findAll({
                where: whereClause,
                include: [VideoCategory, User],
            });

            res.json(videos);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // ✅ Approve a video (Admin)
    async approveVideo(req, res) {
        try {
            const video = await VideoTip.findByPk(req.params.id);
            if (!video) return res.status(404).json({ error: 'Video not found' });

            video.is_approved = true;
            await video.save();

            res.json({ message: 'Video approved', video });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // ✅ Create category (Admin)
    async createCategory(req, res) {
        try {
            const { name, description } = req.body;
            const category = await VideoCategory.create({ name, description });
            res.status(201).json(category);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // ✅ Get all categories
    async getCategories(req, res) {
        try {
            const categories = await VideoCategory.findAll({ where: { is_active: true } });
            res.json(categories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // User deletes their own video
    async deleteVideo(req, res) {
        try {
            const video = await VideoTip.findByPk(req.params.id);
            if (!video) return res.status(404).json({ error: 'Video not found' });

            // Only the uploader can delete
            if (video.uploaded_by !== req.user.id) {
                return res.status(403).json({ error: 'Not allowed' });
            }

            await video.destroy();
            res.json({ message: 'Video deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async rejectVideo(req, res) {
        try {
            const video = await VideoTip.findByPk(req.params.id);
            if (!video) return res.status(404).json({ error: 'Video not found' });

            await video.destroy(); // or add `is_rejected` flag if you want to track rejections
            res.json({ message: 'Video rejected and removed' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};

module.exports = videoController;
