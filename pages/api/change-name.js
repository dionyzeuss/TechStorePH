// pages/api/change-name.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { newFullName } = req.body;
  if (!newFullName) {
    return res.status(400).json({ message: "Missing full name" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { fullName: newFullName },
    });
    return res.status(200).json({ message: "Full name updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating full name:", error);
    return res.status(500).json({ message: "Failed to update full name" });
  }
}