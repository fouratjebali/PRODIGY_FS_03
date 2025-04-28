import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  name: string;
  regularPrice: number;
  discountPrice: number;
  imageUrl: string;
}

const ProductCard = ({ id, name, regularPrice, discountPrice, imageUrl }: ProductCardProps) => {
  const hasDiscount = Number(discountPrice) > 0;
  const displayPrice = hasDiscount ? discountPrice : regularPrice;
  
  
  const fullImageUrl = `${imageUrl}`;

  console.log(fullImageUrl);


  return (
    <Link to={`/product/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="relative h-64 w-full">
          <img
            src={fullImageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#255F38]">
              ${Number(displayPrice).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${Number(regularPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 