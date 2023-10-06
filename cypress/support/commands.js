import "cypress-wait-until";

function loginViaAuth0Ui(username, password) {
  // App landing page redirects to Auth0.
  cy.visit("/");

  // Login on Auth0.
  cy.origin(
    "https://listalpha-development.eu.auth0.com",
    { args: { username, password } },
    ({ username, password }) => {
      cy.get("form")
        .first()
        .within(() => {
          cy.get("#username").type(username);
          cy.get("#password").type(password);
          cy.get("button[type='submit']").filter(":visible").click();
        });
    }
  );

  // Ensure Auth0 has redirected us back to the RWA.
  // cy.url().should('equal', 'https://dev-ui.listalpha.com')
}

Cypress.Commands.add("signInUser", () => {
  loginViaAuth0Ui("e.kutalo@geniusee.com", "test123TEST");
  cy.wait(2000);
});
