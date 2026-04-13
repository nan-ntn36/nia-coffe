import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// ─── Rate Limiter: chống spam đặt đơn ───
const orderRateLimit = new Map(); // IP -> { count, firstRequest }
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 phút
const RATE_LIMIT_MAX = 5; // Tối đa 5 đơn / 10 phút

function checkRateLimit(ip) {
  const now = Date.now();
  const record = orderRateLimit.get(ip);

  if (!record || now - record.firstRequest > RATE_LIMIT_WINDOW) {
    orderRateLimit.set(ip, { count: 1, firstRequest: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false; // Bị chặn
  }

  record.count++;
  return true;
}

// Dọn dẹp bộ nhớ rate limit mỗi 30 phút
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of orderRateLimit) {
    if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
      orderRateLimit.delete(ip);
    }
  }
}, 30 * 60 * 1000);

// ─── Auto-cleanup: hủy đơn pending quá 24h ───
async function cleanupStaleOrders() {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await prisma.order.updateMany({
      where: {
        status: 'pending',
        createdAt: { lt: cutoff },
      },
      data: { status: 'cancelled' },
    });
    if (result.count > 0) {
      console.log(`[Cleanup] Đã hủy ${result.count} đơn pending quá 24h`);
    }
  } catch (err) {
    console.error('[Cleanup] Lỗi:', err.message);
  }
}

// Chạy cleanup mỗi giờ
setInterval(cleanupStaleOrders, 60 * 60 * 1000);
// Chạy ngay khi khởi động
setTimeout(cleanupStaleOrders, 5000);

// POST /api/orders — Public: create order from checkout
router.post('/', async (req, res) => {
  try {
    // Rate limit check
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        error: 'Bạn đã đặt quá nhiều đơn. Vui lòng thử lại sau 10 phút.',
      });
    }

    const { items, totalPrice, customerNote, zaloPhone } = req.body;
    if (!items || !items.length || !totalPrice) {
      return res.status(400).json({ error: 'Đơn hàng không hợp lệ' });
    }

    // Validate: tối đa 20 sản phẩm, số lượng mỗi món <= 50
    if (items.length > 20) {
      return res.status(400).json({ error: 'Tối đa 20 sản phẩm mỗi đơn' });
    }
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity > 50 || item.quantity < 1) {
        return res.status(400).json({ error: 'Số lượng sản phẩm không hợp lệ (1-50)' });
      }
    }

    // Verify product IDs exist
    const productIds = items.map((i) => parseInt(i.productId));
    const existingProducts = await prisma.product.count({
      where: { id: { in: productIds }, isActive: true },
    });
    if (existingProducts !== productIds.length) {
      return res.status(400).json({ error: 'Một số sản phẩm không tồn tại hoặc đã ngừng bán' });
    }

    const order = await prisma.order.create({
      data: {
        totalPrice: parseInt(totalPrice),
        customerNote,
        zaloPhone,
        status: 'pending',
        items: {
          create: items.map((item) => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            unitPrice: parseInt(item.unitPrice),
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — Admin: list orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const where = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: { select: { id: true, name: true, image: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status — Admin: update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status phải là: ${validStatuses.join(', ')}` });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
