import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma'; // Ensure this path is correct
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'PUT') { // Changed to PUT
    const session = await getSession({ req });
    console.log('Session in /api/update-password:', session);

    if (!session?.user?.id) {
      console.log('Unauthorized access attempt to /api/update-password');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { oldPassword, newPassword } = req.body; // Assuming your frontend sends these
    const userId = session.user.id; // Using session's user ID
    console.log('Request Body in /api/update-password:', { oldPassword: '******', newPassword: '******' }); // Mask passwords

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      console.log('User found in /api/update-password:', user ? user.email : 'User not found');

      if (!user) {
        return res.status(400).json({ error: 'Invalid old password' });
      }

      const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
      console.log('Old password correct:', isOldPasswordCorrect);

      if (!isOldPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid old password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log('New password hashed');

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { password: hashedPassword },
      });
      console.log('Updated User in /api/update-password:', updatedUser);
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password in /api/update-password:', error);
      return res.status(500).json({ error: 'Failed to update password', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']); // Changed to PUT
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}