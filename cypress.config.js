const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    // 1. On indique où se trouvent les tests (specs)
    specPattern: "site/tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",

    // 2. On indique où se trouvent les fichiers de support
    supportFile: "site/tests/cypress/support/e2e.js",

    // 3. Optionnel : l'URL de base pour ne plus avoir à l'écrire
    baseUrl: "http://localhost:3000",
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
