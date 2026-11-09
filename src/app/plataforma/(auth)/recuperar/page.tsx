import Link from "next/link";
import { AuthCard } from "@/components/plataforma/AuthCard";
import {
  AuthField,
  AuthSubmit,
  IconMail,
} from "@/components/plataforma/AuthField";
import { ActionForm } from "@/components/plataforma/ActionForm";
import { actionRequestReset } from "@/lib/plataforma/actions";

export const metadata = { title: "Recuperar acesso" };

async function resetRequestAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionRequestReset(formData);
}

export default function RecuperarPage() {
  return (
    <AuthCard
      eyebrow="Recuperação"
      title="Recuperar"
      titleAccent="acesso."
      description="Informe o e-mail da conta. Geramos um link seguro de redefinição."
      visualTitle="Link protegido."
      visualDescription="Se o e-mail existir, um token temporário será criado para troca de senha."
      footer={
        <Link href="/plataforma/entrar" className="sz-auth-help-link">
          Voltar ao login
        </Link>
      }
    >
      <ActionForm action={resetRequestAction} className="sz-auth-form">
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
        <AuthSubmit>Enviar link</AuthSubmit>
      </ActionForm>
    </AuthCard>
  );
}
