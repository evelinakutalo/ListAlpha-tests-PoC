describe('Search Profile in lists - List version', () => {
  beforeEach(() => {
    cy.signInUser()

    cy.visit("https://dev-ui.listalpha.com/friends")
})

  it(`should: create profile, search in lists and delete him`, () => {

      const firstName = 'firstName'
      const lastName = 'lastName'
      const expected = `${firstName} ${lastName}`
      const tagName = "Cypress"

      cy.intercept({
        method: 'GET',
        url: '*/lists'
      }).as("userRequest")

      cy.visit('https://dev-ui.listalpha.com/friends')

      cy.wait('@userRequest')

      cy.get('[mattooltip="Add new profile"]').click()
      cy.get('.edit-options').should('be.visible')

      cy.get('.tab').contains('Manual').click()

      cy.get('[formcontrolname="first_name"]').type(firstName)
      cy.get('[formcontrolname="last_name"]').type(lastName)
      cy.get('[formcontrolname="headline"]').type('Worker')
      cy.get('[formcontrolname="location"]').type('Test City')
      cy.get('[formcontrolname="company_name"]').type('Test Company')
      cy.get('[formcontrolname="title"]').type('Test Title')

    
      
      cy.get('[type="submit"]').contains('Save').click()
      
      cy.wait('@userRequest')
     
      cy.get('div.user-wrapper').contains(expected).should("be.visible")
  
      cy.wait(5000)

      //add tags
      cy.get('div.user-wrapper').contains(expected).click()

      cy.get('.mat-dialog-container').should('be.visible')

      cy.wait(2000)

      cy.get('.mat-chip-input').click()

      cy.get('.mat-chip-input').type(tagName).type('{enter}')

      cy.get('.mat-button-wrapper').contains('Close').click()
      
  
      cy.wait (5000)

      cy.get('.user-wrapper').eq(0).contains(expected).should('be.visible')


      //search by first name
      
      cy.get('[placeholder="Search people by keywords"]').type('firstName')

      cy.get('.lists-container').contains('.user-wrapper', expected).should('exist')

      //search by last name
      
      cy.get('[placeholder="Search people by keywords"]').clear()
      cy.get('[placeholder="Search people by keywords"]').type('lastName')

      cy.get('.lists-container').contains('.user-wrapper', expected).should('exist')

      //search by headline 
      
      cy.get('[placeholder="Search people by keywords"]').clear()
      cy.get('[placeholder="Search people by keywords"]').type('Worker')

      cy.get('.lists-container').contains('.user-wrapper', expected).should('exist')


      //search by location
      
      cy.get('[placeholder="Search people by keywords"]').clear()
      cy.get('[placeholder="Search people by keywords"]').type('Test City')

      cy.get('.lists-container').contains('.user-wrapper', expected).should('exist')


      //search by company
      
      cy.get('[placeholder="Search people by keywords"]').clear()
      cy.get('[placeholder="Search people by keywords"]').type('Test Company')

      cy.get('.lists-container').contains('.user-wrapper', expected).should('exist')


      //search by title
      
      cy.get('[placeholder="Search people by keywords"]').clear()
      cy.get('[placeholder="Search people by keywords"]').type('Test Title')

      cy.get('.lists-container').contains('.user-wrapper', expected).should('exist')

      
      //search by tags
      
      cy.get('[placeholder="Search people by keywords"]').clear()
      cy.get('[placeholder="Search people by keywords"]').type(tagName)

      cy.get('.lists-container').contains('.user-wrapper', expected).should('exist')


      cy.get('.user-wrapper').eq(0).within(() => {
        cy.get('.user-remove button').click({ force: true })
      })

      // wait until deleted
      cy.wait(2000)

      // at the end test that "expected" removed successfully
      cy.get('.user-list-wrapper').contains('.user-wrapper', expected).first().should('not.exist')
    })
  })
