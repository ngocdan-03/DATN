import AppIcon from './AppIcon';

// Label dung chung cho form field co icon, giup dong bo style va giam lap JSX.
const FormFieldLabel = ({
	iconName,
	text,
	className = 'mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#44474c]',
	iconClassName = 'h-3.5 w-3.5',
	iconStrokeWidth,
}) => {
	return (
		<label className={className}>
			<AppIcon name={iconName} className={iconClassName} strokeWidth={iconStrokeWidth} />
			{text}
		</label>
	);
};

export default FormFieldLabel;
