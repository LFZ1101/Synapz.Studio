"use client";

import { Button } from "@/components/ui/Button";
import { SITE } from "@/content/site";
import { projectTypes } from "@/content/studio";
import { whatsappUrl } from "@/lib/utils";
import { useState, type FormEvent, type ReactNode } from "react";

type Status = "idle" | "ready" | "error";

type FieldErrors = Partial<Record<string, string>>;

const initial = {
  name: "",
  company: "",
  whatsapp: "",
  email: "",
  projectType: "",
  message: "",
  consent: false,
  website: "", // honeypot
};

export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const studioWhatsapp = SITE.contact.whatsapp || "5543999541462";

  const directWa = whatsappUrl(
    studioWhatsapp,
    "Olá SYNAPZ, gostaria de conversar sobre um projeto.",
  );

  function buildWhatsappMessage() {
    const lines = [
      "Olá SYNAPZ! Vim pelo formulário do site.",
      "",
      `Nome: ${values.name.trim()}`,
      values.company.trim() ? `Empresa: ${values.company.trim()}` : "",
      `WhatsApp: ${values.whatsapp.trim()}`,
      values.email.trim() ? `E-mail: ${values.email.trim()}` : "",
      `O que precisa: ${values.projectType}`,
      "",
      "Contexto do projeto:",
      values.message.trim(),
    ].filter((line) => line !== "");

    return lines.join("\n");
  }

  function validate() {
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = "Informe seu nome.";
    if (!values.whatsapp.trim()) next.whatsapp = "Informe um WhatsApp.";
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "E-mail inválido.";
    }
    if (!values.projectType) next.projectType = "Selecione o que você precisa.";
    if (!values.message.trim()) {
      next.message = "Conte o contexto do projeto.";
    }
    if (!values.consent) {
      next.consent = "É necessário consentir com o retorno comercial.";
    }
    if (values.website.trim()) {
      next.website = "Spam detectado.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setStatus("error");
      setServerMessage("Revise os campos destacados antes de continuar.");
      return;
    }

    const destination = whatsappUrl(studioWhatsapp, buildWhatsappMessage());
    if (!destination) {
      setStatus("error");
      setServerMessage(
        "Não foi possível preparar o WhatsApp. Tente novamente em instantes.",
      );
      return;
    }

    setStatus("ready");
    setServerMessage(
      "Mensagem preparada. Você ainda poderá revisar e enviar no WhatsApp.",
    );
    window.setTimeout(() => {
      window.location.href = destination;
    }, 200);
  }

  const field = (
    id: keyof typeof initial,
    label: string,
    node: ReactNode,
    hint?: string,
  ) => (
    <div className="space-y-2">
      <label htmlFor={id} className="eyebrow text-synapz-signal">
        {label}
        {hint ? (
          <span className="ml-2 normal-case tracking-normal text-synapz-signal/70">
            {hint}
          </span>
        ) : null}
      </label>
      {node}
      {errors[id] ? (
        <p id={`${id}-error`} className="text-sm text-red-300" role="alert">
          {errors[id]}
        </p>
      ) : null}
    </div>
  );

  const inputClass = "field-input";

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        noValidate
        className="grid gap-6 md:grid-cols-2"
        aria-describedby="form-status"
      >
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
          "Seu nome",
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
          "(opcional)",
        )}

        {field(
          "whatsapp",
          "Seu WhatsApp",
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
          "(opcional)",
        )}

        <div className="md:col-span-2">
          {field(
            "projectType",
            "O que você precisa?",
            <select
              id="projectType"
              name="projectType"
              className={inputClass}
              value={values.projectType}
              aria-invalid={Boolean(errors.projectType)}
              aria-describedby={
                errors.projectType ? "projectType-error" : undefined
              }
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
        </div>

        <div className="md:col-span-2">
          {field(
            "message",
            "Conte o contexto do projeto",
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
          <label className="flex items-start gap-3 text-sm text-synapz-signal cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 accent-synapz-impulse"
              checked={values.consent}
              onChange={(e) =>
                setValues((v) => ({ ...v, consent: e.target.checked }))
              }
              aria-invalid={Boolean(errors.consent)}
            />
            <span>
              Autorizo o retorno comercial da SYNAPZ, conforme a{" "}
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

        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            type="submit"
            variant="impulse"
            size="lg"
            className="w-full sm:w-auto min-h-11"
            disabled={status === "ready"}
          >
            {status === "ready"
              ? "Abrindo WhatsApp..."
              : "Preparar mensagem no WhatsApp"}
          </Button>
          {directWa ? (
            <Button
              href={directWa}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto min-h-11"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir sem preencher
            </Button>
          ) : null}
        </div>
      </form>

      <div id="form-status" aria-live="polite" className="min-h-[1.5rem]">
        {status === "ready" && (
          <p className="text-synapz-impulse">{serverMessage}</p>
        )}
        {status === "error" && (
          <p className="text-synapz-neural/90 border border-synapz-neural/20 bg-synapz-black p-4">
            {serverMessage}
          </p>
        )}
      </div>
    </div>
  );
}
