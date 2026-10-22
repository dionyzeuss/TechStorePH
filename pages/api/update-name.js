import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'; // Assuming your jsconfig.json is correct

export default async function handler(req, res) {
  if (req.method === 'PUT') { // Changed to PUT
    const session = await getSession({ req });
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { newFullName } = req.body; // Assuming your frontend sends 'newFullName'
    const userId = session.user.id; // Using session's user ID

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { fullName: newFullName },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating name:', error);
      return res.status(500).json({ error: 'Failed to update name' });
    }
  } else {
    res.setHeader('Allow', ['PUT']); // Changed to PUT
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}