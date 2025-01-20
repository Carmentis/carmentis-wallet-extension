import { PropsWithChildren, ReactElement } from 'react';


export interface NavbarSidebarLayoutProps {
	navbar: ReactElement,
	sidebar: ReactElement,
}

export function NavbarSidebarLayout({children, navbar, sidebar}: PropsWithChildren<NavbarSidebarLayoutProps>) {
	return <div id="main-layout" className={"w-full h-full"}>
		<nav className="bg-white  dark:bg-gray-900 border-b-2 border-gray-100 fixed top-0 left-0 w-full h-16">
			{navbar}
		</nav>
		<div className={"pt-16 h-full w-full"}>
			<div className={"fixed h-full w-16 border-r-2 border-gray-100 bg-white"}>
				{sidebar}
			</div>
			<div className={"h-full w-full pl-16 overflow-y-auto bg-gray-50"}>
				<div className="p-8">
					{children}
				</div>
			</div>
		</div>
	</div>
}