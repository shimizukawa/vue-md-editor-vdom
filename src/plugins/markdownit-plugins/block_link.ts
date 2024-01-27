import MarkdownIt from 'markdown-it';
import * as mdurl from 'mdurl'
import type StateBlock from 'markdown-it/lib/rules_block/state_block';

const RECODE_HOSTNAME_FOR = ['http:', 'https:'];

export const mdBlockLinkPlugin = (md: MarkdownIt) => {
  function tokenize(state: StateBlock, startLine: number, _endLine: number, silent: boolean) {
    const pos = state.bMarks[startLine]; // pos points to start of line
    const max = state.eMarks[startLine]; // max points to end of line
    const line = state.src.slice(pos, max); // text of line

    const url = state.md.normalizeLink(line);
    const parsed = mdurl.parse(url, true);
    const valid = line.trim().indexOf(' ') < 0 && RECODE_HOSTNAME_FOR.includes(parsed.protocol);
    // console.log("mdBlockLinkPlugin", {pos, max, line, url, valid, silent, protocol: parsed.protocol, parsed});

    // silient for validation
    if (silent || !valid) {
      return valid;
    }

    const token_o = state.push('link_open', 'a', 1);
    token_o.attrs = [['href', url], ['class', 'block-link']];

    const token_t = state.push('text', '', 0)
    token_t.content = state.md.normalizeLinkText(url)

    state.push('link_close', 'a', -1)
    state.line += 1;
    return true;
  }

  md.block.ruler.before("paragraph", "block-link", tokenize, {"alt": ["paragraph"]});
};
