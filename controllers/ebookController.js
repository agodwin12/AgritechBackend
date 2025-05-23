const { Ebook, EbookCategory, EbookOrder, User } = require('../models');

const ebookController = {
    // Create Ebook
    async uploadEbook(req, res) {
        try {
            const { title, description, price, category_id } = req.body;
            const file_url = req.file?.path || req.body.file_url; // From multer or frontend
            const cover_image = req.body.cover_image || null;

            const ebook = await Ebook.create({
                title,
                description,
                price,
                file_url,
                cover_image,
                author_id: req.user.id,
                category_id,
                is_approved: false,
            });

            res.status(201).json({ message: 'Ebook submitted for review.', ebook });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // List all approved ebooks
    async listApprovedEbooks(req, res) {
        try {
            const ebooks = await Ebook.findAll({
                where: { is_approved: true },
                include: [EbookCategory, User]
            });
            res.json(ebooks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Admin: Approve Ebook
    async approveEbook(req, res) {
        try {
            const { id } = req.params;
            const ebook = await Ebook.findByPk(id);
            if (!ebook) return res.status(404).json({ error: 'Ebook not found' });

            ebook.is_approved = true;
            await ebook.save();

            res.json({ message: 'Ebook approved.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Admin: Create Category
    async createEbookCategory(req, res) {
        try {
            const { name, description } = req.body;
            const category = await EbookCategory.create({ name, description });
            res.status(201).json(category);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all categories
    async getEbookCategories(req, res) {
        try {
            const categories = await EbookCategory.findAll({ where: { is_active: true } });
            res.json(categories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Purchase Ebook
    async purchaseEbook(req, res) {
        try {
            const { ebook_id } = req.body;
            const ebook = await Ebook.findByPk(ebook_id);
            if (!ebook || !ebook.is_approved) return res.status(400).json({ error: 'Ebook not available' });

            const existing = await EbookOrder.findOne({
                where: { user_id: req.user.id, ebook_id }
            });

            if (existing) return res.status(409).json({ error: 'Already purchased' });

            const order = await EbookOrder.create({
                user_id: req.user.id,
                ebook_id,
                price_paid: ebook.price
            });

            res.status(201).json({ message: 'Purchase successful', order });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


    async updateEbook(req, res) {
        try {
            const { id } = req.params;
            const ebook = await Ebook.findByPk(id);
            if (!ebook || ebook.author_id !== req.user.id)
                return res.status(403).json({ error: 'Not allowed' });

            await ebook.update(req.body);
            res.json({ message: 'Ebook updated', ebook });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async deleteEbook(req, res) {
        try {
            const { id } = req.params;
            const ebook = await Ebook.findByPk(id);
            if (!ebook || ebook.author_id !== req.user.id)
                return res.status(403).json({ error: 'Not allowed' });

            await ebook.destroy();
            res.json({ message: 'Ebook deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async listApprovedEbooks(req, res) {
        try {
            const approved = req.query.approved;

            const whereClause = {};
            if (approved === 'false') {
                whereClause.is_approved = false;
            } else {
                whereClause.is_approved = true;
            }

            const ebooks = await Ebook.findAll({
                where: whereClause,
                include: [EbookCategory, User],
            });

            res.json(ebooks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


};



module.exports = ebookController;
