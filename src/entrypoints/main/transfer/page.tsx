import {Button, Card, CardContent, TextField, Typography} from '@mui/material';
import Avatar from 'boring-avatars';
import {
    activeAccountState,
    useAuthenticatedAccount,
    walletState
} from '@/entrypoints/contexts/authentication.context.tsx';
import {atom, useRecoilState, useRecoilValue} from 'recoil';
import {Formatter} from '@/entrypoints/main/Formatter.tsx';
import {transferTokensToPublicKey} from '@/entrypoints/components/hooks/sdk.hook.tsx';
import {getUserKeyPair} from '@/entrypoints/main/wallet.tsx';
import {Encoders} from '@/entrypoints/main/Encoders.tsx';
import {useToast} from "@/entrypoints/components/authentication-manager.tsx";

const tokenTransferState = atom({
	key: 'transferPublicKeyState',
	default: { publicKey: '', tokenAmount: 0 }
})
export default function TokenTransferPage() {

	return <div className={"flex flex-col justify-center items-center space-y-12"}>
		<TransferGraphic/>
		<TransferForm/>
	</div>
}

function TransferForm() {
	const wallet = useRecoilValue(walletState);
	const activeAccount = useRecoilValue(activeAccountState);
	const toast = useToast();

	const [tokenTransfer, setTokenTransfert] = useRecoilState(tokenTransferState);

	function updatePublicKey(newPublicKey: string) {
		setTokenTransfert(old => {
			return {
				...old,
				publicKey: newPublicKey
			}
		})
	}

	function updateTokenAmount(newTokenAmount: number) {
		setTokenTransfert(old => {
			return {
				...old,
				tokenAmount: newTokenAmount
			}
		})
	}

	function initiateTransfer() {
		if (!wallet || !activeAccount) return;
		const executeTransfer = async () => {
			const userKeyPair = await getUserKeyPair(wallet, activeAccount);
			console.log("user key pair (pk):", userKeyPair.publicKey)
			const response = await transferTokensToPublicKey(
				Encoders.ToHexa(userKeyPair.privateKey),
				Encoders.ToHexa(userKeyPair.publicKey),
				tokenTransfer.publicKey,
				tokenTransfer.tokenAmount
			);
			console.log(response)
		}

		executeTransfer().then(() => toast.success("Tokens successfully transferred")).catch(toast.error)
	}

	return <Card className={"w-auto "}>
		<CardContent className={'p-8 space-y-4 w-96'}>
			<div className="my-5">
				<TransferIcon />
			</div>
			<Typography>Transfer your tokens to a given address.</Typography>
			<div>
				<label>Public key</label>
				<TextField
					onChange={e => updatePublicKey(e.target.value)}
					className={'w-full'}
					placeholder={'0x123456'}
				/>
			</div>
			<div>
				<label>Amount</label>
				<TextField
					onChange={e => updateTokenAmount(parseInt(e.target.value))}
					type={'number'}
					className={'w-full'}
				/>
			</div>

			<Button variant={'contained'} className={'w-full'} onClick={initiateTransfer}>Transfer</Button>
		</CardContent>
	</Card>
}

function TransferIcon() {
	return <div className={"flex justify-center items-center"}>
		<div className={"rounded-full bg-blue-300 w-20 h-20 flex justify-center items-center"}>
			<i className={'bi bi-arrow-left-right text-2xl'}></i>
		</div>
	</div>
}

function TransferGraphic() {
	const tokenTransfer = useRecoilValue(tokenTransferState);
	const activeAccount = useAuthenticatedAccount();
	return <div className={"flex space-x-32 justify-center items-center"}>
		<div className={"w-24 flex flex-col justify-center items-center space-y-4"}>
			<Avatar name={activeAccount.pseudo} variant={"beam"} />
			<Typography variant={"h6"}>{activeAccount.pseudo}</Typography>
		</div>
		<i className={"bi bi-arrow-right text-3xl"}></i>
		<div className={"w-24  flex flex-col justify-center items-center space-y-4"}>
			<Avatar name={tokenTransfer.publicKey} variant={"beam"} />
			{ tokenTransfer.publicKey &&
				<Typography variant={"h6"}>{Formatter.cropPublicKey(tokenTransfer.publicKey)}</Typography>
			}
			{ !tokenTransfer.publicKey &&
				<Typography variant={"h6"} color={"textDisabled"} className={"text-gray-50"}>0123...F41</Typography>
			}
		</div>
	</div>
}