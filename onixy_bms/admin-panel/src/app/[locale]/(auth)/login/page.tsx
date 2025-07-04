// login/page.tsx
"use client";

import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("common");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo + Language Switcher Row */}
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <span className="text-lg font-semibold">{t("title.title")}</span>
          </a>
          <LanguageSwitcher />
        </div>

        {/* Login Form Centered */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Side Image on Large Screens */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/logo.png"
          alt="Login Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
