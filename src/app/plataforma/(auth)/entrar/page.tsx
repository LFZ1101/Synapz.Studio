import Link from "next/link";
import { AuthCard } from "@/components/plataforma/AuthCard";
import {
  AuthField,
  AuthSubmit,
  IconLock,
  IconMail,
} from "@/components/plataforma/AuthField";
import { ActionForm } from "@/components/plataforma/ActionForm";
import { actionLogin } from "@/lib/plataforma/actions";
import { hasOwner, isBootstrapConfigured } from "@/lib/plataforma/auth";

export const metadata = { title: "Entrar" };

async function loginAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionLogin(formData);
}

export default async function LoginPage() {
  const showBootstrap = isBootstrapConfigured() && !hasOwner();

  return (
    <AuthCard
      eyebrow="Acesse sua conta"
      title="Entre na"
      titleAccent="plataforma."
      description="Use suas credenciais para abrir a central operacional da SYNAPZ STUDIO."
      footer={
        <div className="sz-auth-footer-links">
          <p>
            <Link href="/plataforma/recuperar">Esqueci a senha</Link>
          </p>
          {showBootstrap ? (
            <p>
              Primeira conta?{" "}
              <Link href="/plataforma/bootstrap">Ativar proprietário</Link>
            </p>
          ) : (
            <p className="sz-auth-muted">
              Novos membros entram por convite do proprietário.
            </p>
          )}
        </div>
      }
    >
      <ActionForm action={loginAction} className="sz-auth-form">
        <AuthField
          label="E-mail"
          index="01"
          icon={<IconMail />}
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@email.com"
        />
        <AuthField
          label="Senha"
          index="02"
          icon={<IconLock />}
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          placeholder="Sua senha"
          showPasswordToggle
        />
        <div className="sz-auth-help">
          <label className="sz-auth-remember">
            <input type="checkbox" name="remember" defaultChecked />
            <i aria-hidden />
            <span>Salvar sessão</span>
          </label>
          <Link href="/plataforma/recuperar" className="sz-auth-help-link">
            Esqueci a senha
          </Link>
        </div>
        <AuthSubmit>Entrar na dashboard</AuthSubmit>
      </ActionForm>
    </AuthCard>
  );
}
