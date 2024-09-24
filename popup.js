document.getElementById("remove-reviews").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: removeFakeReviews
      });
    });
  });
  
  function removeFakeReviews() {
    chrome.runtime.sendMessage({ action: "remove_reviews" });
  }
  