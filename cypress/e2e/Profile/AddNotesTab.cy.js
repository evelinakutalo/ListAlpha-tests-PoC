describe('Add Notes as Tab', () => {
    beforeEach(() => {
      cy.signInUser()

      cy.visit("https://dev-ui.listalpha.com/friends")
  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})


    it.skip(`should: create user, add new note and delete him`, () => {

        const firstName = 'firstName'
        const lastName = 'lastName'
        const expected = `${firstName} ${lastName}`


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

        cy.wait('@userRequest')
        // find div that contains expected, hover it and click on the delete button, to delete the user

        cy.get('.user-wrapper').eq(0).contains(expected).should("be.visible")

        cy.wait(5000)
        //edit user's name
        cy.get('div.user-wrapper').contains(expected).click()

        cy.get('.mat-dialog-container').should('be.visible')

        cy.wait(2000)

        cy.get('.labels-list').should('be.visible')

        cy.get('.label-header').contains('Notes').click({force: true})

        cy.get('.label').contains('Notes').should('be.visible')

        cy.get('.new-note').contains('Click here to start a note').click()

        cy.get('.notes-content-wrapper').should('be.visible')

        cy.get('.notes-content-wrapper').within(() => {
            cy.get('.editor-wrapper').click()
            cy.get('.editor-wrapper').eq(1).type("Test cypress note")
        })

        cy.get('.label-close').within(() => {
            cy.get('.mat-button-wrapper').contains('Close').click()
        })

        cy.get('.label-count').contains(1).should('be.visible')

        cy.get('.mat-button-wrapper').contains('Close').click()

        cy.get('.user-wrapper').eq(0).within(() => {
          cy.get('.user-remove button').click({ force: true })
        })

        // wait until deleted
        cy.wait(2000)

      // at the end test that "expected" removed successfully
        cy.get('.user-list-wrapper').contains('.user-wrapper', expected).should('not.exist')
      })
    })
