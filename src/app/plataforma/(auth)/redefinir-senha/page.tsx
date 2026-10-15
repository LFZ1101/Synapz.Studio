import Link from "next/link";
import { AuthCard } from "@/components/plataforma/AuthCard";
import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  TextInput,
} from "@/components/plataforma/FormPrimitives";
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
        title="Link inválido"
        description="Abra o link completo enviado para o seu e-mail."
        footer={
          <Link href="/plataforma/recuperar" className="text-link">
            Solicitar novo link
          </Link>
        }
      >
        <p className="text-sm text-synapz-signal">Token ausente.</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Nova senha"
      description="Defina uma senha com pelo menos 8 caracteres."
      footer={
        <Link href="/plataforma/entrar" className="text-link">
          Voltar ao login
        </Link>
      }
    >
      <ActionForm action={resetAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <Field label="Nova senha" name="password">
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Field>
        <FormActions>
          <button type="submit" className="platform-btn w-full">
            Salvar senha
          </button>
        </FormActions>
      </ActionForm>
    </AuthCard>
  );
}
