"use client";

import Image from "next/image";
import { useState } from "react";
import { AxiosError } from "axios";
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth.service";


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);
            router.push("/admin/dashboard");
        } catch (error) {
            const axiosError = error as AxiosError;
            const message =
                (axiosError.response?.data as { message?: string } | undefined)?.message ||
                axiosError.message ||
                "Connection refused. Is your NestJS server running?";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="flex min-h-screen items-center justify-center bg-primary p-4 text-white">
            <div className="w-full max-w-[450px] bg-primary border border-secondary rounded-[8px] hover:border-blue-500/50 p-8 shadow-2xl">
                <button
                    onClick={() => router.push("/")}
                    className="mb-8 flex items-center text-sm transition-colors text-secondary hover:text-secondary/50"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Home
                </button>

                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[8px] border border-indigo-500/30 bg-secondary p-3">
                        {/* <Image src="/logo.jpg" alt="DCS logo" width={72} height={72} className="h-full w-full object-contain" /> */}
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-secondary">Dental Compliance</h1>
                    <p className="mt-1 text-sm text-gray-400">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error ? (
                        <div className="mb-4 flex items-center gap-2 rounded-[8px] border border-red-900/50 bg-[#1f1616] px-4 py-3 text-[#f87171] animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-xs font-medium">{error}</p>
                        </div>
                    ) : null}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-secondary">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            placeholder="Enter your email"
                            className="w-full border text-secondary border-secondary rounded-[8px] hover:border-blue-500/50 bg-primary placeholder:text-secondary px-4 py-3 text-sm transition-colors focus:text-secondary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-secondary">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                placeholder="Enter your password"
                                className="w-full border text-secondary border-secondary rounded-[8px] hover:border-blue-500/50 bg-primary placeholder:text-secondary px-4 py-3 text-sm transition-colors focus:text-secondary focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-secondary py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-secondary/80"
                    >
                        <LogIn size={18} />
                        {loading ? "Logging in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 space-y-2 text-center">
                    <p className="text-sm text-gray-400">
                        Don&apos;t have an account?{" "}
                        <span className="text-secondary">
                            Sign Up
                        </span>
                    </p>
                    <p className="text-sm text-gray-400">
                        Have an invite?{" "}
                        <span className="text-secondary">
                            Join via invite link
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
