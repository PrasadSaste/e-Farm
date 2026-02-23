const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  dashboard, salesReport, cropReport,
  verifyFarmer, createAlert, createScheme, updateApplication,
} = require('../controllers/adminController');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard',                                dashboard);
router.get('/reports/sales',                            salesReport);
router.get('/reports/crops',                            cropReport);
router.put('/farmers/:id/verify',                       verifyFarmer);
router.post('/alerts',                                  createAlert);
router.post('/schemes',                                 createScheme);
router.put('/schemes/:id/applications/:appId',          updateApplication);

module.exports = router;
