import MarkdownIt from 'markdown-it';

const ISSUELINK_RE = /\B#([0-9]+)\b/;

export const mdIssuePlugin = (md: MarkdownIt) => {
  function tokenize(state: any, silent: boolean) {
    let token;

    if (silent) {
      return false;
    }

    const tail = state.src.slice(state.pos);
    if (!ISSUELINK_RE.test(tail)) {
      return false;
    }

    const matches = tail.match(ISSUELINK_RE);
    const issueKey = matches[1];

    token = state.push("a_open", "a", 1);
    token.attrs = [
      ["class", "issue"],
      ["data-issue", issueKey],
      ["href", `#${issueKey}`]
    ];

    token = state.push("text", "", 0);
    token.content = matches[0];

    token = state.push("a_close", "a", -1);

    state.pos += matches[0].length;
    return true;
  }

  md.inline.ruler.before("emphasis", "issue", tokenize);
};
