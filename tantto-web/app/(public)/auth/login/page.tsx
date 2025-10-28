"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, Lock, Mail } from "lucide-react";
import { LoginFormValues, loginSchema } from "@/validators/login-schema";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    reValidateMode: "onChange",
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    // TODO: Implementar autenticação
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#34393d] px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl bg-card-foreground shadow-lg px-6 py-5 flex flex-col items-center mx-auto ">
        <div
          className="w-full max-w-lg rounded-3xl bg-card px-14 py-10 flex flex-col items-center mx-auto "
          aria-label="Login Form Container"
        >
          <div>
            <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-tr from-[#21c45d] via-[#ffd812] to-[#3483bd]">
              <span className="sr-only">Logo Tantto</span>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="32"
                  height="32"
                  rx="8"
                  fill="#21c45d"
                />
                <rect
                  x="10"
                  y="10"
                  width="16"
                  height="16"
                  rx="4"
                  fill="#ffd812"
                />
                <rect
                  x="18"
                  y="18"
                  width="8"
                  height="8"
                  rx="2"
                  fill="#3483bd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">
            Bem-Vindo de Volta!
          </h2>
          <form
            className="w-full flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="text-white text-sm font-medium mb-2 block"
              >
                Email:
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email aqui.."
                {...register("email")}
                error={errors.email?.message}
                startContent={<Mail className="w-5 h-5 " />}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-white text-sm font-medium mb-2 block"
              >
                Senha:
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                {...register("password")}
                error={errors.password?.message}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                startContent={<Lock className="w-5 h-5" />}
                endContent={<EyeIcon className="w-5 h-5 " />}
                onEndContentClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="w-full text-center">
              <Link
                href="#"
                className="text-xs text-[#bfc8d0] hover:underline"
                tabIndex={0}
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Button type="submit" disabled={!isValid}>
              ENTRAR
            </Button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-[#bfc8d0] text-sm">
              Não tem uma conta?{" "}
              <a
                href="#"
                className="text-[#21c45d] font-semibold hover:underline"
              >
                Cadastre-se
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
