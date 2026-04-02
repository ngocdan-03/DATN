import AppIcon from '../../common/AppIcon';

const PaymentPackageList = ({ packages, selectedPackageId, onSelectPackage }) => {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			{packages.map((pkg) => {
				const isSelected = selectedPackageId === pkg.id;
				return (
					<button
						key={pkg.id}
						type="button"
						onClick={() => onSelectPackage(pkg.id)}
						className={`rounded-2xl border bg-white p-5 text-left transition-all duration-300 ${
							isSelected
								? 'border-[#005baa] shadow-[0_18px_36px_-22px_rgba(0,91,170,0.6)] bg-[linear-gradient(180deg,rgba(0,91,170,0.08),rgba(255,255,255,1))]'
								: 'border-[#c6dfff] hover:-translate-y-1 hover:border-[#8ac2ff] hover:shadow-[0_18px_40px_-24px_rgba(0,91,170,0.48)]'
						}`}
					>
						<div className="flex items-center justify-between gap-2">
							<p className={`text-xs font-semibold uppercase tracking-[0.18em] ${pkg.accentClass}`}>{pkg.label}</p>
							{isSelected && <AppIcon name="check" className="h-4 w-4 text-[#005baa]" />}
						</div>
						<p className="mt-3 whitespace-nowrap text-3xl font-bold">{pkg.displayAmount}</p>
						<p className="mt-3 text-sm text-[#5d6678]">{pkg.benefit}</p>
					</button>
				);
			})}
		</div>
	);
};

export default PaymentPackageList;
