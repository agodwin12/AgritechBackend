const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// ✅ User uploads ebook (protected)
router.post('/ebooks', authenticate, ebookController.uploadEbook);

// ✅ Public access to list all approved ebooks
router.get('/ebooks', ebookController.listApprovedEbooks);

// ✅ Admin approves ebook
router.put('/ebooks/:id/approve', authenticate, authorizeAdmin, ebookController.approveEbook);

// ✅ Admin creates ebook category
router.post('/ebooks/categories', authenticate, authorizeAdmin, ebookController.createEbookCategory);

// ✅ Get all categories (public or authenticated)
router.get('/ebooks/categories', ebookController.getEbookCategories);

// ✅ User purchases an ebook
router.post('/ebooks/purchase', authenticate, ebookController.purchaseEbook);
router.put('/ebooks/:id', authenticate, ebookController.updateEbook);
router.delete('/ebooks/:id', authenticate, ebookController.deleteEbook);


module.exports = router; // <--- very important
