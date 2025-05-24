var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var pdf_parse_exports = {};
__export(pdf_parse_exports, {
  PdfParser: () => PdfParser,
  parse: () => parse
});
module.exports = __toCommonJS(pdf_parse_exports);
var import_fs = __toESM(require("fs"));
const logError = (message, error) => {
  console.error(`${message}:`, error);
};
class PdfParser {
  filename;
  pdfDocument;
  /**
   * 构造函数
   * @param filename PDF文件路径
   */
  constructor(filename, ragName) {
    this.filename = filename;
  }
  /**
   * 初始化PDF.js和加载文档
   * @returns 是否成功初始化
   */
  async initPdfDocument() {
    try {
      if (!import_fs.default.existsSync(this.filename)) {
        logError(`\u6587\u4EF6\u4E0D\u5B58\u5728`, this.filename);
        return false;
      }
      const pdfjsLib = await import("pdfjs-dist");
      const data = new Uint8Array(import_fs.default.readFileSync(this.filename));
      const loadingTask = pdfjsLib.getDocument({ data });
      this.pdfDocument = await loadingTask.promise;
      return true;
    } catch (error) {
      logError("\u521D\u59CB\u5316PDF\u6587\u6863\u5931\u8D25", error);
      return false;
    }
  }
  /**
   * 解析PDF文件
   * @returns Markdown格式的内容
   */
  async parse() {
    if (!await this.initPdfDocument() || !this.pdfDocument) {
      return "";
    }
    let text = "";
    for (let i = 1; i <= this.pdfDocument.numPages; i++) {
      const page = await this.pdfDocument.getPage(i);
      const textContent = await page.getTextContent({ includeMarkedContent: true });
      let items = textContent.items;
      let isEndMarkedContent = false;
      let endMarkedContent = 0;
      let isStart = true;
      for (let item of items) {
        if (item.type == "endMarkedContent") {
          endMarkedContent++;
        }
        if (item.fontName) {
          text += item.str;
          endMarkedContent = 0;
        }
        if (endMarkedContent == 2) {
          text += "\n";
          endMarkedContent = 0;
          isEndMarkedContent = true;
        }
        if (item.hasEOL && isStart || !isEndMarkedContent && item.hasEOL) {
          text += "\n";
          isStart = false;
        }
      }
      text += "\n";
    }
    text = text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "");
    text = text.replace(/[]/g, "");
    return text.trim();
  }
  /**
   * 清理资源
   */
  dispose() {
    if (this.pdfDocument) {
      this.pdfDocument.destroy();
      this.pdfDocument = null;
    }
  }
}
async function parse(filename, ragName) {
  try {
    const parser = new PdfParser(filename, ragName);
    const markdown = await parser.parse();
    return markdown;
  } catch (error) {
    logError("\u89E3\u6790 PDF \u6587\u4EF6\u5931\u8D25", error);
    return "";
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PdfParser,
  parse
});
