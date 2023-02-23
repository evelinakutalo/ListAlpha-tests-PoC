const folderName = 'Test Folder'
const modalTag = 'mat-dialog-container'
const submitButton = 'mat-button-wrapper'
const listName = 'Folder Name'
const editedFolderName = 'Test Folder Edited'
const sharedTeammateEmail = 'listalpha_kefjklejfew@outlook.com'

//function to add new folder
const addFolder = (folderName) => {


    //use intercept to wait until login will be finished
    cy.intercept({
        method: 'GET',
        url: '*/lists'
    }).as("userRequest")
    
    cy.wait('@userRequest')

    // select folder button to add
    cy.get('[mattooltip="Create folder"]').click()
    cy.get(modalTag).should('be.visible')
  
    //enter folder name
    cy.get('[formcontrolname="listName"]').type(folderName)
    cy.get('.mat-button-wrapper').contains("Create").click()

    //wait until folder is fully created
    cy.wait(1000)

}

// function to delete folder
const deleteFolder = (folderName) => {
    // search created folder
    cy.get("#root").children().contains(folderName).rightclick({force: true}) 
  
    // select Delete action
    cy.get('.mat-menu-item').contains("Delete Folder").click()
    cy.get(modalTag).contains(folderName).should('be.visible')

    //isolate the element to search it only in mat-dialog-container
    cy.get(modalTag).within(() => {
        cy.get('button').contains("Delete").click()
    })
    // verify if folder is deleted
    cy.get("#root").children().contains(folderName).should('not.exist')
}

describe("Folder flow", function () {
    beforeEach(() => {
        cy.signInUser()

        cy.visit("https://dev-ui.listalpha.com/friends")
    })

 //create folder
 it('should create new folder', () => {
    const folderName = 'Test Folder'

    addFolder(folderName)

    //verify if folder is created
    cy.get("#root").children().first().contains(folderName).should('exist')

    cy.wait(1000)

    deleteFolder(folderName)
})

//edit folder name
it('should edit folder name', () => {
    const folderName = 'Test Folder'
    const editedFolderName = 'Test Folder Edited'

    addFolder(folderName)

     // select required folder
     cy.get("#root").children().first().contains(folderName).rightclick({force: true} )  
  
     //rename the list

     cy.get('.mat-menu-item').contains("Edit Folder").click()
     cy.get(modalTag).contains("Enter folder name").should('be.visible')

     //isolate the element to search it only in mat-dialog-container
     cy.get('mat-dialog-container').within(() => {
         cy.get('[formcontrolname="listName"]').clear()
         cy.get('[formcontrolname="listName"]').type(editedFolderName)
         cy.get('button').contains("Edit").click()
     })

    cy.wait(1000)

    deleteFolder(editedFolderName)
})


//share folder 
it('should share folder with other teammate', () => {
    const folderName = 'Test Folder'

    addFolder(folderName)

    // select required folder
    cy.get("#root").children().first().contains(folderName).rightclick({force: true})  
  
    //share the list

    cy.get('.mat-menu-item').contains("Permissions").click()
    cy.get(modalTag).contains('User with read/write access:').should('be.visible')

    //isolate the element to search it only in mat-dialog-container
    cy.get('mat-dialog-container [placeholder="New user with access"]').type(sharedTeammateEmail)
    cy.get('.mat-autocomplete-panel mat-option').contains(sharedTeammateEmail).click()
    cy.get(modalTag).contains('User with read/write access:').click()
    cy.get(`${modalTag} button`).contains('Close').click()

    cy.wait(1000)

    deleteFolder(folderName)
})

})
