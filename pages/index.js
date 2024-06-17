import { useState, useEffect } from 'react';
import Head from 'next/head';
import ordersData from '../data.json';
import Link from 'next/link';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    setOrders(storedOrders ? JSON.parse(storedOrders) : ordersData.orders);
  }, []);

  const filteredOrders = orders.filter(order =>
    (statusFilter ? order.status === statusFilter : true) &&
    (searchTerm ? order.customer.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'customer') {
      return a.customer.localeCompare(b.customer);
    } else if (sortField === 'itemCount') {
      return a.items.length - b.items.length;
    } else {
      return 0;
    }
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
    
      <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">Order List</h1>

        {/* Search Bar */}
        <div className="flex justify-end mb-6">
          <input
            type="text"
            placeholder="Search by customer name"
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-blue-500 rounded w-full md:w-1/3"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center mb-6 bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <label className="mr-4 text-gray-700">Filter by status:</label>
            <select
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <label className="mr-4 text-gray-700">Sort by:</label>
            <select
              onChange={e => setSortField(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">None</option>
              <option value="customer">Customer Name</option>
              <option value="itemCount">Item Count</option>
            </select>
          </div>
        </div>

        {/* Order List */}
        <ul>
          {currentOrders.map(order => (
            <li key={order.id} className="mb-4 p-6 bg-white rounded shadow hover:bg-blue-100 transition">
              <h2 className="text-2xl font-semibold mb-2">Order {order.id} - {order.customer}</h2>
              <p className="mb-1">Status: {order.status}</p>
              <p className="mb-2">Items: {order.items.length}</p>
              <a href={`/orders/${order.id}`} className="text-blue-500 hover:text-blue-700">View Details</a>
            </li>
          ))}
        </ul>

        <Link href="/inventory">
        <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded">
          Inventory Management
        </button>
      </Link>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mx-1 rounded transition transform ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-95`}
                >
                    Previous
                </button>
                {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 mx-1 rounded transition transform ${currentPage === i + 1
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${currentPage === i + 1 ? 'focus:outline-none focus:ring-2 focus:ring-blue-300' : 'focus:outline-none focus:ring-2 focus:ring-gray-300'} active:scale-95`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                    className={`px-4 py-2 mx-1 rounded transition transform ${currentPage === Math.ceil(filteredOrders.length / ordersPerPage) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-95`}
                >
                    Next
                </button>
            </div>
      </div>
    </>
  );
}
