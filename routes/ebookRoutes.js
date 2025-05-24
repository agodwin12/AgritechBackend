const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// === Multer Setup ===
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

const upload = multer({ storage });

// === Routes ===

// ✅ Upload ebook (requires authentication)
router.post(
    '/',
    authenticate,
    upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 },
    ]),
    ebookController.uploadEbook
);

// ✅ Get list of approved ebooks (public)
router.get('/', ebookController.listApprovedEbooks);

// ✅ Admin approves an ebook
router.put(
    '/ebooks/:id/approve',
    authenticate,
    authorizeAdmin,
    ebookController.approveEbook
);

// ✅ Admin creates a category
router.post(
    '/ebooks/categories',
    authenticate,
    authorizeAdmin,
    ebookController.createEbookCategory
);

// ✅ Get all ebook categories (public)
router.get('/categories', ebookController.getEbookCategories);

// ✅ User purchases an ebook
router.post('/ebooks/purchase', authenticate, ebookController.purchaseEbook);

// ✅ Update ebook (author only or admin, depending on logic)
router.put('/ebooks/:id', authenticate, ebookController.updateEbook);

// ✅ Delete ebook (author only or admin)
router.delete('/ebooks/:id', authenticate, ebookController.deleteEbook);

module.exports = router; // 🔁 Export the router
