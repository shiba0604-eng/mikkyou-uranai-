# 密教占い配信ツール（宿曜占星術ベース）

## プロジェクト概要

密教占い（宿曜占星術）に基づく日々の運勢を毎朝配信するWebアプリ。
生年月日から二十七宿（にじゅうしちしゅく）を計算し、その日の宿との相性・運勢をユーザーに届ける。

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 14+ (App Router) |
| スタイリング | Tailwind CSS |
| ORM | Prisma |
| データベース | PostgreSQL (本番) / SQLite (開発) |
| 言語 | TypeScript |
| メール配信 | Resend または SendGrid |
| 認証 | NextAuth.js |
| デプロイ | Vercel |
| AI文言生成 | Anthropic Claude API（オプション） |

## ディレクトリ構成（予定）

```
mikkyou-uranai/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # トップページ（今日の運勢）
│   │   ├── register/         # ユーザー登録
│   │   └── api/              # API Routes
│   ├── lib/
│   │   ├── sukuyo/           # 宿曜占星術計算ロジック
│   │   │   ├── constants.ts  # 二十七宿の定義
│   │   │   ├── calculator.ts # 生年月日→宿の計算
│   │   │   └── fortune.ts    # 今日の運勢生成
│   │   ├── db/               # Prisma client
│   │   └── email/            # メール配信
│   └── components/           # UIコンポーネント
├── prisma/
│   └── schema.prisma
├── CLAUDE.md                 # このファイル
└── README.md
```

## 宿曜占星術について

- 二十七宿（インド由来、密教経由で日本に伝来）に基づく占術
- 生年月日から「本命宿（ほんみょうしゅく）」を算出
- 今日の「当日宿」と本命宿の組み合わせで運勢を決定
- 宿の種類: 角・亢・氐・房・心・尾・箕・斗・牛・女・虚・危・室・壁・奎・婁・胃・昴・畢・觜・参・井・鬼・柳・星・張・翼・軫（一部異なる体系あり）

## 開発コマンド

```bash
npm run dev       # 開発サーバー起動
npm run build     # ビルド
npm run db:push   # Prismaスキーマ適用
npm run db:studio # Prisma Studio起動
```

## 注意事項

- 宿曜占星術の計算は旧暦（太陰太陽暦）ベース。新暦→旧暦変換が必要
- 占い文言は各宿×運勢カテゴリ（恋愛・仕事・健康など）で管理
- Claude APIで毎日動的に文言を生成するオプションを検討
