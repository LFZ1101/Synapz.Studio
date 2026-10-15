import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  FormGrid,
  TextInput,
} from "@/components/plataforma/FormPrimitives";
import { PageHeader } from "@/components/plataforma/PageHeader";
import {
  actionChangePassword,
  actionRevokeSession,
  actionSaveProfile,
  actionToggleHideValues,
} from "@/lib/plataforma/actions";
import {
  listSessions,
  requireUser,
} from "@/lib/plataforma/auth";
import { listAudit } from "@/lib/plataforma/audit";
import { formatDateTime } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import { ROLE_LABELS } from "@/lib/plataforma/types";

export const metadata = { title: "Configurações" };

async function profileAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveProfile(formData);
}

async function passwordAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionChangePassword(formData);
}

export default async function ConfigPage() {
  const user = await requireUser();
  const sessions = listSessions(user.id);
  const audit = can(user.role, "audit_read")
    ? listAudit(user.orgId, 20)
    : [];

  return (
    <div>
      <PageHeader
        eyebrow="Conta"
        title="Configurações"
        description="Perfil, segurança, privacidade financeira e trilha de auditoria essenciais do MVP."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="platform-panel">
          <h2 className="font-display text-xl">Perfil</h2>
          <p className="mt-1 text-sm text-synapz-signal">
            {user.orgName} · {ROLE_LABELS[user.role]}
          </p>
          <ActionForm action={profileAction} className="mt-4 space-y-4">
            <FormGrid>
              <Field label="Nome" name="name">
                <TextInput id="name" name="name" required defaultValue={user.name} />
              </Field>
              <Field label="Usuário" name="username">
                <TextInput id="username" name="username" required defaultValue={user.username} />
              </Field>
              <Field label="E-mail de acesso" name="email">
                <TextInput id="email" name="email" type="email" required defaultValue={user.email} />
              </Field>
            </FormGrid>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar perfil
              </button>
            </FormActions>
          </ActionForm>
        </section>

        <section className="platform-panel">
          <h2 className="font-display text-xl">Segurança</h2>
          <ActionForm action={passwordAction} className="mt-4 space-y-4">
            <Field label="Senha atual" name="currentPassword">
              <TextInput
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                autoComplete="current-password"
              />
            </Field>
            <Field label="Nova senha" name="newPassword" hint="Mínimo de 8 caracteres.">
              <TextInput
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </Field>
            <FormActions>
              <button type="submit" className="platform-btn">
                Alterar senha
              </button>
            </FormActions>
          </ActionForm>

          <div className="mt-8">
            <h3 className="text-sm text-synapz-neural">Sessões e dispositivos</h3>
            <ul className="mt-3 space-y-2">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-2 border-t border-synapz-neural/10 pt-2 text-xs sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-synapz-neural">{s.user_agent || "Dispositivo"}</p>
                    <p className="font-mono text-synapz-signal">
                      {s.ip || "IP n/d"} · {formatDateTime(s.created_at)}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await actionRevokeSession(s.id);
                    }}
                  >
                    <button type="submit" className="platform-btn-danger">
                      Encerrar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="platform-panel">
          <h2 className="font-display text-xl">Privacidade</h2>
          <p className="mt-2 text-sm text-synapz-signal">
            Ocultar valores financeiros neste navegador (preferência por conta).
          </p>
          <form
            className="mt-4"
            action={async () => {
              "use server";
              await actionToggleHideValues(!user.hideValues);
            }}
          >
            <button type="submit" className="platform-btn-ghost">
              {user.hideValues ? "Mostrar valores" : "Ocultar valores"}
            </button>
          </form>
        </section>

        <section className="platform-panel">
          <h2 className="font-display text-xl">Plano e integrações</h2>
          <p className="mt-2 text-sm text-synapz-signal">
            Sem cobrança, assinatura ou Asaas neste MVP. Integrações externas só entram
            com credenciais, documentação atual e consentimento do proprietário (Fase C).
          </p>
          <p className="mt-4 text-sm text-synapz-signal">
            Suporte: use o canal oficial da SYNAPZ no site institucional.
          </p>
        </section>
      </div>

      {audit.length > 0 ? (
        <section className="platform-panel mt-6">
          <h2 className="font-display text-xl">Auditoria recente</h2>
          <ul className="mt-4 space-y-2">
            {audit.map((item) => (
              <li key={item.id} className="border-t border-synapz-neural/10 pt-2 text-sm">
                <p className="text-synapz-neural">
                  <span className="font-mono text-xs text-synapz-impulse">{item.action}</span>{" "}
                  · {item.entity_type}
                  {item.entity_id ? ` · ${item.entity_id}` : ""}
                </p>
                <p className="font-mono text-[0.65rem] text-synapz-signal">
                  {item.user_name || "Sistema"} · {formatDateTime(item.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
