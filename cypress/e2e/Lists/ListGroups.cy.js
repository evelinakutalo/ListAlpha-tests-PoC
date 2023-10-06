import {
  addList,
  deleteList,
  getList,
  fillEditNameModal,
} from "../helpers/lists";
import { MODAL_TAG, TOAST_TAG } from "../constants";

const groupName = "Test Group";
const listName = "Test List";

// function to add new group
const addGroup = (groupName) => {
  cy.log("Adding group...");

  cy.get('[mattooltip="Create group"]').click();
  cy.get(MODAL_TAG).should("be.visible");

  //
  cy.get(".mat-input-element").type(groupName);
  cy.get(".mat-button-wrapper").contains("Create").click();

  //wait until list is created
  cy.wait(2000);
  cy.log("Group added!");
};

// function to delete group
const deleteGroup = (groupName) => {
  cy.log("Deleting group...");
  // search created group
  cy.get(".group-wrapper")
    .first()
    .contains(groupName)
    .rightclick({ force: true });
  // delete in MODAL_TAG
  cy.get(".mat-menu-item").contains("Delete group").click();
  cy.get(MODAL_TAG).contains(groupName).should("be.visible");

  //isolate the element to search it only in MODAL_TAG
  cy.get(MODAL_TAG).within(() => {
    cy.get("button").contains("Delete").click();
  });
  cy.get(TOAST_TAG).contains("deleted");
  cy.wait(5000);
  // verify if list is deleted
  cy.get(".group-wrapper").should("not.exist");
  cy.log("Group deleted!");
};

describe("Groups flow", function () {
  beforeEach(() => {
    cy.signInUser();

    cy.visit("https://dev-ui.listalpha.com/friends");
  });

  //add new group
  it("should add new group in the list", () => {
    addList({ name: listName });

    getList({ name: listName }).should("exist");
    getList({ name: listName }).click();

    addGroup(groupName);

    cy.wait(3000);

    cy.get(".group-wrapper").first().contains(groupName).should("exist");

    deleteGroup(groupName);

    deleteList({ name: listName });
  });

  //edit group name
  it("should edit group name in the list", () => {
    const groupName = "Test Group";
    const editedGroupName = "Test Group Edited";

    addList({ name: listName });

    getList({ name: listName }).should("exist");
    cy.wait(1000);
    getList({ name: listName }).click();

    addGroup(groupName);

    cy.wait(5000);

    // select created group
    cy.get(".group-wrapper")
      .first()
      .contains(groupName)
      .rightclick({ force: true });

    // edit in MODAL_TAG
    cy.get(".mat-menu-item").contains("Edit group name").click();

    cy.get(MODAL_TAG).contains("Enter group name").should("be.visible");

    //isolate the element to search it only in MODAL_TAG
    fillEditNameModal({ value: editedGroupName });

    cy.wait(3000);

    cy.get(".group-wrapper")
      .first()
      .contains(editedGroupName)
      .should("be.visible");

    deleteGroup(editedGroupName);

    deleteList({ name: listName });
  });
});
