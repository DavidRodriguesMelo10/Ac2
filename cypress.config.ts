import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://develop.suasfacil.com.br',
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      return config;
    },
  },
  env: {
    SUASFACIL_EMAIL: 'Atendimento@suasfacil.com.br',
    SUASFACIL_PASSWORD: '12345678',
  },
});
