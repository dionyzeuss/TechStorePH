// pages/dashboard.js

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { FaUserCircle, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import { CartContext } from '../contexts/CartContext'; // Import CartContext

// Mock data for best sellers - replace with your actual data fetching
const bestSellersData = [
  {
    id: 1,
    name: 'LENOVO IdeaPad 3 15IAH8 Slim 3...',
    image: '/lenovo.jpg', // Adjusted path: directly in public
    price: 22995,
    link: '/products/lenovo-ideapad',
    description: 'Powerful and slim laptop for everyday tasks and more.',
  },
  {
    id: 2,
    name: 'VENTION USB-C TO HDMI 5-IN-1 (TGESB)',
    image: '/adapter.jpg', // Adjusted path: directly in public
    price: 900,
    link: '/products/vention-adapter',
    description: 'Versatile adapter for connecting various devices.',
  },
  {
    id: 3,
    name: 'TEAMGROUP 512GB MP33 M.2 PCIe NVMe Solid State Drive',
    image: '/ssd.jpg', // Adjusted path: directly in public
    price: 1950,
    link: '/products/teamgroup-ssd',
    description: 'High-speed NVMe SSD for faster performance.',
  },
  {
    id: 4,
    name: 'DELL Inspiron 5430 C5 All-in-One Desktop...',
    image: '/dell-aio.jpg', // Adjusted path: directly in public
    price: 49465,
    link: '/products/dell-inspiron-aio',
    description: 'Sleek and powerful all-in-one desktop for home and office.',
  },
  {
    id: 5,
    name: 'PCX LFH VIRTUOSO (G512400) Intel® Core™ i5 Desktop...',
    image: '/pc-desktop.jpg', // Adjusted path: directly in public
    price: 17995,
    link: '/products/pcx-virtuoso',
    description: 'Reliable Intel Core i5 desktop for gaming and productivity.',
  },
  {
    id: 6,
    name: 'AOC 27" 27G11E 180Hz IPS Gaming Monitor',
    image: '/monitor.jpg', // Adjusted path: directly in public
    price: 9600,
    link: '/products/aoc-monitor',
    description: 'High refresh rate gaming monitor with vibrant IPS display.',
  },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const aboutSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const accountRef = useRef(null);
  const bestSellersRef = useRef(null);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedBestSeller, setSelectedBestSeller] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [loadingId, setLoadingId] = useState(null); // For add to cart loading
  const { addItem, cart } = useContext(CartContext); // Get addItem function and cart

  useEffect(() => {
    if (status === 'authenticated') {
      // Replace the current history state with the homepage URL
      window.history.replaceState(null, '', '/');
      // Then, push the dashboard URL, so the back button goes to the replaced state
      router.push('/dashboard', undefined, { shallow: true });
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const scrollLeft = () => {
    if (bestSellersRef.current) {
      bestSellersRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setScrollPosition(bestSellersRef.current.scrollLeft - 300);
    }
  };

  const scrollRight = () => {
    if (bestSellersRef.current) {
      bestSellersRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setScrollPosition(bestSellersRef.current.scrollLeft + 300);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (bestSellersRef.current) {
        setScrollPosition(bestSellersRef.current.scrollLeft);
      }
    };

    if (bestSellersRef.current) {
      bestSellersRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (bestSellersRef.current) {
        bestSellersRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const openBestSellerModal = (product) => {
    setSelectedBestSeller(product);
    setQuantityToAdd(1); // Reset quantity when opening modal
  };

  const closeBestSellerModal = () => {
    setSelectedBestSeller(null);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantityToAdd(isNaN(value) || value < 1 ? 1 : value);
  };

  const handleAddToCartBestSeller = () => {
    if (selectedBestSeller) {
      setLoadingId(selectedBestSeller.id);
      addItem({ ...selectedBestSeller, quantity: quantityToAdd });
      setTimeout(() => {
        alert(`${selectedBestSeller.name} added to cart`);
        setLoadingId(null);
        closeBestSellerModal();
      }, 500);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen overflow-y-auto relative">
      {/* Top Announcement Bar */}
      <div className="bg-red-600 text-white py-2 px-4 flex justify-between items-center">
        <p className="text-sm">Don't miss out - Get up to 12% OFF on selected laptops today!</p>
        <button className="text-sm hover:underline">x Close</button>
      </div>

      {/* Header with Logo and Main Navigation */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">
          TechStorePH
        </Link>
        <nav className="flex items-center justify-center"> {/* Center the navigation items */}
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-700 hover:text-blue-600">
                Products
              </Link>
            </li>
            <li>
              <button onClick={scrollToAbout} className="text-gray-700 hover:text-blue-600">
                About
              </button>
            </li>
            <li>
              <button onClick={scrollToContact} className="text-gray-700 hover:text-blue-600">
                Contact
              </button>
            </li>
            <li
              ref={accountRef}
              onMouseEnter={() => setIsAccountHovered(true)}
              onMouseLeave={() => setIsAccountHovered(false)}
              className="relative"
            >
              <Link href="/account"> {/* Wrap the button with Link */}
                <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
                  <FaUserCircle className="inline-block mr-1 align-middle" size={20} />
                  <span className="hidden sm:inline">Account</span>
                </span>
              </Link>
              {isAccountHovered && session?.user && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-md rounded-md p-4 z-10 w-48">
                  <p className="text-gray-700 mb-2 text-center">Hi, {session.user.name || session.user.email}</p>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm focus:outline-none w-full cursor-pointer"
                  >
                    Signout
                  </button>
                </div>
              )}
            </li>
            <li>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600">
                <FaShoppingCart className="inline-block mr-1 align-middle" size={20} />
                <span className="hidden sm:inline">Cart</span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 py-16 px-6">
        <div className="max-w-screen-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Welcome to TechStorePH!
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Discover the best deals on PC components and accessories. Your ultimate tech destination.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-screen-xl mx-auto py-8 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Best Sellers</h2>
        <div className="relative">
          <div
            ref={bestSellersRef}
            className="overflow-x-auto scroll-smooth flex space-x-4 -ml-2"
          >
            {bestSellersData.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg p-4 w-72 flex-shrink-0 ml-2 cursor-pointer"
                onClick={() => openBestSellerModal(product)}
              >
                <div>
                  <div className="relative w-full h-40 overflow-hidden rounded-md mb-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h3 className="text-md font-semibold text-gray-700 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm">₱{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Arrows */}
          <button
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-90 text-gray-600 rounded-full shadow-md p-2 -ml-4 cursor-pointer z-10 ${
              scrollPosition > 0 ? '' : 'opacity-50 pointer-events-none'
            }`}
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-90 text-gray-600 rounded-full shadow-md p-2 -mr-4 cursor-pointer z-10 ${
              bestSellersRef.current?.scrollWidth > bestSellersRef.current?.clientWidth + scrollPosition
                ? ''
                : 'opacity-50 pointer-events-none'
            }`}
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Best Seller Modal */}
      {selectedBestSeller && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedBestSeller.name}</h2>
            <div className="relative w-full h-60 overflow-hidden rounded-md mb-4">
              <Image
                src={selectedBestSeller.image}
                alt={selectedBestSeller.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-gray-700 mb-4">{selectedBestSeller.description}</p>
            <p className="text-lg font-semibold mb-2 text-gray-800">Price: ₱{selectedBestSeller.price.toLocaleString()}</p>
            <div className="flex items-center mb-4">
              <label htmlFor="quantity-bestseller" className="mr-2 text-gray-700">Quantity:</label>
              <input
                type="number"
                id="quantity-bestseller"
                className="w-20 border rounded-md py-2 px-3 text-gray-700"
                value={quantityToAdd}
                min="1"
                onChange={handleQuantityChange}
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded mr-2" onClick={closeBestSellerModal}>
                Close
              </button>
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  loadingId === selectedBestSeller.id ? 'cursor-not-allowed opacity-50' : ''
                }`}
                onClick={handleAddToCartBestSeller}
                disabled={loadingId === selectedBestSeller.id}
              >
                {loadingId === selectedBestSeller.id ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-screen-md mx-auto p-6 mt-8 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Products</h2>
        <p className="text-gray-700">Check out our wide range of high-quality PC components and accessories!</p>
        <Link
          href="/products"
          className="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          View All Products
        </Link>
      </div>

      {/* About Section */}
      <section ref={aboutSectionRef} className="max-w-screen-md mx-auto p-6 mt-8 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About Us</h2>
        <p className="text-gray-700">
          We are a team of tech enthusiasts passionate about providing the best products and services for PC enthusiasts. TechStorePH offers the latest and most reliable PC components, all available at competitive prices.
        </p>
      </section>

      {/* Contact Section */}
      <section ref={contactSectionRef} className="max-w-screen-md mx-auto p-6 mt-8 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-700">
          Got questions? Feel free to reach out to us through our contact page. We’d love to hear from you!
        </p>
      </section>
    </div>
  );
} 