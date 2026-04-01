const ICON_PATHS = {
	calendarMonth: [
		<rect key="1" x="4" y="5" width="16" height="15" rx="2" />,
		<path key="2" d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" strokeLinejoin="round" />,
	],
	plus: [<path key="1" d="M12 3v18M3 12h18" strokeLinecap="round" />],
	storefront: [
		<path key="1" d="M4 12h16M12 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />,
	],
	arrowRight: [
		<path key="1" d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />,
	],
	homeWork: [
		<path
			key="1"
			d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>,
	],
	gavel: [
		<path key="1" d="m4 20 8-8" strokeLinecap="round" />,
		<path key="2" d="m14 6 4 4" strokeLinecap="round" />,
		<path key="3" d="m10 10 4-4 4 4-4 4z" strokeLinecap="round" strokeLinejoin="round" />,
		<path key="4" d="m6 14 4 4" strokeLinecap="round" />,
	],
	chevronLeft: [<path key="1" d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />],
	chevronRight: [<path key="1" d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />],
	bookmark: [
		<path key="1" d="M6 4h12v16l-6-3-6 3z" strokeLinecap="round" strokeLinejoin="round" />,
	],
	bookmarkAdd: [
		<path key="1" d="M6 4h12v16l-6-3-6 3z" strokeLinecap="round" strokeLinejoin="round" />,
		<path key="2" d="M12 7v6M9 10h6" strokeLinecap="round" />,
	],
	check: [<path key="1" d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />],
	user: [
		<circle key="1" cx="12" cy="8" r="3" />,
		<path key="2" d="M5 19c0-2.8 2.7-4.7 7-4.7s7 1.9 7 4.7" strokeLinecap="round" />,
	],
	userAdd: [
		<circle key="1" cx="9" cy="8" r="3" />,
		<path key="2" d="M4 19c0-2.4 2.1-4 5-4s5 1.6 5 4" strokeLinecap="round" />,
		<path key="3" d="M18.5 8.5v5m-2.5-2.5h5" strokeLinecap="round" />,
	],
	group: [
		<circle key="1" cx="8" cy="9" r="2.5" />,
		<circle key="2" cx="16" cy="9" r="2.5" />,
		<path key="3" d="M3.5 18c.8-2.1 2.4-3.5 4.5-3.5s3.7 1.4 4.5 3.5" strokeLinecap="round" />,
		<path key="4" d="M11.5 18c.8-2.1 2.4-3.5 4.5-3.5s3.7 1.4 4.5 3.5" strokeLinecap="round" />,
	],
	lock: [
		<rect key="1" x="4.5" y="10" width="15" height="10" rx="2" />,
		<path key="2" d="M8 10V8a4 4 0 1 1 8 0v2" strokeLinecap="round" strokeLinejoin="round" />,
	],
	helpCircle: [
		<circle key="1" cx="12" cy="12" r="9" />,
		<path key="2" d="M9.4 9.5a2.7 2.7 0 1 1 4.5 2c-.8.8-1.3 1.2-1.3 2.2" strokeLinecap="round" />,
		<path key="3" d="M12 17h.01" strokeLinecap="round" />,
	],
	login: [
		<path key="1" d="M14 4h5v16h-5" strokeLinecap="round" strokeLinejoin="round" />,
		<path key="2" d="m10 16 4-4-4-4M14 12H4" strokeLinecap="round" strokeLinejoin="round" />,
	],
	logout: [
		<path key="1" d="M10 4H5v16h5" strokeLinecap="round" strokeLinejoin="round" />,
		<path key="2" d="m14 16 4-4-4-4M18 12H9" strokeLinecap="round" strokeLinejoin="round" />,
	],
	dashboardGrid: [
		<path key="1" d="M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-3H4v3Zm10-11h6V4h-6v5Z" strokeLinecap="round" strokeLinejoin="round" />,
	],
	menuRows: [<path key="1" d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />],
	filterSliders: [<path key="1" d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />],
	listingLines: [<path key="1" d="M7 7h10M7 12h10M7 17h10" strokeLinecap="round" />],
	refresh: [<path key="1" d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" strokeLinecap="round" strokeLinejoin="round" />],
	infoCircle: [
		<path key="1" d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm0 4.2v.1m-2.2 4.1H12v5.1" strokeLinecap="round" strokeLinejoin="round" />,
	],
	rentHouse: [
		<path key="1" d="M3.5 20.5h17M6.2 20.5V9l5.8-3.8L17.8 9v11.5M9.2 12.3h5.6M9.2 15.8h5.6" strokeLinecap="round" strokeLinejoin="round" />,
	],
	saleHouse: [
		<path key="1" d="M4 7.8 12 3l8 4.8V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7.8Zm5 13.2v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />,
	],
	newsDoc: [
		<path key="1" d="M4 5.5h12.5A3.5 3.5 0 0 1 20 9v10.5H7.5A3.5 3.5 0 0 1 4 16V5.5Zm4 4h8m-8 3h8m-8 3h5" strokeLinecap="round" strokeLinejoin="round" />,
	],
	clock: [
		<circle key="1" cx="12" cy="12" r="8" />,
		<path key="2" d="M12 8v5l3 2" strokeLinecap="round" strokeLinejoin="round" />,
	],
	currencyCard: [
		<rect key="1" x="3" y="6" width="18" height="12" rx="2" />,
		<path key="2" d="M16 12h.01M3 10h18" strokeLinecap="round" strokeLinejoin="round" />,
	],
	areaSquareGrid: [<path key="1" d="M4 4h16v16H4zM4 12h16M12 4v16" strokeLinecap="round" strokeLinejoin="round" />],
	legalSeal: [
		<path key="1" d="M12 3v3m6 6h3M12 18v3M3 12h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" strokeLinecap="round" />,
		<circle key="2" cx="12" cy="12" r="4.5" />,
	],
	bedSimple: [<path key="1" d="M3 10h18v9H3zM6 10V7h12v3" strokeLinecap="round" strokeLinejoin="round" />],
	sparkle: [
		<path key="1" d="m12 2 2.3 5.7L20 10l-5.7 2.3L12 18l-2.3-5.7L4 10l5.7-2.3Z" strokeLinecap="round" strokeLinejoin="round" />,
	],
	locationOn: [
		<path key="1" d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" strokeLinecap="round" strokeLinejoin="round" />,
		<circle key="2" cx="12" cy="10" r="2.5" />,
	],
	article: [
		<rect key="1" x="5" y="3" width="14" height="18" rx="2" />,
		<path key="2" d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />,
	],
	call: [
		<path
			key="1"
			d="M5 4h4l2 5-2.5 1.8a14 14 0 0 0 4.7 4.7L15 13l5 2v4a2 2 0 0 1-2.2 2C9.1 20.6 3.4 14.9 3 6.2A2 2 0 0 1 5 4Z"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>,
	],
	mail: [
		<path key="1" d="M4 6h16v12H4z" strokeLinecap="round" strokeLinejoin="round" />,
		<path key="2" d="m4 8 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />,
	],
	search: [
		<circle key="1" cx="11" cy="11" r="7" />,
		<path key="2" d="m20 20-3.5-3.5" strokeLinecap="round" />,
	],
	chat: [
		<path key="1" d="M4 6h16v10H8l-4 4z" strokeLinecap="round" strokeLinejoin="round" />,
	],
	externalLink: [
		<path key="1" d="M7 17 17 7" strokeLinecap="round" strokeLinejoin="round" />,
		<path key="2" d="M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />,
	],
	arrowDiagonal: [<path key="1" d="M5 19 19 5M9 5h10v10" strokeLinecap="round" strokeLinejoin="round" />],
	badgeCheck: [
		<path key="1" d="M12 3 5 8v8l7 5 7-5V8l-7-5Z" strokeLinecap="round" strokeLinejoin="round" />,
		<path key="2" d="M9.3 12.5 11 14l3.7-3.7" strokeLinecap="round" strokeLinejoin="round" />,
	],
	buildingLegacy: [
		<path key="1" d="M3 21h18" strokeLinecap="round" />,
		<path key="2" d="M6 21V9l6-4 6 4v12" strokeLinecap="round" strokeLinejoin="round" />,
		<path key="3" d="M10 14h4M10 17h4" strokeLinecap="round" />,
	],
	responsibility: [
		<path key="1" d="M12 20c5 0 8-3.7 8-8.2C20 7.9 16.7 5 13 5c-4.4 0-7.8 3.5-7.8 7.8" strokeLinecap="round" />,
		<path key="2" d="M6.7 19.2c1.7-.1 3.5-1.5 4.3-3.4.7-1.7.5-3.6-.4-5.2" strokeLinecap="round" />,
		<path key="3" d="M8.6 20c-1.6 0-2.6-.8-2.6-2.1 0-1.2 1-2.1 2.4-2.1 1.7 0 2.6 1 2.6 2.1" strokeLinecap="round" />,
	],
	searchMinus: [
		<circle key="1" cx="11" cy="11" r="6" />,
		<path key="2" d="m16 16 4 4" strokeLinecap="round" />,
		<path key="3" d="M9 11h4" strokeLinecap="round" />,
	],
	areaGrid: [
		<path key="1" d="M3 7h18M3 17h18M7 3v18M17 3v18" strokeLinecap="round" />,
	],
	bed: [
		<path key="1" d="M3 9h18M5 9V5h14v4M6 19v-6h12v6" strokeLinecap="round" strokeLinejoin="round" />,
	],
	bath: [
		<rect key="1" x="3" y="10" width="18" height="8" rx="2" />,
		<path key="2" d="M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" strokeLinecap="round" />,
	],
};

// Bo icon SVG noi bo dung chung toan app de tranh lap lai markup inline.
const AppIcon = ({ name, className = 'h-5 w-5', strokeWidth = 2 }) => {
	const paths = ICON_PATHS[name];
	if (!paths) return null;

	return (
		<svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
			{paths}
		</svg>
	);
};

export default AppIcon;
