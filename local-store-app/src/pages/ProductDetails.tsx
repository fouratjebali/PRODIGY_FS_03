import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

interface Product {
  id: number;
  name: string;
  description: string;
  regularPrice: number;
  discountPrice: number;
  quantity: number;
  images: {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
    altText: string;
  }[];
}

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        // Set the primary image as selected by default
        const primaryImage = data.images.find((img: any) => img.isPrimary);
        if (primaryImage) {
          setSelectedImage(primaryImage.imageUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-2xl text-red-600 mb-4">{error || 'Product not found'}</div>
        <Link to="/" className="text-[#255F38] hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const hasDiscount = Number(product.discountPrice) > 0;
  const displayPrice = hasDiscount ? product.discountPrice : product.regularPrice;

  // Helper function to get full image URL
  const getFullImageUrl = (imageUrl: string) => {
    return imageUrl.startsWith('http') 
      ? imageUrl 
      : `http://localhost:5000${imageUrl}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-[#255F38] mb-8 hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                <img
                  src={selectedImage ? getFullImageUrl(selectedImage) : product.images[0] ? getFullImageUrl(product.images[0].imageUrl) : ''}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.imageUrl)}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                      selectedImage === image.imageUrl ? 'ring-2 ring-[#255F38]' : ''
                    }`}
                  >
                    <img
                      src={getFullImageUrl(image.imageUrl)}
                      alt={image.altText || product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#255F38]">
                  ${Number(displayPrice).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    ${Number(product.regularPrice).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="flex-1 bg-[#255F38] text-white px-6 py-3 rounded-lg hover:bg-[#1F7D53] transition-colors duration-300 flex items-center justify-center gap-2"
                  disabled={product.quantity === 0}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {product.quantity > 0 && (
                <p className="text-green-600">
                  {product.quantity} in stock
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 