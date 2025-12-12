"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Lock, Mail, User, Phone } from "lucide-react";
import { registerSchema, RegisterData } from "@/validators/register-schema";
import { registerUser } from "@/services/auth/register";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Proteção: redireciona para login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Enquanto carrega a sessão
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#34393d]">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  // Se não tiver sessão (não logado)
  if (!session) {
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<RegisterData>({
    reValidateMode: "onChange",
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    console.log("📝 Dados do formulário:", data);
    
    setIsLoading(true);
    try {
      console.log("🚀 Enviando requisição para API...");
      const response = await registerUser(data);
      console.log("✅ Resposta da API:", response);
      
      if (response.success) {
        console.log("🎉 Usuário criado com sucesso!");
        alert("Usuário criado com sucesso!"); // ou use toast
        router.push("/servicos"); // ← mude pra página que quiser (dashboard, clientes, etc.)
      }
    } catch (error: any) {
      console.error("❌ Erro ao cadastrar:", error);
      setError("root", {
        type: "manual",
        message: error.message || "Erro ao cadastrar usuário",
      });
    } finally {
      setIsLoading(false);
      console.log("⏹️ Requisição finalizada");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#34393d] px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-card-foreground shadow-lg px-6 py-5 flex flex-col items-center mx-auto">
        <div
          className="w-full max-w-2xl rounded-3xl bg-card px-14 py-10 flex flex-col items-center mx-auto"
          aria-label="Register Form Container"
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
            Criar Novo Usuário
          </h2>

          {errors.root && (
            <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
            </div>
          )}

          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-white text-sm font-medium mb-2 block"
                >
                  Nome:
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite o nome aqui.."
                  {...register("name")}
                  error={errors.name?.message}
                  startContent={<User className="w-5 h-5" />}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </div>
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
                  placeholder="Digite o email aqui.."
                  {...register("email")}
                  error={errors.email?.message}
                  startContent={<Mail className="w-5 h-5" />}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phone"
                  className="text-white text-sm font-medium mb-2 block"
                >
                  Telefone:
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(99) 99999-9999"
                  {...register("phone")}
                  error={errors.phone?.message}
                  startContent={<Phone className="w-5 h-5" />}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
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
                  placeholder="**************"
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
            </div>

            <Button type="submit" disabled={!isValid || isLoading} className="mt-4">
              {isLoading ? "CRIANDO USUÁRIO..." : "CRIAR USUÁRIO"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[#bfc8d0] text-sm">
              <Link
                href="/servicos"
                className="text-[#21c45d] font-semibold hover:underline"
              >
                Voltar para Serviços
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}