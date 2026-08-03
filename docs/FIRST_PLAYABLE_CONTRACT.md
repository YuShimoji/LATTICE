# First Playable Contract

## Full First Playable

- 30〜45分
- 1地域、固定カメラ場面10〜12、拠点1
- 選手8〜10人、基本陣形3種類
- 他クラブ1、エキシビジョン1、共同作戦1、乗り物1

## Current FP-00

5〜10分で、次の作品固有ループだけを実証します。

`固定カメラ探索 → 無人端末を調べる → 8人から7人を編成する → 地域規約に適合する陣形を成立させる → 世界内のゲートが起動する → ゲートの先で登録残響体と会話する`

### Acceptance conditions

- 三つの接続された固定カメラ場面（コンコース、プラットフォーム、エネルギーゲート）を移動できる。
- 端末、線路、ホーム、ゲート、プレイヤー、登録残響体をシルエットから判別できる。
- input mappingは一箇所に集約され、端末・会話中は移動しない。
- 8人は永続人物として表示され、7人の登録枠へ選択できる。
- Platform 06の規約はTriangle、Anchor 1、Relayer 1、Runner 2以上。
- 条件不成立ではゲートが起動せず、成立後だけ起動する。
- ゲート先で3段階の会話を完了し、route restored状態になる。
- simulation stateはThree.js objectと分離され、純粋なテストで規約を検証できる。
- `npm run typecheck`、`npm test`、`npm run build`が成功する。

FP-00をFull First Playable完成とは主張しません。

## Current FP-01A — Formation Wiring

FP-00の7人登録を、人数・役割の集計だけでなく、Triangle上の位置関係を操作するプレイへ深めます。

### Acceptance conditions

- Triangleを7つの名前付きノードと接続線として表示する。
- 同じ7人・同じTriangleでも、Runner 2点、Relayer 1点、Anchor 1点の配置が不適合ならゲートは起動しない。
- 2つのノードを順に選ぶと、その2人だけを入れ替えられる。
- 適合／不適合のノードと規約不成立理由が端末上で判別できる。
- ノード割当はserializable simulation stateが所有し、UI上の一時選択状態と分離する。
- ゲート起動後は割当を変更できない。
- `npm run typecheck`、`npm test`、`npm run build`が成功する。
- 実ブラウザで不成立配置から成立配置へ組み替え、既存のroute restoredまで到達できる。

FP-01AもFull First Playable完成とは主張しません。
