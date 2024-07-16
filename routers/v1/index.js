import express from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import adminRoutes from './admin.js';
import publicRoutes from './public.js';

const router = express.Router();
const __dirname = path.resolve();
const docUrl = path.join(__dirname, 'routers/v1/sosialvibe.json');
const doc = JSON.parse(fs.readFileSync(docUrl, 'utf-8'));

router.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
router.use('/auth', publicRoutes);
router.use('/api', adminRoutes);

export default router