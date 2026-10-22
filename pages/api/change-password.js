// pages/api/change-password.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method Not Allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing old or new password" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(401).json({ message: "Invalid old password" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });
    return res.status(200).json({ message: "Password updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Failed to update password" });
  }
}