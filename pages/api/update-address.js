import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma'; // Ensure this path is correct

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function(cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log('Session in /api/update-address:', session);

  const cookies = parseCookies(req);
  console.log('Parsed Cookies in /api/update-address:', cookies);

  if (req.method === 'PUT') { // Changed to PUT
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { newAddress } = req.body; // Assuming your frontend sends 'newAddress'
    const userId = session.user.id; // Using session's user ID

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { address: newAddress },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating address:', error);
      return res.status(500).json({ error: 'Failed to update address' });
    }
  } else {
    res.setHeader('Allow', ['PUT']); // Changed to PUT
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}