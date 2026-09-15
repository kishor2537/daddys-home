import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Check, AlertTriangle, Layers, Info } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../translations';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product, quantity: number) => void;
  cartQuantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
  cartQuantity = 0,
}) => {
  const navigate = useNavigate();
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const t = translations[language];

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  const advancePrice = Math.round(product.price * 0.5);

  const handleIncrement = () => {
    if (selectedQty < product.stock) {
      setSelectedQty((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedQty > 1) {
      setSelectedQty((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedQty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className={`bg-white rounded-2xl transition-all overflow-hidden flex flex-col justify-between ${
        product.isBestSeller
          ? 'border-2 border-amber-400 shadow-md ring-2 ring-amber-400/30'
          : 'border border-amber-200/80 shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        {/* Product Image & Badges */}
        <div 
          onClick={() => navigate(`/product/${product.id}`)}
          className="relative aspect-4/3 w-full bg-amber-50 overflow-hidden cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
          aria-label={`View details for ${language === 'ta' ? product.nameTa : product.nameEn}`}
        >
          <img
            src={product.imageUrl}
            alt={product.nameEn}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Top Pill: Pure Badge / Best Seller Badge */}
          {product.isBestSeller ? (
            <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
              <span>⭐</span>
              <span>{language === 'ta' ? 'சிறந்த விற்பனை' : '#1 BEST SELLER'}</span>
            </div>
          ) : (
            <div className="absolute top-2.5 left-2.5 bg-emerald-900/90 text-amber-300 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs flex items-center gap-1 border border-emerald-700/60">
              <span>🌿</span>
              <span>{language === 'ta' ? product.badgeTa || '100% இயற்கை' : product.badgeEn || '100% Pure Organic'}</span>
            </div>
          )}

          {/* Top Right: Stock Status */}
          <div className="absolute top-2.5 right-2.5">
            {isOutOfStock ? (
              <span className="bg-red-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{t.outOfStock}</span>
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-500 text-stone-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                {product.stock} {t.packsLeft}
              </span>
            ) : (
              <span className="bg-emerald-600/90 text-white font-medium text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                {product.stock} {t.packsLeft}
              </span>
            )}
          </div>

          {/* 50% Advance Ribbon on corner */}
          <div className="absolute bottom-2 left-2 bg-amber-400 text-stone-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm border border-amber-300">
            {language === 'ta' ? '50% முன்பணம்: ₹' + advancePrice : 'Pay 50% Advance: ₹' + advancePrice}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          {/* Unit / Weight specification */}
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-semibold">
              <Layers className="w-3 h-3 text-stone-500" />
              {language === 'ta' ? product.unitTa : product.unitEn}
            </span>
            <span className="text-emerald-700 font-medium">
              {language === 'ta' ? product.originTa : product.originEn}
            </span>
          </div>

          {/* Primary Name in chosen language */}
          <h3 
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-lg sm:text-xl font-bold text-stone-900 leading-snug cursor-pointer hover:text-emerald-800 transition-colors"
          >
            {language === 'ta' ? product.nameTa : product.nameEn}
          </h3>

          {/* Secondary Sub-Name for instant clarity */}
          <p className="text-xs text-stone-500 font-medium">
            {language === 'ta' ? product.nameEn : product.nameTa}
          </p>

          {/* Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {language === 'ta' ? product.descriptionTa : product.descriptionEn}
          </p>

          {/* Price Box with 50% Advance highlight */}
          <div className="pt-2 pb-1 border-t border-dashed border-amber-200">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 block font-medium">
                  {language === 'ta' ? 'மொத்த விலை' : 'Total Price'}
                </span>
                <span className="text-2xl font-black text-stone-900">₹{product.price}</span>
              </div>
              <div className="text-right bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wide">
                  {language === 'ta' ? 'முன்பணம் மட்டும்' : 'Pay 50% Advance'}
                </span>
                <span className="text-base font-black text-emerald-700">₹{advancePrice}</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'ta'
                ? `மீதி ₹${product.price - advancePrice} டெலிவரியின் போது செலுத்தவும்`
                : `Remaining ₹${product.price - advancePrice} payable on delivery`}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer: Quantity Selector & Add Button */}
      <div className="p-4 pt-0">
        <div className="flex items-center gap-2">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50 shadow-inner">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={selectedQty <= 1 || isOutOfStock}
              className="w-9 h-11 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:bg-stone-300 disabled:opacity-40 transition font-bold"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center font-black text-stone-900 text-sm select-none">
              {selectedQty}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={selectedQty >= product.stock || isOutOfStock}
              className="w-9 h-11 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:bg-stone-300 disabled:opacity-40 transition font-bold"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>{language === 'ta' ? 'சேர்க்கப்பட்டது!' : 'Added!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>{t.addToCart}</span>
              </>
            )}
          </button>
        </div>

        {cartQuantity > 0 && (
          <div className="mt-2 text-center text-[11px] font-semibold text-emerald-800 bg-emerald-50 py-1 rounded-md border border-emerald-200/60">
            {language === 'ta'
              ? `ஏற்கனவே கூடையில் ${cartQuantity} உள்ளது`
              : `${cartQuantity} already in your cart`}
          </div>
        )}
      </div>
    </div>
  );
};
