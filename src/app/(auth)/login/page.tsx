"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import {
  loginSchema,
  type LoginInput,
} from "@/lib/validations/user";

export default function LoginPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid email or password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-white px-4 py-6">
      <section
        aria-labelledby="login-title"
        className="
          relative
          w-full
          max-w-[500px]
          rounded-[22px]
          border
          border-deep-teal/15
          bg-card
          px-5
          py-7
          shadow-[0_4px_18px_rgba(6,63,58,0.05)]
          sm:px-9
          sm:py-8
        "
      >
        {/* Subtle inner brand border */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[4px]
            rounded-[18px]
            border
            border-gold/15
          "
        />

        <div className="relative">
          {/* Brand */}
          <header className="text-center">
            {/* Minimal brand mark */}
            <div
              aria-hidden="true"
              className="mx-auto mb-2 h-[42px] w-[36px]"
            >
              <div className="relative h-full w-full">
                {/* Outer arch */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-[35px]
                    w-[29px]
                    -translate-x-1/2
                    rounded-t-[16px]
                    border-[3px]
                    border-b-0
                    border-deep-teal
                  "
                />

                {/* Inner arch */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-[27px]
                    w-[20px]
                    -translate-x-1/2
                    rounded-t-[11px]
                    border-[3px]
                    border-b-0
                    border-emerald
                  "
                />

                {/* Gold center */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-[16px]
                    w-[9px]
                    -translate-x-1/2
                    rounded-t-[5px]
                    bg-gold
                  "
                />

                {/* Crescent */}
                <div
                  className="
                    absolute
                    -top-1
                    left-1/2
                    h-[9px]
                    w-[9px]
                    -translate-x-1/2
                    rounded-full
                    bg-gold
                  "
                />

                <span
                  className="
                    absolute
                    left-[calc(50%+3px)]
                    top-0
                    h-[8px]
                    w-[8px]
                    rounded-full
                    bg-card
                  "
                />
              </div>
            </div>

            <p className="text-[23px] font-normal tracking-[-0.02em] text-deep-teal">
              Noor Al Haramain
            </p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-gold">
              Admin Panel
            </p>

            {/* Gold divider */}
            <div
              aria-hidden="true"
              className="mx-auto mt-4 flex max-w-[125px] items-center"
            >
              <span className="h-px flex-1 bg-gold/25" />

              <span className="mx-2 h-[5px] w-[5px] rotate-45 bg-gold/75" />

              <span className="h-px flex-1 bg-gold/25" />
            </div>
          </header>

          {/* Welcome */}
          <div className="mt-5 text-center">
            <h1
              id="login-title"
              className="text-[22px] font-normal tracking-[-0.015em] text-deep-teal"
            >
              Welcome Back
            </h1>

            <p className="mt-1 text-[13px] text-muted-teal">
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mx-auto mt-6 max-w-[410px] space-y-4"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-charcoal"
              >
                Email address
              </label>

              <div className="relative">
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-2
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-md
                    bg-emerald/[0.05]
                    text-deep-teal
                  "
                >
                  <Mail size={16} strokeWidth={1.6} />
                </div>

                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Enter your email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "email-error" : undefined
                  }
                  {...register("email")}
                  className="
                    h-[48px]
                    w-full
                    rounded-[12px]
                    border
                    border-soft-beige
                    bg-warm-white
                    pl-[52px]
                    pr-4
                    text-[13px]
                    text-charcoal
                    outline-none
                    transition-colors
                    duration-200
                    placeholder:text-muted-teal/55
                    hover:border-deep-teal/20
                    focus:border-emerald
                    focus:bg-card
                    focus:ring-4
                    focus:ring-emerald/10
                  "
                />
              </div>

              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-1 px-1 text-[11px] text-red-600"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[13px] font-medium text-charcoal"
                >
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="
                    text-[11px]
                    text-muted-teal
                    transition-colors
                    hover:text-gold
                    focus-visible:text-gold
                  "
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-2
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-md
                    bg-emerald/[0.05]
                    text-deep-teal
                  "
                >
                  <LockKeyhole size={16} strokeWidth={1.6} />
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password")}
                  className="
                    h-[48px]
                    w-full
                    rounded-[12px]
                    border
                    border-soft-beige
                    bg-warm-white
                    pl-[52px]
                    pr-[48px]
                    text-[13px]
                    text-charcoal
                    outline-none
                    transition-colors
                    duration-200
                    placeholder:text-muted-teal/55
                    hover:border-deep-teal/20
                    focus:border-emerald
                    focus:bg-card
                    focus:ring-4
                    focus:ring-emerald/10
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-md
                    text-muted-teal
                    transition-colors
                    hover:bg-emerald/[0.05]
                    hover:text-deep-teal
                  "
                >
                  {showPassword ? (
                    <EyeOff size={17} strokeWidth={1.6} />
                  ) : (
                    <Eye size={17} strokeWidth={1.6} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1 px-1 text-[11px] text-red-600"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div
                role="alert"
                className="
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-3
                  py-2
                  text-[12px]
                  text-red-700
                "
              >
                {serverError}
              </div>
            )}

            {/* Sign in */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex
                h-[48px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-deep-teal
                bg-deep-teal
                text-[13px]
                font-medium
                text-white
                shadow-[0_4px_12px_rgba(6,63,58,0.10)]
                transition-all
                duration-200
                hover:bg-dark-teal
                hover:shadow-[0_5px_15px_rgba(6,63,58,0.14)]
                active:translate-y-px
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <LockKeyhole
                size={15}
                strokeWidth={1.7}
                className="text-gold"
              />

              <span>
                {isSubmitting ? "Signing In…" : "Sign In"}
              </span>
            </button>
          </form>

          {/* Quiet footer */}
          <p className="mt-4 text-center text-[9px] uppercase tracking-[0.14em] text-muted-teal/45">
            Secure administration access
          </p>
        </div>
      </section>
    </main>
  );
}
