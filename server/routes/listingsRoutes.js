const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/listingsController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', ctrl.getAllListings);
router.post('/', verifyToken, upload.single('image'), ctrl.createListing); // logged-in users can report
router.get('/:id', ctrl.getListingById);

// Admin-only: delete a listing
router.delete('/:id', verifyToken, requireAdmin, ctrl.deleteListing);

module.exports = router;
