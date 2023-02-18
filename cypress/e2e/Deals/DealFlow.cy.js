const modalTag = 'mat-dialog-container'
const submitButton = 'mat-button-wrapper'
const editedListName = 'Test List Edited'
const dealName = 'Test Deal'


// function to add new deal
const addDeal = (dealName) => {

    //use intercept to wait until login will be finished
    cy.intercept({
        method: 'GET',
        url: '*/deals*'
    }).as("userRequest")

    cy.wait('@userRequest')

    cy.get('div.add-flow').contains("Add new").click()
    cy.get('mat-dialog-container').should('be.visible')

    cy.get('[formcontrolname="company_name"]').type(dealName)

    cy.get('.mat-button-wrapper').contains("Save").click()

    cy.get('.deals-list-tabs .tab-wrapper').contains('All deals').click()

}

// function to delete deal
const deleteDeal = (dealName) => {
    // search created deal
    cy.get('.deals-list-tabs .tab-wrapper').contains('All deals').click()  

    // delete in mat-dialog-container

    cy.get('.deal-list-wrapper .deal-wrapper').contains(dealName).should("be.visible")

    //isolate the element to search it only in deal record
    cy.get('.deal-list-wrapper .deal-wrapper').eq(0).within(() => {
        cy.get('.cell.deal-remove').click()
    })
    // verify if deal is deleted
    cy.get('.deal-list-wrapper .deal-wrapper').contains(dealName).should('not.exist')
}

describe("Add New Deal", function () {
    beforeEach(() => {
        cy.signInUser()

        cy.visit("https://dev-ui.listalpha.com/deals")
    })

    //add new deal
    it('should add new deal', () => {

        const dealName = 'Test Deal'

        addDeal(dealName)

        cy.get('.deal-wrapper').contains(dealName).should('be.visible')

        deleteDeal(dealName)

    })

    // //edit deal: change stage
    // it.skip('should change deal stage', () => {

    //     const dealName = 'Test Deal'

    //     addDeal(dealName)

    //     cy.get('.deal-list-wrapper .deal-wrapper').contains(dealName).click()
    //     cy.get('mat-dialog-container').should('be.visible')

    //     cy.get('.mat-select-min-line').contains('1. Top of the funnel').click()
    //     //cy.get('#mat-select-46-panel').should('be.visible')

    //     cy.get('#mat-option-101').contains(' 2. Tracking ').click()

    //     cy.get('.mat-select-min-line').contains(' 2. Tracking ').should('be.visible')

    //     deleteDeal(dealName)

    // })
})

