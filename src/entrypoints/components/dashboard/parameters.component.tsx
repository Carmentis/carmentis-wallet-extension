/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, {ReactElement, useEffect, useState} from 'react';
import {Encoders} from '@/entrypoints/main/Encoders.tsx';
import {useNavigate} from 'react-router';
import {EmailValidation} from '@/entrypoints/components/dashboard/email-validation.component..tsx';
import {activeAccountState, walletState,} from '@/entrypoints/contexts/authentication.context.tsx';
import {
	Box,
	Button,
	Card,
	CardContent,
	FormControl, IconButton, InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
	Typography
} from '@mui/material';
import {useRecoilState, useRecoilValue} from 'recoil';
import {getUserKeyPair, Wallet} from '@/entrypoints/main/wallet.tsx';
import {useToast} from "@/entrypoints/components/authentication-manager.tsx";
import Skeleton from "react-loading-skeleton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

function InputWithDynamicConfirmSaveComponent(input: {
	value: string,
	onChange: (value: string) => void,
	onSave: () => void,
	protect: boolean
}): ReactElement {

	const [hasChanged, setHasChanged] = useState<boolean>(false);


	/**
	 * Event function fired when the field has changed.
	 *
	 * @param updatedValue
	 */
	function onChange(updatedValue: string): void {
		setHasChanged(true);
		input.onChange(updatedValue);
	}

	/**
	 * Event function fired when the user wants to save the field value.
	 */
	function onSave() {
		setHasChanged(false);
		input.onSave();
	}

	return <>
		<OutlinedInput
			size={"small"}
			fullWidth={true}
			type={input.protect ? 'password' : 'text'}
			onChange={e => onChange(e.target.value)}
			value={input.value} />

		{hasChanged &&
			<div className="flex justify-end items-end space-x-1 mt-1">
				<Button variant={"contained"} size={"small"} onClick={onSave}>Save</Button>
			</div>
		}
	</>;
}

function InputNumberWithDynamicConfirmSaveComponent(input: {
	value: number | undefined,
	onChange: (value: number) => void,
	onSave: () => void,
}): ReactElement {
	const toast = useToast();
	const [hasChanged, setHasChanged] = useState<boolean>(false);


	function onChange(updatedValue: number): void {
		setHasChanged(true);
		input.onChange(updatedValue);
	}

	function onSave() {
		try {
			input.onSave();
			setHasChanged(false);
		} catch (e) {
			toast.error(`Error: ${e}`)
		}
	}

	return <>
		<OutlinedInput
			size={"small"}
			fullWidth={true}
			type={"number"}
			onChange={e => onChange(parseInt(e.target.value))}
			value={input.value} />

		{hasChanged &&
			<div className="flex justify-end items-end space-x-1 mt-1">
				<Button variant={"contained"} size={"small"} onClick={onSave}>Save</Button>
			</div>
		}
	</>;
}


export default function Parameters() {

	const [wallet, setWallet] = useRecoilState(walletState);
	const activeAccount = useRecoilValue(activeAccountState);


	// state for the pseudo, email and nonce edition
	const [firstname, setFirstname] = useState(activeAccount?.firstname);
	const [lastname, setLastname] = useState(activeAccount?.lastname);
	const [email, setEmail] = useState(activeAccount?.email);
	const [nonce, setNonce] = useState(activeAccount?.nonce);
	const [showPrivateKeys, setShowPrivateKeys] = useState<boolean>(false);

	// state for account deletion
	const [accountDeletionPseudo, setAccountDeletionPseudo] = useState<string>('');


	// states for the endpoints
	const [nodeEndpoint, setNodeEndpoint] = useState(wallet?.nodeEndpoint);
	const [explorerEndpoint, setExplorerEndpoint] = useState(wallet?.explorerEndpoint);


	// states for the user keys
	const [userPrivateKey, setUserPrivateKey] = useState('');
	const [userPublicKey, setUserPublicKey] = useState('');

	useEffect(() => {
		// load the authentication key pair
		if (!wallet || !activeAccount) return;
		getUserKeyPair(wallet, activeAccount)
			.then(keyPair => {
				setUserPrivateKey(Encoders.ToHexa(keyPair.privateKey));
				setUserPublicKey(Encoders.ToHexa(keyPair.publicKey));
			});

	}, [wallet]);




	/**
	 * Event function called when the user saves the parameters.
	 */
	function saveParameters() {
		// prevent invalid parameters
		if (firstname === '' || lastname == '') {
			throw new Error("Empty firstname or lastname");
		}

		if (email === '') {
			throw new Error("Empty email.")
		}


		// update the wallet
		setWallet(wallet => {
			if (!wallet) return undefined;

			// update pseudo, nonce and endpoints
			const accounts = wallet.accounts.map(a => {
				if (a.id !== wallet.activeAccountId) return a;
				return {
					...a,
					firstname,
					lastname,
					email,
					nonce,
				}
			});

			return {
				...wallet,
				accounts,
				nodeEndpoint,
				explorerEndpoint
			} as Wallet
		});
	}

	/**
	 * This function is fired when the user wants to delete the current active account.
	 */
	function deleteActiveAccount() {
		if (activeAccount && activeAccount.firstname === accountDeletionPseudo) {
			setWallet(wallet => {
				if (!wallet) return undefined;
				const accounts = wallet.accounts
					.filter(a => a.firstname !== accountDeletionPseudo);
				return {...wallet, accounts}
			});
		}
	}

	const generalItems = [
		{
			name: 'Firstname',
			description: 'Firstname of the user owning the account',
			field: <InputWithDynamicConfirmSaveComponent
				protect={false}
				value={firstname}
				onChange={setFirstname}
				onSave={saveParameters}/>
		},
		{
			name: 'Lastname',
			description: 'Lastname of the user owning the account',
			field: 	<InputWithDynamicConfirmSaveComponent
				protect={false}
				value={lastname}
				onChange={setLastname}
				onSave={saveParameters}/>
		},
		{
			name: 'Account Nonce',
			description: 'The nonce of your account, used to derive different keys.',
			field: <InputNumberWithDynamicConfirmSaveComponent
				value={nonce}
				onChange={setNonce}
				onSave={saveParameters}/>
		},
		{
			name: 'Email',
			description: 'The email associated to your account.',
			field: <InputWithDynamicConfirmSaveComponent
				value={email}
				onChange={setEmail}
				onSave={saveParameters}/>
		}
	];

	const keysItem = [
		{
			name: "User Authentication Private Key",
			description: "Your private signature authentication key.",
			field: <OutlinedInput
					id="outlined-adornment-password"
					type={showPrivateKeys ? 'text' : 'password'}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label={
									showPrivateKeys ? 'hide private key' : 'display private key'
								}
								onClick={() => setShowPrivateKeys(!showPrivateKeys)}
								edge="end"
							>
								{showPrivateKeys ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
					value={userPrivateKey}
					size={"small"}
					fullWidth={true}
					label="Private key"
				/>
		},
		{
			name: "User Authentication Public Key",
			description: "Your public signature authentication key.",
			field: <PublicKeyInputField/>
		}
	];
	const oracleItems = [
		{
			name: "Email",
			description: "",
			field: <>
				<input type="text"
					   className="parameter-input" readOnly={true} value={email}/>
			</>
		}
	]

	const networkItems = [
		{
			name: "Carmentis Node Endpoint",
			description: "The endpoint of the carmentis node server. Make sure that this node belongs to the Carmentis network.",
			field: <InputWithDynamicConfirmSaveComponent
				protect={false}
				value={nodeEndpoint}
				onChange={setNodeEndpoint}
				onSave={saveParameters}/>
		},
		{
			name: "Carmentis Explorer Endpoint",
			description: "The endpoint of the explorer.",
			field: <InputWithDynamicConfirmSaveComponent
				protect={false}
				value={explorerEndpoint}
				onChange={setExplorerEndpoint}
				onSave={saveParameters}/>
		}
	]

	const dangerousZone = [
		{
			name: "Account Deletion",
			description: "Delete the current account named {activeAccount?.firstname} Write your account name below to confirm the deletion.",
			field: <>
				<input type="text" className="parameter-input" value={accountDeletionPseudo}
					   onChange={e => setAccountDeletionPseudo(e.target.value)}/>
				<div className="flex justify-end items-end space-x-1 mt-1">
					<Button color={"red"} onClick={deleteActiveAccount}>Delete</Button>
				</div>
			</>
		}
	]

	return <>
		<div className="md:container md:mx-auto flex flex-col space-y-8">

			<div className="flex justify-start mb-2">
				<Typography variant={"h4"}>Parameters</Typography>
			</div>


			<ParameterSection sectionTitle={"General"} items={generalItems}/>
			<ParameterSection sectionTitle={"User Keys"} items={keysItem}/>
			<ParameterSection sectionTitle={"Network"} items={networkItems}/>
			{wallet?.accounts.length !== 1 &&
				<ParameterSection sectionTitle={"Account Management"} items={dangerousZone} />
			}
		</div>
	</>;
}

function PublicKeyInputField() {
	const toast = useToast();
	const wallet = useRecoilValue(walletState);
	const account = useRecoilValue(activeAccountState);
	const [userPublicKey, setUserPublicKey] = useState('');

	useEffect(() => {
		getUserKeyPair(wallet!, account!).then(keyPair => {
			setUserPublicKey(Encoders.ToHexa(keyPair.publicKey));
		})
	}, [wallet, account]);

	if (!userPublicKey) return <Skeleton/>
	return (
		<Box display="flex" flexDirection={"column"} alignItems="start" gap={1}>
			<TextField
				value={userPublicKey}
				variant="outlined"
				fullWidth
				inputProps={
					{ readOnly: true, }
				}
				size={"small"}
				onClick={() => {
					navigator.clipboard.writeText(userPublicKey);
					toast.success("Public key copied.")
				}}
			/>
			<Button
				variant="contained"
				onClick={() => {
					window.open(`mailto:?subject=Public%20key&body=Hey%20!%0A%0AHere%20is%20my%20public%20key%3A%0A%0A${userPublicKey}`);
				}}
			>
				Share public key
			</Button>
		</Box>
	);
}

type ParametersSectionProps = {
	sectionTitle: string,
	items: {
		name: string, description: string, field: ReactElement,
	}[]
}

function ParameterSection({sectionTitle, items}: ParametersSectionProps) {
	const content = items.map(it => <LabelAndField name={it.name} description={it.description} field={it.field} />)
	return <Card className="parameter-section">
		<CardContent className={"space-y-4"}>
			<Typography variant={"h5"}>{sectionTitle}</Typography>
			{content}
		</CardContent>
	</Card>
}

function LabelAndField(it: {name: string, description: string, field: ReactElement}) {
	return <Box sx={{display:"flex", flexDirection: "column"}}>
		<Typography fontWeight={"bolder"}>{it.name}</Typography>
		<Typography>{it.description}</Typography>
		{it.field}
	</Box>
}