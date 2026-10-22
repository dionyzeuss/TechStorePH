// pages/_app.js
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import { CartProvider } from '../contexts/CartContext'; // Assuming you're using this as well

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}> {/* Wrap your app with SessionProvider */}
      <CartProvider> {/* Keep other providers inside */}
        <Component {...pageProps} />
      </CartProvider>
    </SessionProvider>
  );
}

export default MyApp;