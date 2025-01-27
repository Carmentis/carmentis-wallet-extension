import {FlexCenter} from '@/entrypoints/components/layout/flex-center.component.tsx';
import React from 'react';

export default function NoTokenAccount() {
	return <FlexCenter className={"flex flex-col"}>
		<i className={"bi bi-info-circle-fill text-xl"}></i>
		You not have token account yet.
	</FlexCenter>

}