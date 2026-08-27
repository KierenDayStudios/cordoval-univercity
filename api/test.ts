export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  const secret = req.headers.authorization || "";
  return res.status(200).json({ ok: true, method: req.method, hasAuth: secret.length > 0, hasFbJson: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON, hasSecret: !!process.env.PUBLISH_API_SECRET });
}