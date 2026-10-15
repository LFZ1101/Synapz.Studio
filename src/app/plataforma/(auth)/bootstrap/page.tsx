import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/plataforma/AuthCard";
import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  FormGrid,
  TextInput,
} from "@/components/plataforma/FormPrimitives";
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
        title="Bootstrap bloqueado"
        description="Defina PLATFORM_BOOTSTRAP_SECRET no ambiente do servidor para criar o proprietário com segurança."
        footer={
          <Link href="/plataforma/entrar" className="text-link">
            Voltar ao login
          </Link>
        }
      >
        <p className="text-sm text-synapz-signal">
          O primeiro visitante nunca recebe papel de proprietário automaticamente.
        </p>
      </AuthCard>
    );
  }

  if (hasOwner()) {
    redirect("/plataforma/entrar");
  }

  return (
    <AuthCard
      title="Ativar proprietário"
      description="Fluxo único e seguro para criar a organização e a conta dona da SYNAPZ."
      footer={
        <Link href="/plataforma/entrar" className="text-link">
          Já tenho acesso
        </Link>
      }
    >
      <ActionForm action={bootstrapAction} className="space-y-4">
        <FormGrid>
          <Field label="Seu nome" name="name">
            <TextInput id="name" name="name" required />
          </Field>
          <Field label="Nome de usuário" name="username">
            <TextInput id="username" name="username" required autoComplete="username" />
          </Field>
        </FormGrid>
        <Field label="E-mail" name="email">
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Senha" name="password" hint="Pelo menos 8 caracteres.">
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Nome da organização" name="orgName">
          <TextInput id="orgName" name="orgName" defaultValue="SYNAPZ STUDIO" required />
        </Field>
        <Field label="Segredo de bootstrap" name="bootstrapSecret">
          <TextInput
            id="bootstrapSecret"
            name="bootstrapSecret"
            type="password"
            required
            autoComplete="off"
          />
        </Field>
        <FormActions>
          <button type="submit" className="platform-btn w-full">
            Criar proprietário
          </button>
        </FormActions>
      </ActionForm>
    </AuthCard>
  );
}
