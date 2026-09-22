import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  whatsapp: z.string().min(8),
  email: z.string().email(),
  projectType: z.string().min(1),
  objective: z.string().optional(),
  investment: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10),
  consent: z.literal(true),
  website: z.string().optional(), // honeypot
});

/**
 * Contact API.
 * Does not fake success when no delivery channel is configured.
 * Set CONTACT_WEBHOOK_URL or RESEND_API_KEY + CONTACT_TO_EMAIL to enable.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "JSON inválido." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Dados inválidos. Revise os campos." },
      { status: 400 },
    );
  }

  // Honeypot triggered
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, message: "Mensagem recebida." });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  if (!webhook && !(resendKey && toEmail)) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNCONFIGURED",
        message:
          "O envio ainda não está configurado neste ambiente. Utilize WhatsApp ou e-mail diretos, ou configure CONTACT_WEBHOOK_URL / RESEND_API_KEY.",
      },
      { status: 503 },
    );
  }

  const payload = {
    ...parsed.data,
    website: undefined,
    receivedAt: new Date().toISOString(),
    source: "synapz-studio-website",
  };

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Webhook failed");
    } else if (resendKey && toEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "SYNAPZ Site <onboarding@resend.dev>",
          to: [toEmail],
          subject: `[SYNAPZ] Novo contato — ${parsed.data.projectType}`,
          text: Object.entries(payload)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n"),
        }),
      });
      if (!res.ok) throw new Error("Resend failed");
    }

    return NextResponse.json({
      ok: true,
      message: "Mensagem enviada. Retornaremos em breve.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Não foi possível enviar agora. Tente novamente em instantes.",
      },
      { status: 502 },
    );
  }
}
