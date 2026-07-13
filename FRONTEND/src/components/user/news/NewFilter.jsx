import { useState } from 'react';
import { CATEGORY } from '../../../constants/news';

const NewFilter = ({ onChange }) => {
	const [category, setCategory] = useState('');

    const handleChange = (event) => {
        setCategory(event.target.value);
        onChange(event.target.value);
    };

	return (
		<div className="mb-10 flex justify-end">
			<select
				value={category}
				onChange={handleChange}
				className="h-11 w-full max-w-[260px] rounded-lg border border-[#c4c6cd] bg-white px-3 text-sm font-semibold text-[#1b1c1d] outline-none transition-all focus:border-[#735c00] focus:ring-2 focus:ring-[#cca830]/30"
			>
				{CATEGORY.map((option) => (
					<option key={option.value || 'all-category'} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default NewFilter;