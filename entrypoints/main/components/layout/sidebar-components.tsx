import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';

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

	return <Tooltip title={text} placement={"right"} onClick={go}>
		<div className={"flex w-full justify-center items-center h-11 cursor-pointer"}>
			<i className={`bi ${icon} text-lg`} />
		</div>
	</Tooltip>
}