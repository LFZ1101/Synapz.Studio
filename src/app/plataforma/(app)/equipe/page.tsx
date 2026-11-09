import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  FormGrid,
  TextInput,
  TextSelect,
} from "@/components/plataforma/FormPrimitives";
import { PageHeader } from "@/components/plataforma/PageHeader";
import {
  actionInviteMember,
  actionUpdateMemberRole,
} from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDate } from "@/lib/plataforma/format";
import { can, canAssignRole } from "@/lib/plataforma/permissions";
import { listTeam } from "@/lib/plataforma/services";
import { ROLE_LABELS, type Role } from "@/lib/plataforma/types";

export const metadata = { title: "Equipe" };

async function inviteAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionInviteMember(formData);
}

async function roleAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionUpdateMemberRole(formData);
}

export default async function EquipePage() {
  const user = await requireUser();
  const team = listTeam(user.orgId);
  const manage = can(user.role, "manage_team");

  return (
    <div>
      <PageHeader
        eyebrow="Organização"
        title="Equipe"
        description="Papéis controlam leitura, escrita e administração no servidor e no banco. Proprietário só nasce pelo bootstrap seguro."
      />

      <div className="platform-table-wrap">
        <table className="platform-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Desde</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td className="font-mono text-xs">@{member.username}</td>
                <td>{member.email}</td>
                <td>{ROLE_LABELS[member.role]}</td>
                <td className="font-mono text-xs">{formatDate(member.created_at)}</td>
                <td>
                  {manage && member.role !== "owner" && member.id !== user.id ? (
                    <ActionForm action={roleAction} className="flex items-center gap-2">
                      <input type="hidden" name="user_id" value={member.id} />
                      <TextSelect name="role" defaultValue={member.role} className="!min-h-9">
                        {(["admin", "member", "viewer"] as Role[])
                          .filter((r) => canAssignRole(user.role, r))
                          .map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </option>
                          ))}
                      </TextSelect>
                      <button type="submit" className="platform-chip">
                        Atualizar
                      </button>
                    </ActionForm>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {manage ? (
        <section className="platform-panel mt-8">
          <h2 className="font-display text-xl mb-2">Adicionar membro</h2>
          <p className="mb-4 text-sm text-synapz-signal">
            Cria acesso imediato com senha inicial. Peça troca de senha no primeiro uso.
          </p>
          <ActionForm action={inviteAction} className="space-y-4">
            <FormGrid>
              <Field label="Nome" name="name">
                <TextInput id="name" name="name" required />
              </Field>
              <Field label="Usuário" name="username">
                <TextInput id="username" name="username" required />
              </Field>
              <Field label="E-mail" name="email">
                <TextInput id="email" name="email" type="email" required />
              </Field>
              <Field label="Senha inicial" name="password">
                <TextInput id="password" name="password" type="password" required minLength={8} />
              </Field>
              <Field label="Papel" name="role">
                <TextSelect id="role" name="role" defaultValue="member">
                  {(["admin", "member", "viewer"] as Role[])
                    .filter((r) => canAssignRole(user.role, r))
                    .map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                </TextSelect>
              </Field>
            </FormGrid>
            <FormActions>
              <button type="submit" className="platform-btn">
                Adicionar à equipe
              </button>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}
    </div>
  );
}
