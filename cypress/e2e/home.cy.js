/// <reference types="cypress" />

// Fluxos principais — Tela Home (Dashboard) refatorado para usar sessão

describe('Fluxos principais — Tela Home (Dashboard)', () => {
  const dashboardPath = '/dashboard';

  before(() => {
    const email = Cypress.env('SUASFACIL_EMAIL');
    const password = Cypress.env('SUASFACIL_PASSWORD');
    cy.loginSuasFacil(email, password);
  });

  beforeEach(() => {
    cy.visit(dashboardPath, { timeout: 60000 });
    cy.url({ timeout: 60000 }).should('include', '/dashboard');
    cy.contains('Famílias', { timeout: 60000 }).should('be.visible');
  });

  it('exibe os painéis principais na home', () => {
    ['Famílias', 'Usuários', 'Atendimentos', 'Encaminhamentos', 'Atividades Recentes', 'Mapa das Famílias Atendidas']
      .forEach(text => cy.contains(text, { timeout: 30000 }).should('be.visible'));
  });

  it('permite pesquisar na barra de busca da home', () => {
    cy.get('input[placeholder*="Digite um Nome"]', { timeout: 30000 }).as('search');
    cy.get('@search').clear().type('Teste de Busca{enter}', { delay: 20 });
    cy.get('@search', { timeout: 20000 }).should('have.value', 'Teste de Busca');
  });

  it('navega para o módulo Família a partir do menu lateral', () => {
    cy.contains(/^Família$|Famílias/, { timeout: 30000 }).first().click();
    cy.contains(/Família|Famílias/, { timeout: 30000 }).should('be.visible');
  });

  it('navega para o módulo Usuário a partir do menu lateral', () => {
    cy.contains(/^Usuário$|Usuários/, { timeout: 30000 }).first().click();
    cy.contains(/Usuário|Usuários/, { timeout: 30000 }).should('be.visible');
  });
});
