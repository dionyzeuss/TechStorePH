// pages/products.js

import { useContext, useState, useEffect } from 'react'; // Import useEffect
import { CartContext } from '../contexts/CartContext';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';

// Your hardcoded product data
const products = [
  { id: 1, name: 'Ergonomic Keyboard', price: 75, image: '/keyboard_ergonomic.jpg', category: 'Keyboards', description: 'Designed for comfortable typing and reduced strain.' },
  { id: 2, name: 'Wireless Mouse', price: 35, image: '/mouse_wireless.jpg', category: 'Mice', description: 'Cordless freedom with precise tracking.' },
  { id: 3, name: '27-inch 4K Monitor', price: 350, image: '/monitor_4k.jpg', category: 'Monitors', description: 'Stunning visuals with high resolution.' },
  { id: 4, name: 'Noise-Cancelling Headphones', price: 120, image: '/headphones_nc.jpg', category: 'Headphones', description: 'Immerse yourself in pure sound.' },
  { id: 5, name: 'Mechanical Keyboard', price: 99, image: '/keyboard_mechanical.jpg', category: 'Keyboards', description: 'Tactile feedback for a satisfying typing experience.' },
  { id: 6, name: 'Gaming Mouse', price: 55, image: '/mouse_gaming.jpg', category: 'Mice', description: 'High DPI and customizable buttons for gaming.' },
  { id: 7, name: 'Ultrawide Monitor', price: 450, image: '/monitor_ultrawide.jpg', category: 'Monitors', description: 'Expansive screen for multitasking and immersive viewing.' },
  { id: 8, name: 'Bluetooth Earbuds', price: 60, image: '/earbuds_bluetooth.jpg', category: 'Headphones', description: 'Compact and wireless for on-the-go listening.' },
  { id: 9, name: 'Webcam 1080p', price: 40, image: '/webcam_1080p.jpg', category: 'Webcams', description: 'Clear video for calls and streaming.' },
  { id: 10, name: 'Desk Lamp', price: 25, image: '/lamp_desk.jpg', category: 'Accessories', description: 'Adjustable lighting for your workspace.' },
  { id: 11, name: 'Laptop Stand', price: 30, image: '/stand_laptop.jpg', category: 'Accessories', description: 'Elevates your laptop for better ergonomics.' },
  { id: 12, name: 'USB Hub', price: 20, image: '/hub_usb.jpg', category: 'Accessories', description: 'Expand your device connectivity.' },
  { id: 13, name: 'Tablet', price: 300, image: '/tablet.jpg', category: 'Tablets', description: 'Versatile device for work and entertainment.' },
  { id: 14, name: 'Smart Speaker', price: 80, image: '/speaker_smart.jpg', category: 'Speakers', description: 'Voice-controlled smart assistant.' },
  { id: 15, name: 'External SSD 1TB', price: 150, image: '/ssd_external.jpg', category: 'Storage', description: 'High-speed external storage solution.' },
  { id: 16, name: 'Drawing Tablet', price: 200, image: '/tablet_drawing.jpg', category: 'Tablets', description: 'Digital canvas for artists and designers.' },
  { id: 17, name: 'VR Headset', price: 400, image: '/vr_headset.jpg', category: 'VR', description: 'Immersive virtual reality experience.' },
  { id: 18, name: 'Gaming Chair', price: 250, image: '/chair_gaming.jpg', category: 'Accessories', description: 'Ergonomic chair for comfortable gaming sessions.' },
  { id: 19, name: 'Printer Ink', price: 30, image: '/ink_printer.jpg', category: 'Printers', description: 'High-quality ink for your printer.' },
  { id: 20, name: 'Monitor Arm', price: 50, image: '/arm_monitor.jpg', category: 'Accessories', description: 'Adjustable arm for optimal monitor positioning.' },
  { id: 21, name: 'Cleaning Kit', price: 15, image: '/kit_cleaning.jpg', category: 'Accessories', description: 'Essential tools for keeping your devices clean.' },
  { id: 22, name: 'Power Bank', price: 40, image: '/bank_power.jpg', category: 'Accessories', description: 'Portable charger for your devices.' },
  { id: 23, name: 'Screen Protector', price: 10, image: '/protector_screen.jpg', category: 'Accessories', description: 'Protects your screen from scratches and damage.' },
  { id: 24, name: 'Cable Organizer', price: 12, image: '/organizer_cable.jpg', category: 'Accessories', description: 'Keeps your cables tidy and manageable.' },
];

const uniqueCategories = [...new Set(products.map(product => product.category))];

export default function Products() {
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const { addItem, cart } = useContext(CartContext);

  useEffect(() => {
    const sendProductsToBackend = async () => {
      try {
        const response = await fetch('/api/seed-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(products),
        });

        const data = await response.json();
        console.log(data); // Log the response from the API
      } catch (error) {
        console.error('Error sending products to backend:', error);
      }
    };

    // Call this function when the component mounts (only once)
    sendProductsToBackend();
  }, []); // Empty dependency array ensures this runs only after the initial render

  const handleAddToCart = () => {
    if (selectedProduct) {
      setLoadingId(selectedProduct.id);
      addItem({ ...selectedProduct, quantity: quantityToAdd });

      setTimeout(() => {
        alert(`${selectedProduct.name} added to cart`);
        setLoadingId(null);
        closeModal();
      }, 500);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantityToAdd(1); // Reset quantity when opening modal
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantityToAdd(isNaN(value) || value < 1 ? 1 : value);
  };

  const filteredProducts = products.filter(product => {
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = !selectedCategory || product.category === selectedCategory;
    return searchMatch && categoryMatch;
  });

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3 border rounded-md text-black"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Link href="/cart" className="relative ml-4">
            <FaShoppingCart className="text-2xl text-blue-600 hover:text-blue-800 cursor-pointer" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
        <div className="flex">
          <aside className="w-1/4 pr-6">
            <h3 className="text-xl font-semibold mb-4 text-black">Categories</h3>
            <ul>
              <li
                className={`cursor-pointer py-2 text-black ${selectedCategory === null ? 'font-bold' : 'hover:text-blue-500'}`}
                onClick={() => handleCategoryClick(null)}
              >
                All Categories
              </li>
              {uniqueCategories.map((category) => (
                <li
                  key={category}
                  className={`cursor-pointer py-2 text-black ${selectedCategory === category ? 'font-bold' : 'hover:text-blue-500'}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </aside>
          <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-all text-black cursor-pointer"
                onClick={() => openModal(product)}
              >
                <div>
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" className="transition-transform duration-300 transform scale-100 hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-black line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 mt-2 text-black">${product.price}</p>
                    <p className="text-gray-500 text-sm mt-1 text-black">Category: {product.category}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-700">
                No products found matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {selectedProduct && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-black">{selectedProduct.name}</h2>
              <div className="relative w-full h-60 overflow-hidden mb-4">
                <Image src={selectedProduct.image} alt={selectedProduct.name} layout="fill" objectFit="contain" />
              </div>
              <p className="text-gray-700 mb-4 text-black">{selectedProduct.description}</p>
              <p className="text-lg font-semibold mb-2 text-black">Price: ${selectedProduct.price}</p>
              <div className="flex items-center mb-4">
                <label htmlFor="quantity" className="mr-2 text-black">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  className="w-20 border rounded-md py-2 px-3 text-black"
                  value={quantityToAdd}
                  min="1"
                  onChange={handleQuantityChange}
                />
              </div>
              <div className="flex justify-end">
                <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2" onClick={closeModal}>
                  Close
                </button>
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                    loadingId === selectedProduct.id ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  onClick={handleAddToCart}
                  disabled={loadingId === selectedProduct.id}
                >
                  {loadingId === selectedProduct.id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}