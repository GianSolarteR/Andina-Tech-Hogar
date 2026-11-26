const { spawnSync } = require('node:child_process');
// Build aislado: ninguna prueba utiliza las credenciales del .env local.
const result = spawnSync(process.execPath, [require.resolve('expo/bin/cli'), 'export', '--platform', 'web', '--output-dir', '.expo/test-dist'], {
  stdio: 'inherit', env: { ...process.env, EXPO_NO_DOTENV: '1', EXPO_PUBLIC_SUPABASE_URL: 'https://andina-test.supabase.co', EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture_only' }
});
process.exit(result.status ?? 1);
