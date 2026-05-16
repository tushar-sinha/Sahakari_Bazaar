/**
 * Build wrapper: forwards npm proxy config to HTTPS_PROXY so Prisma can
 * download its engine binaries through the corporate proxy.
 * If `prisma generate` still fails (e.g. air-gapped CI), the script warns
 * and continues to `next build`.
 */
import { execSync } from 'child_process';

const proxy =
  process.env.HTTPS_PROXY ||
  process.env.https_proxy ||
  process.env.npm_config_https_proxy ||
  process.env.npm_config_proxy ||
  '';

const env = {
  ...process.env,
  ...(proxy ? { HTTPS_PROXY: proxy, HTTP_PROXY: proxy } : {}),
};

if (proxy) {
  console.log(`[build] Using proxy: ${proxy}`);
}

// --- prisma generate (non-fatal) ---
try {
  execSync('npx prisma generate', { env, stdio: 'inherit' });
} catch {
  console.warn('[build] prisma generate failed (binary download issue?) – continuing to next build.');
}

// --- next build (fatal on error) ---
execSync('next build', { env, stdio: 'inherit' });
