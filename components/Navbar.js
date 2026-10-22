import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/products" className="hover:underline">Products</Link>
        <Link href="/cart" className="hover:underline">Cart</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
      </div>
      {session && (
        <button onClick={() => signOut()} className="hover:underline">
          Sign Out
        </button>
      )}
    </nav>
  );
}
