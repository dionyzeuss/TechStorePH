import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = parseInt(session.user.id);
    const { productId, quantity } = req.body;
    const parsedProductId = parseInt(productId);
    const parsedQuantity = parseInt(quantity);

    if (isNaN(parsedProductId) || isNaN(parsedQuantity) || parsedQuantity < 1) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    try {
        const cartItem = await prisma.cart.updateMany({
            where: { userId, productId: parsedProductId },
            data: { quantity: parsedQuantity },
        });

        if (cartItem.count === 0) {
            return res.status(404).json({ message: 'Cart item not found for user' });
        }

        // Optionally return the updated cart for the user
        const updatedCart = await prisma.cart.findMany({
            where: { userId },
            include: { product: true },
        });

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Failed to update cart item' });
    }
}