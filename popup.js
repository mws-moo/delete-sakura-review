document.getElementById("remove-reviews").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: removeFakeReviews
      });
    });
  });
  
  function removeFakeReviews() {
    const reviewList = document.getElementById("cm-cr-dp-review-list");
    if (!reviewList) {
      console.error("レビューリストが見つかりません。");
      return;
    }

    const reviews = reviewList.querySelectorAll("[data-hook='review']");

    reviews.forEach(async (review) => {
      const reviewTextElement = review.querySelector(".review-text-content");
      if (reviewTextElement) {
        const reviewText = reviewTextElement.textContent;

        // LLM APIにテキストを送信して有害レビューか判定
        const isHarmful = await checkIfHarmful(reviewText);

        if (isHarmful) {
          review.style.display = "none";  // レビューを非表示にする
        }
      }
    });
  }
  
  async function checkIfHarmful(text) {
    // LLM API呼び出し
    // ここではダミーとしてランダムに有害と判定
    // 実際にはAPIリクエストを送信して判定を行います。
    return Math.random() > 0.5;
  }
  