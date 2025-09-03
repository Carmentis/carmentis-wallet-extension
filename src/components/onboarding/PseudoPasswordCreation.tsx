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

import { useLocation, useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import {
  onboardingAccountNameAtom,
  onboardingPasswordAtom
} from "@/components/onboarding/onboarding.state.ts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Person, Lock, ShieldLock, CheckCircle, ArrowRight } from "react-bootstrap-icons";

// Define the form schema with Zod
const formSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge this statement" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export function PseudoPasswordCreation() {
  // Recoil state
  const [accountName, setAccountName] = useRecoilState(onboardingAccountNameAtom);
  const [password, setPassword] = useRecoilState(onboardingPasswordAtom);

  // Navigation
  const navigate = useNavigate();
  const location = useLocation();
  const nextStep = location.state?.nextStep;
  const target = nextStep ? nextStep : "/recovery-phrase";

  // Form handling with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      accountName: accountName,
      password: password,
      confirmPassword: "",
      consent: false,
    },
  });

  // Watch password for strength indicator
  const watchedPassword = watch("password", "");

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  const getStrengthColor = (strength: number) => {
    if (strength === 0) return "bg-gray-200";
    if (strength < 3) return "bg-red-500";
    if (strength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength === 0) return "";
    if (strength < 3) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  // Form submission handler
  const onSubmit = (data: FormData) => {
    // Update Recoil state
    setAccountName(data.accountName);
    setPassword(data.password);

    // Navigate to next step
    navigate(target);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <div className="flex flex-col md:flex-row md:items-stretch md:gap-8">
        {/* Left column - Explanation */}
        <div className="flex flex-col md:w-1/2 md:border-r md:border-gray-100 md:pr-6 pb-6 md:pb-0">
          <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-4">Create your wallet</motion.h1>

          <motion.div variants={itemVariants} className="bg-blue-50 p-4 mb-6 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700 flex items-start">
              <ShieldLock className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
              This password unlocks your wallet only on this device. Carmentis cannot recover your password if you lose it.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-medium text-gray-800">Why create a wallet?</h2>
            <p className="text-gray-600">
              Your Carmentis wallet is your gateway to the blockchain. It allows you to securely store, send, and receive digital assets.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Security Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                  Use a strong, unique password
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                  Never share your recovery phrase
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                  Keep your device secure
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Right column - Form */}
        <div className="flex flex-col md:w-1/2 md:pl-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Account name field */}
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Person className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="accountName"
                    type="text"
                    autoFocus
                    placeholder="Enter your first name"
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
                      errors.accountName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                    } shadow-sm placeholder:text-gray-400 focus:ring-4 focus:outline-none sm:text-sm transition-all`}
                    {...register("accountName")}
                  />
                  {errors.accountName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.accountName.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
                      errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                    } shadow-sm placeholder:text-gray-400 focus:ring-4 focus:outline-none sm:text-sm transition-all`}
                    {...register("password")}
                  />
                  {watchedPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`} 
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-500">{getStrengthText(passwordStrength)}</span>
                      </div>
                      <ul className="text-xs text-gray-500 space-y-1 mt-2 bg-gray-50 p-2 rounded-lg">
                        <li className={`flex items-center ${watchedPassword.length >= 8 ? 'text-green-600' : ''}`}>
                          <CheckCircle className={`h-3 w-3 mr-1 ${watchedPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                          At least 8 characters
                        </li>
                        <li className={`flex items-center ${/[A-Z]/.test(watchedPassword) ? 'text-green-600' : ''}`}>
                          <CheckCircle className={`h-3 w-3 mr-1 ${/[A-Z]/.test(watchedPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                          At least one uppercase letter
                        </li>
                        <li className={`flex items-center ${/[a-z]/.test(watchedPassword) ? 'text-green-600' : ''}`}>
                          <CheckCircle className={`h-3 w-3 mr-1 ${/[a-z]/.test(watchedPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                          At least one lowercase letter
                        </li>
                        <li className={`flex items-center ${/[0-9]/.test(watchedPassword) ? 'text-green-600' : ''}`}>
                          <CheckCircle className={`h-3 w-3 mr-1 ${/[0-9]/.test(watchedPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                          At least one number
                        </li>
                      </ul>
                    </div>
                  )}
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Confirm Password field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                    } shadow-sm placeholder:text-gray-400 focus:ring-4 focus:outline-none sm:text-sm transition-all`}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Consent checkbox */}
            <motion.div variants={itemVariants} className="flex items-start mt-6 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center h-5">
                <input
                  id="consent"
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                  {...register("consent")}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="consent" className="text-gray-700">
                  I understand that Carmentis cannot help me recover my password if I lose it.
                </label>
                {errors.consent && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.consent.message}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg 
                shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 
                focus:outline-none focus:ring-4 focus:ring-blue-200
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
