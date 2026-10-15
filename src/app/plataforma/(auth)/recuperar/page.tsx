import Link from "next/link";
import { AuthCard } from "@/components/plataforma/AuthCard";
import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  TextInput,
} from "@/components/plataforma/FormPrimitives";
import { actionRequestReset } from "@/lib/plataforma/actions";

export const metadata = { title: "Recuperar acesso" };

async function resetRequestAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionRequestReset(formData);
}

export default function RecuperarPage() {
  return (
    <AuthCard
      title="Recuperar acesso"
      description="Informe o e-mail da conta. Enviaremos um link seguro de redefinição."
      footer={
        <Link href="/plataforma/entrar" className="text-link">
          Voltar ao login
        </Link>
      }
    >
      <ActionForm action={resetRequestAction} className="space-y-4">
        <Field label="E-mail" name="email">
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </Field>
        <FormActions>
          <button type="submit" className="platform-btn w-full">
            Enviar link
          </button>
        </FormActions>
      </ActionForm>
    </AuthCard>
  );
}
