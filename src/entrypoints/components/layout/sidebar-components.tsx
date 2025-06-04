import { Tooltip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface SidebarLinkProps {
	icon: ReactNode,
	text: string,
	link: string,
	activeRegex: RegExp,
}

export function SidebarItem({icon, text, link, activeRegex}: SidebarLinkProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const isActive = activeRegex.test(location.pathname);

	function go() {
		navigate(link);
	}

	return (
		<Tooltip title={text} placement="right">
			<motion.div 
				onClick={go}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className={`flex w-full justify-center items-center h-11 cursor-pointer transition-colors duration-200 ${
					isActive ? "bg-green-50 text-green-600" : "text-gray-600 hover:text-green-500"
				}`}
			>
				<div className="text-lg">
					{icon}
				</div>
			</motion.div>
		</Tooltip>
	);
}
