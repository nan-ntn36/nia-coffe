import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/stats/overview — Admin: dashboard overview
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalProducts, totalOrders, todayOrders, todayRevenue, totalRevenue, pendingOrders] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count({ where: { status: { in: ['confirmed', 'completed'] } } }),
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow }, status: { in: ['confirmed', 'completed'] } } }),
      prisma.order.aggregate({ where: { createdAt: { gte: today, lt: tomorrow }, status: { in: ['confirmed', 'completed'] } }, _sum: { totalPrice: true } }),
      prisma.order.aggregate({ where: { status: { in: ['confirmed', 'completed'] } }, _sum: { totalPrice: true } }),
      prisma.order.count({ where: { status: 'pending' } }),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      todayOrders,
      todayRevenue: todayRevenue._sum.totalPrice || 0,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      pendingOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/revenue?period=day|month|year&date=2026-04-12
router.get('/revenue', authMiddleware, async (req, res) => {
  try {
    const { period = 'month', date } = req.query;
    const now = date ? new Date(date) : new Date();

    let startDate, endDate, groupFormat;

    if (period === 'day') {
      // Revenue per hour for a specific day
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else if (period === 'month') {
      // Revenue per day for a specific month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else {
      // Revenue per month for a specific year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lt: endDate },
        status: { in: ['confirmed', 'completed'] },
      },
      select: { totalPrice: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by period
    const grouped = {};
    for (const order of orders) {
      let key;
      const d = order.createdAt;
      if (period === 'day') key = `${d.getHours()}:00`;
      else if (period === 'month') key = `${d.getDate()}/${d.getMonth() + 1}`;
      else key = `T${d.getMonth() + 1}`;

      grouped[key] = (grouped[key] || 0) + order.totalPrice;
    }

    const data = Object.entries(grouped).map(([label, revenue]) => ({ label, revenue }));
    const total = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({ period, startDate, endDate, total, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/top-products?limit=10
router.get('/top-products', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
      where: { order: { status: { in: ['confirmed', 'completed'] } } },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    // Enrich with product info
    const productIds = topProducts.map((t) => t.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, image: true, price: true, category: { select: { name: true } } },
    });

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    const result = topProducts.map((t) => ({
      product: productMap[t.productId],
      totalQuantity: t._sum.quantity,
      orderCount: t._count,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
