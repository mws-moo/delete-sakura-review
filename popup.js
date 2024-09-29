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
    checkIfHarmful(allReviewData);
  }

  async function sendChat(text, chatGptApiKey) {
    // OpenAIのエンドポイントURLを定義。
    const endPoint = "https://api.openai.com/v1/chat/completions";
    const modelName = "gpt-4o"; // 使用するモデルの名前を定義。

    // チャットの初期メッセージを定義
    const messages = [
      {
        role: "system", //役割
        content: [
          "これからAmazonのレビューを渡します。その中でサクラレビューだと思われるもののインデックスだけを教えてください。",
          "サクラレビューは, 他のレビューと比べて内容が不自然であることが多いです。",
          "例えば, 他のレビューと比べて内容が異常に短い, 他のレビューと比べて内容が異常に長い, ポジティブ・ネガティブなことしか書いていない, 理由なく星5や星1としている, 不自然な日本語などです。",
          "サクラレビューが見当たらない場合は, -1を出力してください。",
          "",
          "例1",
          "",
          "index: 1, 4がサクラレビューと思われるとき",
          "",
          "答え1:",
          "",
          "1, 4",
          "",
          "例2",
          "サクラレビューが見当たらないとき",
          "",
          "答え2:",
          "",
          "-1",
          "",
          "問"
        ].join('\n')
      },
      {
        role: "user", // ユーザーからのメッセージ
        content: text
      }
    ];

    // リクエストオプション
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatGptApiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        max_tokens: 500 //レスポンスのトークンの最大数
      })
    };

    const maxRetries = 3; // 最大リトライ回数
    const retryDelay = 2000; // リトライまでの待機時間（ミリ秒）
    let retryCount = 0;

    while (retryCount < maxRetries) {
      retryCount++;
      try {
        const res = await fetch(new Request(endPoint, requestOptions));
        if (!res.ok) {
          if (res.status === 429 && retryCount < maxRetries) {
            console.log(`Retrying... (${retryCount})`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue; // リトライ
          } else {
            throw new Error(`Request failed with status: ${res.status}`);
          }
        }

        const json = await res.json();
        console.log(json.choices[0].message.content);
        return json.choices[0].message.content; // 正常に取得した場合、ansを返す
      } catch (err) {
        console.error('Request failed: ', err);
        if (retryCount >= maxRetries) {
          throw new Error('Maximum retries reached');
        }
      }
    }
    return null;
  };

  // checkIfHarmful関数でレビュー情報の配列を受け取る
  async function checkIfHarmful(reviewDataList) {
    // LLM API呼び出し
    // ここではダミーとしてランダムに有害と判定します。
    // 実際にはAPIリクエストを送信して判定を行います。
    // レビューごとに有害かどうかをランダムに判定

    // TODO: APIキーを入力してください
    const apiKey = "INPUT YOUR API KEY";


    text = "";
    for (let i = 0; i < reviewDataList.length; i++) {
      text += "index: " + i + "\n";
      text += "名前: " + reviewDataList[i].userName + "\n";
      text += "星: " + reviewDataList[i].starRating + "\n";
      text += "タイトル: " + reviewDataList[i].reviewTitle + "\n";
      text += "本文: " + reviewDataList[i].reviewText + "\n";
      text += "\n";
    }

    ans = await sendChat(text + "答え" + "\n", apiKey);

    function convertToList(str) {
      // 改行や「答え:」などの不要な部分を削除
      const cleanedStr = str.replace(/\s*答え:\s*/, '').trim();

      // カンマで区切って配列に変換し、数値に変換する
      return cleanedStr.split(',').map(num => parseInt(num.trim(), 10));
    }

    list = convertToList(ans);

    const harmfulResults = list;

    if (harmfulResults[0] == -1) {
      return;
    }

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
