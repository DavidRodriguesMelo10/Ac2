// Custom commands for SUAS Fácil

Cypress.Commands.add('loginSuasFacil', (email, password) => {
  const credentialsKey = [email, password];
  cy.session(credentialsKey, () => {
    cy.visit('/auth/login', { timeout: 60000 });

    cy.contains('button', 'ENTRAR', { timeout: 30000 }).should('be.visible');

    cy.get('input[placeholder="E-mail"]', { timeout: 30000 })
      .should('be.visible')
      .clear()
      .type(email);

    cy.get('input[placeholder="Senha"]', { timeout: 30000 })
      .should('be.visible')
      .clear()
      .type(password, { log: false });

    cy.contains('button', 'ENTRAR', { timeout: 30000 }).click();

    cy.url({ timeout: 60000 }).should('include', '/dashboard');
  }, { cacheAcrossSpecs: true });
});

// Utility to assert required-field native validation message
Cypress.Commands.add('shouldBeRequired', (selector) => {
  cy.get(selector).then(($el) => {
    expect($el[0].validationMessage).to.eq('Preencha este campo.');
  });
});
