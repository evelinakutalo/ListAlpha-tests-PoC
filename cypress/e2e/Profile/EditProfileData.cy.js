describe('Edit Profile Data', () => {
    beforeEach(() => {
      cy.signInUser()
  
      cy.visit("https://dev-ui.listalpha.com/friends")
  })
    
    
    it(`should: create user, edit his data and delete him`, () => {
  
        const firstName = 'firstName'
        const lastName = 'lastName'
        const expected = `${firstName} ${lastName}`
        const editedFirstName = "New First Name"
        const editedLastName = "New Last Name"

  
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
        cy.get('[formcontrolname="headline"]').type('Worker')
        cy.get('[formcontrolname="location"]').type('Test City')
        cy.get('[formcontrolname="email"]').type('testemail@test.com')
        cy.get('[formcontrolname="phone"]').type(1234567890)
        cy.get('[formcontrolname="company_name"]').type('Test Company')
        cy.get('[formcontrolname="title"]').type('Test Title')
        cy.get('[formcontrolname="linkedin"]').type('linkedin.com')

        
        cy.get('.edit-options').click()
        cy.wait('@userRequest')
        
        cy.get('[type="submit"]').contains('Save').click()
        
        cy.wait('@userRequest')
        // find div that contains expected, hover it and click on the delete button, to delete the user
       
        cy.get('div.user-wrapper').contains(expected).should("be.visible")
    
        cy.wait(5000)
        //edit user's name
        cy.get('div.user-wrapper').contains(expected).click()

        cy.get('.mat-dialog-container').should('be.visible')

        cy.get('.mat-button-wrapper').contains("Edit").click()
        cy.get('.mat-dialog-container').should('be.visible')

        //edit first and last name
        cy.get('[placeholder="First name"]').clear()
        cy.get('[placeholder="First name"]').type(editedFirstName)

        cy.get('[placeholder="Last name"]').clear()
        cy.get('[placeholder="Last name"]').type(editedLastName)

        cy.get('[formcontrolname="headline"]').clear()
        cy.get('[formcontrolname="headline"]').type('Edited worker')

        cy.get('[formcontrolname="location"]').clear()
        cy.get('[formcontrolname="location"]').type('Edited Test City')

        cy.get('[formcontrolname="email"]').clear()
        cy.get('[formcontrolname="email"]').type('editedtestemail@test.com')

        cy.get('[formcontrolname="phone"]').clear()
        cy.get('[formcontrolname="phone"]').type(123)

        cy.get('[formcontrolname="company_name"]').clear()
        cy.get('[formcontrolname="company_name"]').type('Edited Test Company')

        cy.get('[formcontrolname="title"]').clear()
        cy.get('[formcontrolname="title"]').type('Etited Test Title')

        cy.get('[formcontrolname="linkedin"]').clear()
        cy.get('[formcontrolname="linkedin"]').type('linkedin.com/edited')



        cy.get('.mat-button-wrapper').contains('Save').click()

        cy.get('.mat-button-wrapper').contains('Close').click()

        cy.get('div.user-wrapper').contains(editedFirstName).should("be.visible")

        cy.get('div.user-wrapper').eq(0).within(() => {
          cy.get('.user-remove button').click({ force: true })
        })
  
        // wait until deleted
        cy.wait(2000)
  
      // at the end test that "expected" removed successfully
        cy.get('.user-list-wrapper').contains('.user-wrapper', editedFirstName).should('not.exist')
      })
    })
  