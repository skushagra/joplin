import { validateLinks } from '@joplin/renderer';
import { anchorRegex, imageRegex } from './htmlUtils';
const stringPadding = require('string-padding');
const urlUtils = require('./urlUtils');
const MarkdownIt = require('markdown-it');

// Taken from codemirror/addon/edit/continuelist.js
const listRegex = /^(\s*)([*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]\s))(\s*)/;
const emptyListRegex = /^(\s*)([*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s+)$/;

export enum MarkdownTableJustify {
	Left = 'left',
	Center = 'center',
	Right = 'right,',
}

export interface MarkdownTableHeader {
	name: string;
	label: string;
	filter?: Function;
	disableEscape?: boolean;
	justify?: MarkdownTableJustify;
}

export interface MarkdownTableRow {
	[key: string]: string;
}

export interface ExtractFileUrlsOptions {
	includeImages?: boolean;
	includeAnchors?: boolean;
	detailedResults?: boolean;
	html?: boolean;
}

export enum ExtractFileUrlsResultType {
	Anchor = 1,
	Image = 2,
}

export interface ExtractFileUrlsResult {
	url: string;
	type: ExtractFileUrlsResultType;
}

const markdownUtils = {
	// Titles for markdown links only need escaping for [ and ]
	escapeTitleText(text: string) {
		return text.replace(/(\[|\])/g, '\\$1');
	},

	escapeLinkUrl(url: string) {
		url = url.replace(/\(/g, '%28');
		url = url.replace(/\)/g, '%29');
		url = url.replace(/ /g, '%20');
		return url;
	},

	escapeTableCell(text: string) {
		// Disable HTML code
		text = text.replace(/</g, '&lt;');
		text = text.replace(/>/g, '&gt;');
		// Table cells can't contain new lines so replace with <br/>
		text = text.replace(/\n/g, '<br/>');
		// "|" is a reserved characters that should be escaped
		text = text.replace(/\|/g, '\\|');
		return text;
	},

	escapeInlineCode(text: string): string {
		// https://github.com/github/markup/issues/363#issuecomment-55499909
		return text.replace(/`/g, '``');
	},

	unescapeLinkUrl(url: string) {
		url = url.replace(/%28/g, '(');
		url = url.replace(/%29/g, ')');
		url = url.replace(/%20/g, ' ');
		return url;
	},

	prependBaseUrl(md: string, baseUrl: string) {
		// eslint-disable-next-line no-useless-escape
		return md.replace(/(\]\()([^\s\)]+)(.*?\))/g, (_match: any, before: string, url: string, after: string) => {
			return before + urlUtils.prependBaseUrl(url, baseUrl) + after;
		});
	},

	// Returns the **encoded** URLs, so to be useful they should be decoded again before use.
	extractFileUrls(md: string, options: ExtractFileUrlsOptions = null): string[] | ExtractFileUrlsResult[] {
		options = {
			includeAnchors: true,
			includeImages: true,
			detailedResults: false,
			// Should probably be true by default but since it was added
			// afterwards we make it false for now.
			html: false,
			...options,
		};

		const markdownIt = new MarkdownIt({ html: options.html });
		markdownIt.validateLink = validateLinks; // Necessary to support file:/// links

		const env = {};
		const tokens = markdownIt.parse(md, env);
		const output: ExtractFileUrlsResult[] = [];

		const searchUrls = (tokens: any[]) => {
			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];
				const type: string = token.type;

				if (type === 'image' || type === 'link_open') {
					if (type === 'image' && !options.includeImages) continue;
					if (type === 'link_open' && !options.includeAnchors) continue;

					for (let j = 0; j < token.attrs.length; j++) {
						const a = token.attrs[j];
						if ((a[0] === 'src' || a[0] === 'href') && a.length >= 2 && a[1]) {
							output.push({
								url: a[1],
								type: type === 'image' ? ExtractFileUrlsResultType.Image : ExtractFileUrlsResultType.Anchor,
							});
						}
					}
				} else if (type === 'html_block' || type === 'html_inline') {
					for (const regex of [imageRegex, anchorRegex]) {
						if (regex === imageRegex && !options.includeImages) continue;
						if (regex === anchorRegex && !options.includeAnchors) continue;

						let result: RegExpExecArray = null;
						while ((result = regex.exec(token.content)) !== null) {
							output.push({
								url: result[2],
								type: regex === imageRegex ? ExtractFileUrlsResultType.Image : ExtractFileUrlsResultType.Anchor,
							});
						}
					}
				}

				if (token.children && token.children.length) {
					searchUrls(token.children);
				}
			}
		};

		searchUrls(tokens);

		if (options.detailedResults) {
			return output;
		} else {
			return output.map(r => r.url);
		}
	},

	replaceResourceUrl(md: string, urlToReplace: string, id: string) {
		const linkRegex = `(?<=\\]\\()\\<?${urlToReplace}\\>?(?=.*\\))`;
		const reg = new RegExp(linkRegex, 'g');
		return md.replace(reg, `:/${id}`);
	},

	extractImageUrls(md: string) {
		return markdownUtils.extractFileUrls(md, {
			includeImages: true,
			includeAnchors: false,
		}) as string[];
	},

	// The match results has 5 items
	// Full match array is
	// [Full match, whitespace, list token, ol line number, whitespace following token]
	olLineNumber(line: string) {
		const match = line.match(listRegex);
		return match ? Number(match[3]) : 0;
	},

	extractListToken(line: string) {
		const match = line.match(listRegex);
		return match ? match[2] : '';
	},

	isListItem(line: string) {
		return listRegex.test(line);
	},

	isEmptyListItem(line: string) {
		return emptyListRegex.test(line);
	},

	createMarkdownTable(headers: MarkdownTableHeader[], rows: MarkdownTableRow[]): string {
		const output = [];

		const minCellWidth = 5;

		const headersMd = [];
		const lineMd = [];
		for (let i = 0; i < headers.length; i++) {
			const h = headers[i];
			headersMd.push(stringPadding(h.label, minCellWidth, ' ', stringPadding.RIGHT));

			const justify = h.justify ? h.justify : MarkdownTableJustify.Left;

			if (justify === MarkdownTableJustify.Left) {
				lineMd.push('-----');
			} else if (justify === MarkdownTableJustify.Center) {
				lineMd.push(':---:');
			} else {
				lineMd.push('----:');
			}
		}

		output.push(`| ${headersMd.join(' | ')} |`);
		output.push(`| ${lineMd.join(' | ')} |`);

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			const rowMd = [];
			for (let j = 0; j < headers.length; j++) {
				const h = headers[j];
				const value = (h.filter ? h.filter(row[h.name]) : row[h.name]) || '';
				const valueMd = h.disableEscape ? value : markdownUtils.escapeTableCell(value);
				rowMd.push(stringPadding(valueMd, minCellWidth, ' ', stringPadding.RIGHT));
			}
			output.push(`| ${rowMd.join(' | ')} |`);
		}

		return output.join('\n');
	},

	countTableColumns(line: string) {
		if (!line) return 0;

		const trimmed = line.trim();
		let pipes = (line.match(/\|/g) || []).length;

		if (trimmed[0] === '|') { pipes -= 1; }
		if (trimmed[trimmed.length - 1] === '|') { pipes -= 1; }

		return pipes + 1;
	},

	matchingTableDivider(header: string, divider: string) {
		if (!header || !divider) return false;

		const invalidChars = divider.match(/[^\s\-:|]/g);

		if (invalidChars) { return false; }

		const columns = markdownUtils.countTableColumns(header);
		const cols = markdownUtils.countTableColumns(divider);
		return cols > 0 && (cols >= columns);
	},

	titleFromBody(body: string) {
		if (!body) return '';
		const mdLinkRegex = /!?\[([^\]]+?)\]\(.+?\)/g;
		const emptyMdLinkRegex = /!?\[\]\((.+?)\)/g;
		const filterRegex = /^[# \n\t*`-]*/;
		const lines = body.trim().split('\n');
		const title = lines[0].trim();
		return title.replace(filterRegex, '').replace(mdLinkRegex, '$1').replace(emptyMdLinkRegex, '$1').substring(0,80);
	},
};

export default markdownUtils;
