import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon';
import DashboardEngagementSection from '../../components/user/dashboard/DashboardEngagementSection';
import DashboardFinanceSection from '../../components/user/dashboard/DashboardFinanceSection';
import DashboardOverviewSection from '../../components/user/dashboard/DashboardOverviewSection';
import DashboardPostsSection from '../../components/user/dashboard/DashboardPostsSection';
import DashboardSettingsSection from '../../components/user/dashboard/DashboardSettingsSection';

const DASHBOARD_SECTIONS = [
	{ key: 'overview', label: 'Tổng quan', iconName: 'dashboardGrid' },
	{ key: 'posts', label: 'Quản lý tin', iconName: 'article' },
	{ key: 'finance', label: 'Quản lý tài chính', iconName: 'currencyCard' },
	{ key: 'engagement', label: 'Tương tác và cá nhân hóa', iconName: 'chat' },
	{ key: 'settings', label: 'Thiết lập tài khoản', iconName: 'user' },
];

const Dashboard = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const activeSection = useMemo(() => {
		const tabFromQuery = searchParams.get('tab');
		return DASHBOARD_SECTIONS.some((item) => item.key === tabFromQuery) ? tabFromQuery : 'overview';
	}, [searchParams]);

	const handleSectionChange = (sectionKey) => {
		setSearchParams((previousParams) => {
			const nextParams = new URLSearchParams(previousParams);
			nextParams.set('tab', sectionKey);
			if (sectionKey !== 'posts') {
				nextParams.delete('postsKeyword');
				nextParams.delete('postsStatus');
				nextParams.delete('postsPage');
			}
			return nextParams;
		});
	};

	const renderActiveSection = () => {
		switch (activeSection) {
			case 'overview':
				return <DashboardOverviewSection />;
			case 'posts':
				return <DashboardPostsSection />;
			case 'finance':
				return <DashboardFinanceSection />;
			case 'engagement':
				return <DashboardEngagementSection />;
			case 'settings':
				return <DashboardSettingsSection />;
			default:
				return <DashboardOverviewSection />;
		}
	};

	const activeSectionLabel = DASHBOARD_SECTIONS.find((item) => item.key === activeSection)?.label || 'Tổng quan';

	return (
		<main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8 md:py-10">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="rounded-2xl border border-[#dbe8f6] bg-white p-4 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)] lg:sticky lg:top-24 lg:h-fit">
					<h2 className="px-3 pb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#64748b]">Dashboard User</h2>
					<nav className="space-y-1.5">
						{DASHBOARD_SECTIONS.map((item) => {
							const isActive = item.key === activeSection;

							return (
								<button
									key={item.key}
									type="button"
									onClick={() => handleSectionChange(item.key)}
									className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
										isActive ? 'bg-[#0d4f9f] text-white shadow' : 'text-[#1e293b] hover:bg-[#eff6ff]'
									}`}
								>
									<AppIcon name={item.iconName} className="h-4 w-4" />
									<span>{item.label}</span>
								</button>
							);
						})}
					</nav>
				</aside>

				<section className="space-y-5">
					<header className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Khu vực làm việc</p>
						<h1 className="mt-2 text-2xl font-extrabold text-[#0f172a]">{activeSectionLabel}</h1>
					</header>

					{renderActiveSection()}
				</section>
			</div>
		</main>
	);
};

export default Dashboard;