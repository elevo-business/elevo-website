import { NextRequest, NextResponse } from "next/server";

const PIPEDRIVE_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_DOMAIN = process.env.PIPEDRIVE_DOMAIN ?? "api.pipedrive.com";

async function pipedrivePost(path: string, body: Record<string, unknown>) {
  const res = await fetch(
    `https://${PIPEDRIVE_DOMAIN}/v1${path}?api_token=${PIPEDRIVE_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  return res.json();
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, company, email, phone, service, budget, message } = data;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  if (!PIPEDRIVE_TOKEN) {
    console.warn("PIPEDRIVE_API_TOKEN not set — skipping CRM sync");
    return NextResponse.json({ success: true, crm: false });
  }

  try {
    const personRes = await pipedrivePost("/persons", {
      name,
      email: [{ value: email, primary: true }],
      phone: phone ? [{ value: phone, primary: true }] : undefined,
      org_name: company || undefined,
    });

    const personId = personRes?.data?.id;

    const title = `${name}${company ? ` — ${company}` : ""} | ${service || "Anfrage"}`;
    await pipedrivePost("/leads", {
      title,
      person_id: personId,
      note: `Budget: ${budget || "k.A."}\n\nNachricht:\n${message}`,
    });

    return NextResponse.json({ success: true, crm: true });
  } catch (err) {
    console.error("Pipedrive error:", err);
    return NextResponse.json({ error: "CRM-Fehler beim Speichern." }, { status: 500 });
  }
}
