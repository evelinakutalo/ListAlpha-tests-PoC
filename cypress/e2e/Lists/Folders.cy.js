import { addFolder, deleteFolder, fillEditNameModal } from "../helpers/lists";

const folderName = "Test Folder";
const modalTag = "mat-dialog-container";
const sharedTeammateEmail = "listalpha_kefjklejfew@outlook.com";
const toastBlock = "snack-bar-container";

const selectFolder = (name) => {
  return cy.get("#shared-root").children().contains(name).first();
};

describe("Folder flow", function () {
  beforeEach(() => {
    cy.signInUser();

    cy.visit("https://dev-ui.listalpha.com/friends");
  });

  //create folder
  it("should create new folder", () => {
    addFolder({ name: folderName });

    //verify if folder is created
    selectFolder(folderName).should("exist");

    cy.wait(1000);

    deleteFolder({ name: folderName });
  });

  //edit folder name
  it("should edit folder name", () => {
    const editedFolderName = "Test Folder Edited";

    cy.intercept({
      method: "PATCH",
      url: "*/lists",
    }).as("editFolder");

    addFolder({ name: folderName });

    // select required folder
    selectFolder(folderName).rightclick({ force: true });

    //rename the list

    cy.get(".mat-menu-item").contains("Edit Folder").click();
    cy.get(modalTag).contains("Enter folder name").should("be.visible");

    //isolate the element to search it only in mat-dialog-container
    fillEditNameModal({ value: editedFolderName });

    cy.wait("@editFolder");
    cy.get(toastBlock).contains("updated");

    deleteFolder({ name: editedFolderName });
  });

  //make private folder
  it("should share folder with other teammate", () => {
    addFolder({ name: folderName });

    cy.wait(1000);
    // select required folder
    selectFolder(folderName).rightclick({ force: true });

    //share the list
    cy.get(".mat-menu-item").contains("Share").click();

    cy.intercept({ url: "**/organization" }).as("makePrivate");

    cy.wait(2000);
    cy.get(`${modalTag} mat-checkbox label`).click();

    cy.wait("@makePrivate");
    cy.get(`${modalTag} button`).filter(":visible").contains("Close").click();
    cy.wait(3000);

    const privateRoot = "#private-root";
    cy.get(privateRoot).children().contains(folderName);
    deleteFolder({ name: folderName, source: privateRoot });
  });
});
