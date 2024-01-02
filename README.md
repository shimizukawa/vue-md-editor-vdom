# vue-markdown-preview-virtualdom

Addressing a problem with the Markdown editor and its preview, where all the elements in the preview are updated each typing.

- The display by v-html redraws all elements for each character entered.
- By breaking up the HTML into Vue's VirtualDOM and rendering it, only the change differences on the preview are updated.
- This eliminates problems such as reloading images and the resulting scrolling misalignment.

Explanation blog entries:

- [VueでMarkdownのプレビューをVueの仮想DOMで表示する — 清水川Web](https://www.freia.jp/taka/blog/vue-md-editor-vdom/index.html)
- [Vue MarkdownエディタにMermaidを組み込んで仮想DOMでレンダリング — 清水川Web](https://www.freia.jp/taka/blog/vue-md-editor-vdom-mermaid/index.html)
- [Vue Componentの再利用による意図しない描画を避ける、MD仮想DOM描画の特殊ケース — 清水川Web](https://www.freia.jp/taka/blog/vue-md-editor-vdom-reused/index.html)

<details>
<summary>日本語</summary>

Markdown エディタとそのプレビューを作るときに、プレビューのエレメントが文字入力ごとに全て更新されてしまう問題の対処。

- v-htmlによる表示は1文字入力毎に全てのエレメントを再描画します。
- HTMLをVueのVirtualDOMに分解してレンダリングすることで、プレビュー上の変更差分だけが更新されます。
- これによって、画像の再ロードや、それに伴うスクロール位置のズレなどの問題を解消できます。

</details>

## licenses

- MIT License (except bellow files)
- [MICAN by @nana_marux](https://twitter.com/nana_marux/status/1726451529820058108) / CC BY-NC 4.0 DEED
- [XKCD Comic #353: Python](https://www.explainxkcd.com/wiki/index.php/353:_Python) / CC BY-NC 2.5 DEED

## v-html vs VirtualDom

https://github.com/shimizukawa/vue-md-editor-vdom/assets/151623/d6135056-c133-443f-aad1-4e5bca49316d

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
