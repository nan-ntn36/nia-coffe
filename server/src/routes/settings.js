import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/settings — Public: get all settings as key-value object
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.shopSetting.findMany();
    const result = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings/list — Admin: get all settings as array
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const settings = await prisma.shopSetting.findMany({ orderBy: { key: 'asc' } });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings/:key — Admin: update a setting
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ error: 'Cần có value' });

    const setting = await prisma.shopSetting.upsert({
      where: { key: req.params.key },
      update: { value },
      create: { key: req.params.key, value },
    });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings — Admin: bulk update settings
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updates = req.body; // { key1: value1, key2: value2 }
    const results = [];

    for (const [key, value] of Object.entries(updates)) {
      const setting = await prisma.shopSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
      results.push(setting);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
