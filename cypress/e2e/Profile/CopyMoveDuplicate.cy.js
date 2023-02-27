const modalTag = 'mat-dialog-container'

const addItem = (listName) => {
    cy.intercept({
        method: 'GET',
        url: '*/lists'
    }).as("userRequest")

   
    cy.wait('@userRequest')
    cy.get('[mattooltip="Create list"]').click()
    cy.get('mat-dialog-container').should('be.visible')

    // 
    cy.get('[formcontrolname="listName"]').type(listName)
    cy.get('.mat-button-wrapper').contains("Create").click()

    //wait until list is created
    cy.wait(2000)
}

// function to delete list
const deleteItem = (listName) => {
    // search created list
    cy.get("#root").children().contains(listName).click()   
    cy.get('.action-button').contains("List settings").click()
    // delete in mat-dialog-container
    cy.get('.mat-menu-item').contains("Delete list").click()
    cy.get(modalTag).contains(listName).should('be.visible')

    //isolate the element to search it only in mat-dialog-container
    cy.get('mat-dialog-container').within(() => {
        cy.get('button').contains("Delete").click()
    })
    // verify if list is deleted
    cy.get("#root").children().contains(listName).should('not.exist')
}


const addProfile = (expected) => {
    const firstName = 'firstName'
    const lastName = 'lastName'

      cy.intercept({
        method: 'GET',
        url: '*/lists'
      }).as("userRequest")

      cy.get('[mattooltip="Add new profile"]').click()
      cy.get('.edit-options').should('be.visible')

      cy.get('.tab').contains('Manual').click()

      cy.get('[formcontrolname="first_name"]').type(firstName)
      cy.get('[formcontrolname="last_name"]').type(lastName)
      cy.get('[formcontrolname="company_name"]').type('test')

      
      cy.get('[type="submit"]').contains('Save').click()
      
      cy.wait('@userRequest')

      cy.wait(5000)
     
      cy.get('div.user-wrapper').contains(expected).should("be.visible")
  
}

const removeProfile = (expected) => {
    cy.get('.user-wrapper').eq(0).within(() => {
        cy.get('.user-remove button').click({ force: true })
      })

      // wait until deleted
      cy.wait(2000)

    // at the end test that "expected" removed successfully
      cy.get('.user-list-wrapper').contains('.user-wrapper', expected).should('not.exist')
}


describe('Copy profile to another list', () => {
    beforeEach(() => {
      cy.signInUser()
  
      cy.visit("https://dev-ui.listalpha.com/friends")
  })
    
    
    it(`should: add new user,copy to another list and delete him`, () => {
  

        const listName = 'Test List'
        const listNameImport = 'import'
        const firstName = 'firstName'
        const lastName = 'lastName'
        const editedFirstName = 'editedFirstName'
        const expected = `${firstName} ${lastName}`
        const newExpected = `${editedFirstName} ${lastName}`

        //create new profile 

        addProfile(expected)

        //create new list

        addItem(listName)
    
        // cy.wait(3000)

        cy.get('.user-wrapper').contains(expected).rightclick({ force: true })

        cy.get('.mat-menu-content').should('be.visible')

        cy.get('[role="menuitem"]').contains('Copy').click()


        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains(listName).click()
        })

        
        //observe if profile remains in the list

        cy.get('.user-wrapper').contains(expected).should('be.visible')

        //make changes to existing user

        cy.get('.user-wrapper').contains(expected).click()

        cy.get('.mat-dialog-container').should('be.visible')

        cy.get('.mat-button-wrapper').contains('Edit').click()
        cy.get('.mat-dialog-container').should('be.visible')

        //edit first name
        cy.get('[placeholder="First name"]').clear()
        cy.get('[placeholder="First name"]').type(editedFirstName)

        cy.get('.mat-button-wrapper').contains('Save').click()

        cy.get('.mat-button-wrapper').contains('Close').click()

        cy.get('.user-wrapper').contains(editedFirstName).should('be.visible')

        cy.get("#root").children().contains(listNameImport).click()

        cy.get('.user-wrapper').contains(newExpected).should('be.visible')


        removeProfile(newExpected)

        deleteItem(listName)

      })



      it(`should: add new user, move to another list and delete him`, () => {
  

        const listName = 'Test List'
        const firstName = 'firstName'
        const lastName = 'lastName'
        const expected = `${firstName} ${lastName}`

        //create new profile 

        addProfile(expected)

        //create new list

        addItem(listName)
    
        cy.wait(1000)

        cy.get('.user-wrapper').contains(expected).rightclick({ force: true })

        cy.get('.mat-menu-content').should('be.visible')

        cy.get('[role="menuitem"]').contains('Move').click()
        

        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains(listName).click()
        })

        
        //observe if profile does NOT remain in the list

        cy.get('.user-wrapper').contains(expected).should('not.be.visible')

        cy.get("#root").children().contains(listName).click()

        cy.get('.user-wrapper').contains(expected).should('be.visible')


        removeProfile(expected)

        deleteItem(listName)

      })



      it(`should: add new user, duplicate to another list and delete him`, () => {
  

        const listName = 'Test List'
        const firstName = 'firstName'
        const lastName = 'lastName'
        const expected = `${firstName} ${lastName}`

        //create new profile 

        addProfile(expected)

        //create new list

        addItem(listName)
    
        cy.wait(1000)

        cy.get('.user-wrapper').contains(expected).rightclick({ force: true })

        cy.get('.mat-menu-content').should('be.visible')

        cy.get('[role="menuitem"]').contains('Duplicate').click()
        

        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains(listName).click()
        })

        
        //observe if profile remains in the list

        cy.get('.user-wrapper').contains(expected).should('.be.visible')

        cy.get("#root").children().contains(listName).click()

        cy.get('.user-wrapper').contains(expected).should('be.visible')


        removeProfile(expected)

        deleteItem(listName)

      })
    })
  
  
    let duplicateCheck = [];
for (let i of Array.from(document.querySelectorAll('.deal-company > p'))) {
    const name = i.textContent;
    if (duplicateCheck.includes(name)) console.log('duplicate', name);
    duplicateCheck.push(name)
}