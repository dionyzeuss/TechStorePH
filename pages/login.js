// pages/login.js
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import the Link component

export default function Login() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await signIn('credentials', {
      redirect: false, // Prevent automatic redirect by signIn
      email,
      password,
      callbackUrl: '/dashboard', // The URL to redirect to after successful login
    });

    if (result?.error) {
      setError(<p className="text-red-700">{result.error}</p>);
    } else {
      // Redirect manually after successful sign in
      router.push(result.url || '/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Login</h1>
        {error && <div className="mb-4">{error}</div>}
        <input type="email" name="email" placeholder="Email" required className="mb-4 w-full px-3 py-2 border rounded text-gray-700" />
        <input type="password" name="password" placeholder="Password" required className="mb-6 w-full px-3 py-2 border rounded text-gray-700" />
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded">Login</button>

        {/* "Don't have an account?" link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}