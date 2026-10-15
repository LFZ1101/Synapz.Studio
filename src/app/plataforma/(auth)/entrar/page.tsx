import Link from "next/link";
import { AuthCard } from "@/components/plataforma/AuthCard";
import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  TextInput,
} from "@/components/plataforma/FormPrimitives";
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
      title="Acessar a central"
      description="Entre com seu e-mail e senha para operar clientes, projetos e resultado."
      footer={
        <div className="space-y-2">
          <p>
            <Link href="/plataforma/recuperar" className="text-link">
              Recuperar acesso
            </Link>
          </p>
          {showBootstrap ? (
            <p>
              Primeira conta?{" "}
              <Link href="/plataforma/bootstrap" className="text-link">
                Ativar proprietário
              </Link>
            </p>
          ) : (
            <p className="text-xs">
              Novos membros entram por convite do proprietário ou administrador.
            </p>
          )}
        </div>
      }
    >
      <ActionForm action={loginAction} className="space-y-4">
        <Field label="E-mail" name="email">
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Senha" name="password">
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-synapz-signal">
          <input type="checkbox" name="remember" className="accent-synapz-impulse" defaultChecked />
          Manter sessão neste dispositivo
        </label>
        <FormActions>
          <button type="submit" className="platform-btn w-full">
            Entrar
          </button>
        </FormActions>
      </ActionForm>
    </AuthCard>
  );
}
