import React, {useState} from 'react';
import {
    Button,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Tooltip
} from '@mui/material';
import {Badge, ContentCopy, DeleteForever, LockReset, Visibility, VisibilityOff, Save} from "@mui/icons-material";
import {Account} from "@/types/Account.ts";
import {useSetRecoilState} from "recoil";
import {walletState} from "@/states/globals.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import {useAsync, useAsyncFn, useBoolean} from "react-use";
import {CryptoEncoderFactory, ProviderFactory} from "@cmts-dev/carmentis-sdk/client";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {useToast} from "@/hooks/useToast.tsx";

export interface AccountEditionProps {
    account: Account,
    index: number,
}

/**
 * This component is used to edit an account.
 *
 * @param props
 * @constructor
 */
export function AccountEdition(props: AccountEditionProps) {
    const wallet = useWallet();
    const setWallet = useSetRecoilState(walletState);
    const {account, index: accountIndex} = props;
    const toast = useToast();
    const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useBoolean(false);
    const blockchain = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint);

    // define account information that will be edited
    const accountId = account.id;
    const [pseudo, setPseudo] = useState(account.pseudo);
    const [nonce, setNonce] = useState(account.nonce);

    // compute the encoded key pair associated to the provided account
    const {value: encodedKeyPair, error} = useAsync(async () => {
        const encoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
        const keyPair = await getUserKeyPair(wallet, account);
        //const accountHash = (await blockchain.getAccountHashFromPublicKey(keyPair.publicKey)).encode();
        const encodedPublicKey = await encoder.encodePublicKey(keyPair.publicKey);
        const encodedPrivateKey = await encoder.encodePrivateKey(keyPair.privateKey);
        return { encodedPublicKey, encodedPrivateKey };
    }, [wallet, account]);

    // compute the account hash associated with the provided account
    const {value: accountHash, error: accountHashError} = useAsync(async () => {
        const keyPair = await getUserKeyPair(wallet, account);
        return await blockchain.getAccountIdByPublicKey(keyPair.publicKey);
    }, [wallet, account]);




    // We show an empty key pair while the key pair is being loaded
    const isComputingKeyPair = encodedKeyPair === undefined;
    const shownPublicKey = isComputingKeyPair ? '' : encodedKeyPair.encodedPublicKey;
    const shownPrivateKey =  isComputingKeyPair ? '' : encodedKeyPair.encodedPrivateKey;

    // we define a method to delete the account
    const [{loading: isDeleting}, deleteAccount] = useAsyncFn(async () => {
        setWallet(wallet => {
            // we ignore the request when the wallet is undefined
            if (!wallet) return undefined;

            // filter the accounts to remove the current one
            const accounts = wallet.accounts.filter(a => a.id !== accountId);
            if (accounts.length === 0) {
                toast.error("Cannot delete the last account");
                return wallet;
            }

            // If deleting the active account, set the first account as active
            const newActiveId = wallet.activeAccountId === accountId ? accounts[0].id : wallet.activeAccountId;

            // notify the successful deletion
            toast.success(`Account '${pseudo}' deleted successfully`);

            return {...wallet, accounts, activeAccountId: newActiveId};
        });
    })

    // we define a method to save the account
    const [{loading: isSaving}, saveAccount] = useAsyncFn(async () => {
        setWallet(wallet => {
            // we ignore the request when the wallet is undefined
            if (!wallet) return undefined;

            // update the current account
            const accounts = wallet.accounts.map(a => {
                // we keep other accounts unchanged
                const isAnotherAccount = a.id !== accountId;
                if (isAnotherAccount) return a;

                // we update the current account
                return {
                    ...a,
                    pseudo,
                    nonce
                }
            });


            return {...wallet, accounts};
        });
    }, [pseudo, nonce])

    if (isDeleting) {
        return <div className="text-sm text-gray-600">Deleting account...</div>
    }

    return <div key={account.id} className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-medium">
                    {pseudo.charAt(0) || '?'}
                </div>
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        Account {accountIndex + 1}
                    </h3>
                    {account.id === wallet.activeAccountId && (
                        <span className="inline-block text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Active
                        </span>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={saveAccount}
                    disabled={isSaving}
                    variant="contained"
                    size="small"
                    startIcon={<Save fontSize="small" />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' }
                    }}
                >
                    Save
                </Button>
                {wallet?.accounts.length > 1 && (
                    <Button
                        color="error"
                        onClick={deleteAccount}
                        disabled={isDeleting}
                        size="small"
                        startIcon={<DeleteForever fontSize="small" />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                        }}
                    >
                        Delete
                    </Button>
                )}
            </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={pseudo}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Badge fontSize="small" className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0.5rem',
                                '& fieldset': { borderColor: '#e5e7eb' },
                                '&:hover fieldset': { borderColor: '#d1d5db' },
                                '&.Mui-focused fieldset': { borderColor: '#93c5fd', borderWidth: '1px' },
                            }
                        }}
                        onChange={(e) => setPseudo(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Nonce</label>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        type="number"
                        value={nonce}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockReset fontSize="small" className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0.5rem',
                                '& fieldset': { borderColor: '#e5e7eb' },
                                '&:hover fieldset': { borderColor: '#d1d5db' },
                                '&.Mui-focused fieldset': { borderColor: '#93c5fd', borderWidth: '1px' },
                            }
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNonce(Number.parseInt(value))
                        }}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Public Key</label>
                <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={shownPublicKey}
                    InputProps={{
                        readOnly: true,
                        className: "font-mono text-sm bg-gray-50",
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Copy to clipboard">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            navigator.clipboard.writeText(shownPublicKey);
                                            toast.success("Public key copied to clipboard");
                                        }}
                                    >
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '0.5rem',
                            backgroundColor: '#f9fafb',
                            '& fieldset': { borderColor: '#e5e7eb' },
                        }
                    }}
                />
                <div className="text-xs text-gray-500 mt-1.5">
                    Public key for this account.
                    {accountHash && (
                        <> Account hash: <Link target="_blank" href={wallet.explorerEndpoint + `/accounts/hash/${accountHash}`} className="text-blue-600 hover:underline">
                            {accountHash}
                        </Link></>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Private Key</label>
                <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    type={isPrivateKeyVisible ? 'text' : 'password'}
                    value={shownPrivateKey}
                    InputProps={{
                        readOnly: true,
                        className: "font-mono text-sm bg-gray-50",
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title={isPrivateKeyVisible ? "Hide" : "Show"}>
                                    <IconButton
                                        size="small"
                                        onClick={() => setIsPrivateKeyVisible(!isPrivateKeyVisible)}
                                    >
                                        {isPrivateKeyVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Copy">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            navigator.clipboard.writeText(shownPrivateKey);
                                            toast.success("Private key copied to clipboard");
                                        }}
                                    >
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '0.5rem',
                            backgroundColor: '#f9fafb',
                            '& fieldset': { borderColor: '#e5e7eb' },
                        }
                    }}
                />
                <div className="text-xs text-red-600 mt-1.5">
                    <strong>Warning:</strong> Never share your private key. It provides full access to your account.
                </div>
            </div>
        </div>
    </div>
}