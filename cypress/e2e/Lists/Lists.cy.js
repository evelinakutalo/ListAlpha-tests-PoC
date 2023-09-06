const modalTag = 'mat-dialog-container'
const submitButton = "mat-button-wrapper"
const editedListName = 'Test List Edited'
const sharedTeammateEmail = 'listalpha_kefjklejfew@outlook.com'

const toastBlock = "snack-bar-container";
const listsRoot = "#shared-root"

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

    cy.get(toastBlock).contains('created');
}

// function to delete list
const deleteItem = (listName, sourceList = listsRoot) => {
    cy.log('Deleting item...')

    cy.get(sourceList).children().contains(listName).rightclick({force: true})
    cy.get('.mat-menu-item').contains("Delete list").click()

    //isolate the element to search it only in mat-dialog-container
    cy.get('mat-dialog-container').within(() => {
        cy.get('button').contains("Delete").click()
    })
    cy.get(toastBlock).contains('deleted');
    // verify if list is deleted
    cy.get(sourceList).children().contains(listName).should('not.exist')

    cy.log('Item deleted!')
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

        cy.get(listsRoot).children().contains(listName).should('exist')

        deleteItem(listName)
    })

    //edit list name
    it('should edit list name', () => {
        const listName = 'Test List'
        const editedListName = 'Test List Edited'

        addItem(listName)

        // select require list
        cy.get(listsRoot).children().contains(listName).rightclick({ force: true })
        cy.get('.mat-menu-item').contains("Rename list").click()

        cy.get(modalTag).contains("Enter list name").should('be.visible')
        //isolate the element to search it only in mat-dialog-container
        cy.get('mat-dialog-container').within(() => {
            cy.get('[formcontrolname="listName"]').clear()
            cy.get('[formcontrolname="listName"]').type(editedListName)
            cy.get('button').contains("Edit").click()
        })

        cy.get(toastBlock).contains('updated');

        deleteItem(editedListName)
    })

    //make it private list with other teammate
    it('should make shared list private', () => {
        const listName = 'Test List'

        addItem(listName)

        cy.wait(1000);
        // select required folder
        cy.get(listsRoot).children().contains(listName).first().rightclick({force: true})

        //share the list

        cy.get('.mat-menu-item').contains("Share").click();

        cy.intercept({ url: '**/organization' }).as("makePrivate")

        cy.wait(2000);
        cy.get(`${modalTag} mat-checkbox label`).click();

        cy.wait('@makePrivate');
        cy.get(`${modalTag} button`).filter(":visible").contains('Close').click()
        cy.wait(3000);

        cy.get("#private-root").children().contains(listName)

        deleteItem(listName, "#private-root")
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