import React, { useState, useEffect } from 'react';

export function MyInterestsDropdown() {
    // Simulate data from user profile
    const [profileItems, setProfileItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        // STILL NEED TO REPLACE THIS WITH A REAL FETCH CALL
        const fakeProfileItems = ['Hiking', 'Cooking', 'Tennis', 'Board Games'];
        setProfileItems(fakeProfileItems);
    }, []);

    const handleChange = (event) => {
        setSelectedItem(event.target.value);
        console.log('Selected:', event.target.value);
    };

    return (
        <div className="w-full max-w-xs mx-auto">
            <label htmlFor="userDropdown" className="block mb-2 text-sm font-medium text-gray-800">
                Select an interest from your profile:
            </label>
            <select
                id="userDropdown"
                value={selectedItem}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>
                    -- Select one --
                </option>
                {profileItems.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}