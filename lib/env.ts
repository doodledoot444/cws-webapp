type EnvName =
  | 'DATABASE_URL'
  | 'NEXTAUTH_SECRET'
  | 'AUTH_SECRET'
  | 'RESEND_API_KEY'
  | 'EMAIL_FROM'
  | 'EMAIL_REPLY_TO'
  | 'APP_URL'
  | 'NEXTAUTH_URL';

function buildEnvError(name: string, context: string) {
  return new Error(
    `Missing ${name}. Set it in your environment variables (Vercel Project Settings -> Environment Variables) before using ${context}.`
  );
}

export function getRequiredEnv(name: EnvName, context: string) {
  const value = process.env[name];
  if (!value) {
    throw buildEnvError(name, context);
  }

  return value;
}

export function getRequiredOneOfEnv(names: EnvName[], context: string) {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }

  throw buildEnvError(names.join(' or '), context);
}
