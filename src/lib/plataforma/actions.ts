"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  bootstrapOwner,
  changePassword,
  destroySession,
  loginWithPassword,
  requestPasswordReset,
  requireUser,
  resetPasswordWithToken,
  setHideValues,
  updateProfile,
  revokeSession,
} from "./auth";
import { assertCan, canAssignRole } from "./permissions";
import { numberToCents, parseMoneyInput } from "./format";
import {
  addOpportunityNote,
  archiveClient,
  archiveOpportunity,
  archivePortfolioSite,
  archiveProject,
  archiveSale,
  archiveTask,
  deleteCashEntry,
  inviteMember,
  moveOpportunity,
  savePipelineStages,
  updateMemberRole,
  upsertCashEntry,
  upsertClient,
  upsertOpportunity,
  upsertPortfolioSite,
  upsertProject,
  upsertSale,
  upsertTask,
} from "./services";
import type {
  CashType,
  ClientStage,
  OpportunityPriority,
  PortfolioStatus,
  ProjectStatus,
  ProjectType,
  Role,
  StageOutcome,
  TaskPriority,
  TaskStatus,
} from "./types";

function formString(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function formOptional(form: FormData, key: string) {
  const v = formString(form, key);
  return v || undefined;
}

function revalidateAll() {
  revalidatePath("/plataforma", "layout");
}

export async function actionBootstrap(formData: FormData) {
  try {
    await bootstrapOwner({
      name: formString(formData, "name"),
      username: formString(formData, "username"),
      email: formString(formData, "email"),
      password: formString(formData, "password"),
      orgName: formString(formData, "orgName") || "SYNAPZ STUDIO",
      bootstrapSecret: formString(formData, "bootstrapSecret"),
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha no bootstrap." };
  }
  redirect("/plataforma");
}

export async function actionLogin(formData: FormData) {
  try {
    await loginWithPassword(
      formString(formData, "email"),
      formString(formData, "password"),
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha no login." };
  }
  redirect("/plataforma");
}

export async function actionLogout() {
  await destroySession();
  redirect("/plataforma/entrar");
}

export async function actionRequestReset(formData: FormData) {
  try {
    const result = await requestPasswordReset(formString(formData, "email"));
    return {
      ok: true as const,
      message:
        "Se o e-mail existir, um link seguro foi gerado. Em ambiente local o link aparece abaixo.",
      resetUrl: result.resetUrl,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao solicitar." };
  }
}

export async function actionResetPassword(formData: FormData) {
  try {
    await resetPasswordWithToken(
      formString(formData, "token"),
      formString(formData, "password"),
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao redefinir." };
  }
  redirect("/plataforma/entrar");
}

export async function actionToggleHideValues(hide: boolean) {
  const user = await requireUser();
  await setHideValues(user.id, hide);
  revalidateAll();
}

export async function actionSaveProfile(formData: FormData) {
  const user = await requireUser();
  try {
    await updateProfile(user.id, {
      name: formString(formData, "name"),
      username: formString(formData, "username"),
      email: formString(formData, "email"),
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar perfil." };
  }
  revalidateAll();
  return { ok: true as const, message: "Perfil atualizado." };
}

export async function actionChangePassword(formData: FormData) {
  const user = await requireUser();
  try {
    await changePassword(
      user.id,
      formString(formData, "currentPassword"),
      formString(formData, "newPassword"),
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao alterar senha." };
  }
  return { ok: true as const };
}

export async function actionRevokeSession(sessionId: string) {
  const user = await requireUser();
  revokeSession(user.id, sessionId);
  revalidatePath("/plataforma/configuracoes");
}

export async function actionSaveClient(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "write");
  try {
    const id = upsertClient(user, {
      id: formOptional(formData, "id"),
      name: formString(formData, "name"),
      company: formOptional(formData, "company"),
      whatsapp: formOptional(formData, "whatsapp"),
      stage: formString(formData, "stage") as ClientStage,
      github: formOptional(formData, "github"),
      site_url: formOptional(formData, "site_url"),
      vercel_url: formOptional(formData, "vercel_url"),
      notes: formOptional(formData, "notes"),
    });
    revalidateAll();
    return { ok: true as const, id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar cliente." };
  }
}

export async function actionArchiveClient(id: string) {
  const user = await requireUser();
  assertCan(user.role, "archive");
  archiveClient(user, id);
  revalidateAll();
}

export async function actionSaveOpportunity(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "write");
  try {
    const tagsRaw = formOptional(formData, "tags");
    const id = upsertOpportunity(user, {
      id: formOptional(formData, "id"),
      stage_id: formString(formData, "stage_id"),
      client_id: formOptional(formData, "client_id"),
      title: formString(formData, "title"),
      company: formOptional(formData, "company"),
      contact_name: formOptional(formData, "contact_name"),
      phone: formOptional(formData, "phone"),
      email: formOptional(formData, "email"),
      value_cents: numberToCents(parseMoneyInput(formString(formData, "value"))),
      owner_user_id: formOptional(formData, "owner_user_id"),
      priority: (formString(formData, "priority") || "media") as OpportunityPriority,
      source: formOptional(formData, "source"),
      next_action: formOptional(formData, "next_action"),
      next_action_at: formOptional(formData, "next_action_at"),
      tags: tagsRaw
        ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    });
    revalidateAll();
    return { ok: true as const, id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar." };
  }
}

export async function actionMoveOpportunity(id: string, stageId: string) {
  const user = await requireUser();
  assertCan(user.role, "write");
  moveOpportunity(user, id, stageId);
  revalidateAll();
}

export async function actionArchiveOpportunity(id: string) {
  const user = await requireUser();
  assertCan(user.role, "archive");
  archiveOpportunity(user, id);
  revalidateAll();
}

export async function actionAddNote(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "write");
  addOpportunityNote(
    user,
    formString(formData, "opportunity_id"),
    formString(formData, "body"),
  );
  revalidateAll();
}

export async function actionSaveStages(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "manage_pipeline");
  const raw = formString(formData, "stages_json");
  const remapFrom = formOptional(formData, "remap_from");
  const remapTo = formOptional(formData, "remap_to");
  try {
    const stages = JSON.parse(raw) as Array<{
      id?: string;
      name: string;
      description?: string;
      probability: number;
      outcome: StageOutcome;
      position: number;
    }>;
    savePipelineStages(
      user,
      stages,
      remapFrom && remapTo
        ? { fromStageId: remapFrom, toStageId: remapTo }
        : undefined,
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar funil." };
  }
  revalidateAll();
  return { ok: true as const };
}

export async function actionSaveProject(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "write");
  try {
    const id = upsertProject(user, {
      id: formOptional(formData, "id"),
      name: formString(formData, "name"),
      client_id: formOptional(formData, "client_id"),
      project_type: formString(formData, "project_type") as ProjectType,
      status: formString(formData, "status") as ProjectStatus,
      delivery_date: formOptional(formData, "delivery_date"),
      description: formOptional(formData, "description"),
    });
    revalidateAll();
    return { ok: true as const, id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar projeto." };
  }
}

export async function actionArchiveProject(id: string) {
  const user = await requireUser();
  assertCan(user.role, "archive");
  archiveProject(user, id);
  revalidateAll();
}

export async function actionSaveSale(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "write");
  try {
    const id = upsertSale(user, {
      id: formOptional(formData, "id"),
      name: formString(formData, "name"),
      client_id: formOptional(formData, "client_id"),
      project_id: formOptional(formData, "project_id"),
      amount_cents: numberToCents(parseMoneyInput(formString(formData, "amount"))),
      cost_cents: numberToCents(parseMoneyInput(formString(formData, "cost"))),
      project_type: formString(formData, "project_type") as ProjectType,
      sold_at: formString(formData, "sold_at") || new Date().toISOString(),
      delivery_forecast: formOptional(formData, "delivery_forecast"),
      notes: formOptional(formData, "notes"),
    });
    revalidateAll();
    return { ok: true as const, id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar venda." };
  }
}

export async function actionArchiveSale(id: string) {
  const user = await requireUser();
  assertCan(user.role, "archive");
  archiveSale(user, id);
  revalidateAll();
}

export async function actionSaveTask(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "write");
  try {
    const id = upsertTask(user, {
      id: formOptional(formData, "id"),
      title: formString(formData, "title"),
      description: formOptional(formData, "description"),
      status: (formString(formData, "status") || "todo") as TaskStatus,
      priority: (formString(formData, "priority") || "media") as TaskPriority,
      due_date: formOptional(formData, "due_date"),
      project_id: formOptional(formData, "project_id"),
      opportunity_id: formOptional(formData, "opportunity_id"),
      assignee_id: formOptional(formData, "assignee_id"),
    });
    revalidateAll();
    return { ok: true as const, id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar tarefa." };
  }
}

export async function actionArchiveTask(id: string) {
  const user = await requireUser();
  assertCan(user.role, "archive");
  archiveTask(user, id);
  revalidateAll();
}

export async function actionSaveCash(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "write");
  try {
    const id = upsertCashEntry(user, {
      id: formOptional(formData, "id"),
      entry_type: formString(formData, "entry_type") as CashType,
      amount_cents: numberToCents(parseMoneyInput(formString(formData, "amount"))),
      description: formString(formData, "description"),
      category: formOptional(formData, "category"),
      occurred_at: formString(formData, "occurred_at") || new Date().toISOString(),
      sale_id: formOptional(formData, "sale_id"),
    });
    revalidateAll();
    return { ok: true as const, id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar lançamento." };
  }
}

export async function actionDeleteCash(id: string) {
  const user = await requireUser();
  assertCan(user.role, "archive");
  deleteCashEntry(user, id);
  revalidateAll();
}

export async function actionSavePortfolio(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "write");
  try {
    const id = upsertPortfolioSite(user, {
      id: formOptional(formData, "id"),
      title: formString(formData, "title"),
      status: formString(formData, "status") as PortfolioStatus,
      url: formOptional(formData, "url"),
      client_id: formOptional(formData, "client_id"),
      cover_url: formOptional(formData, "cover_url"),
      description: formOptional(formData, "description"),
    });
    revalidateAll();
    return { ok: true as const, id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao salvar site." };
  }
}

export async function actionArchivePortfolio(id: string) {
  const user = await requireUser();
  assertCan(user.role, "archive");
  archivePortfolioSite(user, id);
  revalidateAll();
}

export async function actionInviteMember(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "manage_team");
  const role = formString(formData, "role") as Role;
  if (!canAssignRole(user.role, role)) {
    return { error: "Você não pode atribuir este papel." };
  }
  try {
    await inviteMember(user, {
      email: formString(formData, "email"),
      name: formString(formData, "name"),
      username: formString(formData, "username"),
      password: formString(formData, "password"),
      role,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao convidar." };
  }
  revalidateAll();
  return { ok: true as const };
}

export async function actionUpdateMemberRole(formData: FormData) {
  const user = await requireUser();
  assertCan(user.role, "manage_team");
  const role = formString(formData, "role") as Role;
  const memberId = formString(formData, "user_id");
  if (!canAssignRole(user.role, role)) {
    return { error: "Você não pode atribuir este papel." };
  }
  try {
    updateMemberRole(user, memberId, role);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao atualizar papel." };
  }
  revalidateAll();
  return { ok: true as const };
}
