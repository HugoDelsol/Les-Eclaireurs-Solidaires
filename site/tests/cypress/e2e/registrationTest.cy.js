describe('Volunteering opportunity', () => {

  beforeEach(() => {

    cy.visit('http://localhost:3000/dashboardUser')
    cy.viewport(1920, 1080);
  });

  it('should allow a logged-in user to subscribe to a volunteering mission', () => {

    cy.intercept({ method: 'POST', url: "/auth" }).as("connexionRequired")

    cy.get('#email')
      .should('be.visible')
      .type('mamie@gmail.com')
      .should('have.value', 'mamie@gmail.com');

    cy.get('input[type="password"]')
      .should('be.visible')
      .type('123')
      .should('have.value', '123');

    cy.contains("CONNEXION")
      .should('be.visible')
      .click();

    cy.wait("@connexionRequired").then((i) => {
      expect(i.response).to.exist;
      expect(i.response.statusCode).to.eq(200);
    });

    cy.get('.btnPrimary')
      .contains('Missions')
      .click();

    cy.url()
      .should('include', '/missionUserShow');

    cy.get('#regionSelected')
      .select(3);

    cy.contains('Rechercher')
      .click();

    cy.intercept({ method: "POST", url: "**/addRegisterMissionUser**" })
      .as("subscribeInMission");

    cy.get("input[type='checkbox']")
      .should('not.be.checked')
      .click()
      .should('be.checked');

    cy.get(".subscribe")
      .should("have.attr", "href", "#")
      .click();

    cy.wait('@subscribeInMission').then((i) => {
      expect(i.response).to.exist;
      expect(i.response.statusCode).to.eq(200);
    });

    cy.get('.modalToggle')
      .should('include.text', 'prise en compte')
  });
});