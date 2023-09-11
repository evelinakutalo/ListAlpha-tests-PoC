import { MODAL_TAG } from "../../constants";

export * from "./folders";
export * from "./lists";

export const fillEditNameModal = ({ value }) => {
  cy.get(MODAL_TAG).within(() => {
    cy.get('[formcontrolname="listName"]').clear();
    cy.get('[formcontrolname="listName"]').type(value);
    cy.get("button").contains("Edit").click();
  });
};
