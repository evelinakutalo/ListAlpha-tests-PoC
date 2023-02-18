describe("Login Tests", function () {
    it('Successfull login', function () {
        cy.visit("https://dev-ui.listalpha.com")

        cy.signInUser()

        //cy.get("#username") .should('have.attr', 'href', '/@test')
        //cy.get(':nth-child(3) > .nav-link') .should('have.attr', 'href', '/settings')
        //cy.get('.container > .nav > :nth-child(2) > .nav-link') .should('have.attr', 'href', '/editor')
    })
})