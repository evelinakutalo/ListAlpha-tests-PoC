
describe('Add Profile', () => {
    beforeEach(() => {
      cy.signInUser()
  
      cy.visit("https://dev-ui.listalpha.com/friends")
  })
    
    
    it(`should: automaticallu add new user and then delete him`, () => {
  
        const name = 'test'
  
        cy.intercept({
          method: 'GET',
          url: '*/lists'
        }).as("userRequest")
  
        cy.visit('https://dev-ui.listalpha.com/friends')
    
        cy.wait(2000)
  
        cy.get('[mattooltip="Add new profile"]').click()
        cy.get('.edit-options').should('be.visible')
  
        cy.get('[placeholder="Search by name"]').type(name)
        cy.get('.mat-button-wrapper').contains('Search').click()
        
        cy.get('.contact .ng-star-inserted').first().contains(name).click()
        cy.get('.preview').should('exist')

        cy.get('.mat-button-wrapper').contains('Save').click()
        
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
        cy.get('.user-list-wrapper').contains('.user-wrapper', name).should('not.exist')
    })
})