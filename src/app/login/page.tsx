"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ErrorWithResponse, useAuth } from "@/hooks/useApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";

// Componente separado para usar useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/vistorias");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Verificar se veio do cadastro
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Conta criada com sucesso! Faça login para continuar.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center flex flex-col items-center justify-center">
        <img src="/logo.png" alt="Logo" />
        <h2 className="mt-6 text-3xl text-gray-900">Sistema de Vistorias</h2>
        <p className="mt-2 text-sm text-gray-600">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>

      <Card>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={isLoggingIn}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Entrando..." : "Entrar no Sistema"}
          </Button>
        </form>
      </Card>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link
            href="/cadastro"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Criar conta
          </Link>
        </p>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Sistema de vistorias veiculares v1.0</p>
      </div>
    </div>
  );
}

// Loading fallback
function LoginLoading() {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="mt-6 h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="mt-2 h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-lg w-full space-y-8">
        <Suspense fallback={<LoginLoading />}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
