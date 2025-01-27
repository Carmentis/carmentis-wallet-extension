import {FlexCenter} from '@/entrypoints/components/layout/flex-center.component.tsx';
import {Button, Card, CardContent, Checkbox, TextField, Typography} from '@mui/material';

/**
 * Represents the Exchange component which renders a centered layout containing a PayToken component.
 *
 * @return {JSX.Element} A JSX element that centers the PayToken component within a FlexCenter component.
 */
function Exchange() {
	return <FlexCenter>
		<PayToken/>
	</FlexCenter>
}

/**
 * Renders a payment form component allowing users to specify payment details such as token, amount in EUR,
 * and preferred payment method (Credit card, Cryptocurrency, Bank transfer). The form also includes
 * a "Pay" button to initiate the payment process.
 *
 * @return {JSX.Element} A JSX element that displays the payment form.
 */
function PayToken() {
	return <Card>
		<CardContent>

			<div className="flex justify-center mb-8">
				<Typography variant={"h3"}>Pay</Typography>
			</div>

			<div  className={"space-y-4"} >
				<TextField
					label={'Token'}
					name={'token'}
				/>
				<TextField
					label={'EUR'}
					name={'eur'}
				/>

				<div id="method">
					<Typography>Method</Typography>
					<Checkbox
						name={'paymentMethod'}
						label={"Credit card"}
					/>
					<Checkbox
						name={'paymentMethod'}
						label={"Cryptocurrency"}
					/>
					<Checkbox
						name={'paymentMethod'}
						label={"Bank transfer"}
					/>
				</div>


				<Button className={"w-full"}>
					Pay
				</Button>
			</div>
		</CardContent>
	</Card>
}

export default Exchange;