import {PropsWithChildren} from 'react';

/**
 * Interface representing properties for the FlexCenter component.
 *
 * This interface defines the structure of the props that can be passed to the FlexCenter component.
 *
 * Properties:
 * @property {string} [className] - An optional string to specify a custom CSS class for the component.
 */
export interface FlexCenterProps {
	className?: string
}

/**
 * A React component that centers its children both horizontally and vertically
 * within a flex container.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the container.
 * @param {string} props.className - Additional class names to apply to the container for custom styling.
 * @return {JSX.Element} A JSX element rendering a div with centered content.
 */
export function FlexCenter({children, className}: PropsWithChildren<FlexCenterProps>) {
	return <div className={`flex w-full h-full justify-center items-center ${className}`}>
		{children}
	</div>
}