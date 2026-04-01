// Card thong bao trang thai dung chung cho loading/error/info o cac trang.
const StateCard = ({
	title,
	message,
	variant = 'neutral',
	className = '',
}) => {
	if (variant === 'error') {
		return (
			<div className={`rounded-2xl border border-[#ffdad6] bg-[#fff9f8] p-10 text-center ${className}`.trim()}>
				{title && <p className="mb-3 text-lg font-semibold text-[#ba1a1a]">{title}</p>}
				{message && <p className="text-[#44474c]">{message}</p>}
			</div>
		);
	}

	return (
		<div className={`rounded-2xl border border-[#c4c6cd]/30 bg-white p-10 text-center text-[#44474c] ${className}`.trim()}>
			{title && <p className="mb-2 text-lg font-semibold text-[#1b1c1d]">{title}</p>}
			{message}
		</div>
	);
};

export default StateCard;
