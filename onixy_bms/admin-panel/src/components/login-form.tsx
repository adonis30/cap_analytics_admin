"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/services/api";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("common");
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
       
      const res = await login(data).unwrap();
      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  let errorMessage: string | null = null;
  if (typeof error !== "undefined" && "data" in error) {
    const maybeData = error.data as { message?: string } | undefined;
    errorMessage = maybeData?.message ?? t("login.errorMessage");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("title.title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("login.description")}
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">{t("login.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            {...register("email")}
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">{t("login.password")}</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t("login.forgotPassword")}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register("password")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("login.loading") : t("login.loginButton")}
        </Button>

        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            {t("login.or")}
          </span>
        </div>

        <Button variant="outline" className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4 mr-2"
          >
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577..."
              fill="currentColor"
            />
          </svg>
          {t("login.loginWithGithub")}
        </Button>
      </div>

      <div className="text-center text-sm">
        {t("login.noAccount")}{" "}
        <a href="#" className="underline underline-offset-4">
          {t("login.registerButton")}
        </a>
      </div>
    </form>
  );
}
