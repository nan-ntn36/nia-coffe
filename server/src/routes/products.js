import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/products — Public: list all active products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = { isActive: true };

    if (category) where.category = { slug: category };
    if (search) where.name = { contains: search };

    const products = await prisma.product.findMany({
      where,
      include: { category: { select: { id: true, name: true, slug: true, icon: true } } },
      orderBy: { id: 'asc' },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/all — Admin: list ALL products including inactive
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { id: 'asc' },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products — Admin: create product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, variant, badge, categoryId, isActive } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Cần có tên, giá và danh mục' });
    }

    const product = await prisma.product.create({
      data: { name, description, price: parseInt(price), image, variant, badge, categoryId: parseInt(categoryId), isActive: isActive ?? true },
      include: { category: true },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id — Admin: update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, variant, badge, categoryId, isActive } = req.body;
    const data = {};

    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseInt(price);
    if (image !== undefined) data.image = image;
    if (variant !== undefined) data.variant = variant;
    if (badge !== undefined) data.badge = badge;
    if (categoryId !== undefined) data.categoryId = parseInt(categoryId);
    if (isActive !== undefined) data.isActive = isActive;

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { category: true },
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id — Admin: delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
