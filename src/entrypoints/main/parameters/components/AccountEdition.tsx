import React from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    InputAdornment, Link,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {Badge, ContentCopy, DeleteForever, LockReset, Visibility, VisibilityOff} from "@mui/icons-material";
import {AnimatePresence, motion} from "framer-motion";
import {Controller} from "react-hook-form";
import {Account} from "@/types/Account.ts";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {walletState} from "@/states/globals.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import {useAsync, useAsyncFn, useBoolean} from "react-use";
import {CryptoEncoderFactory, ProviderFactory} from "@cmts-dev/carmentis-sdk/client";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {Pencil} from "react-bootstrap-icons";

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
        return <>Deleting account...</>
    }

    return <Grid size={12} key={account.id}>
        <Paper elevation={0} className="p-6 border border-gray-100 rounded-lg mb-4">
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center">
                    <Avatar
                        className="bg-blue-100 text-blue-600 mr-4"
                        sx={{ width: 48, height: 48 }}
                    >
                        {pseudo.charAt(0) || ''}
                    </Avatar>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                        Account {accountIndex + 1}
                        {account.id === wallet.activeAccountId && (
                            <Chip
                                label="Active"
                                size="small"
                                className="ml-2 bg-green-100 text-green-600 font-medium"
                            />
                        )}
                    </Typography>
                </Box>
                <>
                    <Button
                        onClick={saveAccount}
                        disabled={isSaving}
                        size="small"
                    >
                        <Pencil fontSize="small" className="mr-2" />
                        Save
                    </Button>
                </>
                {wallet?.accounts.length > 1 && (
                   <>
                       <Button
                           color="error"
                           onClick={deleteAccount}
                           disabled={isDeleting}
                           size="small"
                           className="text-red-500 hover:bg-red-50"
                       >
                           <DeleteForever fontSize="small" />
                           Delete
                       </Button>
                   </>
                )}
            </Box>
            <Grid container spacing={3}>
                <Grid size={6}>
                    <TextField
                        label="Account Name"
                        variant="outlined"
                        fullWidth
                        value={pseudo}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Badge fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => setPseudo(e.target.value)}
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        label="Account Nonce"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={nonce}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockReset fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNonce(Number.parseInt(value))
                        }}
                    />
                </Grid>

                <Grid size={12}>
                    <TextField
                        label={"Public Key"}
                        fullWidth
                        variant="outlined"
                        value={shownPublicKey}
                        InputProps={{
                            readOnly: true,
                            className: "font-mono text-sm",
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Copy to clipboard">
                                        <IconButton
                                            onClick={() => {
                                                navigator.clipboard.writeText(shownPublicKey);
                                                toast.success("Public key copied to clipboard");
                                            }}
                                            edge="end"
                                        >
                                            <ContentCopy />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" className="mt-1 block">
                        This is the public key associated with this account and its current nonce.
                        Providing this key with a system is useful to identity the used scheme.
                        {
                            accountHash &&
                            <>
                                Note: Your account hash is <Link target={'_blank'} href={wallet.explorerEndpoint + `/accounts/hash/${accountHash}`}>
                                    <Typography component={"span"} variant={"caption"} fontSize={"10pt"}>
                                        {accountHash}
                                    </Typography>
                                </Link>
                            </>
                        }
                    </Typography>
                </Grid>

                {/* Private Key Field */}
                <Grid size={12} >
                    <TextField
                        label={"Private key"}
                        fullWidth
                        variant="outlined"
                        type={isPrivateKeyVisible ? 'text' : 'password'}
                        value={shownPrivateKey}
                        InputProps={{
                            readOnly: true,
                            className: "font-mono text-sm",
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={isPrivateKeyVisible ? "Hide private key" : "Show private key"}>
                                        <IconButton
                                            onClick={() => setIsPrivateKeyVisible(!isPrivateKeyVisible)}
                                            edge="end"
                                        >
                                            {isPrivateKeyVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Copy to clipboard">
                                        <IconButton
                                            onClick={() => {
                                                navigator.clipboard.writeText(shownPrivateKey);
                                                toast.success("Private key copied to clipboard");
                                            }}
                                            edge="end"
                                        >
                                            <ContentCopy />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" className="mt-1 block">
                        <strong>Warning:</strong> Never share your private key with anyone. It provides full access to your account.
                    </Typography>
                </Grid>

            </Grid>
        </Paper>
    </Grid>
}