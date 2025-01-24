import { PropsWithChildren, ReactElement } from 'react';
import {Container} from "@mui/material";


export interface NavbarSidebarLayoutProps {
	navbar: ReactElement,
	sidebar: ReactElement,
}

export function NavbarSidebarLayout({children, navbar, sidebar}: PropsWithChildren<NavbarSidebarLayoutProps>) {
	return <div id="main-layout" className={"w-full h-full z-0"}>
		<nav className="bg-white  dark:bg-gray-900 border-b-2 border-gray-100 fixed top-0 left-0 w-full h-16">
			{navbar}
		</nav>
		<div className={"pt-16 h-full w-full"}>
			<div className={"fixed h-full w-16 border-r-2 border-gray-100 bg-white z-0"}>
				{sidebar}
			</div>
			<div className={"h-full w-full pl-16 overflow-y-auto bg-gray-50 z-0"}>
				<Container className={"py-8"}>
					{children}
				</Container>
			</div>
		</div>
	</div>
}