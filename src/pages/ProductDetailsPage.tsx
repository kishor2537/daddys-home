import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BackToHomeButton } from '../components/BackToHomeButton';
import { translations } from '../translations';
import { ShoppingBag, Plus, Minus, Check, AlertTriangle, Layers, Sprout, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, language, handleAddToCart, cart } = useApp();
  const t = translations[language];

  const product = products.find((p) => p.id === id);
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="flex justify-start">
          <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
        </div>
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-stone-900">
            {language === 'ta' ? 'பொருள் கிடைக்கவில்லை' : 'Product Not Found'}
          </h2>
          <p className="text-sm text-stone-600">
            {language === 'ta'
              ? 'நீங்கள் தேடும் பொருள் இப்போது கிடைக்கவில்லை அல்லது நீக்கப்பட்டுள்ளது.'
              : 'The requested product could not be located in our catalog.'}
          </p>
          <div className="pt-2">
            <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;
  const advancePrice = Math.round(product.price * 0.5);
  const balancePrice = product.price - advancePrice;

  const existingInCart = cart.find((item) => item.product.id === product.id)?.quantity || 0;

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

  const onAdd = () => {
    if (isOutOfStock) return;
    handleAddToCart(product, selectedQty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const onBuyNow = () => {
    if (isOutOfStock) return;
    handleAddToCart(product, selectedQty);
    navigate('/checkout');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 1. Header Navigation with prominent Back to Home Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          {language === 'ta' ? 'கொல்லிமலை பண்ணை பொருட்கள்' : "Daddy's Home / Product Details"}
        </span>
      </div>

      {/* 2. Product Details Grid */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
        {/* Left Column: Image with Badges */}
        <div className="relative bg-amber-50/60 p-6 sm:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-amber-100">
          <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden shadow-inner bg-white border border-amber-200/80">
            <img
              src={product.imageUrl}
              alt={product.nameEn}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.isBestSeller && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
                <span>⭐</span>
                <span>{language === 'ta' ? 'சிறந்த விற்பனை' : '#1 BEST SELLER'}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ta' ? product.originTa : product.originEn}</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'ta' ? '100% இயற்கை' : '100% Organic'}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                <Layers className="w-3.5 h-3.5 text-stone-500" />
                {language === 'ta' ? product.unitTa : product.unitEn}
              </span>

              {isOutOfStock ? (
                <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                  {t.outOfStock}
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full">
                  {product.stock} {t.packsLeft}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {language === 'ta' ? product.nameTa : product.nameEn}
            </h1>
            <p className="text-sm text-stone-500 font-medium">
              {language === 'ta' ? product.nameEn : product.nameTa}
            </p>

            <p className="text-sm text-stone-700 leading-relaxed pt-1">
              {language === 'ta' ? product.descriptionTa : product.descriptionEn}
            </p>

            {/* 50% Advance Price Card */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 block font-medium">
                    {language === 'ta' ? 'முழு விலை (Total Value)' : 'Total Price'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-stone-950">₹{product.price}</span>
                </div>
                <div className="text-right bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold block uppercase tracking-wide opacity-90">
                    {language === 'ta' ? '50% முன்பணம் மட்டும்' : 'Pay 50% Advance'}
                  </span>
                  <span className="text-xl font-black">₹{advancePrice}</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 border-t border-amber-200/60 pt-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {language === 'ta'
                    ? `மீதி ₹${balancePrice} டெலிவரியின் போது செலுத்தவும் (COD / UPI).`
                    : `Remaining ₹${balancePrice} is payable on doorstep delivery (COD / UPI).`}
                </span>
              </p>
            </div>
          </div>

          {/* Quantity Controls & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-600">
                {language === 'ta' ? 'அளவு:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={selectedQty <= 1 || isOutOfStock}
                  className="w-10 h-11 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:bg-stone-300 disabled:opacity-40 transition font-bold"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-black text-stone-900 text-base select-none">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={selectedQty >= product.stock || isOutOfStock}
                  className="w-10 h-11 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:bg-stone-300 disabled:opacity-40 transition font-bold"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {existingInCart > 0 && (
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {language === 'ta' ? `${existingInCart} கூடையில் உள்ளது` : `${existingInCart} in cart`}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                id="details-add-to-cart-btn"
                onClick={onAdd}
                disabled={isOutOfStock}
                className={`h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{language === 'ta' ? 'சேர்க்கப்பட்டது!' : 'Added to Basket!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-amber-300" />
                    <span>{t.addToCart}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="details-buy-now-btn"
                onClick={onBuyNow}
                disabled={isOutOfStock}
                className="h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-950" />
                <span>{language === 'ta' ? 'உடனே வாங்குக (50%)' : 'Order Now (50% Advance)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Back to Home Button for convenience */}
      <div className="pt-4 flex justify-center sm:justify-start">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
      </div>
    </div>
  );
};
