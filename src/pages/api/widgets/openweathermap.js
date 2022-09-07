import cachedFetch from "utils/cached-fetch";
import { getSettings } from "utils/config";

export default async function handler(req, res) {
  const { latitude, longitude, units, provider, cache } = req.query;
  let { apiKey } = req.query;

  if (!apiKey && !provider) {
    return res.status(400).json({ error: "Missing API key or provider" });
  }

  if (!apiKey && provider !== "openweathermap") {
    return res.status(400).json({ error: "Invalid provider for endpoint" });
  }

  if (!apiKey && provider) {
    const settings = await getSettings();
    apiKey = settings?.providers?.openweathermap;
  }

  if (!apiKey) {
    return res.status(400).json({ error: "Missing API key" });
  }

  const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  res.send(await cachedFetch(api_url, cache));
}