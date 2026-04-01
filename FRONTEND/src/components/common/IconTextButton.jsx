import AppIcon from './AppIcon';

// Button dung chung cho pattern icon + text, giam lap class icon/button trong UI.
const IconTextButton = ({
	type = 'button',
	onClick,
	disabled,
	className,
	iconName,
	iconClassName = 'h-4 w-4',
	iconStrokeWidth,
	children,
	ariaLabel,
	title,
	after,
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={className}
			aria-label={ariaLabel}
			title={title}
		>
			{iconName && <AppIcon name={iconName} className={iconClassName} strokeWidth={iconStrokeWidth} />}
			{children}
			{after}
		</button>
	);
};

export default IconTextButton;
