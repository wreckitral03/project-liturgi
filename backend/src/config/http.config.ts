export interface HttpConfig {
  port: number;
  corsOrigins: string[] | true;
}

const DEFAULT_PORT = 3000;
const DEFAULT_CORS_ORIGINS = [
  'http://localhost:8081',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8081',
  'http://127.0.0.1:8080',
];

export function parsePort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    return DEFAULT_PORT;
  }

  return parsed;
}

export function parseCorsOrigins(value: string | undefined): string[] | true {
  if (!value) {
    return DEFAULT_CORS_ORIGINS;
  }

  if (value.trim() === '*') {
    return true;
  }

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : DEFAULT_CORS_ORIGINS;
}

export function getHttpConfig(env: NodeJS.ProcessEnv = process.env): HttpConfig {
  return {
    port: parsePort(env.PORT),
    corsOrigins: parseCorsOrigins(env.CORS_ORIGINS),
  };
}
