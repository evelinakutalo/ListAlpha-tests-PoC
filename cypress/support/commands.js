Cypress.Commands.add(
    'signInUser',
    () => {
        cy.visit("https://dev-ui.listalpha.com")

        cy.get('form').first().within(() => {
            cy.get("#username").type("e.kutalo@geniusee.com")
    
            cy.get("#password").type("test123TEST")
    
            cy.get("button[type='submit']").click()
        })
    },
  );