import Link from "next/link";
import { AuthCard } from "@/components/plataforma/AuthCard";
import {
  AuthField,
  AuthSubmit,
  IconLock,
} from "@/components/plataforma/AuthField";
import { ActionForm } from "@/components/plataforma/ActionForm";
import { actionResetPassword } from "@/lib/plataforma/actions";

export const metadata = { title: "Redefinir senha" };

async function resetAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionResetPassword(formData);
}

export default async function RedefinirPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthCard
        eyebrow="Link inválido"
        title="Token"
        titleAccent="ausente."
        description="Abra o link completo enviado para o seu e-mail."
        footer={
          <Link href="/plataforma/recuperar" className="sz-auth-help-link">
            Solicitar novo link
          </Link>
        }
      >
        <p className="sz-auth-muted">Não foi possível validar este acesso.</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="Segurança"
      title="Nova"
      titleAccent="senha."
      description="Defina uma senha com pelo menos 8 caracteres."
      visualTitle="Sessões encerradas."
      visualDescription="Ao salvar, as sessões anteriores desta conta são invalidadas."
      footer={
        <Link href="/plataforma/entrar" className="sz-auth-help-link">
          Voltar ao login
        </Link>
      }
    >
      <ActionForm action={resetAction} className="sz-auth-form">
        <input type="hidden" name="token" value={token} />
        <AuthField
          label="Nova senha"
          index="01"
          icon={<IconLock />}
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          showPasswordToggle
        />
        <AuthSubmit>Salvar senha</AuthSubmit>
      </ActionForm>
    </AuthCard>
  );
}
