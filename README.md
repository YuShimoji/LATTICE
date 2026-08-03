# LATTICE: THE EMPTY LEAGUE

人の消えた世界を固定カメラ式3Dマップで旅し、7人制の陣形競技によって都市設備と交通網を再起動する、探索・会話・クラブ運営中心のスポーツRPGです。

このリポジトリは現在 `FP-00`、すなわち作品固有の最小ループを検証するブラウザ実働版です。Full First Playableの完成を示すものではありません。

## Run

```powershell
npm install
npm run dev
```

ブラウザでViteが表示するURLを開きます。

- `WASD` または矢印キー: 移動
- `E` / `Enter`: 調べる
- 端末内: 8人から7人を選び、`TRIANGLE`を選択して確定

## Verify

```powershell
npm run typecheck
npm test
npm run build
```

## Authority

- [Project Canon](docs/PROJECT_CANON.md)
- [First Playable Contract](docs/FIRST_PLAYABLE_CONTRACT.md)
- [Runtime State](docs/RUNTIME_STATE.md)
- [Project Context](docs/project-context.md)

## Prototype boundary

primitive geometryとDOM UIによる方向検証です。本番キャラクター、美術、音声、完全な7対7試合、オンライン機能、広告、課金、NFT、公開環境は含みません。
