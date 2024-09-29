const button = document.getElementById("remove-reviews");
button.addEventListener("click", () => {  
  const statusMessage = document.getElementById("status-message");

  // 処理中メッセージを表示
  statusMessage.textContent = "Removing Sakura Reviews...";
  statusMessage.classList.add("show");
  button.disabled = true; // ボタンを無効化して重複クリックを防ぐ

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: removeFakeReviews
    }, () => {
      // 処理完了メッセージを表示
      statusMessage.textContent = "サクラレビューが削除されました";
    });
  });
});

  
function removeFakeReviews() {
   const reviewList = document.getElementById("cm-cr-dp-review-list") || document.getElementById("cm_cr-review_list");
  if (!reviewList) {
    console.error("レビューリストが見つかりません。");
    return;
  }

  const reviews = reviewList.querySelectorAll("[data-hook='review']");

  // すべてのレビュー情報を保持する配列
  const allReviewData = [];

  reviews.forEach((review) => {
    const reviewTextElement = review.querySelector(".review-text-content");
    const reviewTitleSpans = review.querySelectorAll(".review-title span");
    const thirdSpan = reviewTitleSpans[2];  // タイトル
    const userNameElement = review.querySelector(".a-profile-name");
    const starRatingElement = review.querySelector(".review-rating");

    if (reviewTextElement && thirdSpan && userNameElement && starRatingElement) {
      const reviewText = reviewTextElement.textContent.trim();  // 前後の空白を削除
      const reviewTitle = thirdSpan.textContent;
      const userName = userNameElement.textContent;

      // 星の評価（例: "5つ星のうち4.0" の形式）から数値部分だけを抽出
      const starRating = parseFloat(starRatingElement.textContent.match(/(\d+\.?\d*)/)[0]);

      // レビュー情報をオブジェクトにまとめて配列に追加
      const reviewData = {
        userName: userName,
        starRating: starRating,
        reviewTitle: reviewTitle,
        reviewText: reviewText
      };
      
      allReviewData.push(reviewData);
    } else {
      console.error("レビュー情報が不足しています。");
    }
  });

  // すべてのレビュー情報が収集された後に、一度だけAPIリクエスト
  if (allReviewData.length > 0) {
    console.log(allReviewData);
    checkIfHarmful(allReviewData);
  }

  // checkIfHarmful関数でレビュー情報の配列を受け取る
  async function checkIfHarmful(reviewDataList) {
    // LLM API呼び出し
    // ここではダミーとしてランダムに有害と判定します。
    // 実際にはAPIリクエストを送信して判定を行います。
    // レビューごとに有害かどうかをランダムに判定
    const harmfulResults = reviewDataList.map(() => Math.random() > 0.5);

    harmfulResults.forEach((isHarmful, index) => {
      if (isHarmful) {
        const reviewElement = reviews[index];
        if (reviewElement) {
          reviewElement.style.display = "none";  // 有害レビューを非表示にする
          console.log(`harmful review`);
        }
      }
    });
  }
}

