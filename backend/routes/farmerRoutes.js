const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAll, getOne, update, remove, verify } = require('../controllers/farmerController');

router.get('/',              protect, getAll);
router.get('/:id',           protect, getOne);
router.put('/:id',           protect, update);
router.delete('/:id',        protect, authorize('admin'), remove);
router.put('/:id/verify',    protect, authorize('admin'), verify);

module.exports = router;
