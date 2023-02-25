chrome.identity.getAuthToken({interactive: true}, function(token) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    // Use the token to make an API request
    console.log(token);
  }
});  

const propertiesObject = {
  id: "copyNotes",
  contexts: ["selection"],
  title: "Copy to Google Docs"
}

chrome.contextMenus.create(
  propertiesObject
)

chrome.contextMenus.onClicked.addListener(function(selectedData) {
  console.log(selectedData.selectionText);
  if (selectedData.menuItemId === "copyNotes" && selectedData.selectionText) {

  }
})