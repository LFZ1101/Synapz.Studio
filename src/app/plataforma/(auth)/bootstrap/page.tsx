import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/plataforma/AuthCard";
import {
  AuthField,
  AuthSubmit,
  IconKey,
  IconLock,
  IconMail,
  IconUser,
} from "@/components/plataforma/AuthField";
import { ActionForm } from "@/components/plataforma/ActionForm";
import { actionBootstrap } from "@/lib/plataforma/actions";
import { hasOwner, isBootstrapConfigured } from "@/lib/plataforma/auth";

export const metadata = { title: "Bootstrap" };

async function bootstrapAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionBootstrap(formData);
}

export default async function BootstrapPage() {
  if (!isBootstrapConfigured()) {
    return (
      <AuthCard
        eyebrow="Bootstrap"
        title="Ativação"
        titleAccent="bloqueada."
        description="Defina PLATFORM_BOOTSTRAP_SECRET no servidor para criar o proprietário com segurança."
        visualTitle="Ambiente sem chave."
        visualDescription="O primeiro visitante nunca recebe papel de proprietário automaticamente."
        footer={
          <Link href="/plataforma/entrar" className="sz-auth-help-link">
            Voltar ao login
          </Link>
        }
      >
        <p className="sz-auth-muted">
          Configure o segredo de bootstrap e recarregue esta página.
        </p>
      </AuthCard>
    );
  }

  if (hasOwner()) {
    redirect("/plataforma/entrar");
  }

  return (
    <AuthCard
      eyebrow="Bootstrap seguro"
      title="Ativar"
      titleAccent="proprietário."
      description="Fluxo único para criar a organização e a conta dona da SYNAPZ."
      visualTitle="Primeiro impulso."
      visualDescription="Depois deste passo, novos membros entram só por convite."
      footer={
        <Link href="/plataforma/entrar" className="sz-auth-help-link">
          Já tenho acesso
        </Link>
      }
    >
      <ActionForm action={bootstrapAction} className="sz-auth-form">
        <AuthField
          label="Seu nome"
          index="01"
          icon={<IconUser />}
          id="name"
          name="name"
          required
          placeholder="Nome completo"
        />
        <AuthField
          label="Nome de usuário"
          index="02"
          icon={<IconUser />}
          id="username"
          name="username"
          required
          autoComplete="username"
          placeholder="usuario"
        />
        <AuthField
          label="E-mail"
          index="03"
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
          index="04"
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
        <AuthField
          label="Organização"
          index="05"
          icon={<IconUser />}
          id="orgName"
          name="orgName"
          required
          defaultValue="SYNAPZ STUDIO"
        />
        <AuthField
          label="Segredo de bootstrap"
          index="06"
          icon={<IconKey />}
          id="bootstrapSecret"
          name="bootstrapSecret"
          type="password"
          required
          autoComplete="off"
          placeholder="PLATFORM_BOOTSTRAP_SECRET"
          showPasswordToggle
        />
        <AuthSubmit>Criar proprietário</AuthSubmit>
      </ActionForm>
    </AuthCard>
  );
}
