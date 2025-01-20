import { PropsWithChildren } from 'react';

/**
 * Interface representing properties for a Card component.
 *
 * @interface
 * @property {string} [className] - Optional CSS class name to apply custom styling to the Card component.
 */
export interface CardProps {
	className?: string
}

/**
 * Renders a card component with customizable content and styling.
 *
 * @param {Object} props - The properties for the Card component.
 * @param {React.ReactNode} props.children - The child elements or content to be rendered inside the card.
 * @param {string} props.className - Additional CSS class names to customize the appearance of the card.
 * @return {JSX.Element} A styled card component containing the provided children.
 */
export default function Card({children, className}: PropsWithChildren<CardProps>) {
	return <div className={`p-4 shadow-md rounded-md w-full bg-white ${className}`}>
		{children}
	</div>
}