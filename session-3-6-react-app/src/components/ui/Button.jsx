/**
 * BUTTON COMPONENT (SESSION 3 & 6)
 *
 * Demonstrates:
 * - Component props with defaults
 * - Variant pattern (different styles)
 * - Tailwind CSS utility classes
 * - Spread operator for additional props
 * - Conditional class names
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  // Base classes that all buttons share
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles - demonstrates object mapping pattern
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-4 focus:ring-blue-200',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-4 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-4 focus:ring-red-200',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-4 focus:ring-green-200',
    ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
  };

  // Size variations
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Combine classes - template literal magic!
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={combinedClasses}
      {...props}  // Spread remaining props (onClick, disabled, etc.)
    >
      {children}
    </button>
  );
}
