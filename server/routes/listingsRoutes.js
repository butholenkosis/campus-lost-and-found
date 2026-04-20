const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/listingsController');

router.get('/', ctrl.getAllListings);
router.post('/', upload.single('image'), ctrl.createListing);
router.get('/:id', ctrl.getListingById);
router.delete('/:id', ctrl.deleteListing);

module.exports = router;