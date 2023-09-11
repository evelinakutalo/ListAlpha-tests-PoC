const toastBlock = "snack-bar-container";

describe("Add Profile", () => {
  beforeEach(() => {
    cy.signInUser();

    cy.visit("https://dev-ui.listalpha.com/friends");
  });

  it(`should: add new user and then delete him`, () => {
    const firstName = "firstName";
    const lastName = "lastName";
    const expected = `${firstName} ${lastName}`;

    cy.intercept({
      method: "GET",
      url: "*/lists",
    }).as("userRequest");

    cy.visit("https://dev-ui.listalpha.com/friends");

    cy.wait(2000);

    cy.get('[mattooltip="Add new profile"]').click();
    cy.get(".edit-options").should("be.visible");

    cy.get(".tab").contains("Manual").click();

    cy.get('[formcontrolname="first_name"]').type(firstName);
    cy.get('[formcontrolname="last_name"]').type(lastName);
    cy.get('[formcontrolname="company_name"]').type("test");

    cy.get(".edit-options").click();
    cy.wait("@userRequest");

    cy.get('[type="submit"]').contains("Save").click();

    cy.wait("@userRequest");

    // find div that contains expected, hover it and click on the delete button, to delete the user
    cy.get(".lists-container")
      .contains(".user-wrapper", expected)
      .should("exist");

    //delete the profile
    cy.get(".user-wrapper")
      .eq(0)
      .within(() => {
        cy.get(".user-remove button").click({ force: true });
      });

    cy.wait(1000);
    cy.get("mat-dialog-container").within(() => {
      cy.get("button").contains("Delete").click();
    });

    // wait until deleted
    cy.get(toastBlock).contains("removed");

    // at the end test that "expected" removed successfully
    cy.get(".user-list-wrapper")
      .eq(0)
      .contains(".user-wrapper", expected)
      .should("not.exist");
  });
});
