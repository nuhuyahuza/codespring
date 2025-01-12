import { Button } from '@/components/ui/button';
import { ShoppingCart } from '@/components/ShoppingCart';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          {/* Your existing header content */}
        </div>

        <div className="flex items-center gap-4">
          <ShoppingCart />
          {/* Your existing header buttons */}
        </div>
      </div>
    </header>
  );
} 