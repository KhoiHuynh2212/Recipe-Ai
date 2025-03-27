import React, { useState } from 'react';
import './DietFilter.css';

const DietFilter = () => {
    const [selectedDiet, setSelectedDiet] = useState('none');

    const handleChange = (event) => {
        setSelectedDiet(event.target.value);
        console.log(`Selected: ${event.target.value}`);
    };

    return (
        <div className="diet-filter-container">
            <label htmlFor="diet-filter">Choose Diet Preference:</label>
            <select id="diet-filter" value={selectedDiet} onChange={handleChange}>
                <option value="none">None</option>
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
            </select>
        </div>
    );
};

export default DietFilter;
