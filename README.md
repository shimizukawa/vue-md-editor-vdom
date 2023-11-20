# vue-markdown-preview-virtualdom

Addressing a problem with the Markdown editor and its preview, where all the elements in the preview are updated each typing.

- The display by v-html redraws all elements for each character entered.
- By breaking up the HTML into Vue's VirtualDOM and rendering it, only the change differences on the preview are updated.
- This eliminates problems such as reloading images and the resulting scrolling misalignment.

<details>
<summary>日本語</summary>

Markdown エディタとそのプレビューを作るときに、プレビューのエレメントが文字入力ごとに全て更新されてしまう問題の対処。

- v-htmlによる表示は1文字入力毎に全てのエレメントを再描画します。
- HTMLをVueのVirtualDOMに分解してレンダリングすることで、プレビュー上の変更差分だけが更新されます。
- これによって、画像の再ロードや、それに伴うスクロール位置のズレなどの問題を解消できます。

</details>

## v-html vs VirtualDom

### v-html

https://github.com/shimizukawa/vue-md-editor-vdom/assets/151623/e6d08c74-ad7c-49e9-8300-ff9fdbbb2493
(MICAN by @nana_marux / CC BY-NC 4.0 DEED)

### VirtualDom

https://github.com/shimizukawa/vue-md-editor-vdom/assets/151623/6a82f0fc-978e-4c0a-a760-ca5d9c4330ab

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
