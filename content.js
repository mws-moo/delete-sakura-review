chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "remove_reviews") {
      const reviews = document.querySelectorAll(".review-text-content");
  
      reviews.forEach(async (review) => {
        const reviewText = review.textContent;
        
        // LLM APIにテキストを送信して有害レビューか判定
        const isHarmful = await checkIfHarmful(reviewText);
        
        if (isHarmful) {
          review.closest(".review").style.display = "none";  // レビューを非表示にする
        }
      });
    }
  });
  
  async function checkIfHarmful(text) {
    // LLM API呼び出し（外部サービスやローカルサーバー）
    // ここではダミーとしてランダムに有害と判定しますが、
    // 実際にはAPIリクエストを送信して判定を行います。
    return Math.random() > 0.5;
  }
  