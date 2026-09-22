"use client";

import { Button } from "@/components/ui/Button";
import { SITE } from "@/content/site";
import {
  investmentRanges,
  projectTypes,
  timelineOptions,
} from "@/content/studio";
import { whatsappUrl } from "@/lib/utils";
import { useState, type FormEvent, type ReactNode } from "react";

type Status = "idle" | "submitting" | "success" | "error" | "unavailable";

type FieldErrors = Partial<Record<string, string>>;

const initial = {
  name: "",
  company: "",
  whatsapp: "",
  email: "",
  projectType: "",
  objective: "",
  investment: "",
  timeline: "",
  message: "",
  consent: false,
  website: "", // honeypot
};

export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const wa = whatsappUrl(
    SITE.contact.whatsapp,
    "Olá SYNAPZ, gostaria de conversar sobre um projeto.",
  );

  function validate() {
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = "Informe seu nome.";
    if (!values.email.trim()) next.email = "Informe um e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "E-mail inválido.";
    if (!values.whatsapp.trim()) next.whatsapp = "Informe um WhatsApp.";
    if (!values.projectType) next.projectType = "Selecione o tipo de projeto.";
    if (!values.message.trim()) next.message = "Conte um pouco sobre o projeto.";
    if (!values.consent)
      next.consent = "É necessário consentir com o uso dos dados.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
        code?: string;
      };

      if (res.status === 503 || data.code === "UNCONFIGURED") {
        setStatus("unavailable");
        setServerMessage(
          data.message ??
            "O formulário ainda não está conectado a um canal de envio. Use o WhatsApp ou o e-mail.",
        );
        return;
      }

      if (!res.ok || !data.ok) {
        setStatus("error");
        setServerMessage(
          data.message ?? "Não foi possível enviar. Tente novamente.",
        );
        return;
      }

      setStatus("success");
      setServerMessage(
        data.message ?? "Mensagem enviada. Retornaremos em breve.",
      );
      setValues(initial);
    } catch {
      setStatus("error");
      setServerMessage(
        "Falha de conexão. Seus dados foram preservados — tente novamente.",
      );
    }
  }

  const field = (
    id: keyof typeof initial,
    label: string,
    node: ReactNode,
  ) => (
    <div className="space-y-2">
      <label htmlFor={id} className="eyebrow text-synapz-signal">
        {label}
      </label>
      {node}
      {errors[id] ? (
        <p id={`${id}-error`} className="text-sm text-red-300" role="alert">
          {errors[id]}
        </p>
      ) : null}
    </div>
  );

  const inputClass =
    "w-full bg-synapz-black border border-synapz-neural/15 px-4 py-3 text-synapz-neural placeholder:text-synapz-signal/60 focus:border-synapz-impulse focus:outline-none";

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        noValidate
        className="grid gap-6 md:grid-cols-2"
        aria-describedby="form-status"
      >
        {/* Honeypot */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) =>
              setValues((v) => ({ ...v, website: e.target.value }))
            }
          />
        </div>

        {field(
          "name",
          "Nome",
          <input
            id="name"
            name="name"
            autoComplete="name"
            className={inputClass}
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />,
        )}

        {field(
          "company",
          "Empresa",
          <input
            id="company"
            name="company"
            autoComplete="organization"
            className={inputClass}
            value={values.company}
            onChange={(e) =>
              setValues((v) => ({ ...v, company: e.target.value }))
            }
          />,
        )}

        {field(
          "whatsapp",
          "WhatsApp",
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            value={values.whatsapp}
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            onChange={(e) =>
              setValues((v) => ({ ...v, whatsapp: e.target.value }))
            }
          />,
        )}

        {field(
          "email",
          "E-mail",
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            onChange={(e) =>
              setValues((v) => ({ ...v, email: e.target.value }))
            }
          />,
        )}

        {field(
          "projectType",
          "Tipo de projeto",
          <select
            id="projectType"
            name="projectType"
            className={inputClass}
            value={values.projectType}
            aria-invalid={Boolean(errors.projectType)}
            onChange={(e) =>
              setValues((v) => ({ ...v, projectType: e.target.value }))
            }
          >
            <option value="">Selecione</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>,
        )}

        {field(
          "investment",
          "Faixa de investimento",
          <select
            id="investment"
            name="investment"
            className={inputClass}
            value={values.investment}
            onChange={(e) =>
              setValues((v) => ({ ...v, investment: e.target.value }))
            }
          >
            <option value="">Selecione</option>
            {investmentRanges.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>,
        )}

        {field(
          "timeline",
          "Prazo",
          <select
            id="timeline"
            name="timeline"
            className={inputClass}
            value={values.timeline}
            onChange={(e) =>
              setValues((v) => ({ ...v, timeline: e.target.value }))
            }
          >
            <option value="">Selecione</option>
            {timelineOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>,
        )}

        {field(
          "objective",
          "Objetivo",
          <input
            id="objective"
            name="objective"
            className={inputClass}
            placeholder="Ex.: lançar produto, redesenhar site..."
            value={values.objective}
            onChange={(e) =>
              setValues((v) => ({ ...v, objective: e.target.value }))
            }
          />,
        )}

        <div className="md:col-span-2">
          {field(
            "message",
            "Mensagem",
            <textarea
              id="message"
              name="message"
              rows={5}
              className={inputClass}
              value={values.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              onChange={(e) =>
                setValues((v) => ({ ...v, message: e.target.value }))
              }
            />,
          )}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-start gap-3 text-sm text-synapz-signal">
            <input
              type="checkbox"
              className="mt-1 accent-synapz-impulse"
              checked={values.consent}
              onChange={(e) =>
                setValues((v) => ({ ...v, consent: e.target.checked }))
              }
              aria-invalid={Boolean(errors.consent)}
            />
            <span>
              Concordo com o uso dos dados para retorno comercial, conforme a{" "}
              <a
                href="/politica-de-privacidade"
                className="text-synapz-neural underline underline-offset-4"
              >
                Política de Privacidade
              </a>
              .
            </span>
          </label>
          {errors.consent ? (
            <p className="text-sm text-red-300" role="alert">
              {errors.consent}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            variant="impulse"
            size="lg"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Enviando..." : "Iniciar conversa"}
          </Button>
          {wa ? (
            <Button
              href={wa}
              variant="secondary"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conversar pelo WhatsApp
            </Button>
          ) : null}
        </div>
      </form>

      <div id="form-status" aria-live="polite" className="min-h-[1.5rem]">
        {status === "success" && (
          <p className="text-synapz-impulse">{serverMessage}</p>
        )}
        {(status === "error" || status === "unavailable") && (
          <p className="text-synapz-neural/90 border border-synapz-neural/20 bg-synapz-black p-4">
            {serverMessage}
            {!wa && SITE.contact.email ? (
              <>
                {" "}
                E-mail:{" "}
                <a
                  className="text-synapz-impulse underline"
                  href={`mailto:${SITE.contact.email}`}
                >
                  {SITE.contact.email}
                </a>
              </>
            ) : null}
          </p>
        )}
      </div>
    </div>
  );
}
