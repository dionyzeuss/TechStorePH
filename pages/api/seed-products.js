// pages/api/seed-products.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const productsToSeed = req.body;

      for (const productData of productsToSeed) {
        const existingProduct = await prisma.product.findUnique({
          where: { id: productData.id },
        });

        if (!existingProduct) {
          await prisma.product.create({
            data: {
              id: productData.id,
              name: productData.name,
              price: productData.price,
              image: productData.image,
              // Add other fields if necessary, e.g., description
            },
          });
        } else {
          console.log(`Product with ID ${productData.id} already exists.`);
        }
      }

      res.status(200).json({ message: 'Products seeded successfully!' });
    } catch (error) {
      console.error('Error seeding products:', error);
      res.status(500).json({ error: 'Failed to seed products' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}