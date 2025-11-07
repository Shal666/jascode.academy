export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const crmResponse = await fetch(
      "https://jascode.linked.kz/api/services/app/RequestsPub/CreateNewOnlineRequest",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const data = await crmResponse.text();
    res.status(crmResponse.status).send(data);
  } catch (err) {
    console.error("CRM Proxy Error:", err);
    res.status(500).json({ error: "Failed to connect to CRM" });
  }
}