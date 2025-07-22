import React, { useState } from "react";

interface InterestSelectorProps {
    availableInterests: string[];
    selectedInterests: string[];
    setSelectedInterests: (interests: string[]) => void;
    label?: string;
    placeholder?: string;
}

export function InterestSelector() {

    return (
        <div className="w-full">
            {label && <label className="block mb-1 font-semibold">{label}</label>}
    <Form method="post">
            <input
                aria-label="Search contacts"
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="Search interests..."
                type="search"
                className="w-full p-2 border rounded mb-2 text-black"
            />
            {interests.length ? (
                <ul className="bg-white text-black border rounded max-h-40 overflow-auto mb-2">

                    {interests.map((interest) => (
                        <li key={interestId} className="p-2 cursor-pointer hover:bg-gray-200">
                            {interest.interestName}
                        </li>
                    ))} </ul>
                    ) : (
                    <p className="p-2 text-gray-500">No matches found</p>
                    )}

    </Form>
    <Form action="destroy" method="delete">
            <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                    <span
                        key={interest}
                        className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center"
                    >
            {interest}
                        <button type="submit" className="ml-2 font-bold text-xs hover:text-red-300">
              ✕
            </button>
          </span>))}
            </div>
    </Form>
        </div>
    );
}
