function getEnvVar(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getOptionalEnvVar(name: string): string | undefined {
  const value = process.env[name];
  return value !== undefined && value !== '' ? value : undefined;
}

export default getEnvVar;
