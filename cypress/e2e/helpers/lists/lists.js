import { MODAL_TAG, TOAST_TAG } from "../../constants";

export const LIST_DEFAULT_SOURCE_SELECTOR = "#shared-root";

export const getList = ({ name, source = LIST_DEFAULT_SOURCE_SELECTOR }) =>
  cy.get(source).children().contains(name);

export const addList = ({ name }) => {
  //use intercept to wait until login will be finished
  cy.intercept({
    method: "GET",
    url: "*/lists",
  }).as("userRequest");

  cy.wait("@userRequest");
  cy.get('[mattooltip="Create list"]').click();
  cy.get(MODAL_TAG).should("be.visible");

  cy.get('[formcontrolname="listName"]').type(name);

  cy.get(".mat-button-wrapper").contains("Create").click();

  cy.get(TOAST_TAG).contains("created");
};

export const deleteList = ({ name, source = LIST_DEFAULT_SOURCE_SELECTOR }) => {
  cy.log("Deleting item...");

  cy.get(source).children().contains(name).rightclick({ force: true });
  cy.get(".mat-menu-item").contains("Delete list").click();

  //isolate the element to search it only in MODAL_TAG
  cy.get(MODAL_TAG).within(() => {
    cy.get("button").contains("Delete").click();
  });
  cy.get(TOAST_TAG).contains("deleted");
  // verify if list is deleted
  cy.get(source).children().contains(name).should("not.exist");

  cy.log("Item deleted!");
};
