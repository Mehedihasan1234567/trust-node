import Link from "next/link";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "../actions";
import { SubmitButton } from "../submit-button";
import { GoogleAuthButton } from "../google-auth-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="landing-page flex min-h-screen items-center justify-center bg-charcoal-900 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden font-general selection:bg-electric-green selection:text-charcoal-900">
      {/* Decorative background elements utilizing globals.css theme colors */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-electric-green/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyber-rose/15 rounded-full blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-[420px] border-white/10 bg-charcoal-800/80 backdrop-blur-xl text-white shadow-2xl rounded-2xl z-10 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-electric-green to-carbon-mint opacity-80"></div>
        <CardHeader className="space-y-3 pb-6 pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-electric-green/10 border border-electric-green/30 mb-2 shadow-[0_0_40px_rgba(0,255,171,0.15)]">
            <Shield className="h-8 w-8 text-electric-green" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight font-clash">Welcome back</CardTitle>
            <CardDescription className="text-base text-[#E0E0E0]">
              Sign in to your TrustNode account
            </CardDescription>
          </div>
        </CardHeader>

        <div className="px-8 pb-4">
          <GoogleAuthButton text="Sign in with Google" />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1C1F26] px-2 text-[#E0E0E0]/50 rounded-md backdrop-blur-md">Or continue with email</span>
            </div>
          </div>
        </div>

        <form action={login}>
          <CardContent className="space-y-5 px-8">
            {message && (
              <div className="flex items-start gap-3 rounded-xl bg-electric-green/10 border border-electric-green/20 p-4 text-sm text-electric-green">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{message}</span>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-11 rounded-lg border-white/10 bg-charcoal-900 text-white placeholder:text-white/30 transition-colors focus:border-electric-green/50 focus:ring-1 focus:ring-electric-green/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-electric-green hover:text-electric-green/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11 rounded-lg border-white/10 bg-charcoal-900 text-white placeholder:text-white/30 transition-colors focus:border-electric-green/50 focus:ring-1 focus:ring-electric-green/50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-5 px-8 pb-8 pt-4">
            <SubmitButton className="w-full h-11 text-base font-bold rounded-lg bg-electric-green text-charcoal-900 border-0 shadow-[0_0_20px_rgba(0,255,171,0.3)] transition-all hover:shadow-[0_0_40px_rgba(0,255,171,0.6)] active:scale-[0.98]">
              Sign in to account
            </SubmitButton>
            <p className="text-center text-sm text-[#E0E0E0]/70">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-electric-green hover:text-electric-green/80 transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
