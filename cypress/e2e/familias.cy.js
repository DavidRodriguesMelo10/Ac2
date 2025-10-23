/// <reference types="cypress" />

// Cenários para /dashboard/familias

describe('Módulo Famílias — Lista e Interações Básicas', () => {
  const path = '/dashboard/familias';

  before(() => {
    const email = Cypress.env('SUASFACIL_EMAIL');
    const password = Cypress.env('SUASFACIL_PASSWORD');
    cy.loginSuasFacil(email, password);
  });

  beforeEach(() => {
    cy.visit(path, { timeout: 60000 });
    cy.url({ timeout: 60000 }).should('include', '/dashboard/familias');
  });

  it('carrega a página com status 200 e mostra cabeçalho', () => {
    cy.request({ url: path, failOnStatusCode: false }).its('status').should('be.oneOf', [200, 204]);
    cy.contains(/Família|Famílias/i, { timeout: 30000 }).should('be.visible');
  });

  it('exibe filtros e permite alterar', () => {
    // Busca por nome/CPF ou similar
    cy.get('input[type="text"], input[placeholder*="Nome" i], input[placeholder*="CPF" i]', { timeout: 30000 })
      .first()
      .as('filtroTexto');

    cy.get('@filtroTexto').clear().type('Teste Família');

    // Selects (ex.: unidade, status, bairro)
    cy.get('select', { timeout: 10000 }).then($selects => {
      if ($selects.length) {
        cy.wrap($selects).each(($s) => {
          const options = $s.querySelectorAll('option');
          if (options.length > 1) {
            cy.wrap($s).select(options[1].value);
          }
        });
      }
    });
  });

  it('lista de famílias é renderizada (tabela ou cards)', () => {
    // Aceita table ou grid de cards
    cy.get('table, [role="table"], .table', { timeout: 30000 })
      .should('exist');

    // Deve ter ao menos uma linha de dados
    cy.get('table tbody tr, [role="row"], .table tbody tr', { timeout: 30000 })
      .should('exist');
  });

  it('permite pesquisar por texto e mantém valor digitado', () => {
    cy.get('input[type="text"], input[placeholder*="Nome" i]', { timeout: 30000 })
      .first()
      .as('searchFam');

    cy.get('@searchFam').clear().type('Maria{enter}', { delay: 15 });
    cy.get('@searchFam').should('have.value', 'Maria');
  });

  it('abre detalhes de uma família ao clicar na linha', () => {
    // Clica na primeira linha/ação de ver detalhes
    cy.get('table tbody tr', { timeout: 30000 }).first().click();

    // Confirma que abriu painel/modal/detalhe
    cy.contains(/Detalhe|Família|Composição|Prontuário/i, { timeout: 30000 }).should('be.visible');

    // Fecha se for modal/drawer
    cy.get('button, [role="button"]').contains(/Fechar|Voltar|X|Close/i).first().click({ force: true });
  });

  it('navegação lateral mantém contexto do módulo Famílias', () => {
    cy.contains('nav, aside', /Família|Famílias/i).should('be.visible');
    // retorna à lista clicando no item do menu
    cy.contains('nav, aside', /Família|Famílias/i).first().click({ force: true });
    cy.url().should('include', '/dashboard/familias');
  });

  it('pagina resultados (se paginação existir)', () => {
    cy.get('nav[aria-label*="Paginação" i], .pagination, [data-testid*="pagination" i]').then($nav => {
      if ($nav.length) {
        cy.wrap($nav).contains(/Próximo|›|Next/i).click({ force: true });
        cy.wait(300);
        cy.wrap($nav).contains(/Anterior|‹|Prev/i).click({ force: true });
      }
    });
  });
});
