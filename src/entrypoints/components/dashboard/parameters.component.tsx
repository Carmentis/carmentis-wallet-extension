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
import {Card, CardContent, Typography} from '@mui/material';
import {useRecoilState, useRecoilValue} from 'recoil';
import {getUserKeyPair, Wallet} from '@/entrypoints/main/wallet.tsx';

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
		<input type={input.protect ? 'password' : 'text'} onChange={e => onChange(e.target.value)}
			   className="parameter-input" value={input.value} />

		{hasChanged &&
			<div className="flex justify-end items-end space-x-1 mt-1">
				<button className="btn-primary btn-highlight" onClick={onSave}>Save</button>
			</div>
		}
	</>;
}

function InputNumberWithDynamicConfirmSaveComponent(input: {
	value: number | undefined,
	onChange: (value: number) => void,
	onSave: () => void,
}): ReactElement {

	const [hasChanged, setHasChanged] = useState<boolean>(false);


	function onChange(updatedValue: number): void {
		setHasChanged(true);
		input.onChange(updatedValue);
	}

	function onSave() {
		setHasChanged(false);
		input.onSave();
	}

	return <>
		<input type="number" onChange={e => onChange(parseInt(e.target.value))}
			   className="parameter-input" value={input.value} />

		{hasChanged &&
			<div className="flex justify-end items-end space-x-1 mt-1">
				<button className="btn-primary btn-highlight" onClick={onSave}>Save</button>
			</div>
		}
	</>;
}


export default function Parameters() {

	const [wallet, setWallet] = useRecoilState(walletState);
	const activeAccount = useRecoilValue(activeAccountState);


	const navigate = useNavigate();


	// state for the pseudo, email and nonce edition
	const [firstname, setFirstname] = useState(activeAccount?.firstname);
	const [lastname, setLastname] = useState(activeAccount?.lastname);
	const [email, setEmail] = useState(activeAccount?.email);
	const [verifiedEmail, setVerifiedEmail] = useState<boolean>(activeAccount?.emailValidationProof !== undefined);
	const [nonce, setNonce] = useState(activeAccount?.nonce);
	const [showPrivateKeys, setShowPrivateKeys] = useState<boolean>(false);

	// state for account deletion
	const [accountDeletionPseudo, setAccountDeletionPseudo] = useState<string>('');


	// states for the endpoints
	const [nodeEndpoint, setNodeEndpoint] = useState(wallet?.nodeEndpoint);


	// states for the user keys
	const [userPrivateKey, setUserPrivateKey] = useState('');
	const [userPublicKey, setUserPublicKey] = useState('');

	useEffect(() => {
		// load the authentication key pair
		if (!wallet || !activeAccount) return
		console.log("exposing signature keys:", wallet, activeAccount);
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
		if (firstname === '') {
			// TODO notify the user
			console.error('[parameters] cannot update the active account pseudo with an empty pseudo');
			return;
		}


		// update the wallet
		setWallet(wallet => {
			if (!wallet) return undefined;

			// update pseudo, nonce and endpoints
			const accounts = wallet.accounts.map(a => {
				if (a.id !== wallet.activeAccountId) return a;
				return {
					...a,
					firstname: firstname,
					lastname: lastname,
					nonce,
				}
			});

			return {
				...wallet,
				accounts,
				nodeEndpoint
			} as Wallet
		});
	}

	/**
	 * This function is fired when the user wants to delete the current active account.
	 */
	function deleteActiveAccount() {
		if (activeAccount && activeAccount.firstname === accountDeletionPseudo) {
			console.log(`[g] deleting ${activeAccount.firstname}`);
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
		}
	];

	const keysItem = [
		{
			name: "User Authentication Private Key",
			description: "Your private signature authentication key.",
			field: <>
				<div className="parameter-icon-input bg-gray-200 flex flex-column p-2 rounded-md ">
					<svg onClick={() => setShowPrivateKeys(!showPrivateKeys)}
						 xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
						 className="pr-2 mr-2 w-6 h-6 border-r-2 border-gray-300 hover:cursor-pointer"
						 viewBox="0 0 16 16">
						<path
							d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
						<path
							d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
					</svg>

					<input className="block w-full bg-gray-200"
						   type={showPrivateKeys ? 'text' : 'password'} onClick={() => {
						navigator.clipboard.writeText(userPrivateKey);
					}} readOnly={true} value={userPrivateKey}/>
				</div>
			</>
		},
		{
			name: "User Authentication Public Key",
			description: "Your public signature authentication key.",
			field: <>
				<input type="text" onClick={() => {
					navigator.clipboard.writeText(userPublicKey);
				}}
					   className="parameter-input mb-2" readOnly={true} value={userPublicKey}/>
				{userPublicKey &&
					<div className="flex items-end">
						<button
							className="btn-primary btn-highlight"
							onClick={() => {
								window.open(`mailto:?subject=Public%20key&body=Hey%20!%0A%0AHere%20is%20my%20public%20key%3A%0A%0A${userPublicKey}`);
							}}>
							Share your public key
						</button>
					</div>
				}
				</>
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
			field: <input type="text"
						  className="parameter-input mb-2" readOnly={true} value={wallet?.explorerEndpoint || ''}/>
		}
	]

	return <>
		<div className="md:container md:mx-auto flex flex-col space-y-8">

			<div className="flex justify-start mb-2">
				<Typography variant={"h4"}>Parameters</Typography>
			</div>


			<EmailValidation/>
			<GeneralParameters items={generalItems}/>
			<KeysParameters items={keysItem}/>
			<OracleParameters items={oracleItems}/>
			<NetworkParameters items={networkItems}/>


			{wallet?.accounts.length !== 1 &&
				<Card className="parameter-section">
					<CardContent>
						<h2>Dangerous Zone</h2>

						<div className="parameter-group text-red-500">
							<div className="parameter-title">Account Deletion</div>
							<div className="parameter-description">
								Delete the current account named <b>{activeAccount?.firstname}</b>.
								Write your account name below to confirm the deletion.
							</div>
							<input type="text" className="parameter-input" value={accountDeletionPseudo}
								   onChange={e => setAccountDeletionPseudo(e.target.value)}/>
							<div className="flex justify-end items-end space-x-1 mt-1">
								<button className="btn-primary bg-red-500" onClick={deleteActiveAccount}>Delete</button>
							</div>

						</div>
					</CardContent>
				</Card>
			}
		</div>
	</>;
}

type GeneralParametersProps = {
	items: {
		name: string, description: string, field: ReactElement,
	}[]
}
function GeneralParameters({items}: GeneralParametersProps) {
	const content = items.map(it => <div className="parameter-group">
		<div className="parameter-title">{it.name}</div>
		<div className="parameter-description">{it.description}</div>
		{it.field}
	</div>)
	return <Card>
		<CardContent>
			<h2>General</h2>
			{content}
		</CardContent>
	</Card>
}

function KeysParameters({items}: GeneralParametersProps) {
	const content = items.map(it => <div className="parameter-group">
		<div className="parameter-title">{it.name}</div>
		<div className="parameter-description">{it.description}</div>
		{it.field}
	</div>)
	return <Card>
		<CardContent>
			<h2>User Keys</h2>
			{content}
		</CardContent>
	</Card>
}

function OracleParameters({items}: GeneralParametersProps) {
	const content = items.map(it => <div className="parameter-group">
		<div className="parameter-title">{it.name}</div>
		<div className="parameter-description">{it.description}</div>
		{it.field}
	</div>)
	return <Card className="parameter-section">
		<CardContent>
			<h2>Oracles</h2>
			{content}
		</CardContent>
	</Card>
}

function NetworkParameters({items}: GeneralParametersProps) {
	const content = items.map(it => <div className="parameter-group">
			<div className="parameter-title">{it.name}</div>
			<div className="parameter-description">{it.description}</div>
			{it.field}
		</div>)
	return <Card className="parameter-section">
		<CardContent>
			<h2>Network</h2>
			{content}
		</CardContent>
	</Card>
}