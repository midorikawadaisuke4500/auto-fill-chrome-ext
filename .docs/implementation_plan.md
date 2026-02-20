# Implementation Plan: Auto-Input Completion Chrome Extension

## Goal Description

本プロジェクトの目的は、様々なウェブサイトの「ログイン画面」「注文/申込画面（氏名・住所等）」のDOM構造の違いを吸収し、最短距離での自動入力を実現するChrome拡張機能を作成することです。
機能要件に基づき、まずは「拡張機能本体（Tier 1）」のコア機能である、URL検知、DOM操作、マスターパスワード認証、暗号化等の土台を実装します。

## Proposed Changes

### Extension Core (`extension` directory)

#### [NEW] `manifest.json`

- **目的**: Chrome拡張機能（Manifest V3）の定義。
- **内容**: `permissions` (storage, activeTab, tabs, scripting)、`background` (service worker)、`action` (popup)、`content_scripts` を定義します。

#### [NEW] `src/background.js`

- **目的**: 拡張機能のバックグラウンド状態管理と、データ中継APIや通知との連携。
- **内容**: タブのURL変更検知（`chrome.tabs.onUpdated`）、シナリオのフェッチ処理、パスワードのセッションメモリ保持などのイベント駆動ロジック。

#### [NEW] `src/content.js`

- **目的**: 各ウェブサイト上のDOM操作と監視。
- **内容**:
  - `MutationObserver` を用いた動的UI/SPAでの要素出現検知。
  - バックグラウンドからの指示に基づくフォームの自動入力（XPath/CSSセレクタを利用した要素検索と値のセット）。
  - Nextボタンなどの自動クリック実行（複数ステップ対応）。

#### [NEW] `public/popup.html` & `src/popup.js`

- **目的**: ユーザーインターフェース。
- **内容**: マスターパスワードの入力画面、現在のアカウント（プロファイル）切り替えUIモジュール。

#### [NEW] `src/crypto.js`

- **目的**: 暗号化・復号化のユーティリティ。
- **内容**: `crypto.subtle` (Web Crypto API) を用いた AES-256-GCM によるクレデンシャル情報の暗号化および復号化処理。

## Verification Plan

### Automated Tests

- 本フェーズでは、まずコアの暗号化ロジック（`crypto.js`）に対する基本的なユニットテスト（またはコンソールでのローカル検証コード）を作成・実行し、平文が正しく暗号化・復号でき、マスタパスワードが一致しない場合に弾かれることを確認します。

### Manual Verification

1. **拡張機能の読み込み**: Chromeの `chrome://extensions` 画面にて、「パッケージ化されていない拡張機能を読み込む」から `extension` フォルダを読み込みます。
2. **Popup UI確認**: 拡張機能アイコンをクリックし、パスワード入力画面や設定画面が正常に表示されるか確認します。
3. **Content Scriptの動作確認**: 任意のテストページ（または実際のログインページ）を開き、手動またはダミーのJSONシナリオに基づいて、特定のフォームへの値の自動入力やボタンクリックが正常に発火するかをConsoleログおよび実際の挙動で確認します。
