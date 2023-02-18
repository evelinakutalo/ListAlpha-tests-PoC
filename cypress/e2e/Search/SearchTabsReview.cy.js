describe("Search All Tabs display", function () {
    it('should display all tabs from search', function () {
        cy.signInUser()

        cy.get("#myInputHome").type("test")

        cy.get('.suggestion-category').contains("All")
        cy.get('.suggestion-category').contains("Companies")
        cy.get('.suggestion-category').contains("People")
    })
})