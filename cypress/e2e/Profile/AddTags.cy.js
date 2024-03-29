describe('Add Tags', () => {
    beforeEach(() => {
      cy.signInUser()

      cy.visit("https://dev-ui.listalpha.com/friends")
  })


    it.skip(`should: create user, add new tags and delete him`, () => {

        const firstName = 'firstName'
        const lastName = 'lastName'
        const expected = `${firstName} ${lastName}`
        const tagName = "Cypress"


        cy.intercept({
          method: 'GET',
          url: '*/lists'
        }).as("userRequest")

        cy.visit('https://dev-ui.listalpha.com/friends')

        cy.wait(2000)

        //create new user
        cy.get('[mattooltip="Add new profile"]').click()
        cy.get('.edit-options').should('be.visible')

        cy.get('.tab').contains('Manual').click()

        cy.get('[formcontrolname="first_name"]').type(firstName)
        cy.get('[formcontrolname="last_name"]').type(lastName)
        cy.get('[formcontrolname="company_name"]').type('Test Company')


        cy.get('.edit-options').click()
        cy.wait('@userRequest')

        cy.get('[type="submit"]').contains('Save').click()

        cy.wait(5000)
        // find div that contains expected, hover it and click on the delete button, to delete the user

        cy.get('.user-wrapper').contains(expected).should('be.visible')

        cy.wait(2000)
        //add tags
        cy.get('.user-wrapper').contains(expected).click()

        cy.get('.mat-dialog-container').should('be.visible')

        cy.wait(2000)

        cy.get('.mat-chip-input').click()

        cy.get('.mat-chip-input').type(tagName).type('{enter}')

        cy.get('.mat-button-wrapper').contains('Close').click()

        cy.wait(5000)

        cy.get('.user-wrapper').within(() => {
            cy.get('.mat-chip-ripple').contains(tagName).should('be.visible')
        })

        cy.get('.user-wrapper').eq(0).within(() => {
          cy.get('.user-remove button').click({ force: true })
        })

        // wait until deleted
        cy.wait(2000)

      // at the end test that "expected" removed successfully
        cy.get('.user-list-wrapper').contains('.user-wrapper', expected).should('not.exist')
      })
    })
