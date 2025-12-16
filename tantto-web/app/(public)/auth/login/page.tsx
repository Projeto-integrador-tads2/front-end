"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Lock, Mail } from "lucide-react";
import { LoginData, loginSchema } from "@/validators/login-schema";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { logIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginData>({
    reValidateMode: "onChange",
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    logIn(data);
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#34393d] px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl bg-card-foreground shadow-lg px-6 py-5 flex flex-col items-center mx-auto ">
        <div
          className="w-full max-w-lg rounded-3xl bg-card px-14 py-10 flex flex-col items-center mx-auto "
          aria-label="Login Form Container"
        >
          <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-3">
            <span className="sr-only">Logo Tantto</span>
            <Image
              src="/logo-tantto.png"
              alt="Logo da empresa"
              width={60}
              height={60}
            />
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
                placeholder="Digite sua senha aqui.."
                {...register("password")}
                error={errors.password?.message}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                startContent={<Lock className="w-5 h-5" />}
                endContent={
                  showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )
                }
                onEndContentClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <Button type="submit" disabled={!isValid}>
              ENTRAR
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
