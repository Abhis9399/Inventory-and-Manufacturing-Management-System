import { useState, useEffect } from 'react';
import itemsData from '../data.json';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Pagination } from "@nextui-org/react";

export default function InventoryManagement() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const storedItems = localStorage.getItem('items');
        setItems(storedItems ? JSON.parse(storedItems) : itemsData.items);
    }, []);

    const filteredItems = items.filter(item =>
        (stockFilter === 'inStock' ? item.stock > 0 : stockFilter === 'outOfStock' ? item.stock === 0 : true) &&
        (searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const addItem = (name, stock) => {
        const newItem = { id: items.length + 1, name, stock: parseInt(stock) };
        const updatedItems = [...items, newItem];
        localStorage.setItem('items', JSON.stringify(updatedItems));
        setItems(updatedItems);
    };

    const deleteItem = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        localStorage.setItem('items', JSON.stringify(updatedItems));
        setItems(updatedItems);
    };

    const editItem = (id) => {
        const itemToEdit = items.find(item => item.id === id);
        const updatedItem = {
            ...itemToEdit,
            name: prompt("Enter new name:", itemToEdit.name),
            stock: parseInt(prompt("Enter new stock:", itemToEdit.stock))
        };
        const updatedItems = items.map(item => item.id === id ? updatedItem : item);
        localStorage.setItem('items', JSON.stringify(updatedItems));
        setItems(updatedItems);
    };
    return (
        <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">Inventory Management</h1>

            {/* Add Item Form */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Add Item</h2>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        addItem(e.target.name.value, e.target.stock.value);
                        e.target.reset();
                    }}
                    className="flex flex-wrap items-end gap-2"
                >
                    <input
                        name="name"
                        placeholder="Item Name"
                        className="flex-grow px-4 py-2 border border-blue-500 rounded"
                        required
                    />
                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock"
                        className="w-32 px-4 py-2 border border-blue-500 rounded"
                        required
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        Add
                    </button>
                </form>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center mb-6 bg-white p-4 rounded shadow">
                {/* Search Bar */}
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    <input
                        type="text"
                        placeholder="Search by item name"
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-blue-500 rounded"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <label className="mr-2">Filter by stock:</label>
                    <select
                        onChange={e => setStockFilter(e.target.value)}
                        className="px-4 py-2 border border-blue-500 rounded"
                    >
                        <option value="">All</option>
                        <option value="inStock">In Stock</option>
                        <option value="outOfStock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Item List */}
            <ul className="space-y-4">
                {currentItems.map(item => (
                    <li key={item.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">{item.name}</h2>
                            <p>Stock: {item.stock}</p>
                        </div>
                        <div className='flex space-x-2'>

                            <FaEdit
                                className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                onClick={() => editItem(item.id)}
                            />
                            <MdDelete
                                className="cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-200"
                                onClick={() => deleteItem(item.id)}
                            />
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mx-1 rounded transition transform ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-95`}
                >
                    Previous
                </button>
                {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
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
                    disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                    className={`px-4 py-2 mx-1 rounded transition transform ${currentPage === Math.ceil(filteredItems.length / itemsPerPage) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-gray-300 active:scale-95`}
                >
                    Next
                </button>
            </div>


        </div>
    );
}
