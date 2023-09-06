describe('Add Profile Image', () => {
    beforeEach(() => {
      cy.signInUser()

      cy.visit("https://dev-ui.listalpha.com/friends")
  })


    it.skip(`should: create user, add image and delete user`, () => {

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
        cy.get('[formcontrolname="company_name"]').type('test')


        cy.get('.edit-options').click()
        cy.wait('@userRequest')

        cy.get('[type="submit"]').contains('Save').click()

        cy.wait('@userRequest')
        // find div that contains expected, hover it and click on the delete button, to delete the user

        cy.get('div.user-wrapper').contains(expected).should("be.visible")

        cy.wait(5000)

        cy.get('div.user-wrapper').contains(expected).click()

        cy.get('.mat-dialog-container').should('be.visible')

        cy.get('.mat-button-wrapper').contains("Edit").click()
        cy.get('.mat-dialog-container').should('be.visible')

        //add image
        cy.get('.image').click()
        cy.get('.photo-container').should('be.visible')

        cy.waitUntil(() =>  cy.get('.photo-container').children().should('have.length.greaterThan', 1))

        cy.get('.photo-container').within(() => {
          cy.get('.image.ng-star-inserted').first().click()
        })

        cy.waitUntil(() => cy.get('app-search-photo .mat-button-wrapper').contains('Save').should('not.be.disabled'))

        cy.get('app-search-photo .mat-button-wrapper').contains('Save').click()

        cy.get('app-dialog-employee-edit').should('be.visible')

        cy.get('app-dialog-employee-edit .mat-button-wrapper').contains('Save').click()

        cy.get('.mat-button-wrapper').contains('Close').click()

        cy.get('div.user-wrapper').contains(expected).should("be.visible")

        cy.get('div.user-wrapper').eq(0).within(() => {
          cy.get('.user-img img').invoke('attr', 'src').should('contain', 'https://dev-listalpha-user-files.s3')

          cy.get('.user-remove button').click({ force: true })
        })

        // wait until deleted
        cy.wait(2000)

      // at the end test that "expected" removed successfully
        cy.get('.user-list-wrapper').contains('.user-wrapper', expected).should('not.exist')
      })
    })
