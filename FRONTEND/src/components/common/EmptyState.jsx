import AppIcon from './AppIcon';

// Empty state dung chung cho cac grid list, giup dong nhat UI va tranh lap JSX.
const EmptyState = ({ message }) => {
	return (
		<section className="rounded-2xl border border-[#c4c6cd]/30 bg-white p-10 text-center text-[#44474c]">
			<div className="mb-3 flex justify-center">
				<AppIcon name="searchMinus" className="h-10 w-10 text-[#735c00]/70" strokeWidth={1.8} />
			</div>
			{message}
		</section>
	);
};

export default EmptyState;
