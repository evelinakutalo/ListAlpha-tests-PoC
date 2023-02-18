const modalTag = 'mat-dialog-container'
const submitButton = "mat-button-wrapper"
const editedListName = 'Test List Edited'
const sharedTeammateEmail = 'listalpha_kefjklejfew@outlook.com'

// function to add new list
const addItem = (listName) => {

    //use intercept to wait until login will be finished
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
    


describe("List flow", function () {
    beforeEach(() => {
        cy.signInUser()

        cy.visit("https://dev-ui.listalpha.com/friends")
    })

    //add new list
    it('should add new list', () => {
        const listName = 'Test List'
        
        addItem(listName)

        cy.get("#root").children().contains(listName).should('exist')

        deleteItem(listName)
    })
    
    //edit list name
    it('should edit list name', () => {
        const listName = 'Test List'
        const editedListName = 'Test List Edited'
        
        addItem(listName)

        // select require list
        cy.get("#root").children().contains(listName).click()   
        cy.get('.action-button').contains("List settings").click()
        //rename the list
        cy.get('.mat-menu-item').contains("Rename list").click()
        cy.get(modalTag).contains("Enter list name").should('be.visible')
        //isolate the element to search it only in mat-dialog-container
        cy.get('mat-dialog-container').within(() => {
            cy.get('[formcontrolname="listName"]').clear()
            cy.get('[formcontrolname="listName"]').type(editedListName)
            cy.get('button').contains("Edit").click()
        })

        cy.wait(1000)

        deleteItem(editedListName)
    })

    //share list with other teammate
    it('should share list with teammate', () => {
        const listName = 'Test List'
        
        addItem(listName)

        // select required list
        cy.get("#root").children().contains(listName).click()   
        cy.get('.action-button').contains('Private list').click()
        cy.get(modalTag).contains('User with read/write access:').should('be.visible')
      
        //isolate the element to search it only in mat-dialog-container
        cy.get('[placeholder="New user with access"]').type(sharedTeammateEmail)
        //select option from dropdown
        cy.get('.mat-option').first().contains(sharedTeammateEmail).click()
        cy.get(modalTag).contains('User with read/write access:').click()
        cy.get(`${modalTag} button`).contains('Close').click()

        cy.wait(1000)

        cy.get('.action-button').contains('Shared list').should('exist')

        deleteItem(listName)
    })
})





// describe("Edit list name", function () {
//     beforeEach(() => {
//         cy.signInUser()

//         cy.visit("https://dev-ui.listalpha.com/friends")
//     })

//     it('should edit list name', function () {
//         addItem()

//         // select require list
//         cy.get("#root").children().last().contains(listName).click()   
//         cy.get('.action-button').contains("List settings").click()
//         //rename the list
//         cy.get('.mat-menu-item').contains("Rename list").click()
//         cy.get(modalTag).contains("Enter list name").should('be.visible')
//         //isolate the element to search it only in mat-dialog-container
//         cy.get('mat-dialog-container').within(() => {
//             cy.get('[formcontrolname="listName"]').type(' Edited')
//             cy.get('button').contains("Edit").click()
//     })

//     //wait until list is created
//     cy.wait(2000)

//     cy.get("#root").children().last().contains(editedListName).should('be.visible')

//     //delete list
//     cy.get("#root").children().last().contains(editedListName).click()   
//     cy.get('.action-button').contains("List settings").click()
//     // delete in mat-dialog-container
//     cy.get('.mat-menu-item').contains("Delete list").click()
//     cy.get(modalTag).contains(editedListName).should('be.visible')

//     //isolate the element to search it only in mat-dialog-container
//     cy.get('mat-dialog-container').within(() => {
//         cy.get('button').contains("Delete").click()
//     })
//     // verify if list is deleted
//     cy.get("#root").children().last().contains(editedListName).should('not.exist') 
//     })