"use client";

import { useActionState, type ReactNode } from "react";
import { ErrorBanner, SuccessBanner } from "./FormPrimitives";

type ActionResult =
  | { error?: string; ok?: boolean; message?: string; resetUrl?: string | null }
  | undefined
  | void;

export function ActionForm({
  action,
  children,
  className,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className={className}>
      <ErrorBanner message={state && "error" in state ? state?.error : null} />
      <SuccessBanner
        message={state && "message" in state ? state?.message : null}
      />
      {state && "resetUrl" in state && state.resetUrl ? (
        <p className="mb-4 break-all text-xs text-synapz-impulse">
          Link local: {state.resetUrl}
        </p>
      ) : null}
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
