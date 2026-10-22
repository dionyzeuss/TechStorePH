import React, { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../../contexts/CartContext';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext); // ✅ Consume the context

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId); // ✅ Use the removeFromCart function from the context
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateQuantity(itemId, parseInt(newQuantity, 10)); // ✅ Use the updateQuantity function from the context
  };

  if (!cartItems) {
    return <div>Loading cart...</div>; // Or handle initial state differently
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link href="/products" className="text-blue-500">Continue shopping</Link></p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id} className="flex items-center border-b py-4">
              <div className="w-1/4">
                {/* You might want to display an image here */}
                {item.name}
              </div>
              <div className="w-1/4">₱{item.price}</div>
              <div className="w-1/4 flex items-center">
                <label htmlFor={`quantity-${item.id}`} className="mr-2">Qty:</label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  className="w-16 border rounded-md py-1 px-2"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                />
              </div>
              <div className="w-1/4">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Total: ₱{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</h2>
          <Link href="/checkout" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartPage;