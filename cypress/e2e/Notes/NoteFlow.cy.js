const DEFAULT_NOTE_NAME = "Note title";

const generateNoteName = () => {
  return DEFAULT_NOTE_NAME + " " + Math.round(Math.random(0, 1) * 1000);
};

// function to add new note
const addNote = (noteName) => {
  //use intercept to wait until login will be finished
  // cy.intercept({
  //     method: 'GET',
  //     url: '*/notes*'
  // }).as("userRequest")

  // cy.wait('@userRequest')

  cy.wait(10000);
  cy.intercept({ method: "POST", url: "*/note" }).as("addNote");

  cy.get('[mattooltip="Add note"]').click();
  cy.wait("@addNote");

  cy.get(".note-wrapper")
    .first()
    .contains(DEFAULT_NOTE_NAME)
    .should("be.visible");
  cy.get(".note-wrapper")
    .first()
    .contains(DEFAULT_NOTE_NAME)
    .click({ force: true });
  cy.get(".note-title input").clear();
  cy.get(".note-title input").type(noteName);
};

// function to delete note
const deleteNote = (noteName) => {
  cy.get(".note-wrapper").first().contains(noteName).click();

  cy.get(".mat-menu-trigger").contains("Note settings").click();

  cy.get(".mat-menu-item").contains("Delete note").click();
};

describe("Add New Note", function () {
  beforeEach(() => {
    cy.signInUser();

    cy.visit("https://dev-ui.listalpha.com/notes");
  });

  //add new note
  it.skip("should add new note", () => {
    const noteName = generateNoteName();

    addNote(noteName);

    cy.get(".note-wrapper").first().contains(noteName).should("be.visible");

    deleteNote(noteName);
  });

  it.skip("title is changes correctly", () => {
    const noteName = generateNoteName();
    const newNoteName = generateNoteName();

    addNote(noteName);

    cy.get(".note-wrapper").first().contains(noteName).should("be.visible");
    cy.get(".note-wrapper").first().contains(noteName).click();
    cy.get(".note-title input").clear();
    cy.get(".note-title input").type(newNoteName);
    cy.get(".note-wrapper").first().contains(newNoteName).should("be.visible");

    deleteNote(newNoteName);
  });

  it.skip("adds profile to note and the note is appear in the selected user", () => {
    cy.on("uncaught:exception", () => false);
    const userToTestOn = "Aemen Tehmas";
    const noteName = generateNoteName();

    addNote(noteName);

    cy.get(".note-wrapper").first().contains(noteName).click();
    cy.get('.peope-wrapper [placeholder="Search by name"]').type(userToTestOn);
    cy.get("mat-option").contains(userToTestOn).click();
    cy.get(".peope-wrapper .user-card").first().contains(userToTestOn).click();
    // force: true because "Notes" title is display: none
    cy.get("mat-dialog-container .labels-list")
      .contains("Notes")
      .click({ force: true });
    cy.get(".label-content .note-title input").should("have.value", noteName);
    cy.get(".cdk-overlay-backdrop").click({ force: true });
    cy.get(".peope-wrapper .user-card")
      .first()
      .within(() => {
        // because button is not visible until hovered
        cy.get(".remove-card").click({ force: true });
      });

    cy.get('.left-menu [routerlink="/friends"]').click();

    cy.get(".tile-wrapper").contains(userToTestOn).click();
    cy.get("mat-dialog-container .labels-list")
      .contains("Notes")
      .click({ force: true });
    cy.get("mat-dialog-container .new-note").should("be.visible");

    cy.get(".cdk-overlay-backdrop").click({ force: true });

    cy.get('.left-menu [mattooltip="Notes"]').click();
    cy.wait(2000);

    deleteNote(noteName);
  });

  it.skip("adds deals to notes and new note is appearing in the selected deal", () => {
    cy.on("uncaught:exception", () => false);
    const dealName = "Genius";
    const noteName = generateNoteName();

    addNote(noteName);

    cy.get(".note-wrapper").first().contains(noteName).click();
    cy.get('.deal-wrapper [placeholder="Search by name"]').type(dealName);
    cy.get("mat-option").contains(dealName).click();
    cy.get(".deal-wrapper .user-card").first().contains(dealName).click();

    cy.get("mat-dialog-container .tabs-wrapper .tab").contains("Notes").click();
    cy.get(".label-content .note-title input").should("have.value", noteName);
    cy.get(".cdk-overlay-backdrop").click({ force: true });

    cy.get(".peope-wrapper .user-card")
      .first()
      .within(() => {
        // because button is not visible until hovered
        cy.get(".remove-card").click({ force: true });
      });

    cy.get('.left-menu [mattooltip="Deals"]').click();

    cy.get(".deal-board-wrapper .deal-container").contains(dealName).click();
    cy.get("mat-dialog-container .tabs-wrapper .tab").contains("Notes").click();
    cy.get("mat-dialog-container .new-note").should("be.visible");

    cy.get(".cdk-overlay-backdrop").click({ force: true });

    cy.get('.left-menu [mattooltip="Notes"]').click();
    cy.wait(2000);

    deleteNote(noteName);
  });
});
