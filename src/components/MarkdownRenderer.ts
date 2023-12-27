import { defineComponent, h } from "vue";
import MarkdownRendererMermaid from "./MarkdownRendererMermaid.vue";
import MarkdownRendererIssue from "./MarkdownRendererIssue.vue";

interface VNode {
  type: any;
  props: object;
  children: VNodeChild[] | object | null;
  text?: string;
}
type VNodeChild = any;
type VisitorMethod = (node: HTMLElement) => VNode;
type DepartureMethod = (node: HTMLElement, vNode: VNode) => VNode;
type VisitorMethods = {
  [key: string]: VisitorMethod | DepartureMethod;
};

const capitalize = (str: string): string => {
  // text -> Text
  // text-text -> TextText
  return str
    .split("-")
    .map((s) => {
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    })
    .join("");
};

const getVisitorMethodNames = (node: HTMLElement): { visitName: string, departName: string } => {
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
    const componentCount: {[key: string]: Record<string, number>} = {};

    const resetCounter = () => {
      Object.keys(componentCount).forEach((key) => {
        componentCount[key] = {};
      })
    }

    const getNextKey = (type: string, id: string) => {
        const counter = componentCount[type] ||= {};
        const count = counter[id] || 0;
        counter[id] = count + 1;
        const key = `${type}-${id}-${count}`;
        return key;
    }

    const walkNodes = (node: HTMLElement): any => {
      // h()でvNodeを作る時点で子ノードの一覧が必要になるため、以下の順で処理します。
      // 1. visit: vNode作成の基本情報
      // 2. walk in: children作成
      // 3. depart: 後でvNodeの調整が必要な場合の処理
      // 4. h()によるvNode作成
      let vNode: VNode;

      const { visitName, departName } = getVisitorMethodNames(node);

      // visit
      if (visitName in vmethods) {
        vNode = (vmethods[visitName] as VisitorMethod)(node);
      } else {
        vNode = (vmethods.visitGeneric as VisitorMethod)(node);
      }

      // walk in
      const children: VNodeChild[] = Array.from(node.childNodes).map(
        (childNode) => {
          return walkNodes(childNode as HTMLElement);
        }
      );
      if (children.length > 0) {
        vNode.children = children;
      }

      // depart
      if (departName in vmethods) {
        vNode = (vmethods[departName] as DepartureMethod)(node, vNode);
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
    const vmethods: VisitorMethods = {
      // text node の場合
      visitText(node: HTMLElement): VNode {
        const vNode: VNode = {
          type: null,
          props: {},
          children: null,
          text: node.textContent || "",
        };
        return vNode;
      },
      departText(_node: HTMLElement, vNode: VNode): VNode {
        return vNode;
      },

      // vNodeを作る一般的な処理
      visitGeneric(node: HTMLElement): VNode {
        const _props: any = {};
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
        if (node.classList.contains("mermaid")) {
          return vmethods.departPreMermaid(node, vNode);
        }
        else if (node.classList.contains("issue")) {
          return vmethods.departIssue(node, vNode);
        }
        return vNode;
      },
      departPreMermaid(node: HTMLElement, vNode: VNode): VNode {
        const index = node.parentNode ? [...node.parentNode.querySelectorAll(".mermaid")].findIndex((n) => n===node) : 0;
        const newVNode: VNode = {
          type: MarkdownRendererMermaid,
          props: {
            content: node.textContent,
            index,
          },
          children: null,
        };
        return newVNode;
      },
      departIssue(node: HTMLElement, vNode: VNode): VNode {
        const id = node.dataset["issue"] as string;
        const key = getNextKey("issue", id);

        const newVNode: VNode = {
          type: MarkdownRendererIssue,
          props: {
            key,
            id,
          },
          children: null,
        };
        return newVNode;
      },
    };

    // レンダー関数を返します
    return () => {
      if (!props.content) {
        return h("div");
      }

      const outer = document.createElement("div");
      outer.innerHTML = props.content;

      resetCounter()
      return walkNodes(outer);
    };
  },
});
