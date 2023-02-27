const modalTag = 'mat-dialog-container'
const submitButton = "mat-button-wrapper"
const groupName = 'Test Group'
const listName = 'Test List'
const editedGroupName = 'Test Group Edited'


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
    cy.get('.mat-input-element').type(listName)
    cy.get('.mat-button-wrapper').contains("Create").click()

    //wait until list is created
    cy.wait(2000)
}

// function to delete list
const deleteItem = (listName) => {
    // search created list
    //cy.get("#root").children().last().contains(listName).click()   
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

// function to add new group
const addGroup = (groupName) => {

    cy.get('[mattooltip="Create group"]').click()
    cy.get('mat-dialog-container').should('be.visible')

    // 
    cy.get('.mat-input-element').type(groupName)
    cy.get('.mat-button-wrapper').contains("Create").click()

    //wait until list is created
    cy.wait(2000)
}

// function to delete group
const deleteGroup = (groupName) => {
    // search created group
    cy.get('.group-wrapper').first().contains(groupName).rightclick({force: true})   
    // delete in mat-dialog-container
    cy.get('.mat-menu-item').contains("Delete group").click()
    cy.get(modalTag).contains(groupName).should('be.visible')

    //isolate the element to search it only in mat-dialog-container
    cy.get('mat-dialog-container').within(() => {
        cy.get('button').contains("Delete").click()
    })
    // verify if list is deleted
    cy.get('.group-wrapper').first().contains(groupName).should('not.exist')
}
    


describe("Groups flow", function () {
    beforeEach(() => {
        cy.signInUser()

        cy.visit("https://dev-ui.listalpha.com/friends")
    })

    //add new group
    it('should add new group in the list', () => {
        const listName = 'Test List'
        
        addItem(listName)

            cy.get("#root").children().contains(listName).should('exist')

        cy.get("#root").children().contains(listName).click()   


        addGroup(groupName)

            cy.get('.group-wrapper').first().contains(groupName).should('exist')
            
        deleteGroup(groupName)

        deleteItem(listName)
    })


    //edit group name
    it('should edit group name in the list', () => {
        const groupName = 'Test Group'
        const editedGroupName = 'Test Group Edited'
        
        addItem(listName)

        cy.get("#root").children().contains(listName).should('exist')

        cy.wait(1000)
        cy.get("#root").children().contains(listName).click()   


        addGroup(groupName)

        // select created group
        cy.get('.group-wrapper').first().contains(groupName).rightclick({force: true})   

        // edit in mat-dialog-container
        cy.get('.mat-menu-item').contains("Edit group name").click()

        cy.get(modalTag).contains("Enter group name").should('be.visible')

        //isolate the element to search it only in mat-dialog-container

        cy.get('mat-dialog-container').within(() => {
            cy.get('.mat-input-element').clear()
            cy.get('.mat-input-element').type(editedGroupName)
            cy.get('button').contains("Edit").click()
        })

        cy.wait(3000)

        cy.get('.group-wrapper').first().contains(editedGroupName).should('be.visible')

        deleteGroup(editedGroupName)

        deleteItem(listName)
    })

})
