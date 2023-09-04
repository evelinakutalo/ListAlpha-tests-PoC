const folderName = 'Test Folder'
const modalTag = 'mat-dialog-container'
const submitButton = 'mat-button-wrapper'
const listName = 'Folder Name'
const editedFolderName = 'Test Folder Edited'
const sharedTeammateEmail = 'listalpha_kefjklejfew@outlook.com'
const toastBlock = "snack-bar-container";

//function to add new folder
const addFolder = (folderName) => {


    //use intercept to wait until login will be finished
    cy.intercept({
        method: 'GET',
        url: '*/lists'
    }).as("userRequest")

    cy.intercept({
        method: 'POST',
        url: '**/lists'
    }).as("createFolder")

    cy.wait('@userRequest')

    // select folder button to add
    cy.get('[mattooltip="Create folder"]').click()
    cy.get(modalTag).should('be.visible')

    //enter folder name
    cy.get('[formcontrolname="listName"]').type(folderName)
    cy.get('.mat-button-wrapper').contains("Create").click()

    //wait until folder is fully created
    cy.wait('@createFolder');
    cy.get(toastBlock).contains('created');
}

// function to delete folder
const deleteFolder = (folderName, sourceList = "#shared-root") => {
    // search created folder
    cy.get(sourceList).children().contains(folderName).rightclick({force: true})

    // select Delete action
    cy.get('.mat-menu-item').contains("Delete Folder").click()
    cy.get(modalTag).contains(folderName).should('be.visible')

    //isolate the element to search it only in mat-dialog-container
    cy.get(modalTag).within(() => {
        cy.get('button').contains("Delete").click()
    })
    cy.get(toastBlock).contains('deleted');
    // verify if folder is deleted
    cy.get(sourceList).children().contains(folderName).should('not.exist')
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
    cy.get("#shared-root").children().contains(folderName).first().should('exist')

    cy.wait(1000)

    deleteFolder(folderName)
})

//edit folder name
it('should edit folder name', () => {
    const folderName = 'Test Folder'
    const editedFolderName = 'Test Folder Edited'

    cy.intercept({
        method: 'PATCH',
        url: '*/lists'
    }).as("editFolder")

    addFolder(folderName)

     // select required folder
     cy.get("#shared-root").children().contains(folderName).first().rightclick({force: true} )

     //rename the list

     cy.get('.mat-menu-item').contains("Edit Folder").click()
     cy.get(modalTag).contains("Enter folder name").should('be.visible')

     //isolate the element to search it only in mat-dialog-container
     cy.get('mat-dialog-container').within(() => {
         cy.get('[formcontrolname="listName"]').clear()
         cy.get('[formcontrolname="listName"]').type(editedFolderName)
         cy.get('button').contains("Edit").click()
     })

    cy.wait('@editFolder')
    cy.get(toastBlock).contains('updated');

    deleteFolder(editedFolderName)
})


//share folder
it('should share folder with other teammate', () => {
    const folderName = 'Test Folder'

    addFolder(folderName)

    cy.wait(1000);
    // select required folder
    cy.get("#shared-root").children().contains(folderName).first().rightclick({force: true})

    //share the list

    cy.get('.mat-menu-item').contains("Share").click();

    cy.intercept({ url: '**/organization' }).as("makePrivate")

    cy.wait(2000);
    cy.get(`${modalTag} mat-checkbox label`).click();

    cy.wait('@makePrivate');
    cy.get(`${modalTag} button`).filter(":visible").contains('Close').click()
    cy.wait(3000);

    cy.get("#private-root").children().contains(folderName)

    deleteFolder(folderName, "#private-root")
})

})