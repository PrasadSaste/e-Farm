const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { getSchemes, checkEligibility, applyScheme, myApplications } = require('../controllers/adminController');

router.get('/',                    protect, getSchemes);
router.post('/:id/check',          protect, checkEligibility);
router.post('/:id/apply',          protect, applyScheme);
router.get('/my-applications',     protect, myApplications);

module.exports = router;
