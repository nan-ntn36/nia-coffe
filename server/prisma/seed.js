import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ═══ Admin ═══
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', passwordHash },
  });
  console.log('✅ Admin created (admin / admin123)');

  // ═══ Categories ═══
  const cats = [
    { name: 'Cà Phê', slug: 'coffee', icon: '☕', description: 'Hương vị cà phê Việt Nam đậm đà', sortOrder: 1 },
    { name: 'Matcha', slug: 'matcha', icon: '🍵', description: 'Matcha Nhật Bản thượng hạng', sortOrder: 2 },
    { name: 'Cacao', slug: 'cacao', icon: '🍫', description: 'Cacao nguyên chất béo ngậy', sortOrder: 3 },
    { name: 'Trà', slug: 'tea', icon: '🍋', description: 'Trà trái cây tươi mát', sortOrder: 4 },
  ];

  for (const cat of cats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // ═══ Products ═══
  const categories = await prisma.category.findMany();
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const products = [
    // Cà Phê
    { name: 'Cà Phê Đen', variant: 'Đá / Nóng', description: 'Cà phê phin truyền thống, đậm đà hương vị Robusta Việt Nam', price: 25000, categoryId: catMap.coffee, image: '/images/ca-phe-den.webp', badge: 'Classic' },
    { name: 'Cà Phê Sữa', variant: 'Đá / Nóng', description: 'Cà phê phin pha sữa đặc, vị đậm ngọt truyền thống Sài Gòn', price: 29000, categoryId: catMap.coffee, image: '/images/ca-phe-sua.webp', badge: 'Bán chạy' },
    { name: 'Cà Phê Sữa Gấu', description: 'Cà phê kết hợp sữa gấu béo ngậy, vị mượt mà khác biệt', price: 35000, categoryId: catMap.coffee, image: '/images/ca-phe-sua-gau.webp' },
    { name: 'Cà Phê Muối', description: 'Cà phê phủ kem muối - vị mặn ngọt hài hòa, trend không thể bỏ lỡ', price: 35000, categoryId: catMap.coffee, image: '/images/ca-phe-muoi.webp', badge: 'Hot' },
    { name: 'Cà Phê Sữa Tươi', description: 'Cà phê pha sữa tươi thanh mát, ít ngọt hơn sữa đặc', price: 35000, categoryId: catMap.coffee, image: '/images/ca-phe-sua-tuoi.webp' },
    { name: 'Cà Phê Latte', description: 'Espresso kết hợp sữa tươi đánh bông mềm mại, latte art tinh tế', price: 45000, categoryId: catMap.coffee, image: '/images/ca-phe-latte.webp' },
    { name: 'Bạc Xỉu', description: 'Nhiều sữa ít cà phê, vị ngọt dịu phù hợp cho mọi người', price: 29000, categoryId: catMap.coffee, image: '/images/bac-xiu.webp', badge: 'Bán chạy' },
    { name: 'Cà Phê Einspanner', description: 'Espresso phủ lớp kem whipped dày, phong cách Vienna sang trọng', price: 55000, categoryId: catMap.coffee, image: '/images/ca-phe-einspanner.webp', badge: 'Premium' },
    { name: 'Cà Phê Matcha Latte', description: 'Sự kết hợp độc đáo giữa espresso Việt Nam và matcha Nhật Bản', price: 49000, categoryId: catMap.coffee, image: '/images/ca-phe-matcha-latte.webp', badge: 'Mới' },
    // Matcha
    { name: 'Matcha Latte', variant: 'Đá / Nóng', description: 'Matcha Nhật Bản nguyên chất pha sữa tươi, đậm vị trà xanh', price: 45000, categoryId: catMap.matcha, image: '/images/matcha-latte.webp', badge: 'Bán chạy' },
    { name: 'Matcha Kem Muối', description: 'Matcha latte phủ lớp kem muối béo ngậy, vị mặn ngọt tinh tế', price: 49000, categoryId: catMap.matcha, image: '/images/matcha-kem-muoi.webp', badge: 'Hot' },
    { name: 'Matcha Sữa Gấu', description: 'Matcha kết hợp sữa gấu, vị béo mượt đặc trưng khó quên', price: 45000, categoryId: catMap.matcha, image: '/images/matcha-sua-gau.webp' },
    { name: 'Matcha Cold Whisk', description: 'Matcha đánh lạnh truyền thống Nhật Bản, vị thanh khiết mát lạnh', price: 55000, categoryId: catMap.matcha, image: '/images/matcha-cold-whisk.webp', badge: 'Premium' },
    // Cacao
    { name: 'Cacao Latte', variant: 'Đá / Nóng', description: 'Cacao nguyên chất pha sữa tươi, vị chocolate đậm đà ấm áp', price: 39000, categoryId: catMap.cacao, image: '/images/cacao-latte.webp' },
    { name: 'Cacao Kem Muối', description: 'Cacao latte phủ kem muối, vị ngọt mặn hòa quyện tuyệt hảo', price: 45000, categoryId: catMap.cacao, image: '/images/cacao-kem-muoi.webp' },
    { name: 'Cacao Sữa Gấu', description: 'Cacao kết hợp sữa gấu, béo ngậy sánh mịn như velvet', price: 39000, categoryId: catMap.cacao, image: '/images/cacao-sua-gau.webp' },
    { name: 'Cacao Cold Whisk', description: 'Cacao đánh lạnh kiểu mới, đậm vị và mát lạnh sảng khoái', price: 49000, categoryId: catMap.cacao, image: '/images/cacao-cold-whisk.webp' },
    { name: 'Cacao Latte Matcha', description: 'Hai tầng hương vị cacao và matcha, sự kết hợp bất ngờ', price: 49000, categoryId: catMap.cacao, image: '/images/cacao-latte-matcha.webp', badge: 'Mới' },
    // Trà
    { name: 'Trà Tắc', description: 'Trà pha tắc (quất) tươi, vị chua ngọt thanh mát giải khát', price: 25000, categoryId: catMap.tea, image: '/images/tra-tac.webp' },
    { name: 'Trà Chanh', description: 'Trà pha chanh tươi truyền thống, thơm mát sảng khoái tức thì', price: 25000, categoryId: catMap.tea, image: '/images/tra-chanh.webp' },
  ];

  // Clear existing products then re-create
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`✅ ${products.length} products seeded`);

  // ═══ Shop Settings ═══
  const settings = [
    { key: 'shop_name', value: 'Nia Coffee' },
    { key: 'address', value: '53 Phạm Huy Thông, Gò Vấp, TP. Hồ Chí Minh' },
    { key: 'open_hours', value: '5:00 — 10:00' },
    { key: 'zalo_phone_1', value: '0385637299' },
    { key: 'zalo_phone_2', value: '0376598497' },
    { key: 'logo', value: '/images/logo.png' },
    { key: 'hero_bg', value: '/images/hero-bg.webp' },
    { key: 'qr_image_1', value: '/images/qr.jpg' },
    { key: 'qr_image_2', value: '/images/qr2.jpg' },
    { key: 'hero_title', value: 'Hương vị Cà Phê Việt Nam' },
    { key: 'hero_subtitle', value: 'Thưởng thức khoảnh khắc bình yên bên ly cà phê đậm đà, được chọn lọc từ những hạt cà phê tốt nhất.' },
    { key: 'footer_desc', value: 'Hương vị cà phê Việt Nam trong từng giọt. Chúng tôi mang đến trải nghiệm hoàn hảo cho bạn.' },
  ];

  for (const s of settings) {
    await prisma.shopSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ Shop settings seeded');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
