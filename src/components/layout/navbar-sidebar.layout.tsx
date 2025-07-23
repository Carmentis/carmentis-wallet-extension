import {PropsWithChildren, ReactElement} from 'react';
import {Container} from "@mui/material";
import {atom} from "recoil";
import {motion} from "framer-motion";




export interface NavbarSidebarLayoutProps {
	navbar: ReactElement,
	sidebar: ReactElement,
}



export function NavbarSidebarLayout({children, navbar, sidebar}: PropsWithChildren<NavbarSidebarLayoutProps>) {
	return (
		<div id="main-layout" className="w-full h-full z-0">
			<motion.nav 
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full h-16 z-10"
			>
				{navbar}
			</motion.nav>
			<div className="pt-16 h-full w-full">
				<motion.div 
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className="fixed h-full w-16 border-r border-gray-200 bg-white shadow-sm z-0"
				>
					{sidebar}
				</motion.div>
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="h-full w-full pl-16 overflow-y-auto bg-gray-50 z-0"
				>
					<Container className="py-8">
						{children}
					</Container>
				</motion.div>
			</div>
		</div>
	);
}
