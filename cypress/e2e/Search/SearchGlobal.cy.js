const testKeyword = 'test'

describe("Global Search", function () {
    beforeEach(() => {
        cy.signInUser()

        cy.visit("https://dev-ui.listalpha.com")
    })

    //enter "work" - any result in All results should appear
    it('Search Global', function () {
        cy.get("#myInputHome").type('work')
        cy.get('.suggestion-category').contains('Companies').click()
        cy.get('.results-row').should('have.length.greaterThan', 1)
        cy.get("#myInputHome").clear()

    })


    //enter "work" - any result in People tab should appear
    it('Search profile', function () { 
        cy.get("#myInputHome").type('work')
        cy.get('.suggestion-category').contains('People').click()
        cy.get('.results-row').should('have.length.greaterThan', 1)
        cy.get("#myInputHome").clear()
        
    })

    //enter "Slack" - deal with this title should appear in Deals tab
    it('Search deals', function () {
        cy.intercept({ method: 'GET', url: '*/deals*' }).as('getDeals')
        cy.get("#myInputHome").type('Slack')
        cy.wait('@getDeals')
        cy.get('.suggestion-category').contains('Deals').click()
        cy.get('.results-row .deal-company').contains('Slack').should('be.visible')
        cy.get("#myInputHome").clear()

    })

    //enter "note" - note with this title should appear in Note tab
    it('Search notes', function () {
        cy.intercept({ method: 'GET', url: '*/note*' }).as('getNotes')
        
        cy.get("#myInputHome").type('note')
        cy.wait('@getNotes')
        cy.wait(1000)
        cy.get('.suggestion-category').contains('Notes').click()
        cy.get('.results-row .note-title').contains('note', { matchCase: false }).should('be.visible')
    })
})