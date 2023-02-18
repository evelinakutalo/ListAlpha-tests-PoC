describe('My First Test', () => {
  it('Should work', () => {
    cy.signInUser()

    cy.get('.showMoreCompanyButton').click()

    cy.get('mat-dialog-container').should('be.visible')
  })
})