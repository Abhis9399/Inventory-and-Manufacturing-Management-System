import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ordersData from '../../data.json';

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) {
      const storedOrders = localStorage.getItem('orders');
      const orders = storedOrders ? JSON.parse(storedOrders) : ordersData.orders;
      const order = orders.find(order => order.id === parseInt(id));
      setOrder(order);
    }
  }, [id]);

  const markAsCompleted = () => {
    const updatedOrder = { ...order, status: 'Completed' };
    const storedOrders = localStorage.getItem('orders');
    const orders = storedOrders ? JSON.parse(storedOrders) : ordersData.orders;
    const updatedOrders = orders.map(o => o.id === order.id ? updatedOrder : o);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrder(updatedOrder);
  };

  if (!order) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">Order #{order.id} Details</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <p className="text-xl mb-4"><strong>Customer:</strong> {order.customer}</p>
        <p className="text-xl mb-4"><strong>Status:</strong> {order.status}</p>
        <h2 className="text-2xl font-semibold mt-4 mb-4">Items</h2>
        <ul className="list-disc pl-6">
          {order.items.map(item => (
            <li key={item.id} className="mb-2 text-lg">
              {item.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
        {order.status !== 'Completed' && (
          <button
            onClick={markAsCompleted}
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-green-600 text-white rounded transition"
          >
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
}
