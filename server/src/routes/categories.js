import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/categories — Public
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories — Admin
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, slug, icon, description, sortOrder } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Cần có tên và slug' });

    const category = await prisma.category.create({
      data: { name, slug, icon: icon || '☕', description, sortOrder: sortOrder || 0 },
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/categories/:id — Admin
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, slug, icon, description, sortOrder } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (icon !== undefined) data.icon = icon;
    if (description !== undefined) data.description = description;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/categories/:id — Admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Đã xóa danh mục' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
