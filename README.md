# Amazon Sakura Review Remover

Amazonのサクラレビューを削除するChrome拡張

Amazonの日本サイト（ https://www.amazon.co.jp/ ）内のすべてのページでスクリプトが実行される

# 機能

- localStorageにユーザーのChatGPT APIを保存する (API KEYは各自で[このサイト](https://platform.openai.com/api-keys)から取得してください)
- ChatGPT APIを用いて, サクラレビューを自動的に検出し非表示にする

# 使い方
1. このレポジトリをcloneする
1. Chromeの拡張機能のページにアクセスする
1. デベロッパーモードを有効にする
1. 「パッケージ化されていない拡張機能を読み込む」をクリックして, cloneしたレポジトリのディレクトリを選択する
1. [このサイト](https://platform.openai.com/api-keys)にアクセスして, API KEYを取得する
1. 拡張機能のアイコンをクリックして, ChatGPT APIを入力する
1. 拡張機能のアイコンをクリックして, 「サクラレビューを削除」をクリックする
