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

#### 新しいバックエンドを初期化する

Next.js アプリを実行できるようになったので、アプリのサポートに必要なバックエンドサービスを作成できるように、Amplify をセットアップします。

新しいターミナルを開きます。プロジェクトのルートから、次を実行します。

```bash
amplify init
```

Amplify を初期化すると、アプリに関するいくつかの情報を求められます。

```bash
Enter a name for the project (nextamplified)

# All AWS services you provision for your app are grouped into an "environment"
# A common naming convention is dev, staging, and production
Enter a name for the environment (dev)

# Sometimes the CLI will prompt you to edit a file, it will use this editor to open those files.
Choose your default editor

# Amplify supports JavaScript (Web & React Native), iOS, and Android apps
Choose the type of app that you're building (javascript)

What JavaScript framework are you using (react)

Source directory path (src)

Distribution directory path (build)

Build command (npm run build)

Start command (npm start)

# This is the profile you created with the `amplify configure` command in the introduction step.
Do you want to use an AWS profile?
```

> 可能な場合、CLI は、Amplify が初期化されているプロジェクトのタイプに基づいて適切な構成を推測します。この場合、CLI は、Create Next App を使用していることと、アプリ、フレームワーク、ソース、ディストリビューション、ビルド、そして起動オプションを認識します。

新しい Amplify プロジェクトを初期化すると、いくつかのことが起こります。

- バックエンドの定義を保存する、`amplify` という最上位のディレクトリが作成されます。チュートリアルでは、GraphQL API や認証などの機能を追加します。機能を追加すると、`amplify` フォルダーは、バックエンド スタックを定義するコードとしてのインフラストラクチャ テンプレートと共に拡大します。コードとしてのインフラストラクチャは、レプリケート可能なバックエンド スタックを作成するためのベスト プラクティスの方法です。
- Amplify で作成するサービスのすべての設定を保持する aws-exports.js というファイルが src ディレクトリに作成されます。これは、Amplify クライアントがバックエンド サービスに関する必要な情報を取得できる方法です。
- .gitignore ファイルを変更し、生成されたファイルを無視リストに追加します。
- クラウド プロジェクトが AWS Amplify コンソールに作成され、Amplify コンソールを実行してアクセスできます。コンソールには、バックエンド環境のリスト、Amplify カテゴリごとにプロビジョニングされたリソースへのディープ リンク、最近のデプロイのステータス、バックエンド リソースの昇格、クローン作成、プル、削除の手順が表示されます。

カテゴリを追加または削除し、Amplify CLI を使用してバックエンド設定を更新すると、aws-exports.js の設定が自動的に更新されます。

#### Amplify ライブラリをインストールする

クライアントで Amplify を使用するための最初のステップは、必要な依存関係をインストールすることです。

```bash
npm install aws-amplify @aws-amplify/ui-react
```

`aws-amplify` パッケージは、アプリで Amplify を操作するためのメインライブラリです。`@aws-amplify/ui-react` パッケージには、アプリの構築時に使用する React 固有の UI コンポーネントが含まれています。

Next.js アプリがセットアップされ、Amplify が初期化されたので、次のステップで API を追加する準備が整いました。

### API とデータベースをアプリに接続する

Next.js アプリを作成して構成し、新しい Amplify プロジェクトを初期化したので、機能を追加できます。最初に追加する機能は API です。

Amplify CLI は、REST と GraphQL の 2 種類の API カテゴリの作成と操作をサポートしています。

このステップで作成する API は、AWS AppSync (マネージド GraphQL サービス) を使用する GraphQL API であり、データベースは Amazon DynamoDB (NoSQL データベース) です。

#### GraphQL API とデータベースを作成する

[GraphQL API](https://docs.aws.amazon.com/appsync/latest/devguide/designing-a-graphql-api.html) をアプリに追加し、アプリケーション ディレクトリのルートから次のコマンドを実行して、データベースを自動的にプロビジョニングします。

```bash
amplify add api
```

以下の明示的な値を選択して、*API キー* (パブリック読み取りアクセス用) と *Cognito ユーザープール* (認証済みアクセス用) を有効にします。

```bash
? Select from one of the below mentioned services: GraphQL
? Here is the GraphQL API that we will create. Select a setting to edit or continue
Authorization modes: API key (default, expiration time: 7 days from now)
? Choose the default authorization type for the API Amazon Cognito User Pool
Using service: Cognito, provided by: awscloudformation

The current configured provider is Amazon Cognito.

Do you want to use the default authentication and security configuration? Default configuration

Warning: you will not be able to edit these selections.

How do you want users to be able to sign in? Username
Do you want to configure advanced settings? No, I am done.
✅ Successfully added auth resource nextamplified locally

✅ Some next steps:
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

? Configure additional auth types? No
? Here is the GraphQL API that we will create. Select a setting to edit or continue Continue
? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)
```

CLI は、この GraphQL スキーマをテキストエディターで開きます。サンプルスキーマを以下の Post モデルに置き換えます。

*amplify/backend/api/nextamplified/schema.graphql*

```graphql
type Post
  @model
  @auth(rules: [{ allow: owner }, { allow: public, operations: [read] }]) {
  id: ID!
  title: String!
  content: String!
}
```

生成されるスキーマは、ブログアプリ用です。`@model` の `Post` タイプのディレクティブに気付くでしょう。このディレクティブは、Amplify の [GraphQL 変換](https://docs.amplify.aws/cli/graphql/data-modeling/) ライブラリの一部です。

GraphQL 変換ライブラリは、スキーマで使用できるカスタムディレクティブを提供します。これにより、データモデルの定義、認証および認可ルールの設定、サーバーレス関数のリゾルバーの構成などを行うことができます。

`@model` ディレクティブで修飾された型は、型のデータベース テーブル (Post テーブル)、CRUD (作成、読み取り、更新、削除) とリスト操作のスキーマ、およびすべてを連携させるために必要な GraphQL リゾルバーを足場にします。

コマンド ラインで Enter キーを押してスキーマを受け入れ、次の手順に進みます。

##### API のデプロイ

このバックエンドをデプロイするには、`push` コマンドを実行します。

```bash
amplify push
```

```bash
Current Environment: dev

┌──────────┬───────────────────────┬───────────┬───────────────────┐
│ Category │ Resource name         │ Operation │ Provider plugin   │
├──────────┼───────────────────────┼───────────┼───────────────────┤
│ Auth     │ nextamplifiedXXXXXXX  │ Create    │ awscloudformation │
├──────────┼───────────────────────┼───────────┼───────────────────┤
│ Api      │ nextamplified         │ Create    │ awscloudformation │
└──────────┴───────────────────────┴───────────┴───────────────────┘
? Are you sure you want to continue? Yes

# You will be walked through the following questions for GraphQL code generation


API key configuration
✔ Enter a description for the API key: ·
✔ After how many days from now the API key should expire (1-365): · 7
GraphQL schema compiled successfully.

? Do you want to generate code for your newly created GraphQL API Yes
? Choose the code generation language target javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2

...

✔ Generated GraphQL operations successfully and saved at src/graphql
✔ All resources are updated in the cloud
```

これで API がライブになり、操作を開始できます。

デプロイした API には、投稿の作成、読み取り、更新、削除、および一覧表示のための操作が含まれています。

次に、次のコマンドを実行して Amplify のステータスを確認します。

```bash
amplify status
```

これにより、現在の環境、作成されたカテゴリ、それらのカテゴリの状態など、Amplify プロジェクトの現在のステータスが表示されます。次のようになります。

```bash
Current Environment: dev

┌──────────┬───────────────────────┬───────────┬───────────────────┐
│ Category │ Resource name         │ Operation │ Provider plugin   │
├──────────┼───────────────────────┼───────────┼───────────────────┤
│ Auth     │ nextamplifiedXXXXXXXX │ No Change │ awscloudformation │
├──────────┼───────────────────────┼───────────┼───────────────────┤
│ Api      │ nextamplified         │ No Change │ awscloudformation │
└──────────┴───────────────────────┴───────────┴───────────────────┘
```

いつでも AppSync コンソールで GraphQL API を表示するには、次のコマンドを実行します。

```bash
amplify console api
```

Amplify コンソールでいつでもアプリ全体を表示するには、次のコマンドを実行します。

```bash
amplify console
```

##### (オプショナル) API をテストする

これをローカルでテストするには、mock コマンドを実行します。注: [モッキングをセットアップする手順](https://docs.amplify.aws/cli/usage/mock/) を参照してください。

> 先に進んでフロントエンドを接続したい場合は、次のステップにジャンプできます。

```bash
amplify mock api
```

注: `amplify mock api` には Java が必要です

```bash
# If you have not already deployed you API, you will be walked through the following steps for GraphQL code generation
? Choose the code generation language target: javascript (or preferred target)
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions: Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
```

これにより、ローカル ートで GraphiQL エクスプローラーが開きます。テスト環境から、クエリやミューテーションなど、さまざまな操作をローカルで試すことができます。

GraphiQL ツールバーで、*Use: API Key* を選択し、post の作成を試みます。

```graphql
mutation CreatePost {
  createPost(input: { title: "Test Post", content: "post content" }) {
    id
    owner
    title
    updatedAt
    createdAt
    content
  }
}
```

#### サーバーサイドレンダリング (SSR) を使用する API

このセクションでは、Next.js アプリケーションから投稿を一覧表示および作成する方法を作成します。これを行うには、サーバーから最新の投稿を取得してレンダリングし、クライアントで新しい投稿を作成します。

次のライブラリがインストールされていることを確認します。

```bash
npm install aws-amplify @aws-amplify/ui-react
```

*pages/_app.js* を開き、次のコードを追加して、[Amplify UI](https://ui.docs.amplify.aws/) からスタイルをインポートします。
