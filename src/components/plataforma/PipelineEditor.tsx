"use client";

import { useMemo, useState, useTransition } from "react";
import { actionSaveStages } from "@/lib/plataforma/actions";

type Stage = {
  id: string;
  name: string;
  description: string | null;
  probability: number;
  outcome: string;
  position: number;
};

export function PipelineEditor({ initialStages }: { initialStages: Stage[] }) {
  const [stages, setStages] = useState(
    initialStages.map((s, i) => ({
      id: s.id,
      name: s.name,
      description: s.description || "",
      probability: s.probability,
      outcome: s.outcome as "aberto" | "ganho" | "perdido",
      position: i,
      _key: s.id,
    })),
  );
  const [removed, setRemoved] = useState<string[]>([]);
  const [remapTo, setRemapTo] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const remainingIds = useMemo(
    () => stages.filter((s) => s.id).map((s) => s.id as string),
    [stages],
  );

  function update(index: number, patch: Partial<(typeof stages)[number]>) {
    setStages((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= stages.length) return;
    setStages((prev) => {
      const next = [...prev];
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next.map((s, i) => ({ ...s, position: i }));
    });
  }

  function removeAt(index: number) {
    const stage = stages[index];
    if (stage.id) setRemoved((r) => [...r, stage.id as string]);
    setStages((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, position: i })));
  }

  function addStage() {
    setStages((prev) => [
      ...prev,
      {
        id: undefined as unknown as string,
        name: "Nova etapa",
        description: "",
        probability: 0,
        outcome: "aberto" as const,
        position: prev.length,
        _key: `new-${Date.now()}`,
      },
    ]);
  }

  function save() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const form = new FormData();
      form.set(
        "stages_json",
        JSON.stringify(
          stages.map((s, i) => ({
            id: s.id || undefined,
            name: s.name,
            description: s.description,
            probability: Number(s.probability) || 0,
            outcome: s.outcome,
            position: i,
          })),
        ),
      );
      if (removed.length > 0) {
        if (!remapTo) {
          setError("Selecione a etapa de destino para remapeamento das oportunidades.");
          return;
        }
        form.set("remap_from", removed[0]);
        form.set("remap_to", remapTo);
        // remap sequentially for multiple removals
        for (let i = 1; i < removed.length; i++) {
          // handled by one save with first; for MVP remap all to same target via loop in client
        }
      }
      // If multiple removed, remap each to remapTo by calling once per removed with updated stages
      if (removed.length > 1) {
        for (const from of removed) {
          const f = new FormData();
          f.set(
            "stages_json",
            JSON.stringify(
              stages.map((s, i) => ({
                id: s.id || undefined,
                name: s.name,
                description: s.description,
                probability: Number(s.probability) || 0,
                outcome: s.outcome,
                position: i,
              })),
            ),
          );
          f.set("remap_from", from);
          f.set("remap_to", remapTo);
          const res = await actionSaveStages(f);
          if (res && "error" in res && res.error) {
            setError(res.error);
            return;
          }
        }
      } else {
        const res = await actionSaveStages(form);
        if (res && "error" in res && res.error) {
          setError(res.error);
          return;
        }
      }
      setRemoved([]);
      setMessage("Funil atualizado.");
    });
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="border border-synapz-danger/40 bg-synapz-danger/10 px-3 py-2 text-sm">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="border border-synapz-impulse/40 bg-synapz-impulse/10 px-3 py-2 text-sm">
          {message}
        </div>
      ) : null}

      {removed.length > 0 ? (
        <div className="platform-panel">
          <p className="text-sm text-synapz-signal">
            Etapas removidas com possíveis oportunidades. Remapeie para:
          </p>
          <select
            className="platform-input mt-3 w-full md:max-w-sm"
            value={remapTo}
            onChange={(e) => setRemapTo(e.target.value)}
          >
            <option value="">Selecione a etapa destino</option>
            {remainingIds.map((id) => {
              const s = stages.find((x) => x.id === id);
              return (
                <option key={id} value={id}>
                  {s?.name || id}
                </option>
              );
            })}
          </select>
        </div>
      ) : null}

      {stages.map((stage, index) => (
        <div key={stage._key} className="platform-panel grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Nome</span>
            <input
              className="platform-input w-full"
              value={stage.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Descrição</span>
            <input
              className="platform-input w-full"
              value={stage.description}
              onChange={(e) => update(index, { description: e.target.value })}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Probabilidade (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              className="platform-input w-full"
              value={stage.probability}
              onChange={(e) => update(index, { probability: Number(e.target.value) })}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Resultado</span>
            <select
              className="platform-input w-full"
              value={stage.outcome}
              onChange={(e) =>
                update(index, {
                  outcome: e.target.value as "aberto" | "ganho" | "perdido",
                })
              }
            >
              <option value="aberto">Aberto</option>
              <option value="ganho">Ganho</option>
              <option value="perdido">Perdido</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button type="button" className="platform-chip" onClick={() => move(index, -1)}>
              Subir
            </button>
            <button type="button" className="platform-chip" onClick={() => move(index, 1)}>
              Descer
            </button>
            <button type="button" className="platform-btn-danger" onClick={() => removeAt(index)}>
              Remover etapa
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="platform-btn-ghost" onClick={addStage}>
          Adicionar etapa
        </button>
        <button type="button" className="platform-btn" disabled={pending} onClick={save}>
          {pending ? "Salvando…" : "Salvar funil"}
        </button>
      </div>
    </div>
  );
}
