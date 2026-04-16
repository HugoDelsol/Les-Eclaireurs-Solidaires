describe('Home Page - Tests Cypress', () => {

  beforeEach(() => {

    cy.visit('http://localhost:3000/home');
    cy.viewport(1920, 1080);
  });

  it('should send a contact form and receive a 200 response', () => {

    cy.intercept({ method: 'POST', url: '/homeForm' }).as('postHomeForm');

    cy.get('#firstName')
      .type('monNom')
      .should('have.value', 'monNom');

    cy.get('#email')
      .type('hugo@gmail.com')
      .should('have.value', 'hugo@gmail.com');

    cy.get('#txtArea')
      .type('monNom')
      .should('have.value', 'monNom');

    cy.get('button[type="submit"]')
      .click();

    cy.wait("@postHomeForm").then((i) => {
      expect(i.response).to.exist;
      expect(i.response.statusCode).to.eq(200);
    });

    cy.get('.alertFrontOfficeSuccess')
      .should('include.text', 'envoyé')
  });

  it('should redirect to signIn page when joining a mission', () => {

    cy.contains('Rejoindre')
      .click();

    cy.get('.linkJoin')
      .should('contain', 'Rejoindre')
      .click();

    cy.url().should('include', '/signIn');
  });


  it('should login successfully and redirect to dashboard', () => {

    cy.intercept({ method: 'POST', url: '/auth' }).as('signInForm')

    cy.get('.btnSecondary')
      .contains('Se connecter')
      .click()

    cy.get('#email')
      .type('mamie@gmail.com')
      .should('have.value', 'mamie@gmail.com')

    cy.get('input[type="password"]')
      .type('123')
      .should('have.value', '123')

    cy.get('.btnSecondary')
      .contains('CONNEXION')
      .click()

    cy.wait('@signInForm').then((i) => {
      expect(i.response).to.exist;
      expect(i.response.statusCode).to.eq(200);
    });

    cy.url().should('include', '/auth')
  });
});