import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useNavigate } from "react-router-dom";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const navigate = useNavigate();

  const { data: cartCourses, isLoading } = useQuery({
    queryKey: ['cart-courses', items],
    queryFn: async () => {
      if (items.length === 0) return [];
      const response = await fetch(`http://localhost:5000/api/courses/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseIds: items }),
      });
      if (!response.ok) throw new Error('Failed to fetch cart courses');
      return response.json();
    },
    enabled: items.length > 0,
  });

  const totalPrice = cartCourses?.reduce((sum, course) => sum + course.price, 0) || 0;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-4">
        {cartCourses?.map((course) => (
          <div key={course.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
            <div>
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-gray-600">${course.price}</p>
            </div>
            <Button variant="outline" onClick={() => removeItem(course.id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold">${totalPrice}</span>
        </div>
        <Button className="w-full" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
} 