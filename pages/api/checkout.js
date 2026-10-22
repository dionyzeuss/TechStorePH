// pages/api/checkout.js
export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  
    const { cartItems, paymentMethod, deliveryAddress, phoneNumber } = req.body;
  
    if (!cartItems || !paymentMethod || !deliveryAddress || !phoneNumber) {
      return res.status(400).json({ message: "Missing order details" });
    }
  
    // Simulate saving order
    console.log("ORDER RECEIVED:", {
      cartItems,
      paymentMethod,
      deliveryAddress,
      phoneNumber,
    });
  
    // You can replace this with Prisma order creation later
    res.status(200).json({ message: "Order placed successfully" });
  }
  