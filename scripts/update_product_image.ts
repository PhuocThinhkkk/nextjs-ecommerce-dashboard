import db from '@/lib/db';

function randomProductImage() {
  const topics = [
    'product',
    'electronics',
    'laptop',
    'smartphone',
    'shoes',
    'watch',
    'fashion',
    'headphones',
    'camera'
  ];

  const topic = topics[Math.floor(Math.random() * topics.length)];
  return `https://loremflickr.com/600/600/${topic}?random=${Date.now()}`;
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ DO NOT run this script in production!');
  }

  const products = await db.product.findMany({
    select: {
      id: true,
      name: true
    }
  });
  console.log('Product need to update: ', products);

  if (products.length === 0) {
    console.log('❌ No products found.');
    return;
  }

  for (let i = 0; i < products.length; i++) {
    await db.product.update({
      where: { id: products[i].id },
      data: {
        photo_url: randomProductImage()
      }
    });
  }

  console.log(`✅ Updated ${products.length} products with realistic images`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
