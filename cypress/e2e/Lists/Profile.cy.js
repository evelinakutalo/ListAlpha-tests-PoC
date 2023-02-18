describe('Add Profile', () => {
  beforeEach(() => {
    cy.signInUser()

    cy.visit("https://dev-ui.listalpha.com/friends")
})
  
  
  it(`should: add new user and then delete him`, () => {

      const firstName = 'firstName'
      const lastName = 'lastName'
      const expected = `${firstName} ${lastName}`

      cy.intercept({
        method: 'GET',
        url: '*/lists'
      }).as("userRequest")

      cy.visit('https://dev-ui.listalpha.com/friends')
  
      cy.wait(2000)

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
      // cy.get('div.tile-wrapper').eq(0).contains(expected).within(() => {
      //   cy.get('.tile-remove').click()
      // })

      cy.get('div.user-wrapper').eq(0).within(() => {
        cy.get('.user-remove button').click({ force: true })
      })

      // wait until deleted
      cy.wait(2000)

    // at the end test that "expected" removed successfully
      cy.get('.user-list-wrapper').contains('.user-wrapper', expected).should('not.exist')


      // cy.get('.ng-fa-icon.remove-icon').should('have')

      //cy.get(modalTag).should('not.exist')



     // waiting until "${expected}" appear in the table
     // cy.get('#group-root').contains(expected)
      
     // only then we test that "${expected}" is in the first row of the table
     // cy.get('#group-root > .connection').eq(0).contains(expected)

     // find first element again, within find remove button and click
     // cy.get('#group-root > .connection').eq(0).within(() => {
     //   cy.get('.user-remove button').click({ force: true })
     // })

     // at the end test that "${expected" removed successfully
     // cy.get('#group-root').contains(expected).should('not.exist')
    })
  })

