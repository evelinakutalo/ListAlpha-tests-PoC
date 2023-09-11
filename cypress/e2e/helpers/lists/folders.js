import { MODAL_TAG, TOAST_TAG } from "../../constants";

export const addFolder = ({ name }) => {
  //use intercept to wait until login will be finished
  cy.intercept({
    method: "GET",
    url: "*/lists",
  }).as("userRequest");

  cy.intercept({
    method: "POST",
    url: "**/lists",
  }).as("createFolder");

  cy.wait("@userRequest");

  // select folder button to add
  cy.get('[mattooltip="Create folder"]').click();
  cy.get(MODAL_TAG).should("be.visible");

  //enter folder name
  cy.get('[formcontrolname="listName"]').type(name);
  cy.get(".mat-button-wrapper").contains("Create").click();

  //wait until folder is fully created
  cy.wait("@createFolder");
  cy.get(TOAST_TAG).contains("created");
};

export const deleteFolder = ({ name, source = "#shared-root" }) => {
  // search created folder
  cy.get(source).children().contains(name).rightclick({ force: true });

  // select Delete action
  cy.get(".mat-menu-item").contains("Delete Folder").click();
  cy.get(MODAL_TAG).contains(name).should("be.visible");

  //isolate the element to search it only in mat-dialog-container
  cy.get(MODAL_TAG).within(() => {
    cy.get("button").contains("Delete").click();
  });
  cy.get(TOAST_TAG).contains("deleted");
  // verify if folder is deleted
  cy.get(source).children().contains(name).should("not.exist");
};
