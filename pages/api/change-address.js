// pages/api/change-address.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method Not Allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { newAddress } = req.body;
  if (!newAddress) {
    return res.status(400).json({ message: "Missing address" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { address: newAddress },
    });
    return res.status(200).json({ message: "Address updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Failed to update address" });
  }
}