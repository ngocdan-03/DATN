import AppIcon from './AppIcon';

// Button dung chung cho pattern icon + text, giam lap class icon/button trong UI.
const IconTextButton = ({
	Component = 'button',
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
	...rest
}) => {
	const componentProps = Component === 'button' ? { type } : {};

	return (
		<Component
			{...componentProps}
			{...rest}
			onClick={onClick}
			disabled={disabled}
			className={className}
			aria-label={ariaLabel}
			title={title}
		>
			{iconName && <AppIcon name={iconName} className={iconClassName} strokeWidth={iconStrokeWidth} />}
			{children}
			{after}
		</Component>
	);
};

export default IconTextButton;
