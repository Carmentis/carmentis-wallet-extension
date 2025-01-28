import {PropsWithChildren} from 'react';

export function GrayBackground({children}: PropsWithChildren) {
	return <div className={"w-full h-full bg-gray-100"}>
		{children}
	</div>
}