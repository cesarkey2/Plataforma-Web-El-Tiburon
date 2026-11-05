import { ENV } from "./_core/env";

export async function notifyByFormSubmit(subject: string, payload: Record<string, string>) {
  const recipient = ENV.formSubmitEmail.trim();
  if (!recipient) return;
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...payload, _subject: subject, _template: "table" }),
    });
    if (!response.ok) console.warn(`[FormSubmit] No se pudo enviar (${response.status})`);
  } catch (error) {
    console.warn("[FormSubmit] Envío omitido; el registro en MySQL se conserva.", error instanceof Error ? error.message : error);
  }
}
