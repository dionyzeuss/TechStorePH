import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = parseInt(session.user.id);
    const { productId, quantity = 1 } = req.body;
    const parsedProductId = parseInt(productId);

    if (isNaN(parsedProductId) || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    try {
        // Check if the product exists
        const product = await prisma.product.findUnique({ where: { id: parsedProductId } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the item is already in the user's cart
        const existingCartItem = await prisma.cart.findFirst({
            where: { userId, productId: parsedProductId },
        });

        let cartItem;
        if (existingCartItem) {
            // Update quantity if item exists
            cartItem = await prisma.cart.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity },
            });
        } else {
            // Add new item to cart
            cartItem = await prisma.cart.create({
                data: { userId, productId: parsedProductId, quantity },
            });
        }

        // Optionally return the updated cart for the user
        const updatedCart = await prisma.cart.findMany({
            where: { userId },
            include: { product: true },
        });

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
}