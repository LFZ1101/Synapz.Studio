"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Project, ProjectGalleryItem } from "@/content/project-types";
import { emptyProjectDraft, type ProjectInput } from "@/lib/project-schema";
import { slugify } from "@/lib/admin-client";

type Props = {
  mode: "create" | "edit";
  initial?: Project;
};

function toInput(project?: Project): ProjectInput {
  if (!project) return emptyProjectDraft();
  return {
    slug: project.slug,
    name: project.name,
    client: project.client || "",
    segment: project.segment,
    year: project.year,
    summary: project.summary,
    cover: project.cover,
    coverAlt: project.coverAlt,
    video: project.video || "",
    services: project.services || [],
    featured: project.featured,
    published: project.published,
    context: project.context || "",
    problem: project.problem || "",
    objective: project.objective || "",
    strategy: project.strategy || "",
    creativeDirection: project.creativeDirection || "",
    design: project.design || "",
    development: project.development || "",
    deliverables: project.deliverables || [],
    gallery: project.gallery || [],
    nextProject: project.nextProject || "",
    externalUrl: project.externalUrl || "",
  };
}

async function uploadFile(file: File, folder: string) {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder || "geral");
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || "Falha no upload");
  return data.url;
}

export function ProjectForm({ mode, initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectInput>(() => toInput(initial));
  const [servicesText, setServicesText] = useState(
    (initial?.services || []).join("\n"),
  );
  const [deliverablesText, setDeliverablesText] = useState(
    (initial?.deliverables || []).join("\n"),
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState("");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const folder = useMemo(
    () => values.slug || slugify(values.name) || "novo",
    [values.slug, values.name],
  );

  function setField<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateGallery(index: number, patch: Partial<ProjectGalleryItem>) {
    setValues((prev) => {
      const gallery = [...prev.gallery];
      gallery[index] = { ...gallery[index], ...patch };
      return { ...prev, gallery };
    });
  }

  function removeGallery(index: number) {
    setValues((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }

  function addGallery(kind: "image" | "video") {
    setValues((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        kind === "video"
          ? { alt: values.name || "Vídeo", video: "", caption: "" }
          : { alt: values.name || "Imagem", src: "", caption: "" },
      ],
    }));
  }

  async function onUpload(
    file: File | null,
    apply: (url: string) => void,
    label: string,
  ) {
    if (!file) return;
    setUploading(label);
    setError("");
    try {
      const url = await uploadFile(file, folder);
      apply(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    }
    setUploading("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const payload: ProjectInput = {
      ...values,
      slug: values.slug || slugify(values.name),
      services: servicesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      deliverables: deliverablesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      gallery: values.gallery.filter((item) => item.src || item.video || item.youtube),
    };

    try {
      const res = await fetch(
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${initial!.slug}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as {
        project?: Project;
        error?: string;
      };
      if (!res.ok || !data.project) {
        setError(data.error || "Não foi possível salvar.");
        setBusy(false);
        return;
      }
      router.push("/admin/projetos");
      router.refresh();
    } catch {
      setError("Falha de rede ao salvar.");
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!window.confirm(`Remover o projeto “${initial.name}”?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/projects/${initial.slug}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Não foi possível remover.");
      setBusy(false);
      return;
    }
    router.push("/admin/projetos");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nome">
          <input
            className="field-input"
            value={values.name}
            required
            onChange={(e) => {
              const name = e.target.value;
              setField("name", name);
              if (!slugTouched) setField("slug", slugify(name));
              if (!values.coverAlt) setField("coverAlt", `${name} — capa`);
            }}
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            className="field-input"
            value={values.slug}
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            onChange={(e) => {
              setSlugTouched(true);
              setField("slug", slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="Cliente">
          <input
            className="field-input"
            value={values.client || ""}
            onChange={(e) => setField("client", e.target.value)}
          />
        </Field>
        <Field label="Segmento / tipo">
          <input
            className="field-input"
            value={values.segment}
            required
            placeholder="Ex.: Identidade visual, Edição de vídeo…"
            onChange={(e) => setField("segment", e.target.value)}
          />
        </Field>
        <Field label="Ano">
          <input
            className="field-input"
            type="number"
            min={1990}
            max={2100}
            value={values.year}
            required
            onChange={(e) => setField("year", Number(e.target.value))}
          />
        </Field>
        <Field label="Resumo">
          <textarea
            className="field-input min-h-24"
            value={values.summary}
            required
            onChange={(e) => setField("summary", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Capa (URL ou upload)">
          <input
            className="field-input"
            value={values.cover}
            required
            onChange={(e) => setField("cover", e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm text-synapz-signal"
            onChange={(e) =>
              onUpload(e.target.files?.[0] || null, (url) => setField("cover", url), "capa")
            }
          />
          {values.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={values.cover}
              alt=""
              className="mt-3 max-h-40 border border-synapz-neural/10 object-cover"
            />
          ) : null}
        </Field>
        <div className="space-y-4">
          <Field label="Alt da capa">
            <input
              className="field-input"
              value={values.coverAlt}
              required
              onChange={(e) => setField("coverAlt", e.target.value)}
            />
          </Field>
          <Field label="Vídeo principal (opcional)">
            <input
              className="field-input"
              value={values.video || ""}
              placeholder="/media/.../filme.mp4"
              onChange={(e) => setField("video", e.target.value)}
            />
            <input
              type="file"
              accept="video/*"
              className="mt-2 block w-full text-sm text-synapz-signal"
              onChange={(e) =>
                onUpload(
                  e.target.files?.[0] || null,
                  (url) => setField("video", url),
                  "vídeo",
                )
              }
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm text-synapz-signal">
          <input
            type="checkbox"
            className="h-5 w-5 accent-synapz-impulse"
            checked={values.published}
            onChange={(e) => setField("published", e.target.checked)}
          />
          Publicado no site
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-synapz-signal">
          <input
            type="checkbox"
            className="h-5 w-5 accent-synapz-impulse"
            checked={values.featured}
            onChange={(e) => setField("featured", e.target.checked)}
          />
          Destaque na home
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Serviços (um por linha)">
          <textarea
            className="field-input min-h-28"
            value={servicesText}
            onChange={(e) => setServicesText(e.target.value)}
          />
        </Field>
        <Field label="Entregas (um por linha)">
          <textarea
            className="field-input min-h-28"
            value={deliverablesText}
            onChange={(e) => setDeliverablesText(e.target.value)}
          />
        </Field>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl">Galeria (imagens e vídeos)</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="border border-synapz-neural/20 px-3 py-2 text-sm"
              onClick={() => addGallery("image")}
            >
              + Imagem
            </button>
            <button
              type="button"
              className="border border-synapz-impulse/50 px-3 py-2 text-sm text-synapz-impulse"
              onClick={() => addGallery("video")}
            >
              + Vídeo
            </button>
          </div>
        </div>

        {values.gallery.length === 0 ? (
          <p className="text-sm text-synapz-signal">
            Nenhum item ainda. Adicione imagens ou vídeos do case.
          </p>
        ) : (
          <ul className="space-y-4">
            {values.gallery.map((item, index) => (
              <li
                key={index}
                className="space-y-3 border border-synapz-neural/10 bg-synapz-graphite p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-synapz-impulse">
                    Item {String(index + 1).padStart(2, "0")} ·{" "}
                    {item.video || item.youtube ? "Vídeo" : "Imagem"}
                  </p>
                  <button
                    type="button"
                    className="text-sm text-red-300"
                    onClick={() => removeGallery(index)}
                  >
                    Remover
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Alt / título">
                    <input
                      className="field-input"
                      value={item.alt}
                      onChange={(e) => updateGallery(index, { alt: e.target.value })}
                    />
                  </Field>
                  <Field label="Legenda">
                    <input
                      className="field-input"
                      value={item.caption || ""}
                      onChange={(e) =>
                        updateGallery(index, { caption: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="URL da imagem">
                    <input
                      className="field-input"
                      value={item.src || ""}
                      onChange={(e) => updateGallery(index, { src: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2 block w-full text-sm text-synapz-signal"
                      onChange={(e) =>
                        onUpload(
                          e.target.files?.[0] || null,
                          (url) => updateGallery(index, { src: url }),
                          `galeria-${index}-img`,
                        )
                      }
                    />
                  </Field>
                  <Field label="URL do vídeo">
                    <input
                      className="field-input"
                      value={item.video || ""}
                      onChange={(e) =>
                        updateGallery(index, { video: e.target.value })
                      }
                    />
                    <input
                      type="file"
                      accept="video/*"
                      className="mt-2 block w-full text-sm text-synapz-signal"
                      onChange={(e) =>
                        onUpload(
                          e.target.files?.[0] || null,
                          (url) => updateGallery(index, { video: url }),
                          `galeria-${index}-video`,
                        )
                      }
                    />
                  </Field>
                  <Field label="Poster do vídeo">
                    <input
                      className="field-input"
                      value={item.poster || ""}
                      onChange={(e) =>
                        updateGallery(index, { poster: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="YouTube (opcional)">
                    <input
                      className="field-input"
                      value={item.youtube || ""}
                      placeholder="https://www.youtube.com/watch?v=..."
                      onChange={(e) =>
                        updateGallery(index, { youtube: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Nota" className="md:col-span-2">
                    <textarea
                      className="field-input min-h-20"
                      value={item.note || ""}
                      onChange={(e) =>
                        updateGallery(index, { note: e.target.value })
                      }
                    />
                  </Field>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {uploading ? (
        <p className="text-sm text-synapz-impulse">Enviando {uploading}…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy || Boolean(uploading)}
          className="inline-flex h-12 items-center justify-center bg-synapz-impulse px-6 text-sm font-medium text-synapz-black disabled:opacity-50"
        >
          {busy ? "Salvando…" : mode === "create" ? "Criar projeto" : "Salvar alterações"}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="inline-flex h-12 items-center justify-center border border-red-400/40 px-6 text-sm text-red-300"
          >
            Remover projeto
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="eyebrow text-synapz-signal">{label}</p>
      {children}
    </div>
  );
}
