/**
 * This helper returns environment variables that are injected at runtime by the Docker entrypoint script.
 * In development (local), it falls back to Vite's import.meta.env.
 */
export const getEnv = (key: string): string => {
  // @ts-ignore
  return window._env_?.[key] || import.meta.env[key] || '';
};
