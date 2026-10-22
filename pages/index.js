// pages/index.js

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession

// Sample item data (replace with your actual data)
const carouselItems = [
  { id: 1, name: 'Laptop Model A', image: '/laptop1.jpg', description: 'High-performance laptop for all your needs.' },
  { id: 2, name: 'Accessory B', image: '/accessory1.jpg', description: 'Essential PC accessory to enhance your setup.' },
  { id: 3, name: 'Razer Mouse', image: '/razermouse.jpg', description: 'Portable and powerful tablet for on-the-go productivity.' },
  // Add more items as needed
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: session } = useSession(); // Get the session data

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000); // Change item every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [carouselItems.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-16 px-8 sm:px-24 overflow-y-auto">
      <header className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold text-blue-400">TechStorePH</h1>
      </header>
      <header className="absolute top-8 right-8">
        <nav>
          <ul className="flex space-x-8">
            {session ? (
              // If the user is logged in, show Dashboard
              <li>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-blue-400 font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Dashboard
                </Link>
              </li>
            ) : (
              // If the user is not logged in, show Login and Register
              <>
                <li>
                  <Link
                    href="/login"
                    className="text-white hover:text-blue-400 font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-white hover:text-blue-400 font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight text-center mb-6">
          Great deals happening <br />
          <span className="text-blue-400">Right Now!</span>
        </h1>
        <p className="text-lg text-gray-300 text-center mb-4">
          Enjoy a safe, convenient shopping experience
        </p>
        <p className="text-gray-300 text-center mb-8">
          Shop stress-free from home. We're ready to help, online or by phone.
        </p>
        <Link
          href="/products"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
        >
          Explore Now →
        </Link>
      </main>

      {/* Carousel Section - Increased max-width and padding */}
      <section className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-md p-10"> {/* Increased max-width and padding */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Featured Items</h2> {/* Increased margin */}
        <div className="relative">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute top-0 left-0 w-full transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-96 object-contain rounded-md" // Increased height and using object-contain
              />
              <div className="mt-6 text-center"> {/* Increased margin */}
                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                <p className="text-gray-400 text-lg">{item.description}</p> {/* Slightly larger description */}
                <Link
                  href={`/products/${item.id}`} // Example product link
                  className="inline-block mt-4 text-blue-400 hover:underline text-lg" // Increased margin and text size
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
          {carouselItems.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 focus:outline-none z-10" // Adjusted left and padding
              >
                ←
              </button>
              <button
                onClick={goToNext}
                className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 focus:outline-none z-10" // Adjusted right and padding
              >
                →
              </button>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10"> {/* Adjusted bottom and spacing */}
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    className={`w-4 h-4 rounded-full ${
                      index === currentIndex ? 'bg-blue-400' : 'bg-gray-500'
                    } focus:outline-none`} // Slightly larger dots
                    onClick={() => setCurrentIndex(index)}
                  ></button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Add more content below the carousel as needed */}
      <footer className="mt-16 text-center text-gray-500 w-full">
        <p className="text-sm">© 2025 TechStorePH. All rights reserved.</p>
      </footer>
    </div>
  );
}