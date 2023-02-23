describe('Attach File to Profile', () => {
    beforeEach(() => {
      cy.signInUser()
  
      cy.visit("https://dev-ui.listalpha.com/friends")
  })
    
    
    it(`should: create user, attach file and delete him`, () => {
  
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
       
        cy.get('.user-wrapper').eq(0).contains(expected).should('be.visible')
    
        cy.wait(5000)

        //attach file 
        cy.get('.user-wrapper').contains(expected).click()

        cy.get('.mat-dialog-container').should('be.visible')

        cy.wait(2000)

        cy.get('.labels-list').should('be.visible')

        cy.get('.label-header').contains('Attach a file').click({force: true})

        cy.get('.label').contains('Attach a file').should('be.visible')

        cy.get('app-labels-list').eq(1).within(() => {
            cy.get('input[type=file]').selectFile('cypress/fixtures/cypresstestImage.jpg', { force: true })

            cy.get('.file-name').should('be.visible')

            cy.get('.label-close').within(() => {
                cy.get('.mat-button-wrapper').contains('Close').click()
            })
        })

        cy.get('.label-count').contains(1).should('be.visible')

        cy.get('mat-dialog-actions').within(() => {
            cy.get('.mat-button-wrapper').contains('Close').click()
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
  