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

import { useState } from "react";
import { SecureWalletStorage } from "@/utils/db/SecureWalletStorage.ts";
import { CarmentisProvider } from "@/utils/CarmentisProvider.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import {useAuthenticationContext} from "@/hooks/useAuthenticationContext.tsx";

// Define the form schema with Zod
const loginSchema = z.object({
    password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
    // recover the wallet update from the context
    const { connect } = useAuthenticationContext();

    // Form state with react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    console.log(errors, isSubmitting)

    // Error state
    const [authError, setAuthError] = useState<string | null>(null);

    /**
     * This function is executed when the user attempts to login in.
     *
     * To login, the application attempts to decrypt the provided seed. If the password fails then the password
     * is considered as invalid.
     */
    const onSubmit = async (data: LoginFormData) => {
        try {
            setAuthError(null);
            const provider = new CarmentisProvider();
            const secureStorage = await SecureWalletStorage.CreateSecureWalletStorage(provider, data.password);
            const wallet = await secureStorage.readWalletFromStorage();
            connect(wallet);
        } catch (error) {
            console.log("An error occurred during the wallet reading: ", error);
            setAuthError("Invalid password. Please try again.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <motion.img
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto h-12 w-auto"
                    src="https://cdn.prod.website-files.com/66018cbdc557ae3625391a87/662527ae3e3abfceb7f2ae35_carmentis-logo-dark.svg"
                    alt="Carmentis"
                />
                <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your wallet
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                aria-autocomplete={'none'}
                                autoComplete="off"
                                autoFocus
                                className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${errors.password || authError ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-500'} 
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-200`}
                                {...register("password")}
                            />
                            {(errors.password || authError) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 text-sm text-red-600"
                                >
                                    {errors.password?.message || authError}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full justify-center items-center rounded-md bg-blue-500 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm
              hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
              disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <Lock className="mr-2 h-4 w-4" />
                        )}
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}

export default Login;
