import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackToHomeButtonProps {
  className?: string;
  label?: string;
  variant?: 'primary' | 'outline' | 'subtle';
  onClickExtra?: () => void;
}

export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({
  className = '',
  label = 'Back to Home',
  variant = 'primary',
  onClickExtra,
}) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    if (onClickExtra) {
      onClickExtra();
    }
    navigate('/');
  };

  // Daddy's Home Theme Colors (emerald-700 / emerald-800)
  let variantStyles = 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-sm border border-emerald-600/70';
  if (variant === 'outline') {
    variantStyles = 'bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border-2 border-emerald-600';
  } else if (variant === 'subtle') {
    variantStyles = 'bg-emerald-800/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700';
  }

  return (
    <button
      id="back-to-home-btn"
      type="button"
      onClick={handleBackToHome}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 active:scale-95 cursor-pointer select-none min-h-[44px] ${variantStyles} ${className}`}
      aria-label="Back to Home"
    >
      <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
      <span>{label}</span>
    </button>
  );
};
