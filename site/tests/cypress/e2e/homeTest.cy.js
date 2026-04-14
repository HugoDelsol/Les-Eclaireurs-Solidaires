describe('Académie des Super-Héros - Test de Recrutement', () => {

  // Avant chaque test, on se rend sur le site
  beforeEach(() => {
    // Imaginons que c'est un site d'entraînement public
    cy.visit('https://example.cypress.io/commands/actions');
  });

  it('devrait remplir le formulaire d’inscription du héros', () => {
    // 1. TROUVER UN ÉLÉMENT ET ÉCRIRE DEDANS
    // On cherche un champ email, on tape dedans et on vérifie la valeur
    cy.get('.action-email')
      .type('batman@gotham.city')
      .should('have.value', 'batman@gotham.city');

    // 2. SIMULER DES TOUCHES SPÉCIALES
    // On peut simuler la touche "Entrée"
    cy.get('.action-email').type('{enter}');
  });

  it('devrait choisir un super-pouvoir dans une liste', () => {
    // 3. AGIR SUR UN MENU DÉROULANT (SELECT)
    // Imaginons un menu pour choisir une cape
    // Ici on utilise un exemple du site Cypress (un select de type "frutier")
    cy.get('.action-select').select('apples');
    cy.get('.action-select').should('have.value', 'fr-apples');
  });

  it('devrait valider les conditions générales avec une case à cocher', () => {
    // 4. COCHER DES CASES (CHECKBOX)
    // On coche, et on vérifie que c'est bien coché
    cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]')
      .check()
      .should('be.checked');
  });

  it('devrait tester le "Drag and Drop" (Glisser-Déposer) de bouclier', () => {
    // 5. LES INTERACTIONS COMPLEXES
    // Cypress permet de vérifier si un élément contient un texte précis après une action
    cy.contains('Click to edit').click();

    // On efface le texte existant et on écrit le nom de notre arme
    cy.get('.action-canvas').click(); // Simule un clic sur une zone de dessin

    // On vérifie que l'URL contient bien un mot spécifique après l'action
    cy.url().should('include', '/commands/actions');
  });

  it('devrait afficher un message secret au survol de la souris', () => {
    // 6. LE SURVOL (HOVER) ET LA VISIBILITÉ
    // Parfois, des éléments n'apparaissent qu'au survol
    cy.get('.action-btn').click();
    cy.get('.well').should('contain', 'You clicked on a button!');
  });

});