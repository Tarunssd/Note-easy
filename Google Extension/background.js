var ACCESS_TOKEN;
chrome.identity.getAuthToken({interactive: true}, function(token) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    // Use the token to make an API request
    ACCESS_TOKEN = token;
    console.log(token);
  }
});  

const propertiesObject = {
  id: "copyNotes New",
  contexts: ["selection"],
  title: "Copy to New Google Doc"
}

const propertiesObjectEx = {
  id: "copyNotes Existing",
  contexts: ["selection"],
  title: "Copy to Existing Google Doc"
}

chrome.contextMenus.create(
  propertiesObject
)

chrome.contextMenus.create(
  propertiesObjectEx
)

var fileId = "";
// Create a new Google Doc
function createNewGoogleDoc(token, text) {
  const metadata = {
    name: 'My New Doc',
    mimeType: 'application/vnd.google-apps.document'
  };

  fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  })
  .then(response => response.json())
  .then(data => {
    fileId = data.id;
    const content = text;
    // paste text
    pasteText(token, fileId, content)
  })
  .catch(error => console.error(error));
}

function pasteText(token, fileId, content) {
  fetch(`https://docs.googleapis.com/v1/documents/${fileId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              text: content + '\n',
              endOfSegmentLocation: {},
            },
          },
        ],
      })
    })
    .then(response => console.log(response))
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

chrome.contextMenus.onClicked.addListener(function(selectedData, tab) {
  console.log(selectedData, tab);
  const selectedText = selectedData.selectionText;
  if (selectedText) {
    if (selectedData.menuItemId === "copyNotes New") {
      fileId = "";
      // Need to open a popup here to let the user enter new file

      createNewGoogleDoc(ACCESS_TOKEN, selectedText);
    }
    else if (selectedData.menuItemId === "copyNotes Existing") {
      if(fileId === "") {
        // Need to show alert here to let user know there is no file created before
        chrome.tabs.sendMessage(tab.id, {message: "There is no file created before!, Please select option Copy to New Google Doc"});
      }
      else {
        pasteText(ACCESS_TOKEN, fileId, selectedText);
      }
    }
  }
})