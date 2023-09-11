import {
  addList,
  deleteList,
  getList,
  fillEditNameModal,
} from "../helpers/lists";
import { MODAL_TAG, TOAST_TAG } from "../constants";

const listName = "Test List";
const editedListName = "Test List Edited";
const sharedTeammateEmail = "listalpha_kefjklejfew@outlook.com";

describe("List flow", function () {
  beforeEach(() => {
    cy.signInUser();

    cy.visit("https://dev-ui.listalpha.com/friends");
  });

  //add new list
  it("should add new list", () => {
    addList({ name: listName });

    getList({ name: listName }).should("exist");

    deleteList({ name: listName });
  });

  //edit list name
  it("should edit list name", () => {
    addList({ name: listName });

    // select require list
    getList({ name: listName }).rightclick({ force: true });

    cy.get(".mat-menu-item").contains("Rename list").click();

    cy.get(MODAL_TAG).contains("Enter list name").should("be.visible");
    //isolate the element to search it only in MODAL_TAG
    fillEditNameModal({ value: editedListName });

    cy.get(TOAST_TAG).contains("updated");

    deleteList({ name: editedListName });
  });

  //make it private list with other teammate
  it("should make shared list private", () => {
    addList({ name: listName });

    cy.wait(1000);
    // select required folder
    getList({ name: listName }).first().rightclick({ force: true });

    //share the list
    cy.get(".mat-menu-item").contains("Share").click();

    cy.intercept({ url: "**/organization" }).as("makePrivate");

    cy.wait(2000);
    cy.get(`${MODAL_TAG} mat-checkbox label`).click();

    cy.wait("@makePrivate");
    cy.get(`${MODAL_TAG} button`).filter(":visible").contains("Close").click();
    cy.wait(3000);

    cy.get("#private-root").children().contains(listName);

    deleteList({ name: listName, source: "#private-root" });
  });
});

// describe("Edit list name", function () {
//     beforeEach(() => {
//         cy.signInUser()

//         cy.visit("https://dev-ui.listalpha.com/friends")
//     })

//     it('should edit list name', function () {
//         addList()

//         // select require list
//         cy.get("#root").children().last().contains(listName).click()
//         cy.get('.action-button').contains("List settings").click()
//         //rename the list
//         cy.get('.mat-menu-item').contains("Rename list").click()
//         cy.get(MODAL_TAG).contains("Enter list name").should('be.visible')
//         //isolate the element to search it only in MODAL_TAG
//         cy.get(MODAL_TAG).within(() => {
//             cy.get('[formcontrolname="listName"]').type(' Edited')
//             cy.get('button').contains("Edit").click()
//     })

//     //wait until list is created
//     cy.wait(2000)

//     cy.get("#root").children().last().contains(editedListName).should('be.visible')

//     //delete list
//     cy.get("#root").children().last().contains(editedListName).click()
//     cy.get('.action-button').contains("List settings").click()
//     // delete in MODAL_TAG
//     cy.get('.mat-menu-item').contains("Delete list").click()
//     cy.get(MODAL_TAG).contains(editedListName).should('be.visible')

//     //isolate the element to search it only in MODAL_TAG
//     cy.get(MODAL_TAG).within(() => {
//         cy.get('button').contains("Delete").click()
//     })
//     // verify if list is deleted
//     cy.get("#root").children().last().contains(editedListName).should('not.exist')
//     })
