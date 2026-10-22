// pages/api/check-session.js
import { getSession } from 'next-auth/react';


async function handler(req, res) {
  const session = await getSession({ req });
  console.log('Session in /api/check-session:', session);

  if (session) {
    res.status(200).json({ message: 'Session is valid', session });
  } else {
    res.status(401).json({ error: 'Unauthorized - No valid session found' });
  }
}

export default handler;