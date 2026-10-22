import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { CartContext } from '../contexts/CartContext';
import { useSession } from 'next-auth/react';

function CheckoutPage() {
  const { cart: cartItems, clearCart } = useContext(CartContext);
  const { data: session, status } = useSession();
  const [fullName, setFullName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch('/api/user', { // Replace '/api/user' with your actual API endpoint to fetch user data
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setFullName(userData.fullName || '');
            setShippingAddress(userData.address || '');
          } else {
            console.error('Failed to fetch user data');
            setErrorMessage('Failed to load your information. Please try again.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setErrorMessage('Error loading your information. Please try again.');
        }
      }
    };

    fetchUserData();
  }, [status, session]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!paymentMethod) {
      setErrorMessage('Please select a payment method.');
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    const orderData = {
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      fullName: fullName,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      userId: session?.user?.id || null,
    };

    console.log('Order Data:', orderData); // Log the order data
    // Replace this with your actual API call to create the order
    try {
      const response = await fetch('/api/orders', { // Replace '/api/orders' with your actual API endpoint for creating orders
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setProcessing(false);
        alert('Order placed successfully! Estimated delivery in 3-5 days.');
        clearCart();
        // Optionally redirect to an order confirmation page
      } else {
        const errorResult = await response.json();
        console.error('Failed to place order:', errorResult);
        setErrorMessage('Failed to place order. Please try again.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage('Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  if (status === 'loading') {
    return <div className="text-black">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-md text-black">
      <h1 className="text-2xl font-bold mb-4 text-black">Checkout</h1>

      {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{errorMessage}</div>}

      {cartItems.length === 0 ? (
        <p className="text-black">Your cart is empty. <Link href="/products" className="text-blue-500">Continue shopping</Link></p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-black">Order Summary</h2>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex items-center border-b py-2 text-black">
                <div className="w-1/4">
                  <img src={item.image} alt={item.name} width={130} height={130} className="mr-4" />
                  {item.name}
                </div>
                <div className="w-1/4 text-black">₱{item.price}</div>
                <div className="w-1/4 text-black">Qty: {item.quantity}</div>
                <div className="w-1/4 text-black">Subtotal: ₱{(item.price * item.quantity).toLocaleString()}</div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-black">
            <h2 className="text-xl font-semibold text-black">Total: ₱{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}</h2>
          </div>

          <div className="mt-6 text-black">
            <h2 className="text-xl font-semibold mb-3 text-black">Shipping Information</h2>
            <div className="mb-3 text-black">
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2 text-black">Full Name:</label>
              <input
                type="text"
                id="fullName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed text-black"
                value={fullName}
                readOnly
              />
            </div>
            <div className="mb-3 text-black">
              <label htmlFor="shippingAddress" className="block text-gray-700 text-sm font-bold mb-2 text-black">Shipping Address:</label>
              <textarea
                id="shippingAddress"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed text-black"
                value={shippingAddress}
                readOnly
                rows="3"
              />
            </div>
            <p className="text-gray-600 text-sm mb-3 text-black">Estimated Delivery: 3-5 business days</p>

            <h2 className="text-xl font-semibold mb-3 text-black">Payment Method</h2>
            <div className="mb-3 text-black">
              <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2 text-black">Select Payment Method:</label>
              <select
                id="paymentMethod"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-black"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required // Make payment method required
              >
                <option value="">-- Select --</option>
                <option value="credit_card" className="text-black">Credit Card</option>
                <option value="paypal" className="text-black">PayPal</option>
                <option value="cash_on_delivery" className="text-black">Cash on Delivery</option>
                {/* Add more payment methods as needed */}
              </select>
            </div>

            <button
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block ${processing ? 'opacity-50 cursor-not-allowed' : ''} text-black`}
              onClick={handleCheckout}
              disabled={processing || !paymentMethod} // Disable if processing or no payment method selected
            >
              {processing ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;