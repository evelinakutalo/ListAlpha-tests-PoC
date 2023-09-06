
describe('Automatic Add Profile (Easy Add)', () => {
    beforeEach(() => {
      cy.signInUser()

      cy.visit("https://dev-ui.listalpha.com/friends")
  })


    it.skip(`should: automatically add new user and then delete him`, () => {

        const name = 'Test'

        cy.intercept({
          method: 'GET',
          url: '*/lists'
        }).as("userRequest")

        cy.visit('https://dev-ui.listalpha.com/friends')

        cy.wait(5000)

        cy.get('[mattooltip="Add new profile"]').click()
        cy.get('.edit-options').should('be.visible')

        cy.get('.edit-options').within(() => {
          cy.get('[placeholder="Search by name"]').type(name)
          cy.get('.mat-flat-button').contains('Search').click()

          cy.wait(5000)

          cy.get('.contacts-list').within(() => {
            cy.get('.contact').first().click()
          })
        })

        cy.wait(5000)

        cy.get('app-dialog-employee-add').within(() => {
          cy.get('.preview').should('be.visible')

          cy.get('.preview').within(() => {
          cy.get('.mat-button-wrapper').contains('Save').click()
          })

        })
          cy.wait(5000)

        // find div that contains expected, hover it and click on the delete button, to delete the user

        cy.get('.user-wrapper').eq(0).contains(name).should('be.visible')

        cy.get('.user-wrapper').eq(0).within(() => {
          cy.get('.user-remove button').click({ force: true })
        })


      // at the end test that "expected" removed successfully
        cy.get('.user-list-wrapper').contains('.user-wrapper', name).should('not.exist')
      })
})