import { defineComponent, h } from "vue";

interface VNode {
  type: any;
  props: object;
  children: (VNode | string)[] | object | null;
  text?: string;
}

const capitalize = (str): string => {
  // text -> Text
  // text-text -> TextText
  return str
    .split("-")
    .map((s) => {
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    })
    .join("");
};

const getVisitorMethodNames = (node: HTMLElement) => {
  let name;
  if (node.nodeType === Node.TEXT_NODE) {
    name = node.nodeName.slice(1);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    name = node.tagName;
  } else {
    throw new Error("Not implemented nodeType: " + node.nodeType);
  }
  // visit + "2文字目以降のキャピタライズ"
  const capitalName = capitalize(name);
  const visitName = "visit" + capitalName;
  const departName = "depart" + capitalName;
  return { visitName, departName };
};

export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const walkNodes = (node: HTMLElement): VNode | string => {
      // h()でvNodeを作る時点で子ノードの一覧が必要になるため、以下の順で処理します。
      // 1. visit: vNode作成の基本情報
      // 2. walk in: children作成
      // 3. depart: 後でvNodeの調整が必要な場合の処理
      // 4. h()によるvNode作成
      let vNode: VNode = null;

      const { visitName, departName } = getVisitorMethodNames(node);

      // visit
      if (vmethods[visitName]) {
        vNode = vmethods[visitName](node);
      } else {
        vNode = vmethods.visitGeneric(node);
      }

      // walk in
      const children = Array.from(node.childNodes).map(
        (childNode: HTMLElement) => {
          return walkNodes(childNode);
        }
      );
      if (children.length > 0) {
        vNode.children = children;
      }

      // depart
      if (vmethods[departName]) {
        vNode = vmethods[departName](node, vNode);
      } else {
        vNode = vmethods.departGeneric(node, vNode);
      }

      // vNode must not negative
      if (!vNode) {
        console.error("WARN: vNode is null", { node, vNode });
        throw new Error("vNode is null");
      }

      if (vNode.text) {
        return vNode.text;
      } else {
        // @ts-expect-error childrenの型があわない
        return h(vNode.type, vNode.props, vNode.children);
      }
    };

    // walkNodes内で動的なmethod探索を行うため、変数にいれてあります。
    // また、propsにアクセスできるように、setup関数内で定義しています。
    const vmethods = {
      // text node の場合
      visitText(node: HTMLElement): VNode {
        const vNode: VNode = {
          type: null,
          props: {},
          children: null,
          text: node.textContent,
        };
        return vNode;
      },
      departText(_node, vNode: VNode): VNode {
        return vNode;
      },

      // vNodeを作る一般的な処理
      visitGeneric(node: HTMLElement): VNode {
        const _props = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          _props[attr.name] = attr.value;
        }
        const vNode: VNode = {
          type: node.tagName.toLowerCase(),
          props: _props,
          children: null,
        };
        return vNode;
      },
      departGeneric(node: HTMLElement, vNode: VNode): VNode {
        return vNode;
      },
    };

    // レンダー関数を返します
    return () => {
      if (!props.content) {
        return h("div");
      }

      const outer = document.createElement("div");
      outer.innerHTML = props.content;

      return walkNodes(outer);
    };
  },
});
