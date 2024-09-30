# Amazon Sakura Review Remover

Amazonのサクラレビューを削除するChrome拡張

Amazonの日本サイト（ https://www.amazon.co.jp/ ）内のページでスクリプトが実行可能

# 機能

- localStorageにユーザーのOpenAI API keyを保存する (API keyは各自で[このサイト](https://platform.openai.com/api-keys)から取得してください)
- OpenAI APIを用いて, サクラレビューを自動的に検出し非表示にする

# 使い方
1. リポジトリのReleasesから最新のzipファイルを取得する
1. Chromeの拡張機能ページ( chrome://extensions/ )にアクセスする
1. デベロッパーモードを有効にする
1. 「パッケージ化されていない拡張機能を読み込む」をクリックして, zipを解凍したディレクトリを選択する
1. [このサイト](https://platform.openai.com/api-keys)にアクセスして, API keyを取得する
1. 拡張機能のアイコンをクリックして, OpenAI API keyを入力し保存する
1. 拡張機能のアイコンをクリックして, 「サクラレビューを削除」をクリックする
