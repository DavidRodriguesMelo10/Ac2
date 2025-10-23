/// <reference types="cypress" />

// Refatoração dos cenários de Login usando helpers e env

describe('Página de Login', () => {
  const loginUrl = '/auth/login';
  const emailInput = 'input[placeholder="E-mail"]';
  const passwordInput = 'input[placeholder="Senha"]';
  const loginButtonText = 'ENTRAR';

  beforeEach(() => {
    cy.visit(loginUrl, { timeout: 60000 });
    cy.contains('button', loginButtonText, { timeout: 30000 }).should('be.visible');
  });

  it('deve fazer login com sucesso com credenciais válidas', () => {
    const email = Cypress.env('SUASFACIL_EMAIL');
    const password = Cypress.env('SUASFACIL_PASSWORD');

    cy.get(emailInput, { timeout: 20000 }).should('be.visible').clear().type(email);
    cy.get(passwordInput, { timeout: 20000 }).should('be.visible').clear().type(password, { log: false });
    cy.contains('button', loginButtonText, { timeout: 20000 }).click();
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
  });

  it('deve exibir mensagem de erro com credenciais inválidas', () => {
    cy.get(emailInput, { timeout: 20000 }).should('be.visible').clear().type('email-invalido@exemplo.com');
    cy.get(passwordInput, { timeout: 20000 }).should('be.visible').clear().type('senha-invalida', { log: false });
    cy.contains('button', loginButtonText, { timeout: 20000 }).click();

    cy.contains(
      'Essas credenciais não correspondem aos nossos registros ou o usuário está desativado',
      { timeout: 30000 }
    ).should('be.visible');

    cy.url({ timeout: 20000 }).should('eq', `${Cypress.config('baseUrl')}${loginUrl}`);
  });

  it('deve exibir mensagem de erro ao tentar logar com e-mail vazio', () => {
    cy.get(passwordInput, { timeout: 20000 }).should('be.visible').type('admin1234', { log: false });
    cy.contains('button', loginButtonText, { timeout: 20000 }).click();
    cy.shouldBeRequired(emailInput);
  });

  it('deve exibir mensagem de erro ao tentar logar com senha vazia', () => {
    cy.get(emailInput, { timeout: 20000 }).should('be.visible').type('email-valido@exemplo.com');
    cy.contains('button', loginButtonText, { timeout: 20000 }).click();
    cy.shouldBeRequired(passwordInput);
  });

  it('deve exibir mensagem de erro ao tentar logar com ambos os campos vazios', () => {
    cy.contains('button', loginButtonText, { timeout: 20000 }).click();
    cy.shouldBeRequired(emailInput);
  });
});
