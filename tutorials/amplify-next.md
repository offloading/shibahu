# Amplify-Next.js

[Getting started - Next.js - AWS Amplify Docs](https://docs.amplify.aws/start/q/integration/next/)

## 入門

オープンソースの Amplify は、フルスタックの iOS、Android、Flutter、Web、および React Native アプリを構築するために、次の製品を提供します。

- Amplify CLI - シンプルなコマンドラインインターフェイスを使用して、バックエンドを強化するために必要なすべてのサービスを構成します。
- Amplify ライブラリ - ユースケース中心のクライアントライブラリを使用して、宣言型インターフェイスを使用してアプリコードをバックエンドと統合します。
- Amplify UI コンポーネント - React、React Native、Angular、Vue、Flutter の UI ライブラリ。

Amplify Hosting は、フルスタックウェブアプリの継続的なデプロイとホスティングのための git ベースのワークフローを提供する AWS のサービスです。Amplify CLI によって作成されたクラウドリソースは、Amplify コンソールにも表示されます。

### 構築するもの

このチュートリアルでは、バックエンドをセットアップし、そのバックエンドを新しい Next.js アプリと統合する方法について説明します。

GraphQL API を使用して簡単なブログを作成し、アイテムをクラウドデータベースに保存および取得します。さらに、ユーザーを認証し、API と通信し、AWS にデプロイする方法を示します。

GraphQL は、アプリが API からデータを取得できるようにするために開発されたデータ言語です。宣言型の自己文書化スタイルを持ちます。 GraphQL 操作では、クライアントは、サーバーからデータが返されたときにデータを構造化する方法を指定します。これにより、クライアントは、必要なデータのみを必要な形式でクエリできるようになります。

## チュートリアル

### 前提条件

開始する前に、次のものがインストールされていることを確認してください。

- Node.js v14.x 以降
- npm v6.14.4 以降
- git v2.14.1 以降

### AWS アカウントにサインアップする

AWS アカウントをまだ持っていない場合は、このチュートリアルで説明されている手順に従うためにアカウントを作成する必要があります。

[AWS アカウントの作成](https://portal.aws.amazon.com/billing/signup?redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start)

AWS アカウントを作成するための前払い料金や契約期間はありません。サインアップすると、AWS 無料利用枠にすぐにアクセスできます。

### Amplify CLI をインストールして構成する

Amplify コマンドラインインターフェイス(CLI) は、アプリ用の AWS クラウドサービスを作成するための統合ツールチェーンです。それでは、Amplify CLI をインストールしてみましょう。

#### オプション 1: ビデオ ガイドを見る

以下のビデオを見て、Amplify CLI をインストールして構成する方法を学習するか、次のセクションにスキップしてステップバイステップの手順に従います。
https://youtu.be/fWbM5DLh25U

#### オプション 2: 指示に従う

```bash
npm install -g @aws-amplify/cli
```

次に、Amplify CLI をセットアップします。次のコマンドを実行して Amplify を構成します。

```bash
amplify configure
```

`amplify configure` は、AWS コンソールにサインインするように求めます。

サインインすると、Amplify CLI から IAM ユーザーを作成するよう求められます。

Amazon IAM (Identity and Access Management) を使用すると、AWS でユーザーとユーザー権限を管理できます。 Amazon IAM の詳細については、[こちら](https://aws.amazon.com/iam/) をご覧ください。

```bash
Specify the AWS Region
? region:  <Your preferred region>
Specify the username of the new IAM user:
? user name:  <User name for Amplify IAM user>
Complete the user creation using the AWS console: <URL>
```

`<URL>` に従って、`AdministratorAccess-Amplify` を使用してアカウントにユーザーを作成し、AppSync、Cognito などの AWS リソースをプロビジョニングします。

Amplify CLI will then ask you to copy and paste the accessKeyId and the secretAccessKey from your newly created IAM user to connect with Amplify CLI.

次に、Amplify CLI は、新しく作成された IAM ユーザーから accessKeyId と secretAccessKey をコピーして貼り付け、Amplify CLI に接続するように求めます。

新しいユーザーが正常に設定されました。

次のセクションでは、アプリをセットアップして Amplify を初期化します。

### フルスタックプロジェクトのセットアップ

プロジェクトを設定するには、最初に [Create Next App](https://nextjs.org/docs/api-reference/create-next-app) を使用して新しい Next.js アプリを作成します。これは、新しい Next.js アプリケーションの構築をすばやく開始できるシンプルな CLI ツールであり、すべてが設定されています。次に、Amplify を追加して、新しいプロジェクトを初期化します。

プロジェクト ディレクトリから、次のコマンドを実行します。

```bash
npx create-next-app next-amplified
cd next-amplified
```

これにより、next-amplified という名前のディレクトリに新しい Next.js アプリが作成され、その新しいディレクトリに切り替えられます。

プロジェクトのルートに移動したので、次のコマンドを使用してアプリを実行できます。

```bash
npm run dev
```

これにより、開発サーバーが実行され、ビルドによって生成された出力を確認できます。http://localhost:3000 に移動すると、実行中のアプリを確認できます。
