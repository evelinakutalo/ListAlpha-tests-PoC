const toastBlock = "snack-bar-container";

describe("Add Notes", () => {
  beforeEach(() => {
    cy.signInUser();

    cy.visit("https://dev-ui.listalpha.com/friends");
  });

  it(`should: create user, add new note and delete him`, () => {
    const firstName = "firstName";
    const lastName = "lastName";
    const expected = `${firstName} ${lastName}`;
    const noteName = "Cypress note";

    cy.intercept({
      method: "GET",
      url: "*/lists",
    }).as("userRequest");

    cy.visit("https://dev-ui.listalpha.com/friends");

    cy.wait(2000);

    //create new user
    cy.get('[mattooltip="Add new profile"]').click();
    cy.get(".edit-options").should("be.visible");

    cy.get(".tab").contains("Manual").click();

    cy.get('[formcontrolname="first_name"]').type(firstName);
    cy.get('[formcontrolname="last_name"]').type(lastName);
    cy.get('[formcontrolname="company_name"]').type("Test Company");

    cy.get(".edit-options").click();
    cy.wait("@userRequest");

    cy.get('[type="submit"]').contains("Save").click();

    cy.wait(5000);
    // find div that contains expected, hover it and click on the delete button, to delete the user

    cy.get(".user-wrapper").contains(expected).should("be.visible");

    cy.wait(2000);

    //add notes
    cy.get(".user-wrapper").contains(expected).click();

    cy.get(".mat-dialog-container").should("be.visible");

    cy.wait(2000);

    cy.get(".mat-button-wrapper").contains("Notes").click();

    cy.get(".mat-dialog-container").within(() => {
      cy.get(".notes-wrapper").click();
      cy.get(".notes-wrapper").type(noteName);
    });

    cy.get(".mat-button-wrapper").contains("Close").click();

    cy.wait(5000);

    cy.get(".user-wrapper").eq(0).contains(expected);

    cy.get(".user-wrapper")
      .eq(0)
      .within(() => {
        cy.get(".cell.user-notes").should("exist");
      });

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
