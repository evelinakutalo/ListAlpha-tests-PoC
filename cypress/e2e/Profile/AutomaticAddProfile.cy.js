describe("Automatic Add Profile (Easy Add)", () => {
  beforeEach(() => {
    cy.signInUser();
  });

  it(`should: automatically add new user and then delete him`, () => {
    cy.intercept({
      method: "GET",
      url: "*/lists",
    }).as("userRequest");

    const name = "Ihar Valodzin";
    const toastBlock = "snack-bar-container";

    cy.get('[routerlink="/friends"].navigation-link').click();

    cy.wait(5000);

    cy.get('[mattooltip="Add new profile"]').click();
    cy.get(".edit-options").should("be.visible");

    cy.get(".edit-options").within(() => {
      cy.get('[placeholder="Search by name"]').type(name);
      cy.get(".mat-flat-button").contains("Search").click();

      cy.wait(3000);

      cy.get(".contacts-list").within(() => {
        cy.get(".contact").first().click();
      });
    });

    cy.wait(3000);

    cy.get("app-dialog-employee-add").within(() => {
      cy.get(".preview").should("be.visible");

      cy.get(".preview").within(() => {
        cy.get(".mat-button-wrapper").contains("Save").click();
      });
    });
    cy.wait(3000);

    // find div that contains name
    cy.get(".lists-container").contains(name).should("exist");

    //delete the profile
    cy.get(".user-wrapper")
      .eq(0)
      .within(() => {
        cy.get(".user-remove button").click({ force: true });
      });

    cy.wait(3000);
    cy.get("mat-dialog-container")
      .first()
      .within(() => {
        cy.get("button").contains("Delete").click();
      });

    // wait until deleted
    cy.get(toastBlock).contains("removed");

    cy.wait(2000);
    // at the end test that "name" removed successfully
    cy.get(".user-list-wrapper")
      .eq(0)
      .contains(".user-wrapper", name)
      .should("not.exist");
  });
});
