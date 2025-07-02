import React, { useState } from "react";

interface InterestSelectorProps {
    availableInterests: string[];
    selectedInterests: string[];
    setSelectedInterests: (interests: string[]) => void;
    label?: string;
    placeholder?: string;
}

export function InterestSelector({
                                     availableInterests,
                                     selectedInterests,
                                     setSelectedInterests,
                                     label = "Select Interests",
                                     placeholder = "Search interests...",
                                 }: InterestSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInterests = availableInterests.filter(
        (interest) =>
            interest.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedInterests.includes(interest)
    );

    const addInterest = (interest: string) => {
        setSelectedInterests([...selectedInterests, interest]);
        setSearchTerm("");
    };

    const removeInterest = (interest: string) => {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    };

    return (
        <div className="w-full">
            {label && <label className="block mb-1 font-semibold">{label}</label>}

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2 border rounded mb-2 text-black"
            />

            {searchTerm && (
                <ul className="bg-white text-black border rounded max-h-40 overflow-auto mb-2">
                    {filteredInterests.length > 0 ? (
                        filteredInterests.map((interest) => (
                            <li
                                key={interest}
                                onClick={() => addInterest(interest)}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                            >
                                {interest}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">No matches found</li>
                    )}
                </ul>
            )}

            <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                    <span
                        key={interest}
                        className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center"
                    >
            {interest}
                        <button
                            onClick={() => removeInterest(interest)}
                            className="ml-2 font-bold text-xs hover:text-red-300"
                        >
              ✕
            </button>
          </span>
                ))}
            </div>
        </div>
    );
}
