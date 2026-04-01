import { useNavigate } from 'react-router-dom';
import AppIcon from '../../../common/AppIcon';

// Nut quay lai danh sach tin tuc.
const BackLink = ({
	to = '/news',
	label = 'Quay lại',
	withWrapper = true,
	wrapperClassName = 'mb-12',
	className,
}) => {
	const navigate = useNavigate();
	const buttonClassName =
		className || 'group inline-flex items-center gap-2 text-[#44474c] transition-colors hover:text-[#041627]';

	const button = (
		<button type="button" onClick={() => navigate(to)} className={buttonClassName}>
			<AppIcon name="chevronLeft" className="h-5 w-5 transition-transform group-hover:-translate-x-1" strokeWidth={2.2} />
			<span className="text-sm font-semibold uppercase tracking-wide">{label}</span>
		</button>
	);

	if (!withWrapper) {
		return button;
	}

	return (
		<section className={wrapperClassName}>
			{button}
		</section>
	);
};

export default BackLink;
