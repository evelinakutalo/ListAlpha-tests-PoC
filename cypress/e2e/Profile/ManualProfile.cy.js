describe("Add Profile", () => {
  beforeEach(() => {
    cy.signInUser();
  });

  it(`should: add new user and then delete him`, () => {
    cy.intercept({
      method: "GET",
      url: "*/lists",
    }).as("userRequest");
    const firstName = "First Name";
    const lastName = "Last Name";
    const expected = `${firstName} ${lastName}`;
    const toastBlock = "snack-bar-container";

    cy.wait(5000);

    cy.get('[routerlink="/friends"].navigation-link').click();

    cy.get('[mattooltip="Add new profile"]').click();
    cy.get(".edit-options").should("be.visible");

    cy.get(".tab").contains("Manual").click();

    cy.get('[formcontrolname="first_name"]').type(firstName);
    cy.get('[formcontrolname="last_name"]').type(lastName);
    cy.get('[formcontrolname="company_name"]').type("test");

    cy.get(".edit-options").click();
    // cy.wait("@userRequest");

    cy.get('[type="submit"]').contains("Save").click();

    cy.wait("@userRequest");

    // find div that contains expected, hover it and click on the delete button, to delete the user
    cy.get(".lists-container").find(".user-wrapper", expected).should("exist");

    //delete the profile
    cy.get(".user-wrapper")
      .eq(0)
      .within(() => {
        cy.get(".user-remove button").first().click({ force: true });
      });

    cy.wait(1000);
    cy.get("mat-dialog-container")
      .first()
      .within(() => {
        cy.get("button").contains("Delete").click();
      });

    cy.wait(5000);
    // wait until deleted
    cy.get(toastBlock).contains("removed");

    // at the end test that "expected" removed successfully
    cy.get(".user-list-wrapper")
      .eq(0)
      .contains(".user-wrapper", expected)
      .should("not.exist");
  });
});
