import {Tooltip} from '@mui/material';
import {useLocation, useNavigate} from 'react-router';

export interface SidebarLinkProps {
	icon: string,
	text: string,
	link: string,
	activeRegex: RegExp,
}

export function SidebarItem({icon,text, link, activeRegex}: SidebarLinkProps) {
	const navigate = useNavigate();


	function go() {
		navigate(link)
	}

	const location = useLocation();
	const activeItemClasses = activeRegex.test(location.pathname) && "bg-blue-50 text-blue-500";

	return <Tooltip title={text} placement={"right"} onClick={go}>
		<div className={`flex w-full justify-center items-center h-11 cursor-pointer ${activeItemClasses}`}>
			<i className={`bi ${icon} text-lg`} />
		</div>
	</Tooltip>
}