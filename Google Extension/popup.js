const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', () => {
  console.log('Button clicked!');
  let inputText = document.getElementById('inputField').value;
  chrome.runtime.sendMessage({text: inputText});
  window.close();
});