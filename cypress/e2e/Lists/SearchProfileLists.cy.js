describe('Search Profile in lists - List version', () => {
  beforeEach(() => {
    cy.signInUser()

    cy.visit("https://dev-ui.listalpha.com/friends")
})

  it(`should: create profile, search in lists and delete him`, () => {

      const firstName = 'firstName'
      const lastName = 'lastName'
      const expected = `${firstName} ${lastName}`
      //const modalTag = 'mat-dialog-container'

      cy.intercept({
        method: 'GET',
        url: '*/lists'
      }).as("userRequest")

      cy.visit('https://dev-ui.listalpha.com/friends')

      cy.wait(5000)

      cy.get('[mattooltip="Add new profile"]').click()
      cy.get('.edit-options').should('be.visible')

      cy.get('.tab').contains('Manual').click()

      cy.get('[formcontrolname="first_name"]').type(firstName)
      cy.get('[formcontrolname="last_name"]').type(lastName)
      cy.get('[formcontrolname="company_name"]').type('test')

      cy.get('.edit-options').click()
      cy.wait('@userRequest')
      
      cy.get('[type="submit"]').contains('Save').click()
      
      cy.wait('@userRequest')
    // find div that contains expected, hover it and click on the delete button, to delete the user
  
      cy.get('div.user-wrapper').contains(expected).should("be.visible")

      cy.wait(5000)
      
      cy.get('[placeholder="Search people by keywords"]').type("firstName")

      cy.get('.lists-container').contains('.user-wrapper', expected).should('exist')

      cy.get('div.user-wrapper').eq(0).within(() => {
        cy.get('.user-remove button').click({ force: true })
      })

      cy.get('div.user-wrapper').eq(0).within(() => {
        cy.get('.user-remove button').click({ force: true })
      })

      // wait until deleted
      cy.wait(2000)

      // at the end test that "expected" removed successfully
      cy.get('.user-list-wrapper').contains('.user-wrapper', expected).first().should('not.exist')
    })
  })
