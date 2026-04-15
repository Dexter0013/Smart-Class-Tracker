function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function getServerEnv() {
  return {
    lmStudioBaseUrl: required("LMSTUDIO_API_BASE_URL"),
    lmStudioModel: required("LMSTUDIO_MODEL"),
    lmStudioApiKey: process.env.LMSTUDIO_API_KEY?.trim() || undefined,
  };
}
