export default async function handler(req, res) {
  const backendBase = "http://161.35.36.93:3030";

  // forward the request path, removing /api
  const targetUrl = backendBase + req.url.replace("/api", "");

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json"
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined
    });

    const contentType = response.headers.get("content-type");

    // return JSON
    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      return res.status(response.status).json(json);
    }

    // or text
    const text = await response.text();
    return res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy failed" });
  }
}
