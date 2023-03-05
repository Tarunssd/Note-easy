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
  id: "copyNotes",
  contexts: ["selection"],
  title: "Copy to Google Docs"
}

chrome.contextMenus.create(
  propertiesObject
)

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
    const fileId = data.id;
    const content = text;
    // paste text
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
              text: content,
              endOfSegmentLocation: {},
            },
          },
        ],
      })
    })
    .then(response => console.log(response))
    .then(data => console.log(data))
    .catch(error => console.error(error));
  })
  .catch(error => console.error(error));
}


chrome.contextMenus.onClicked.addListener(function(selectedData) {
  console.log(selectedData.selectionText);
  const selectedText = selectedData.selectionText;
  if (selectedText) {
    createNewGoogleDoc(ACCESS_TOKEN, selectedText)
  }
})