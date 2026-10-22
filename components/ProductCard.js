export default function ProductCard({ product, onAddToCart }) {
    return (
      <div className="border p-4 rounded shadow hover:shadow-md transition">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-2">₱{product.price}</p>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Add to Cart
        </button>
      </div>
    );
  }
  