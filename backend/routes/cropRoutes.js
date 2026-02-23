const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { getAll, create, getOne, update, remove, getAdvisory } = require('../controllers/cropController');

router.get('/',               protect, getAll);
router.post('/',              protect, create);
router.get('/:id',            protect, getOne);
router.put('/:id',            protect, update);
router.delete('/:id',         protect, remove);
router.get('/:id/advisory',   protect, getAdvisory);

module.exports = router;
