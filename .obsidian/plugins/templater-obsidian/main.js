'use strict';

var obsidian = require('obsidian');
var child_process = require('child_process');
var util = require('util');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_SETTINGS = {
    command_timeout: 5,
    template_folder: "",
    templates_pairs: [["", ""]],
};
class TemplaterSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        let fragment = document.createDocumentFragment();
        let link = document.createElement("a");
        link.href = "https://silentvoid13.github.io/Templater/";
        link.text = "documentation";
        fragment.append("Check the ");
        fragment.append(link);
        fragment.append(" to get a list of all the available internal variables / functions.");
        new obsidian.Setting(containerEl)
            .setName("Template folder location")
            .setDesc("Files in this folder will be available as templates.")
            .addText(text => {
            text.setPlaceholder("Example: folder 1/folder 2")
                .setValue(this.plugin.settings.template_folder)
                .onChange((new_folder) => {
                this.plugin.settings.template_folder = new_folder;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Timeout")
            .setDesc("Maximum timeout in seconds for a system command.")
            .addText(text => {
            text.setPlaceholder("Timeout")
                .setValue(this.plugin.settings.command_timeout.toString())
                .onChange((new_value) => {
                let new_timeout = Number(new_value);
                if (isNaN(new_timeout)) {
                    this.plugin.log_error("Timeout must be a number");
                    return;
                }
                this.plugin.settings.command_timeout = new_timeout;
                this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Internal Variables and Functions")
            .setDesc(fragment);
        let i = 1;
        this.plugin.settings.templates_pairs.forEach((template_pair) => {
            let div = containerEl.createEl('div');
            div.addClass("templater_div");
            let title = containerEl.createEl('h4', {
                text: 'User Function n°' + i,
            });
            title.addClass("templater_title");
            let setting = new obsidian.Setting(containerEl)
                .addExtraButton(extra => {
                extra.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                    if (index > -1) {
                        this.plugin.settings.templates_pairs.splice(index, 1);
                        // Force refresh
                        this.plugin.saveSettings();
                        this.display();
                    }
                });
            })
                .addText(text => {
                let t = text.setPlaceholder('Function name')
                    .setValue(template_pair[0])
                    .onChange((new_value) => {
                    let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                    if (index > -1) {
                        this.plugin.settings.templates_pairs[index][0] = new_value;
                        this.plugin.saveSettings();
                    }
                });
                t.inputEl.addClass("templater_template");
                return t;
            })
                .addTextArea(text => {
                let t = text.setPlaceholder('System Command')
                    .setValue(template_pair[1])
                    .onChange((new_cmd) => {
                    let index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                    if (index > -1) {
                        this.plugin.settings.templates_pairs[index][1] = new_cmd;
                        this.plugin.saveSettings();
                    }
                });
                t.inputEl.setAttr("rows", 4);
                t.inputEl.addClass("templater_cmd");
                return t;
            });
            setting.infoEl.remove();
            div.appendChild(title);
            div.appendChild(containerEl.lastChild);
            i += 1;
        });
        let div = containerEl.createEl('div');
        div.addClass("templater_div2");
        let setting = new obsidian.Setting(containerEl)
            .addButton(button => {
            let b = button.setButtonText("Add New User Function").onClick(() => {
                this.plugin.settings.templates_pairs.push(["", ""]);
                // Force refresh
                this.display();
            });
            b.buttonEl.addClass("templater_button");
            return b;
        });
        setting.infoEl.remove();
        div.appendChild(containerEl.lastChild);
    }
}

var OpenMode;
(function (OpenMode) {
    OpenMode[OpenMode["InsertTemplate"] = 0] = "InsertTemplate";
    OpenMode[OpenMode["CreateNoteTemplate"] = 1] = "CreateNoteTemplate";
})(OpenMode || (OpenMode = {}));
class TemplaterFuzzySuggestModal extends obsidian.FuzzySuggestModal {
    constructor(app, plugin) {
        super(app);
        this.app = app;
        this.plugin = plugin;
    }
    getItems() {
        let template_files = [];
        if (this.plugin.settings.template_folder === "") {
            let files = this.app.vault.getFiles();
            template_files = files;
        }
        else {
            let template_folder_str = obsidian.normalizePath(this.plugin.settings.template_folder);
            let template_folder = this.app.vault.getAbstractFileByPath(template_folder_str);
            if (!template_folder) {
                throw new Error(`${template_folder_str} folder doesn't exist`);
            }
            if (!(template_folder instanceof obsidian.TFolder)) {
                throw new Error(`${template_folder_str} is a file, not a folder`);
            }
            obsidian.Vault.recurseChildren(template_folder, (file) => {
                if (file instanceof obsidian.TFile) {
                    template_files.push(file);
                }
            });
            template_files.sort((a, b) => {
                return a.basename.localeCompare(b.basename);
            });
        }
        return template_files;
    }
    getItemText(item) {
        return item.basename;
    }
    onChooseItem(item, _evt) {
        switch (this.open_mode) {
            case OpenMode.InsertTemplate:
                this.plugin.parser.replace_templates_and_append(item);
                break;
            case OpenMode.CreateNoteTemplate:
                this.plugin.parser.create_new_note_from_template(item, this.creation_folder);
                break;
        }
    }
    insert_template() {
        this.open_mode = OpenMode.InsertTemplate;
        // If there is only one file in the templates directory, we don't open the modal
        try {
            let files = this.getItems();
            if (files.length == 1) {
                this.plugin.parser.replace_templates_and_append(files[0]);
            }
            else {
                this.open();
            }
        }
        catch (error) {
            this.plugin.log_error(error);
        }
    }
    create_new_note_from_template(folder) {
        this.creation_folder = folder;
        this.open_mode = OpenMode.CreateNoteTemplate;
        try {
            this.open();
        }
        catch (error) {
            this.plugin.log_error(error);
        }
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var eta_min = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports);}(commonjsGlobal,(function(e){function t(e){var n,r,i=new Error(e);return n=i,r=t.prototype,Object.setPrototypeOf?Object.setPrototypeOf(n,r):n.__proto__=r,i}function n(e,n,r){var i=n.slice(0,r).split(/\n/),a=i.length,o=i[a-1].length+1;throw t(e+=" at line "+a+" col "+o+":\n\n  "+n.split(/\n/)[a-1]+"\n  "+Array(o).join(" ")+"^")}t.prototype=Object.create(Error.prototype,{name:{value:"Eta Error",enumerable:!1}});var r=new Function("return this")().Promise;function i(e,t){for(var n in t)r=t,i=n,Object.prototype.hasOwnProperty.call(r,i)&&(e[n]=t[n]);var r,i;return e}function a(e,t,n,r){var i,a;return Array.isArray(t.autoTrim)?(i=t.autoTrim[1],a=t.autoTrim[0]):i=a=t.autoTrim,(n||!1===n)&&(i=n),(r||!1===r)&&(a=r),a||i?"slurp"===i&&"slurp"===a?e.trim():("_"===i||"slurp"===i?e=function(e){return String.prototype.trimLeft?e.trimLeft():e.replace(/^\s+/,"")}(e):"-"!==i&&"nl"!==i||(e=e.replace(/^(?:\r\n|\n|\r)/,"")),"_"===a||"slurp"===a?e=function(e){return String.prototype.trimRight?e.trimRight():e.replace(/\s+$/,"")}(e):"-"!==a&&"nl"!==a||(e=e.replace(/(?:\r\n|\n|\r)$/,"")),e):e}var o={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function s(e){return o[e]}var l=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,c=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,u=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;function p(e){return e.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&")}function f(e,t){var r=[],i=!1,o=0,s=t.parse;if(t.plugins)for(var f=0;f<t.plugins.length;f++){(T=t.plugins[f]).processTemplate&&(e=T.processTemplate(e,t));}function d(e,n){e&&(e=a(e,t,i,n))&&(e=e.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),r.push(e));}t.rmWhitespace&&(e=e.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")),l.lastIndex=0,c.lastIndex=0,u.lastIndex=0;for(var g,h=[s.exec,s.interpolate,s.raw].reduce((function(e,t){return e&&t?e+"|"+p(t):t?p(t):e}),""),m=new RegExp("([^]*?)"+p(t.tags[0])+"(-|_)?\\s*("+h+")?\\s*","g"),v=new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?"+p(t.tags[1])+")","g");g=m.exec(e);){o=g[0].length+g.index;var y=g[1],x=g[2],_=g[3]||"";d(y,x),v.lastIndex=o;for(var w=void 0,b=!1;w=v.exec(e);){if(w[1]){var E=e.slice(o,w.index);m.lastIndex=o=v.lastIndex,i=w[2],b={t:_===s.exec?"e":_===s.raw?"r":_===s.interpolate?"i":"",val:E};break}var I=w[0];if("/*"===I){var R=e.indexOf("*/",v.lastIndex);-1===R&&n("unclosed comment",e,w.index),v.lastIndex=R;}else if("'"===I){c.lastIndex=w.index,c.exec(e)?v.lastIndex=c.lastIndex:n("unclosed string",e,w.index);}else if('"'===I){u.lastIndex=w.index,u.exec(e)?v.lastIndex=u.lastIndex:n("unclosed string",e,w.index);}else if("`"===I){l.lastIndex=w.index,l.exec(e)?v.lastIndex=l.lastIndex:n("unclosed string",e,w.index);}}b?r.push(b):n("unclosed tag",e,g.index+y.length);}if(d(e.slice(o,e.length),!1),t.plugins)for(f=0;f<t.plugins.length;f++){var T;(T=t.plugins[f]).processAST&&(r=T.processAST(r,t));}return r}function d(e,t){var n=f(e,t),r="var tR='',__l,__lP"+(t.include?",include=E.include.bind(E)":"")+(t.includeFile?",includeFile=E.includeFile.bind(E)":"")+"\nfunction layout(p,d){__l=p;__lP=d}\n"+(t.globalAwait?"let prs = [];\n":"")+(t.useWith?"with("+t.varName+"||{}){":"")+function(e,t){var n,r=e.length,i="";if(t.globalAwait){for(n=0;n<r;n++){if("string"!=typeof(o=e[n]))if("r"===(s=o.t)||"i"===s)i+="prs.push("+(l=o.val||"")+");\n";}i+="let rst = await Promise.all(prs);\n";}var a=0;for(n=0;n<r;n++){var o;if("string"==typeof(o=e[n])){i+="tR+='"+o+"'\n";}else {var s=o.t,l=o.val||"";"r"===s?(t.globalAwait&&(l="rst["+a+"]"),t.filter&&(l="E.filter("+l+")"),i+="tR+="+l+"\n",a++):"i"===s?(t.globalAwait&&(l="rst["+a+"]"),t.filter&&(l="E.filter("+l+")"),t.autoEscape&&(l="E.e("+l+")"),i+="tR+="+l+"\n",a++):"e"===s&&(i+=l+"\n");}}return i}(n,t)+(t.includeFile?"if(__l)tR="+(t.async?"await ":"")+"includeFile(__l,Object.assign("+t.varName+",{body:tR},__lP))\n":t.include?"if(__l)tR="+(t.async?"await ":"")+"include(__l,Object.assign("+t.varName+",{body:tR},__lP))\n":"")+"if(cb){cb(null,tR)} return tR"+(t.useWith?"}":"");if(t.plugins)for(var i=0;i<t.plugins.length;i++){var a=t.plugins[i];a.processFnString&&(r=a.processFnString(r,t));}return r}var g=new(function(){function e(e){this.cache=e;}return e.prototype.define=function(e,t){this.cache[e]=t;},e.prototype.get=function(e){return this.cache[e]},e.prototype.remove=function(e){delete this.cache[e];},e.prototype.reset=function(){this.cache={};},e.prototype.load=function(e){i(this.cache,e);},e}())({});var h={async:!1,autoEscape:!0,autoTrim:[!1,"nl"],cache:!1,e:function(e){var t=String(e);return /[&<>"']/.test(t)?t.replace(/[&<>"']/g,s):t},include:function(e,n){var r=this.templates.get(e);if(!r)throw t('Could not fetch template "'+e+'"');return r(n,this)},parse:{exec:"",interpolate:"=",raw:"~"},plugins:[],rmWhitespace:!1,tags:["<%","%>"],templates:g,useWith:!1,varName:"it"};function m(e,t){var n={};return i(n,h),t&&i(n,t),e&&i(n,e),n}function v(e,n){var r=m(n||{}),i=r.async?function(){try{return new Function("return (async function(){}).constructor")()}catch(e){throw e instanceof SyntaxError?t("This environment doesn't support async/await"):e}}():Function;try{return new i(r.varName,"E","cb",d(e,r))}catch(n){throw n instanceof SyntaxError?t("Bad template syntax\n\n"+n.message+"\n"+Array(n.message.length+1).join("=")+"\n"+d(e,r)+"\n"):n}}function y(e,t){if(t.cache&&t.name&&t.templates.get(t.name))return t.templates.get(t.name);var n="function"==typeof e?e:v(e,t);return t.cache&&t.name&&t.templates.define(t.name,n),n}function x(e,n,i,a){var o=m(i||{});if(!o.async)return y(e,o)(n,o);if(!a){if("function"==typeof r)return new r((function(t,r){try{t(y(e,o)(n,o));}catch(e){r(e);}}));throw t("Please provide a callback function, this env doesn't support Promises")}try{y(e,o)(n,o,a);}catch(e){return a(e)}}e.compile=v,e.compileToString=d,e.config=h,e.configure=function(e){return i(h,e)},e.defaultConfig=h,e.getConfig=m,e.parse=f,e.render=x,e.renderAsync=function(e,t,n,r){return x(e,t,Object.assign({},n,{async:!0}),r)},e.templates=g,Object.defineProperty(e,"__esModule",{value:!0});}));
//# sourceMappingURL=eta.min.js.map
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class TParser {
    constructor(app) {
        this.app = app;
    }
}

class InternalModule extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.static_templates = new Map();
        this.dynamic_templates = new Map();
    }
    getName() {
        return this.name;
    }
    generateContext(file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.file = file;
            if (this.static_templates.size === 0) {
                yield this.createStaticTemplates();
            }
            yield this.updateTemplates();
            return Object.assign(Object.assign({}, Object.fromEntries(this.static_templates)), Object.fromEntries(this.dynamic_templates));
        });
    }
}

function get_date_string(date_format, days, moment_str, moment_format) {
    return window.moment(moment_str, moment_format).add(days, 'days').format(date_format);
}
const UNSUPPORTED_MOBILE_TEMPLATE = "Error_MobileUnsupportedTemplate";

class InternalModuleDate extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "date";
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_templates.set("now", this.generate_now());
            this.static_templates.set("tomorrow", this.generate_tomorrow());
            this.static_templates.set("yesterday", this.generate_yesterday());
        });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_now() {
        return (format = "YYYY-MM-DD", offset, reference, reference_format) => {
            if (reference && !window.moment(reference, reference_format).isValid()) {
                throw new Error("Invalid title date format, try specifying one with the argument 'reference'");
            }
            return get_date_string(format, offset, reference, reference_format);
        };
    }
    generate_tomorrow() {
        return (format = "YYYY-MM-DD") => {
            return get_date_string(format, 1);
        };
    }
    generate_yesterday() {
        return (format = "YYYY-MM-DD") => {
            return get_date_string(format, -1);
        };
    }
}

const DEPTH_LIMIT = 10;
class InternalModuleFile extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "file";
        this.include_depth = 0;
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_templates.set("clipboard", this.generate_clipboard());
            this.static_templates.set("cursor", this.generate_cursor());
            this.static_templates.set("selection", this.generate_selection());
        });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dynamic_templates.set("content", yield this.generate_content());
            this.dynamic_templates.set("creation_date", this.generate_creation_date());
            this.dynamic_templates.set("folder", this.generate_folder());
            this.dynamic_templates.set("include", this.generate_include());
            this.dynamic_templates.set("last_modified_date", this.generate_last_modified_date());
            this.dynamic_templates.set("path", this.generate_path());
            this.dynamic_templates.set("rename", this.generate_rename());
            this.dynamic_templates.set("tags", this.generate_tags());
            this.dynamic_templates.set("title", this.generate_title());
        });
    }
    generate_clipboard() {
        return () => __awaiter(this, void 0, void 0, function* () {
            // TODO: Add mobile support
            if (this.app.isMobile) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            return yield navigator.clipboard.readText();
        });
    }
    generate_cursor() {
        return (order) => {
            // Hack to prevent empty output
            return `<% tp.file.cursor(${order !== null && order !== void 0 ? order : ''}) %>`;
        };
    }
    generate_content() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.app.vault.read(this.file);
        });
    }
    generate_creation_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return get_date_string(format, undefined, this.file.stat.ctime);
        };
    }
    generate_folder() {
        return (relative = false) => {
            let parent = this.file.parent;
            let folder;
            if (relative) {
                folder = parent.path;
            }
            else {
                folder = parent.name;
            }
            return folder;
        };
    }
    generate_include() {
        return (include_filename) => __awaiter(this, void 0, void 0, function* () {
            let inc_file = this.app.metadataCache.getFirstLinkpathDest(obsidian.normalizePath(include_filename), "");
            if (!inc_file) {
                throw new Error(`File ${include_filename} doesn't exist`);
            }
            if (!(inc_file instanceof obsidian.TFile)) {
                throw new Error(`${include_filename} is a folder, not a file`);
            }
            // TODO: Add mutex for this, this may currently lead to a race condition. 
            // While not very impactful, that could still be annoying.
            this.include_depth += 1;
            if (this.include_depth > DEPTH_LIMIT) {
                this.include_depth = 0;
                throw new Error("Reached inclusion depth limit (max = 10)");
            }
            let inc_file_content = yield this.app.vault.read(inc_file);
            let parsed_content = yield this.plugin.parser.parseTemplates(inc_file_content);
            this.include_depth -= 1;
            return parsed_content;
        });
    }
    generate_last_modified_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return get_date_string(format, undefined, this.file.stat.mtime);
        };
    }
    generate_path() {
        return (relative = false) => {
            // TODO: Add mobile support
            if (this.app.isMobile) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            if (!(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
                throw new Error("app.vault is not a FileSystemAdapter instance");
            }
            let vault_path = this.app.vault.adapter.getBasePath();
            if (relative) {
                return this.file.path;
            }
            else {
                return `${vault_path}/${this.file.path}`;
            }
        };
    }
    generate_rename() {
        return (new_title) => __awaiter(this, void 0, void 0, function* () {
            let new_path = obsidian.normalizePath(`${this.file.parent.path}/${new_title}.${this.file.extension}`);
            yield this.app.fileManager.renameFile(this.file, new_path);
            return "";
        });
    }
    generate_selection() {
        return () => {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view == null) {
                throw new Error("Active view is null");
            }
            let editor = active_view.editor;
            return editor.getSelection();
        };
    }
    generate_tags() {
        let cache = this.app.metadataCache.getFileCache(this.file);
        return obsidian.getAllTags(cache);
    }
    generate_title() {
        return this.file.basename;
    }
}

class InternalModuleWeb extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "web";
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_templates.set("daily_quote", this.generate_daily_quote());
            this.static_templates.set("random_picture", this.generate_random_picture());
            this.static_templates.set("get_request", this.generate_get_request());
        });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getRequest(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(url);
            if (!response.ok) {
                throw new Error("Error performing GET request");
            }
            return response;
        });
    }
    generate_daily_quote() {
        return () => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest("https://quotes.rest/qod");
            let json = yield response.json();
            let author = json.contents.quotes[0].author;
            let quote = json.contents.quotes[0].quote;
            let new_content = `> ${quote}\n> &mdash; <cite>${author}</cite>`;
            return new_content;
        });
    }
    generate_random_picture() {
        return (size = "1600x900", query) => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest(`https://source.unsplash.com/random/${size}?${query}`);
            let url = response.url;
            return `![tp.web.random_picture](${url})`;
        });
    }
    generate_get_request() {
        return (url) => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest(url);
            let json = yield response.json();
            return json;
        });
    }
}

class InternalModuleFrontmatter extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "frontmatter";
    }
    createStaticTemplates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            let cache = this.app.metadataCache.getFileCache(this.file);
            this.dynamic_templates = new Map(Object.entries(cache.frontmatter || {}));
        });
    }
}

class InternalTemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.modules_array = new Array();
        this.createModules();
    }
    createModules() {
        this.modules_array.push(new InternalModuleDate(this.app, this.plugin));
        this.modules_array.push(new InternalModuleFile(this.app, this.plugin));
        this.modules_array.push(new InternalModuleWeb(this.app, this.plugin));
        this.modules_array.push(new InternalModuleFrontmatter(this.app, this.plugin));
    }
    generateContext(f) {
        return __awaiter(this, void 0, void 0, function* () {
            let modules_context_map = new Map();
            for (let mod of this.modules_array) {
                modules_context_map.set(mod.getName(), yield mod.generateContext(f));
            }
            return Object.fromEntries(modules_context_map);
        });
    }
}

class UserTemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.resolveCwd();
    }
    resolveCwd() {
        // TODO: Add mobile support
        if (this.app.isMobile || !(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
            this.cwd = "";
        }
        else {
            this.cwd = this.app.vault.adapter.getBasePath();
        }
    }
    generateUserTemplates(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_templates = new Map();
            const exec_promise = util.promisify(child_process.exec);
            let context = yield this.plugin.parser.generateContext(file, ContextMode.INTERNAL);
            for (let [template, cmd] of this.plugin.settings.templates_pairs) {
                if (template === "" || cmd === "") {
                    continue;
                }
                cmd = yield this.plugin.parser.parseTemplates(cmd, context);
                user_templates.set(template, (user_args) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let process_env = Object.assign(Object.assign({}, process.env), user_args);
                        let cmd_options = {
                            timeout: this.plugin.settings.command_timeout * 1000,
                            cwd: this.cwd,
                            env: process_env,
                        };
                        let { stdout } = yield exec_promise(cmd, cmd_options);
                        return stdout;
                    }
                    catch (error) {
                        this.plugin.log_error(`Error with User Template ${template}`, error);
                    }
                }));
            }
            return user_templates;
        });
    }
    generateContext(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_templates = yield this.generateUserTemplates(file);
            return Object.fromEntries(user_templates);
        });
    }
}

class CursorJumper {
    constructor(app) {
        this.app = app;
        this.cursor_regex = new RegExp("<%\\s*tp.file.cursor\\((?<order>[0-9]{0,2})\\)\\s*%>", "g");
    }
    jump_to_next_cursor_location() {
        return __awaiter(this, void 0, void 0, function* () {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("No active view, can't append templates.");
            }
            let active_file = active_view.file;
            yield active_view.save();
            let content = yield this.app.vault.read(active_file);
            const { match_string, pos } = this.get_cursor_position(content);
            if (pos) {
                content = content.replace(match_string, "");
                yield this.app.vault.modify(active_file, content);
                this.set_cursor_location(pos);
            }
        });
    }
    get_cursor_position(content) {
        let cursor_matches = [];
        let match;
        while ((match = this.cursor_regex.exec(content)) != null) {
            cursor_matches.push(match);
        }
        if (cursor_matches.length === 0) {
            return {};
        }
        cursor_matches.sort((m1, m2) => {
            return Number(m1.groups["order"]) - Number(m2.groups["order"]);
        });
        let match_str = cursor_matches[0][0];
        let index = cursor_matches[0].index;
        let substr = content.substr(0, index);
        let l = 0;
        let offset = -1;
        let r = -1;
        for (; (r = substr.indexOf("\n", r + 1)) !== -1; l++, offset = r)
            ;
        offset += 1;
        let ch = content.substr(offset, index - offset).length;
        let pos = { line: l, ch: ch };
        return { match_string: match_str, pos: pos };
    }
    set_cursor_location(pos) {
        let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (active_view === null) {
            return;
        }
        let editor = active_view.editor;
        editor.focus();
        editor.setCursor(pos);
    }
}

var ContextMode;
(function (ContextMode) {
    ContextMode[ContextMode["USER"] = 0] = "USER";
    ContextMode[ContextMode["INTERNAL"] = 1] = "INTERNAL";
    ContextMode[ContextMode["USER_INTERNAL"] = 2] = "USER_INTERNAL";
    ContextMode[ContextMode["DYNAMIC"] = 3] = "DYNAMIC";
})(ContextMode || (ContextMode = {}));
// TODO: Remove that
const tp_cursor = new RegExp("<%\\s*tp.file.cursor\\s*%>");
class TemplateParser extends TParser {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.userTemplateParser = null;
        this.cursor_jumper = new CursorJumper(this.app);
        this.internalTemplateParser = new InternalTemplateParser(this.app, this.plugin);
        // TODO: Add mobile support
        if (!this.app.isMobile) {
            this.userTemplateParser = new UserTemplateParser(this.app, this.plugin);
        }
    }
    setCurrentContext(file, context_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            this.current_context = yield this.generateContext(file, context_mode);
        });
    }
    generateContext(file, context_mode = ContextMode.USER_INTERNAL) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = {};
            let internal_context = yield this.internalTemplateParser.generateContext(file);
            let user_context = {};
            if (!this.current_context) {
                // If a user system command is using tp.file.include, we need the context to be set.
                this.current_context = internal_context;
            }
            switch (context_mode) {
                case ContextMode.USER:
                    if (this.userTemplateParser) {
                        user_context = yield this.userTemplateParser.generateContext(file);
                    }
                    context = {
                        user: Object.assign({}, user_context)
                    };
                    break;
                case ContextMode.INTERNAL:
                    context = internal_context;
                    break;
                case ContextMode.DYNAMIC:
                    if (this.userTemplateParser) {
                        user_context = yield this.userTemplateParser.generateContext(file);
                    }
                    context = {
                        dynamic: Object.assign(Object.assign({}, internal_context), { user: Object.assign({}, user_context) })
                    };
                    break;
                case ContextMode.USER_INTERNAL:
                    if (this.userTemplateParser) {
                        user_context = yield this.userTemplateParser.generateContext(file);
                    }
                    context = Object.assign(Object.assign({}, internal_context), { user: Object.assign({}, user_context) });
                    break;
            }
            return context;
        });
    }
    parseTemplates(content, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context) {
                context = this.current_context;
            }
            if (content.match(tp_cursor)) {
                this.plugin.log_update(`tp.file.cursor was updated! It's now an internal function, you should call it like so: tp.file.cursor() <br/>
tp.file.cursor now supports cursor jump order! Specify the jump order as an argument (tp.file.cursor(1), tp.file.cursor(2), ...), if you wish to change the default top to bottom order.<br/>
Check the <a href='https://silentvoid13.github.io/Templater/docs/internal-variables-functions/internal-modules/file-module'>documentation</a> for more informations.`);
            }
            try {
                content = (yield eta_min.renderAsync(content, context, {
                    varName: "tp",
                    parse: {
                        exec: "*",
                        interpolate: "~",
                        raw: "",
                    },
                    autoTrim: false,
                    globalAwait: true,
                }));
            }
            catch (error) {
                this.plugin.log_error("Template parsing error, aborting.", error);
            }
            return content;
        });
    }
    replace_in_active_file() {
        try {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("Active view is null");
            }
            this.replace_templates_and_overwrite_in_file(active_view.file);
        }
        catch (error) {
            this.plugin.log_error(error);
        }
    }
    create_new_note_from_template(template_file, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let template_content = yield this.app.vault.read(template_file);
                if (!folder) {
                    folder = this.app.fileManager.getNewFileParent("");
                    //folder = this.app.vault.getConfig("newFileFolderPath");
                }
                // TODO: Change that, not stable atm
                // @ts-ignore
                let created_note = yield this.app.fileManager.createNewMarkdownFile(folder, "Untitled");
                //let created_note = await this.app.vault.create("Untitled.md", "");
                yield this.setCurrentContext(created_note, ContextMode.USER_INTERNAL);
                let content = yield this.plugin.parser.parseTemplates(template_content);
                yield this.app.vault.modify(created_note, content);
                let active_leaf = this.app.workspace.activeLeaf;
                if (!active_leaf) {
                    throw new Error("No active leaf");
                }
                yield active_leaf.openFile(created_note, { state: { mode: 'source' }, eState: { rename: 'all' } });
                yield this.cursor_jumper.jump_to_next_cursor_location();
            }
            catch (error) {
                this.plugin.log_error(error);
            }
        });
    }
    replace_templates_and_append(template_file) {
        return __awaiter(this, void 0, void 0, function* () {
            let active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                throw new Error("No active view, can't append templates.");
            }
            let editor = active_view.editor;
            let doc = editor.getDoc();
            let content = yield this.app.vault.read(template_file);
            yield this.setCurrentContext(active_view.file, ContextMode.USER_INTERNAL);
            content = yield this.parseTemplates(content);
            doc.replaceSelection(content);
            yield this.cursor_jumper.jump_to_next_cursor_location();
            editor.focus();
        });
    }
    replace_templates_and_overwrite_in_file(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = yield this.app.vault.read(file);
            yield this.setCurrentContext(file, ContextMode.USER_INTERNAL);
            let new_content = yield this.parseTemplates(content);
            if (new_content !== content) {
                yield this.app.vault.modify(file, new_content);
                if (this.app.workspace.getActiveFile() === file) {
                    yield this.cursor_jumper.jump_to_next_cursor_location();
                }
            }
        });
    }
}

const ICON_DATA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.1328 28.7"><path d="M0 15.14 0 10.15 18.67 1.51 18.67 6.03 4.72 12.33 4.72 12.76 18.67 19.22 18.67 23.74 0 15.14ZM33.6928 1.84C33.6928 1.84 33.9761 2.1467 34.5428 2.76C35.1094 3.38 35.3928 4.56 35.3928 6.3C35.3928 8.0466 34.8195 9.54 33.6728 10.78C32.5261 12.02 31.0995 12.64 29.3928 12.64C27.6862 12.64 26.2661 12.0267 25.1328 10.8C23.9928 9.5733 23.4228 8.0867 23.4228 6.34C23.4228 4.6 23.9995 3.1066 25.1528 1.86C26.2994.62 27.7261 0 29.4328 0C31.1395 0 32.5594.6133 33.6928 1.84M49.8228.67 29.5328 28.38 24.4128 28.38 44.7128.67 49.8228.67M31.0328 8.38C31.0328 8.38 31.1395 8.2467 31.3528 7.98C31.5662 7.7067 31.6728 7.1733 31.6728 6.38C31.6728 5.5867 31.4461 4.92 30.9928 4.38C30.5461 3.84 29.9995 3.57 29.3528 3.57C28.7061 3.57 28.1695 3.84 27.7428 4.38C27.3228 4.92 27.1128 5.5867 27.1128 6.38C27.1128 7.1733 27.3361 7.84 27.7828 8.38C28.2361 8.9267 28.7861 9.2 29.4328 9.2C30.0795 9.2 30.6128 8.9267 31.0328 8.38M49.4328 17.9C49.4328 17.9 49.7161 18.2067 50.2828 18.82C50.8495 19.4333 51.1328 20.6133 51.1328 22.36C51.1328 24.1 50.5594 25.59 49.4128 26.83C48.2595 28.0766 46.8295 28.7 45.1228 28.7C43.4228 28.7 42.0028 28.0833 40.8628 26.85C39.7295 25.6233 39.1628 24.1366 39.1628 22.39C39.1628 20.65 39.7361 19.16 40.8828 17.92C42.0361 16.6733 43.4628 16.05 45.1628 16.05C46.8694 16.05 48.2928 16.6667 49.4328 17.9M46.8528 24.52C46.8528 24.52 46.9595 24.3833 47.1728 24.11C47.3795 23.8367 47.4828 23.3033 47.4828 22.51C47.4828 21.7167 47.2595 21.05 46.8128 20.51C46.3661 19.97 45.8162 19.7 45.1628 19.7C44.5161 19.7 43.9828 19.97 43.5628 20.51C43.1428 21.05 42.9328 21.7167 42.9328 22.51C42.9328 23.3033 43.1561 23.9733 43.6028 24.52C44.0494 25.06 44.5961 25.33 45.2428 25.33C45.8895 25.33 46.4261 25.06 46.8528 24.52Z" fill="currentColor"/></svg>`;
class TemplaterPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.fuzzySuggest = new TemplaterFuzzySuggestModal(this.app, this);
            this.parser = new TemplateParser(this.app, this);
            this.registerMarkdownPostProcessor((el, ctx) => this.dynamic_templates_processor(el, ctx));
            obsidian.addIcon("templater-icon", ICON_DATA);
            this.addRibbonIcon('templater-icon', 'Templater', () => __awaiter(this, void 0, void 0, function* () {
                this.fuzzySuggest.insert_template();
            }));
            this.addCommand({
                id: "insert-templater",
                name: "Insert Template",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: 'e',
                    },
                ],
                callback: () => {
                    this.fuzzySuggest.insert_template();
                },
            });
            this.addCommand({
                id: "replace-in-file-templater",
                name: "Replace templates in the active file",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: 'r',
                    },
                ],
                callback: () => {
                    this.parser.replace_in_active_file();
                },
            });
            this.addCommand({
                id: "jump-to-next-cursor-location",
                name: "Jump to next cursor location",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: "Tab",
                    },
                ],
                callback: () => {
                    try {
                        this.parser.cursor_jumper.jump_to_next_cursor_location();
                    }
                    catch (error) {
                        this.log_error(error);
                    }
                }
            });
            this.addCommand({
                id: "create-new-note-from-template",
                name: "Create new note from template",
                hotkeys: [
                    {
                        modifiers: ["Alt"],
                        key: "n",
                    },
                ],
                callback: () => {
                    this.fuzzySuggest.create_new_note_from_template();
                }
            });
            this.app.workspace.onLayoutReady(() => {
                this.registerEvent(
                // TODO: Find a way to not trigger this on files copy
                this.app.vault.on("create", (file) => __awaiter(this, void 0, void 0, function* () {
                    // TODO: find a better way to do this
                    // Currently, I have to wait for the daily note plugin to add the file content before replacing
                    // Not a problem with Calendar however since it creates the file with the existing content
                    yield delay(300);
                    // ! This could corrupt binary files
                    if (!(file instanceof obsidian.TFile) || file.extension !== "md") {
                        return;
                    }
                    this.parser.replace_templates_and_overwrite_in_file(file);
                })));
            });
            this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
                if (file instanceof obsidian.TFolder) {
                    menu.addItem((item) => {
                        item.setTitle("Create new note from template")
                            .setIcon("templater-icon")
                            .onClick(evt => {
                            this.fuzzySuggest.create_new_note_from_template(file);
                        });
                    });
                }
            }));
            this.addSettingTab(new TemplaterSettingTab(this.app, this));
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    log_update(msg) {
        let notice = new obsidian.Notice("", 15000);
        // TODO: Find better way for this
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Templater update</b>: ${msg}`;
    }
    log_error(msg, error) {
        let notice = new obsidian.Notice("", 8000);
        if (error) {
            // TODO: Find a better way for this
            // @ts-ignore
            notice.noticeEl.innerHTML = `<b>Templater Error</b>: ${msg}<br/>Check console for more informations`;
            console.error(msg, error);
        }
        else {
            // @ts-ignore
            notice.noticeEl.innerHTML = `Templater Error: ${msg}`;
        }
    }
    dynamic_templates_processor(el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (el.textContent.contains("tp.dynamic")) {
                // TODO: This will not always be the active file, 
                // I need to use getFirstLinkpathDest and ctx to find the actual file
                let file = this.app.workspace.getActiveFile();
                yield this.parser.setCurrentContext(file, ContextMode.DYNAMIC);
                let new_html = yield this.parser.parseTemplates(el.innerHTML);
                el.innerHTML = new_html;
            }
        });
    }
}

module.exports = TemplaterPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9TZXR0aW5ncy50cyIsInNyYy9UZW1wbGF0ZXJGdXp6eVN1Z2dlc3QudHMiLCJub2RlX21vZHVsZXMvZXRhL2Rpc3QvYnJvd3Nlci9ldGEubWluLmpzIiwic3JjL1RQYXJzZXIudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvSW50ZXJuYWxNb2R1bGUudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvSW50ZXJuYWxVdGlscy50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy9kYXRlL0ludGVybmFsTW9kdWxlRGF0ZS50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy9maWxlL0ludGVybmFsTW9kdWxlRmlsZS50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy93ZWIvSW50ZXJuYWxNb2R1bGVXZWIudHMiLCJzcmMvSW50ZXJuYWxUZW1wbGF0ZXMvZnJvbnRtYXR0ZXIvSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlci50cyIsInNyYy9JbnRlcm5hbFRlbXBsYXRlcy9JbnRlcm5hbFRlbXBsYXRlUGFyc2VyLnRzIiwic3JjL1VzZXJUZW1wbGF0ZXMvVXNlclRlbXBsYXRlUGFyc2VyLnRzIiwic3JjL0N1cnNvckp1bXBlci50cyIsInNyYy9UZW1wbGF0ZVBhcnNlci50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmcm9tLmxlbmd0aCwgaiA9IHRvLmxlbmd0aDsgaSA8IGlsOyBpKyssIGorKylcclxuICAgICAgICB0b1tqXSA9IGZyb21baV07XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gJy4vbWFpbic7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBUZW1wbGF0ZXJTZXR0aW5ncyA9IHtcblx0Y29tbWFuZF90aW1lb3V0OiA1LFxuXHR0ZW1wbGF0ZV9mb2xkZXI6IFwiXCIsXG5cdHRlbXBsYXRlc19wYWlyczogW1tcIlwiLCBcIlwiXV0sXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlclNldHRpbmdzIHtcblx0Y29tbWFuZF90aW1lb3V0OiBudW1iZXI7XG5cdHRlbXBsYXRlX2ZvbGRlcjogc3RyaW5nO1xuXHR0ZW1wbGF0ZXNfcGFpcnM6IEFycmF5PFtzdHJpbmcsIHN0cmluZ10+O1xufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XG5cdH1cblxuXHRkaXNwbGF5KCk6IHZvaWQge1xuXHRcdGxldCB7Y29udGFpbmVyRWx9ID0gdGhpcztcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xuXG5cdFx0bGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cdFx0bGluay5ocmVmID0gXCJodHRwczovL3NpbGVudHZvaWQxMy5naXRodWIuaW8vVGVtcGxhdGVyL1wiO1xuXHRcdGxpbmsudGV4dCA9IFwiZG9jdW1lbnRhdGlvblwiO1xuXHRcdGZyYWdtZW50LmFwcGVuZChcIkNoZWNrIHRoZSBcIik7XG5cdFx0ZnJhZ21lbnQuYXBwZW5kKGxpbmspO1xuXHRcdGZyYWdtZW50LmFwcGVuZChcIiB0byBnZXQgYSBsaXN0IG9mIGFsbCB0aGUgYXZhaWxhYmxlIGludGVybmFsIHZhcmlhYmxlcyAvIGZ1bmN0aW9ucy5cIik7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiVGVtcGxhdGUgZm9sZGVyIGxvY2F0aW9uXCIpXG5cdFx0XHQuc2V0RGVzYyhcIkZpbGVzIGluIHRoaXMgZm9sZGVyIHdpbGwgYmUgYXZhaWxhYmxlIGFzIHRlbXBsYXRlcy5cIilcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4ge1xuXHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyIDEvZm9sZGVyIDJcIilcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyKVxuXHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X2ZvbGRlcikgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyID0gbmV3X2ZvbGRlcjtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJUaW1lb3V0XCIpXG5cdFx0XHQuc2V0RGVzYyhcIk1heGltdW0gdGltZW91dCBpbiBzZWNvbmRzIGZvciBhIHN5c3RlbSBjb21tYW5kLlwiKVxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB7XG5cdFx0XHRcdHRleHQuc2V0UGxhY2Vob2xkZXIoXCJUaW1lb3V0XCIpXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dC50b1N0cmluZygpKVxuXHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X3ZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgbmV3X3RpbWVvdXQgPSBOdW1iZXIobmV3X3ZhbHVlKTtcblx0XHRcdFx0XHRcdGlmIChpc05hTihuZXdfdGltZW91dCkpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4ubG9nX2Vycm9yKFwiVGltZW91dCBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21tYW5kX3RpbWVvdXQgPSBuZXdfdGltZW91dDtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHR9KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJJbnRlcm5hbCBWYXJpYWJsZXMgYW5kIEZ1bmN0aW9uc1wiKVxuXHRcdFx0LnNldERlc2MoZnJhZ21lbnQpO1xuXG5cdFx0bGV0IGkgPSAxO1xuXHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5mb3JFYWNoKCh0ZW1wbGF0ZV9wYWlyKSA9PiB7XG5cdFx0XHRsZXQgZGl2ID0gY29udGFpbmVyRWwuY3JlYXRlRWwoJ2RpdicpO1xuXHRcdFx0ZGl2LmFkZENsYXNzKFwidGVtcGxhdGVyX2RpdlwiKTtcblxuXHRcdFx0bGV0IHRpdGxlID0gY29udGFpbmVyRWwuY3JlYXRlRWwoJ2g0Jywge1xuXHRcdFx0XHR0ZXh0OiAnVXNlciBGdW5jdGlvbiBuwrAnICsgaSxcblx0XHRcdH0pO1xuXHRcdFx0dGl0bGUuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfdGl0bGVcIik7XG5cblx0XHRcdGxldCBzZXR0aW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHRcdC5hZGRFeHRyYUJ1dHRvbihleHRyYSA9PiB7XG5cdFx0XHRcdFx0ZXh0cmEuc2V0SWNvbihcImNyb3NzXCIpXG5cdFx0XHRcdFx0XHQuc2V0VG9vbHRpcChcIkRlbGV0ZVwiKVxuXHRcdFx0XHRcdFx0Lm9uQ2xpY2soKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRsZXQgaW5kZXggPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuaW5kZXhPZih0ZW1wbGF0ZV9wYWlyKTtcblx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0XHRcdFx0XHQvLyBGb3JjZSByZWZyZXNoXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5kaXNwbGF5KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5hZGRUZXh0KHRleHQgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IHQgPSB0ZXh0LnNldFBsYWNlaG9sZGVyKCdGdW5jdGlvbiBuYW1lJylcblx0XHRcdFx0XHRcdC5zZXRWYWx1ZSh0ZW1wbGF0ZV9wYWlyWzBdKVxuXHRcdFx0XHRcdFx0Lm9uQ2hhbmdlKChuZXdfdmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmluZGV4T2YodGVtcGxhdGVfcGFpcik7XG5cdFx0XHRcdFx0XHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzW2luZGV4XVswXSA9IG5ld192YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR0LmlucHV0RWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfdGVtcGxhdGVcIik7XG5cblx0XHRcdFx0XHRcdHJldHVybiB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KVxuXHRcdFx0XHQuYWRkVGV4dEFyZWEodGV4dCA9PiB7XG5cdFx0XHRcdFx0bGV0IHQgPSB0ZXh0LnNldFBsYWNlaG9sZGVyKCdTeXN0ZW0gQ29tbWFuZCcpXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRlbXBsYXRlX3BhaXJbMV0pXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKChuZXdfY21kKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgaW5kZXggPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuaW5kZXhPZih0ZW1wbGF0ZV9wYWlyKTtcblx0XHRcdFx0XHRcdGlmIChpbmRleCA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlyc1tpbmRleF1bMV0gPSBuZXdfY21kO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHQuaW5wdXRFbC5zZXRBdHRyKFwicm93c1wiLCA0KTtcblx0XHRcdFx0XHR0LmlucHV0RWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfY21kXCIpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHQ7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuXHRcdFx0ZGl2LmFwcGVuZENoaWxkKHRpdGxlKTtcblx0XHRcdGRpdi5hcHBlbmRDaGlsZChjb250YWluZXJFbC5sYXN0Q2hpbGQpO1xuXG5cdFx0XHRpKz0xO1xuXHRcdH0pO1xuXG5cdFx0bGV0IGRpdiA9IGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdkaXYnKTtcblx0XHRkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfZGl2MlwiKTtcblxuXHRcdGxldCBzZXR0aW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuYWRkQnV0dG9uKGJ1dHRvbiA9PiB7XG5cdFx0XHRcdGxldCBiID0gYnV0dG9uLnNldEJ1dHRvblRleHQoXCJBZGQgTmV3IFVzZXIgRnVuY3Rpb25cIikub25DbGljaygoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLnB1c2goW1wiXCIsIFwiXCJdKTtcblx0XHRcdFx0XHQvLyBGb3JjZSByZWZyZXNoXG5cdFx0XHRcdFx0dGhpcy5kaXNwbGF5KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRiLmJ1dHRvbkVsLmFkZENsYXNzKFwidGVtcGxhdGVyX2J1dHRvblwiKTtcblxuXHRcdFx0XHRyZXR1cm4gYjtcblx0XHRcdH0pO1xuXHRcdHNldHRpbmcuaW5mb0VsLnJlbW92ZSgpO1xuXG5cdFx0ZGl2LmFwcGVuZENoaWxkKGNvbnRhaW5lckVsLmxhc3RDaGlsZCk7XG5cdH1cbn0iLCJpbXBvcnQgeyBBcHAsIEZ1enp5U3VnZ2VzdE1vZGFsLCBURmlsZSwgVEZvbGRlciwgbm9ybWFsaXplUGF0aCwgVmF1bHQsIFRBYnN0cmFjdEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSAnLi9tYWluJztcblxuZXhwb3J0IGVudW0gT3Blbk1vZGUge1xuICAgIEluc2VydFRlbXBsYXRlLFxuICAgIENyZWF0ZU5vdGVUZW1wbGF0ZSxcbn07XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZXJGdXp6eVN1Z2dlc3RNb2RhbCBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPFRGaWxlPiB7XG4gICAgcHVibGljIGFwcDogQXBwO1xuICAgIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW47XG4gICAgcHJpdmF0ZSBvcGVuX21vZGU6IE9wZW5Nb2RlO1xuICAgIHByaXZhdGUgY3JlYXRpb25fZm9sZGVyOiBURm9sZGVyO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBnZXRJdGVtcygpOiBURmlsZVtdIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlX2ZpbGVzOiBURmlsZVtdID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlX2ZvbGRlciA9PT0gXCJcIikge1xuICAgICAgICAgICAgbGV0IGZpbGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZXMoKTtcbiAgICAgICAgICAgIHRlbXBsYXRlX2ZpbGVzID0gZmlsZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgdGVtcGxhdGVfZm9sZGVyX3N0ciA9IG5vcm1hbGl6ZVBhdGgodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVfZm9sZGVyKTtcblxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlX2ZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aCh0ZW1wbGF0ZV9mb2xkZXJfc3RyKTtcbiAgICAgICAgICAgIGlmICghdGVtcGxhdGVfZm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RlbXBsYXRlX2ZvbGRlcl9zdHJ9IGZvbGRlciBkb2Vzbid0IGV4aXN0YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoISAodGVtcGxhdGVfZm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlcikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGVtcGxhdGVfZm9sZGVyX3N0cn0gaXMgYSBmaWxlLCBub3QgYSBmb2xkZXJgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVmF1bHQucmVjdXJzZUNoaWxkcmVuKHRlbXBsYXRlX2ZvbGRlciwgKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlX2ZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRlbXBsYXRlX2ZpbGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5iYXNlbmFtZS5sb2NhbGVDb21wYXJlKGIuYmFzZW5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGVtcGxhdGVfZmlsZXM7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogVEZpbGUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaXRlbS5iYXNlbmFtZTtcbiAgICB9XG5cbiAgICBvbkNob29zZUl0ZW0oaXRlbTogVEZpbGUsIF9ldnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHN3aXRjaCh0aGlzLm9wZW5fbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5JbnNlcnRUZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5wYXJzZXIucmVwbGFjZV90ZW1wbGF0ZXNfYW5kX2FwcGVuZChpdGVtKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgT3Blbk1vZGUuQ3JlYXRlTm90ZVRlbXBsYXRlOlxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnBhcnNlci5jcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShpdGVtLCB0aGlzLmNyZWF0aW9uX2ZvbGRlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnNlcnRfdGVtcGxhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3Blbl9tb2RlID0gT3Blbk1vZGUuSW5zZXJ0VGVtcGxhdGU7XG5cbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgZmlsZSBpbiB0aGUgdGVtcGxhdGVzIGRpcmVjdG9yeSwgd2UgZG9uJ3Qgb3BlbiB0aGUgbW9kYWxcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBmaWxlcyA9IHRoaXMuZ2V0SXRlbXMoKTtcbiAgICAgICAgICAgIGlmIChmaWxlcy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnBhcnNlci5yZXBsYWNlX3RlbXBsYXRlc19hbmRfYXBwZW5kKGZpbGVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlX25ld19ub3RlX2Zyb21fdGVtcGxhdGUoZm9sZGVyPzogVEZvbGRlcikge1xuICAgICAgICB0aGlzLmNyZWF0aW9uX2ZvbGRlciA9IGZvbGRlcjtcblxuICAgICAgICB0aGlzLm9wZW5fbW9kZSA9IE9wZW5Nb2RlLkNyZWF0ZU5vdGVUZW1wbGF0ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmxvZ19lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KChlPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6ZXx8c2VsZikuRXRhPXt9KX0odGhpcywoZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlKXt2YXIgbixyLGk9bmV3IEVycm9yKGUpO3JldHVybiBuPWkscj10LnByb3RvdHlwZSxPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKG4scik6bi5fX3Byb3RvX189cixpfWZ1bmN0aW9uIG4oZSxuLHIpe3ZhciBpPW4uc2xpY2UoMCxyKS5zcGxpdCgvXFxuLyksYT1pLmxlbmd0aCxvPWlbYS0xXS5sZW5ndGgrMTt0aHJvdyB0KGUrPVwiIGF0IGxpbmUgXCIrYStcIiBjb2wgXCIrbytcIjpcXG5cXG4gIFwiK24uc3BsaXQoL1xcbi8pW2EtMV0rXCJcXG4gIFwiK0FycmF5KG8pLmpvaW4oXCIgXCIpK1wiXlwiKX10LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSx7bmFtZTp7dmFsdWU6XCJFdGEgRXJyb3JcIixlbnVtZXJhYmxlOiExfX0pO3ZhciByPW5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkuUHJvbWlzZTtmdW5jdGlvbiBpKGUsdCl7Zm9yKHZhciBuIGluIHQpcj10LGk9bixPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocixpKSYmKGVbbl09dFtuXSk7dmFyIHIsaTtyZXR1cm4gZX1mdW5jdGlvbiBhKGUsdCxuLHIpe3ZhciBpLGE7cmV0dXJuIEFycmF5LmlzQXJyYXkodC5hdXRvVHJpbSk/KGk9dC5hdXRvVHJpbVsxXSxhPXQuYXV0b1RyaW1bMF0pOmk9YT10LmF1dG9UcmltLChufHwhMT09PW4pJiYoaT1uKSwocnx8ITE9PT1yKSYmKGE9ciksYXx8aT9cInNsdXJwXCI9PT1pJiZcInNsdXJwXCI9PT1hP2UudHJpbSgpOihcIl9cIj09PWl8fFwic2x1cnBcIj09PWk/ZT1mdW5jdGlvbihlKXtyZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdD9lLnRyaW1MZWZ0KCk6ZS5yZXBsYWNlKC9eXFxzKy8sXCJcIil9KGUpOlwiLVwiIT09aSYmXCJubFwiIT09aXx8KGU9ZS5yZXBsYWNlKC9eKD86XFxyXFxufFxcbnxcXHIpLyxcIlwiKSksXCJfXCI9PT1hfHxcInNsdXJwXCI9PT1hP2U9ZnVuY3Rpb24oZSl7cmV0dXJuIFN0cmluZy5wcm90b3R5cGUudHJpbVJpZ2h0P2UudHJpbVJpZ2h0KCk6ZS5yZXBsYWNlKC9cXHMrJC8sXCJcIil9KGUpOlwiLVwiIT09YSYmXCJubFwiIT09YXx8KGU9ZS5yZXBsYWNlKC8oPzpcXHJcXG58XFxufFxccikkLyxcIlwiKSksZSk6ZX12YXIgbz17XCImXCI6XCImYW1wO1wiLFwiPFwiOlwiJmx0O1wiLFwiPlwiOlwiJmd0O1wiLCdcIic6XCImcXVvdDtcIixcIidcIjpcIiYjMzk7XCJ9O2Z1bmN0aW9uIHMoZSl7cmV0dXJuIG9bZV19dmFyIGw9L2AoPzpcXFxcW1xcc1xcU118XFwkeyg/Oltee31dfHsoPzpbXnt9XXx7W159XSp9KSp9KSp9fCg/IVxcJHspW15cXFxcYF0pKmAvZyxjPS8nKD86XFxcXFtcXHNcXHdcIidcXFxcYF18W15cXG5cXHInXFxcXF0pKj8nL2csdT0vXCIoPzpcXFxcW1xcc1xcd1wiJ1xcXFxgXXxbXlxcblxcclwiXFxcXF0pKj9cIi9nO2Z1bmN0aW9uIHAoZSl7cmV0dXJuIGUucmVwbGFjZSgvWy4qK1xcLT9eJHt9KCl8W1xcXVxcXFxdL2csXCJcXFxcJCZcIil9ZnVuY3Rpb24gZihlLHQpe3ZhciByPVtdLGk9ITEsbz0wLHM9dC5wYXJzZTtpZih0LnBsdWdpbnMpZm9yKHZhciBmPTA7Zjx0LnBsdWdpbnMubGVuZ3RoO2YrKyl7KFQ9dC5wbHVnaW5zW2ZdKS5wcm9jZXNzVGVtcGxhdGUmJihlPVQucHJvY2Vzc1RlbXBsYXRlKGUsdCkpfWZ1bmN0aW9uIGQoZSxuKXtlJiYoZT1hKGUsdCxpLG4pKSYmKGU9ZS5yZXBsYWNlKC9cXFxcfCcvZyxcIlxcXFwkJlwiKS5yZXBsYWNlKC9cXHJcXG58XFxufFxcci9nLFwiXFxcXG5cIiksci5wdXNoKGUpKX10LnJtV2hpdGVzcGFjZSYmKGU9ZS5yZXBsYWNlKC9bXFxyXFxuXSsvZyxcIlxcblwiKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSxcIlwiKSksbC5sYXN0SW5kZXg9MCxjLmxhc3RJbmRleD0wLHUubGFzdEluZGV4PTA7Zm9yKHZhciBnLGg9W3MuZXhlYyxzLmludGVycG9sYXRlLHMucmF3XS5yZWR1Y2UoKGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUmJnQ/ZStcInxcIitwKHQpOnQ/cCh0KTplfSksXCJcIiksbT1uZXcgUmVnRXhwKFwiKFteXSo/KVwiK3AodC50YWdzWzBdKStcIigtfF8pP1xcXFxzKihcIitoK1wiKT9cXFxccypcIixcImdcIiksdj1uZXcgUmVnRXhwKFwiJ3xcXFwifGB8XFxcXC9cXFxcKnwoXFxcXHMqKC18Xyk/XCIrcCh0LnRhZ3NbMV0pK1wiKVwiLFwiZ1wiKTtnPW0uZXhlYyhlKTspe289Z1swXS5sZW5ndGgrZy5pbmRleDt2YXIgeT1nWzFdLHg9Z1syXSxfPWdbM118fFwiXCI7ZCh5LHgpLHYubGFzdEluZGV4PW87Zm9yKHZhciB3PXZvaWQgMCxiPSExO3c9di5leGVjKGUpOyl7aWYod1sxXSl7dmFyIEU9ZS5zbGljZShvLHcuaW5kZXgpO20ubGFzdEluZGV4PW89di5sYXN0SW5kZXgsaT13WzJdLGI9e3Q6Xz09PXMuZXhlYz9cImVcIjpfPT09cy5yYXc/XCJyXCI6Xz09PXMuaW50ZXJwb2xhdGU/XCJpXCI6XCJcIix2YWw6RX07YnJlYWt9dmFyIEk9d1swXTtpZihcIi8qXCI9PT1JKXt2YXIgUj1lLmluZGV4T2YoXCIqL1wiLHYubGFzdEluZGV4KTstMT09PVImJm4oXCJ1bmNsb3NlZCBjb21tZW50XCIsZSx3LmluZGV4KSx2Lmxhc3RJbmRleD1SfWVsc2UgaWYoXCInXCI9PT1JKXtjLmxhc3RJbmRleD13LmluZGV4LGMuZXhlYyhlKT92Lmxhc3RJbmRleD1jLmxhc3RJbmRleDpuKFwidW5jbG9zZWQgc3RyaW5nXCIsZSx3LmluZGV4KX1lbHNlIGlmKCdcIic9PT1JKXt1Lmxhc3RJbmRleD13LmluZGV4LHUuZXhlYyhlKT92Lmxhc3RJbmRleD11Lmxhc3RJbmRleDpuKFwidW5jbG9zZWQgc3RyaW5nXCIsZSx3LmluZGV4KX1lbHNlIGlmKFwiYFwiPT09SSl7bC5sYXN0SW5kZXg9dy5pbmRleCxsLmV4ZWMoZSk/di5sYXN0SW5kZXg9bC5sYXN0SW5kZXg6bihcInVuY2xvc2VkIHN0cmluZ1wiLGUsdy5pbmRleCl9fWI/ci5wdXNoKGIpOm4oXCJ1bmNsb3NlZCB0YWdcIixlLGcuaW5kZXgreS5sZW5ndGgpfWlmKGQoZS5zbGljZShvLGUubGVuZ3RoKSwhMSksdC5wbHVnaW5zKWZvcihmPTA7Zjx0LnBsdWdpbnMubGVuZ3RoO2YrKyl7dmFyIFQ7KFQ9dC5wbHVnaW5zW2ZdKS5wcm9jZXNzQVNUJiYocj1ULnByb2Nlc3NBU1Qocix0KSl9cmV0dXJuIHJ9ZnVuY3Rpb24gZChlLHQpe3ZhciBuPWYoZSx0KSxyPVwidmFyIHRSPScnLF9fbCxfX2xQXCIrKHQuaW5jbHVkZT9cIixpbmNsdWRlPUUuaW5jbHVkZS5iaW5kKEUpXCI6XCJcIikrKHQuaW5jbHVkZUZpbGU/XCIsaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpXCI6XCJcIikrXCJcXG5mdW5jdGlvbiBsYXlvdXQocCxkKXtfX2w9cDtfX2xQPWR9XFxuXCIrKHQuZ2xvYmFsQXdhaXQ/XCJsZXQgcHJzID0gW107XFxuXCI6XCJcIikrKHQudXNlV2l0aD9cIndpdGgoXCIrdC52YXJOYW1lK1wifHx7fSl7XCI6XCJcIikrZnVuY3Rpb24oZSx0KXt2YXIgbixyPWUubGVuZ3RoLGk9XCJcIjtpZih0Lmdsb2JhbEF3YWl0KXtmb3Iobj0wO248cjtuKyspe2lmKFwic3RyaW5nXCIhPXR5cGVvZihvPWVbbl0pKWlmKFwiclwiPT09KHM9by50KXx8XCJpXCI9PT1zKWkrPVwicHJzLnB1c2goXCIrKGw9by52YWx8fFwiXCIpK1wiKTtcXG5cIn1pKz1cImxldCByc3QgPSBhd2FpdCBQcm9taXNlLmFsbChwcnMpO1xcblwifXZhciBhPTA7Zm9yKG49MDtuPHI7bisrKXt2YXIgbztpZihcInN0cmluZ1wiPT10eXBlb2Yobz1lW25dKSl7aSs9XCJ0Uis9J1wiK28rXCInXFxuXCJ9ZWxzZXt2YXIgcz1vLnQsbD1vLnZhbHx8XCJcIjtcInJcIj09PXM/KHQuZ2xvYmFsQXdhaXQmJihsPVwicnN0W1wiK2ErXCJdXCIpLHQuZmlsdGVyJiYobD1cIkUuZmlsdGVyKFwiK2wrXCIpXCIpLGkrPVwidFIrPVwiK2wrXCJcXG5cIixhKyspOlwiaVwiPT09cz8odC5nbG9iYWxBd2FpdCYmKGw9XCJyc3RbXCIrYStcIl1cIiksdC5maWx0ZXImJihsPVwiRS5maWx0ZXIoXCIrbCtcIilcIiksdC5hdXRvRXNjYXBlJiYobD1cIkUuZShcIitsK1wiKVwiKSxpKz1cInRSKz1cIitsK1wiXFxuXCIsYSsrKTpcImVcIj09PXMmJihpKz1sK1wiXFxuXCIpfX1yZXR1cm4gaX0obix0KSsodC5pbmNsdWRlRmlsZT9cImlmKF9fbCl0Uj1cIisodC5hc3luYz9cImF3YWl0IFwiOlwiXCIpK1wiaW5jbHVkZUZpbGUoX19sLE9iamVjdC5hc3NpZ24oXCIrdC52YXJOYW1lK1wiLHtib2R5OnRSfSxfX2xQKSlcXG5cIjp0LmluY2x1ZGU/XCJpZihfX2wpdFI9XCIrKHQuYXN5bmM/XCJhd2FpdCBcIjpcIlwiKStcImluY2x1ZGUoX19sLE9iamVjdC5hc3NpZ24oXCIrdC52YXJOYW1lK1wiLHtib2R5OnRSfSxfX2xQKSlcXG5cIjpcIlwiKStcImlmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSXCIrKHQudXNlV2l0aD9cIn1cIjpcIlwiKTtpZih0LnBsdWdpbnMpZm9yKHZhciBpPTA7aTx0LnBsdWdpbnMubGVuZ3RoO2krKyl7dmFyIGE9dC5wbHVnaW5zW2ldO2EucHJvY2Vzc0ZuU3RyaW5nJiYocj1hLnByb2Nlc3NGblN0cmluZyhyLHQpKX1yZXR1cm4gcn12YXIgZz1uZXcoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUpe3RoaXMuY2FjaGU9ZX1yZXR1cm4gZS5wcm90b3R5cGUuZGVmaW5lPWZ1bmN0aW9uKGUsdCl7dGhpcy5jYWNoZVtlXT10fSxlLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuY2FjaGVbZV19LGUucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihlKXtkZWxldGUgdGhpcy5jYWNoZVtlXX0sZS5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLmNhY2hlPXt9fSxlLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGUpe2kodGhpcy5jYWNoZSxlKX0sZX0oKSkoe30pO3ZhciBoPXthc3luYzohMSxhdXRvRXNjYXBlOiEwLGF1dG9UcmltOlshMSxcIm5sXCJdLGNhY2hlOiExLGU6ZnVuY3Rpb24oZSl7dmFyIHQ9U3RyaW5nKGUpO3JldHVybi9bJjw+XCInXS8udGVzdCh0KT90LnJlcGxhY2UoL1smPD5cIiddL2cscyk6dH0saW5jbHVkZTpmdW5jdGlvbihlLG4pe3ZhciByPXRoaXMudGVtcGxhdGVzLmdldChlKTtpZighcil0aHJvdyB0KCdDb3VsZCBub3QgZmV0Y2ggdGVtcGxhdGUgXCInK2UrJ1wiJyk7cmV0dXJuIHIobix0aGlzKX0scGFyc2U6e2V4ZWM6XCJcIixpbnRlcnBvbGF0ZTpcIj1cIixyYXc6XCJ+XCJ9LHBsdWdpbnM6W10scm1XaGl0ZXNwYWNlOiExLHRhZ3M6W1wiPCVcIixcIiU+XCJdLHRlbXBsYXRlczpnLHVzZVdpdGg6ITEsdmFyTmFtZTpcIml0XCJ9O2Z1bmN0aW9uIG0oZSx0KXt2YXIgbj17fTtyZXR1cm4gaShuLGgpLHQmJmkobix0KSxlJiZpKG4sZSksbn1mdW5jdGlvbiB2KGUsbil7dmFyIHI9bShufHx7fSksaT1yLmFzeW5jP2Z1bmN0aW9uKCl7dHJ5e3JldHVybiBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gKGFzeW5jIGZ1bmN0aW9uKCl7fSkuY29uc3RydWN0b3JcIikoKX1jYXRjaChlKXt0aHJvdyBlIGluc3RhbmNlb2YgU3ludGF4RXJyb3I/dChcIlRoaXMgZW52aXJvbm1lbnQgZG9lc24ndCBzdXBwb3J0IGFzeW5jL2F3YWl0XCIpOmV9fSgpOkZ1bmN0aW9uO3RyeXtyZXR1cm4gbmV3IGkoci52YXJOYW1lLFwiRVwiLFwiY2JcIixkKGUscikpfWNhdGNoKG4pe3Rocm93IG4gaW5zdGFuY2VvZiBTeW50YXhFcnJvcj90KFwiQmFkIHRlbXBsYXRlIHN5bnRheFxcblxcblwiK24ubWVzc2FnZStcIlxcblwiK0FycmF5KG4ubWVzc2FnZS5sZW5ndGgrMSkuam9pbihcIj1cIikrXCJcXG5cIitkKGUscikrXCJcXG5cIik6bn19ZnVuY3Rpb24geShlLHQpe2lmKHQuY2FjaGUmJnQubmFtZSYmdC50ZW1wbGF0ZXMuZ2V0KHQubmFtZSkpcmV0dXJuIHQudGVtcGxhdGVzLmdldCh0Lm5hbWUpO3ZhciBuPVwiZnVuY3Rpb25cIj09dHlwZW9mIGU/ZTp2KGUsdCk7cmV0dXJuIHQuY2FjaGUmJnQubmFtZSYmdC50ZW1wbGF0ZXMuZGVmaW5lKHQubmFtZSxuKSxufWZ1bmN0aW9uIHgoZSxuLGksYSl7dmFyIG89bShpfHx7fSk7aWYoIW8uYXN5bmMpcmV0dXJuIHkoZSxvKShuLG8pO2lmKCFhKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiByKXJldHVybiBuZXcgcigoZnVuY3Rpb24odCxyKXt0cnl7dCh5KGUsbykobixvKSl9Y2F0Y2goZSl7cihlKX19KSk7dGhyb3cgdChcIlBsZWFzZSBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24sIHRoaXMgZW52IGRvZXNuJ3Qgc3VwcG9ydCBQcm9taXNlc1wiKX10cnl7eShlLG8pKG4sbyxhKX1jYXRjaChlKXtyZXR1cm4gYShlKX19ZS5jb21waWxlPXYsZS5jb21waWxlVG9TdHJpbmc9ZCxlLmNvbmZpZz1oLGUuY29uZmlndXJlPWZ1bmN0aW9uKGUpe3JldHVybiBpKGgsZSl9LGUuZGVmYXVsdENvbmZpZz1oLGUuZ2V0Q29uZmlnPW0sZS5wYXJzZT1mLGUucmVuZGVyPXgsZS5yZW5kZXJBc3luYz1mdW5jdGlvbihlLHQsbixyKXtyZXR1cm4geChlLHQsT2JqZWN0LmFzc2lnbih7fSxuLHthc3luYzohMH0pLHIpfSxlLnRlbXBsYXRlcz1nLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXRhLm1pbi5qcy5tYXBcbiIsImltcG9ydCB7IEFwcCwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykgKTtcbn07XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHApIHt9XG4gICAgYWJzdHJhY3QgZ2VuZXJhdGVDb250ZXh0KGZpbGU6IFRGaWxlKTogUHJvbWlzZTxhbnk+O1xufSIsImltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IEFwcCwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFRQYXJzZXIgfSBmcm9tIFwiVFBhcnNlclwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW50ZXJuYWxNb2R1bGUgZXh0ZW5kcyBUUGFyc2VyIHtcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgbmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBzdGF0aWNfdGVtcGxhdGVzOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcCgpO1xuICAgIHByb3RlY3RlZCBkeW5hbWljX3RlbXBsYXRlczogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKTtcbiAgICBwcm90ZWN0ZWQgZmlsZTogVEZpbGU7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJvdGVjdGVkIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgfVxuXG4gICAgZ2V0TmFtZSgpOiBTdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lXG4gICAgfVxuXG4gICAgYWJzdHJhY3QgY3JlYXRlU3RhdGljVGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD47XG4gICAgYWJzdHJhY3QgdXBkYXRlVGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD47XG5cbiAgICBhc3luYyBnZW5lcmF0ZUNvbnRleHQoZmlsZTogVEZpbGUpIHtcbiAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcblxuICAgICAgICBpZiAodGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNpemUgPT09IDApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlU3RhdGljVGVtcGxhdGVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy51cGRhdGVUZW1wbGF0ZXMoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKHRoaXMuc3RhdGljX3RlbXBsYXRlcyksXG4gICAgICAgICAgICAuLi5PYmplY3QuZnJvbUVudHJpZXModGhpcy5keW5hbWljX3RlbXBsYXRlcyksXG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGZ1bmN0aW9uIGdldF9kYXRlX3N0cmluZyhkYXRlX2Zvcm1hdDogc3RyaW5nLCBkYXlzPzogbnVtYmVyLCBtb21lbnRfc3RyPzogc3RyaW5nIHwgbnVtYmVyLCBtb21lbnRfZm9ybWF0Pzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5tb21lbnQobW9tZW50X3N0ciwgbW9tZW50X2Zvcm1hdCkuYWRkKGRheXMsICdkYXlzJykuZm9ybWF0KGRhdGVfZm9ybWF0KTtcbn1cblxuZXhwb3J0IGNvbnN0IFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURSA9IFwiRXJyb3JfTW9iaWxlVW5zdXBwb3J0ZWRUZW1wbGF0ZVwiOyIsImltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBnZXRfZGF0ZV9zdHJpbmcgfSBmcm9tIFwiLi4vSW50ZXJuYWxVdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVEYXRlIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIG5hbWUgPSBcImRhdGVcIjtcblxuICAgIGFzeW5jIGNyZWF0ZVN0YXRpY1RlbXBsYXRlcygpIHtcbiAgICAgICAgdGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNldChcIm5vd1wiLCB0aGlzLmdlbmVyYXRlX25vdygpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNldChcInRvbW9ycm93XCIsIHRoaXMuZ2VuZXJhdGVfdG9tb3Jyb3coKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX3RlbXBsYXRlcy5zZXQoXCJ5ZXN0ZXJkYXlcIiwgdGhpcy5nZW5lcmF0ZV95ZXN0ZXJkYXkoKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlVGVtcGxhdGVzKCkge31cblxuICAgIGdlbmVyYXRlX25vdygpIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERFwiLCBvZmZzZXQ/OiBudW1iZXIsIHJlZmVyZW5jZT86IHN0cmluZywgcmVmZXJlbmNlX2Zvcm1hdD86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSAmJiAhd2luZG93Lm1vbWVudChyZWZlcmVuY2UsIHJlZmVyZW5jZV9mb3JtYXQpLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGl0bGUgZGF0ZSBmb3JtYXQsIHRyeSBzcGVjaWZ5aW5nIG9uZSB3aXRoIHRoZSBhcmd1bWVudCAncmVmZXJlbmNlJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnZXRfZGF0ZV9zdHJpbmcoZm9ybWF0LCBvZmZzZXQsIHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV90b21vcnJvdygpIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERFwiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0X2RhdGVfc3RyaW5nKGZvcm1hdCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV95ZXN0ZXJkYXkoKSB7XG4gICAgICAgIHJldHVybiAoZm9ybWF0OiBzdHJpbmcgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGdldF9kYXRlX3N0cmluZyhmb3JtYXQsIC0xKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuaW1wb3J0IHsgZ2V0X2RhdGVfc3RyaW5nLCBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgfSBmcm9tIFwiLi4vSW50ZXJuYWxVdGlsc1wiO1xuXG5pbXBvcnQgeyBGaWxlU3lzdGVtQWRhcHRlciwgZ2V0QWxsVGFncywgTWFya2Rvd25WaWV3LCBub3JtYWxpemVQYXRoLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgY29uc3QgREVQVEhfTElNSVQgPSAxMDtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlRmlsZSBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBuYW1lID0gXCJmaWxlXCI7XG4gICAgcHJpdmF0ZSBpbmNsdWRlX2RlcHRoOiBudW1iZXIgPSAwO1xuXG4gICAgYXN5bmMgY3JlYXRlU3RhdGljVGVtcGxhdGVzKCkge1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwiY2xpcGJvYXJkXCIsIHRoaXMuZ2VuZXJhdGVfY2xpcGJvYXJkKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwiY3Vyc29yXCIsIHRoaXMuZ2VuZXJhdGVfY3Vyc29yKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwic2VsZWN0aW9uXCIsIHRoaXMuZ2VuZXJhdGVfc2VsZWN0aW9uKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVRlbXBsYXRlcygpIHtcbiAgICAgICAgdGhpcy5keW5hbWljX3RlbXBsYXRlcy5zZXQoXCJjb250ZW50XCIsIGF3YWl0IHRoaXMuZ2VuZXJhdGVfY29udGVudCgpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX3RlbXBsYXRlcy5zZXQoXCJjcmVhdGlvbl9kYXRlXCIsIHRoaXMuZ2VuZXJhdGVfY3JlYXRpb25fZGF0ZSgpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX3RlbXBsYXRlcy5zZXQoXCJmb2xkZXJcIiwgdGhpcy5nZW5lcmF0ZV9mb2xkZXIoKSk7XG4gICAgICAgIHRoaXMuZHluYW1pY190ZW1wbGF0ZXMuc2V0KFwiaW5jbHVkZVwiLCB0aGlzLmdlbmVyYXRlX2luY2x1ZGUoKSk7XG4gICAgICAgIHRoaXMuZHluYW1pY190ZW1wbGF0ZXMuc2V0KFwibGFzdF9tb2RpZmllZF9kYXRlXCIsIHRoaXMuZ2VuZXJhdGVfbGFzdF9tb2RpZmllZF9kYXRlKCkpO1xuICAgICAgICB0aGlzLmR5bmFtaWNfdGVtcGxhdGVzLnNldChcInBhdGhcIiwgdGhpcy5nZW5lcmF0ZV9wYXRoKCkpO1xuICAgICAgICB0aGlzLmR5bmFtaWNfdGVtcGxhdGVzLnNldChcInJlbmFtZVwiLCB0aGlzLmdlbmVyYXRlX3JlbmFtZSgpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX3RlbXBsYXRlcy5zZXQoXCJ0YWdzXCIsIHRoaXMuZ2VuZXJhdGVfdGFncygpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX3RlbXBsYXRlcy5zZXQoXCJ0aXRsZVwiLCB0aGlzLmdlbmVyYXRlX3RpdGxlKCkpO1xuXG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY2xpcGJvYXJkKCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2N1cnNvcigpIHtcbiAgICAgICAgcmV0dXJuIChvcmRlcj86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgLy8gSGFjayB0byBwcmV2ZW50IGVtcHR5IG91dHB1dFxuICAgICAgICAgICAgcmV0dXJuIGA8JSB0cC5maWxlLmN1cnNvcigke29yZGVyID8/ICcnfSkgJT5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfY29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGhpcy5maWxlKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9jcmVhdGlvbl9kYXRlKCkge1xuICAgICAgICByZXR1cm4gKGZvcm1hdDogc3RyaW5nID0gXCJZWVlZLU1NLUREIEhIOm1tXCIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRfZGF0ZV9zdHJpbmcoZm9ybWF0LCB1bmRlZmluZWQsIHRoaXMuZmlsZS5zdGF0LmN0aW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2ZvbGRlcigpIHtcbiAgICAgICAgcmV0dXJuIChyZWxhdGl2ZTogYm9vbGVhbiA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5maWxlLnBhcmVudDtcbiAgICAgICAgICAgIGxldCBmb2xkZXI7XG5cbiAgICAgICAgICAgIGlmIChyZWxhdGl2ZSkge1xuICAgICAgICAgICAgICAgIGZvbGRlciA9IHBhcmVudC5wYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9sZGVyID0gcGFyZW50Lm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmb2xkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9pbmNsdWRlKCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKGluY2x1ZGVfZmlsZW5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgbGV0IGluY19maWxlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChub3JtYWxpemVQYXRoKGluY2x1ZGVfZmlsZW5hbWUpLCBcIlwiKTtcbiAgICAgICAgICAgIGlmICghaW5jX2ZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGUgJHtpbmNsdWRlX2ZpbGVuYW1lfSBkb2Vzbid0IGV4aXN0YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShpbmNfZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtpbmNsdWRlX2ZpbGVuYW1lfSBpcyBhIGZvbGRlciwgbm90IGEgZmlsZWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUT0RPOiBBZGQgbXV0ZXggZm9yIHRoaXMsIHRoaXMgbWF5IGN1cnJlbnRseSBsZWFkIHRvIGEgcmFjZSBjb25kaXRpb24uIFxuICAgICAgICAgICAgLy8gV2hpbGUgbm90IHZlcnkgaW1wYWN0ZnVsLCB0aGF0IGNvdWxkIHN0aWxsIGJlIGFubm95aW5nLlxuICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlX2RlcHRoID4gREVQVEhfTElNSVQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggPSAwO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlJlYWNoZWQgaW5jbHVzaW9uIGRlcHRoIGxpbWl0IChtYXggPSAxMClcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpbmNfZmlsZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChpbmNfZmlsZSk7XG4gICAgICAgICAgICBsZXQgcGFyc2VkX2NvbnRlbnQgPSBhd2FpdCB0aGlzLnBsdWdpbi5wYXJzZXIucGFyc2VUZW1wbGF0ZXMoaW5jX2ZpbGVfY29udGVudCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaW5jbHVkZV9kZXB0aCAtPSAxO1xuICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBwYXJzZWRfY29udGVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2xhc3RfbW9kaWZpZWRfZGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERCBISDptbVwiKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRfZGF0ZV9zdHJpbmcoZm9ybWF0LCB1bmRlZmluZWQsIHRoaXMuZmlsZS5zdGF0Lm10aW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3BhdGgoKSB7XG4gICAgICAgIHJldHVybiAocmVsYXRpdmU6IGJvb2xlYW4gPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEodGhpcy5hcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2YXVsdF9wYXRoID0gdGhpcy5hcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuXG4gICAgICAgICAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlLnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dmF1bHRfcGF0aH0vJHt0aGlzLmZpbGUucGF0aH1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcmVuYW1lKCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKG5ld190aXRsZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3X3BhdGggPSBub3JtYWxpemVQYXRoKGAke3RoaXMuZmlsZS5wYXJlbnQucGF0aH0vJHtuZXdfdGl0bGV9LiR7dGhpcy5maWxlLmV4dGVuc2lvbn1gKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnJlbmFtZUZpbGUodGhpcy5maWxlLCBuZXdfcGF0aCk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3NlbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjdGl2ZSB2aWV3IGlzIG51bGxcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgICAgICByZXR1cm4gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfdGFncygpIHtcbiAgICAgICAgbGV0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUodGhpcy5maWxlKTtcbiAgICAgICAgcmV0dXJuIGdldEFsbFRhZ3MoY2FjaGUpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3RpdGxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlLmJhc2VuYW1lO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVXZWIgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgbmFtZSA9IFwid2ViXCI7XG5cbiAgICBhc3luYyBjcmVhdGVTdGF0aWNUZW1wbGF0ZXMoKSB7XG4gICAgICAgIHRoaXMuc3RhdGljX3RlbXBsYXRlcy5zZXQoXCJkYWlseV9xdW90ZVwiLCB0aGlzLmdlbmVyYXRlX2RhaWx5X3F1b3RlKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY190ZW1wbGF0ZXMuc2V0KFwicmFuZG9tX3BpY3R1cmVcIiwgdGhpcy5nZW5lcmF0ZV9yYW5kb21fcGljdHVyZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfdGVtcGxhdGVzLnNldChcImdldF9yZXF1ZXN0XCIsIHRoaXMuZ2VuZXJhdGVfZ2V0X3JlcXVlc3QoKSk7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHVwZGF0ZVRlbXBsYXRlcygpIHt9XG5cbiAgICBhc3luYyBnZXRSZXF1ZXN0KHVybDogc3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBwZXJmb3JtaW5nIEdFVCByZXF1ZXN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9kYWlseV9xdW90ZSgpIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdChcImh0dHBzOi8vcXVvdGVzLnJlc3QvcW9kXCIpO1xuICAgICAgICAgICAgbGV0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICAgICAgICAgIGxldCBhdXRob3IgPSBqc29uLmNvbnRlbnRzLnF1b3Rlc1swXS5hdXRob3I7XG4gICAgICAgICAgICBsZXQgcXVvdGUgPSBqc29uLmNvbnRlbnRzLnF1b3Rlc1swXS5xdW90ZTtcbiAgICAgICAgICAgIGxldCBuZXdfY29udGVudCA9IGA+ICR7cXVvdGV9XFxuPiAmbWRhc2g7IDxjaXRlPiR7YXV0aG9yfTwvY2l0ZT5gO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3X2NvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9yYW5kb21fcGljdHVyZSgpIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIChzaXplOiBzdHJpbmcgPSBcIjE2MDB4OTAwXCIsIHF1ZXJ5Pzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldFJlcXVlc3QoYGh0dHBzOi8vc291cmNlLnVuc3BsYXNoLmNvbS9yYW5kb20vJHtzaXplfT8ke3F1ZXJ5fWApO1xuICAgICAgICAgICAgbGV0IHVybCA9IHJlc3BvbnNlLnVybDtcbiAgICAgICAgICAgIHJldHVybiBgIVt0cC53ZWIucmFuZG9tX3BpY3R1cmVdKCR7dXJsfSlgOyAgIFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZ2V0X3JlcXVlc3QoKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdCh1cmwpO1xuICAgICAgICAgICAgbGV0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlciBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBuYW1lID0gXCJmcm9udG1hdHRlclwiO1xuXG4gICAgYXN5bmMgY3JlYXRlU3RhdGljVGVtcGxhdGVzKCkge31cblxuICAgIGFzeW5jIHVwZGF0ZVRlbXBsYXRlcygpIHtcbiAgICAgICAgbGV0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUodGhpcy5maWxlKVxuICAgICAgICB0aGlzLmR5bmFtaWNfdGVtcGxhdGVzID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhjYWNoZS5mcm9udG1hdHRlciB8fCB7fSkpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBcHAsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IEludGVybmFsTW9kdWxlRGF0ZSB9IGZyb20gXCIuL2RhdGUvSW50ZXJuYWxNb2R1bGVEYXRlXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZUZpbGUgfSBmcm9tIFwiLi9maWxlL0ludGVybmFsTW9kdWxlRmlsZVwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVXZWIgfSBmcm9tIFwiLi93ZWIvSW50ZXJuYWxNb2R1bGVXZWJcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlRnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi9mcm9udG1hdHRlci9JbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBUUGFyc2VyIH0gZnJvbSBcIlRQYXJzZXJcIjtcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsVGVtcGxhdGVQYXJzZXIgZXh0ZW5kcyBUUGFyc2VyIHtcbiAgICBwcml2YXRlIG1vZHVsZXNfYXJyYXk6IEFycmF5PEludGVybmFsTW9kdWxlPiA9IG5ldyBBcnJheSgpO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5jcmVhdGVNb2R1bGVzKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlTW9kdWxlcygpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRGF0ZSh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRmlsZSh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlV2ViKHRoaXMuYXBwLCB0aGlzLnBsdWdpbikpO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChuZXcgSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZUNvbnRleHQoZjogVEZpbGUpIHtcbiAgICAgICAgbGV0IG1vZHVsZXNfY29udGV4dF9tYXAgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgZm9yIChsZXQgbW9kIG9mIHRoaXMubW9kdWxlc19hcnJheSkge1xuICAgICAgICAgICAgbW9kdWxlc19jb250ZXh0X21hcC5zZXQobW9kLmdldE5hbWUoKSwgYXdhaXQgbW9kLmdlbmVyYXRlQ29udGV4dChmKSk7XG4gICAgICAgIH1cblxuICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMobW9kdWxlc19jb250ZXh0X21hcCk7XG4gICAgfVxufSIsImltcG9ydCB7IEFwcCwgRmlsZVN5c3RlbUFkYXB0ZXIsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGV4ZWMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIjtcblxuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgQ29udGV4dE1vZGUgfSBmcm9tIFwiVGVtcGxhdGVQYXJzZXJcIjtcbmltcG9ydCB7IFRQYXJzZXIgfSBmcm9tIFwiVFBhcnNlclwiO1xuXG5leHBvcnQgY2xhc3MgVXNlclRlbXBsYXRlUGFyc2VyIGV4dGVuZHMgVFBhcnNlciB7XG4gICAgY3dkOiBzdHJpbmc7XG4gICAgY21kX29wdGlvbnM6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMucmVzb2x2ZUN3ZCgpOyAgICAgICAgXG4gICAgfVxuXG4gICAgcmVzb2x2ZUN3ZCgpIHtcbiAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgIGlmICh0aGlzLmFwcC5pc01vYmlsZSB8fCAhKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgaW5zdGFuY2VvZiBGaWxlU3lzdGVtQWRhcHRlcikpIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gdGhpcy5hcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVVc2VyVGVtcGxhdGVzKGZpbGU6IFRGaWxlKSB7XG4gICAgICAgIGxldCB1c2VyX3RlbXBsYXRlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgZXhlY19wcm9taXNlID0gcHJvbWlzaWZ5KGV4ZWMpO1xuXG4gICAgICAgIGxldCBjb250ZXh0ID0gYXdhaXQgdGhpcy5wbHVnaW4ucGFyc2VyLmdlbmVyYXRlQ29udGV4dChmaWxlLCBDb250ZXh0TW9kZS5JTlRFUk5BTCk7XG5cbiAgICAgICAgZm9yIChsZXQgW3RlbXBsYXRlLCBjbWRdIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycykge1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlID09PSBcIlwiIHx8IGNtZCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbWQgPSBhd2FpdCB0aGlzLnBsdWdpbi5wYXJzZXIucGFyc2VUZW1wbGF0ZXMoY21kLCBjb250ZXh0KTtcblxuICAgICAgICAgICAgdXNlcl90ZW1wbGF0ZXMuc2V0KHRlbXBsYXRlLCBhc3luYyAodXNlcl9hcmdzPzogYW55KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvY2Vzc19lbnYgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnVzZXJfYXJncyxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgY21kX29wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21tYW5kX3RpbWVvdXQgKiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3dkOiB0aGlzLmN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudjogcHJvY2Vzc19lbnYsXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHtzdGRvdXR9ID0gYXdhaXQgZXhlY19wcm9taXNlKGNtZCwgY21kX29wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3Rkb3V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfZXJyb3IoYEVycm9yIHdpdGggVXNlciBUZW1wbGF0ZSAke3RlbXBsYXRlfWAsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1c2VyX3RlbXBsYXRlcztcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZUNvbnRleHQoZmlsZTogVEZpbGUpIHtcbiAgICAgICAgbGV0IHVzZXJfdGVtcGxhdGVzID0gYXdhaXQgdGhpcy5nZW5lcmF0ZVVzZXJUZW1wbGF0ZXMoZmlsZSk7XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXModXNlcl90ZW1wbGF0ZXMpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBcHAsIEVkaXRvclBvc2l0aW9uLCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGNsYXNzIEN1cnNvckp1bXBlciB7XG4gICAgcHJpdmF0ZSBjdXJzb3JfcmVnZXggPSBuZXcgUmVnRXhwKFwiPCVcXFxccyp0cC5maWxlLmN1cnNvclxcXFwoKD88b3JkZXI+WzAtOV17MCwyfSlcXFxcKVxcXFxzKiU+XCIsIFwiZ1wiKTtcdFxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAgIGFzeW5jIGp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKSB7XG4gICAgICAgIGxldCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmIChhY3RpdmVfdmlldyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gYWN0aXZlIHZpZXcsIGNhbid0IGFwcGVuZCB0ZW1wbGF0ZXMuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhY3RpdmVfZmlsZSA9IGFjdGl2ZV92aWV3LmZpbGU7XG4gICAgICAgIGF3YWl0IGFjdGl2ZV92aWV3LnNhdmUoKTtcblxuICAgICAgICBsZXQgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoYWN0aXZlX2ZpbGUpO1xuXG4gICAgICAgIGNvbnN0IHttYXRjaF9zdHJpbmcsIHBvc30gPSB0aGlzLmdldF9jdXJzb3JfcG9zaXRpb24oY29udGVudCk7XG4gICAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UobWF0Y2hfc3RyaW5nLCBcIlwiKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShhY3RpdmVfZmlsZSwgY29udGVudCk7XG4gICAgICAgICAgICB0aGlzLnNldF9jdXJzb3JfbG9jYXRpb24ocG9zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldF9jdXJzb3JfcG9zaXRpb24oY29udGVudDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBjdXJzb3JfbWF0Y2hlcyA9IFtdO1xuICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgIHdoaWxlKChtYXRjaCA9IHRoaXMuY3Vyc29yX3JlZ2V4LmV4ZWMoY29udGVudCkpICE9IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnNvcl9tYXRjaGVzLnB1c2gobWF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJzb3JfbWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnNvcl9tYXRjaGVzLnNvcnQoKG0xLCBtMikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlcihtMS5ncm91cHNbXCJvcmRlclwiXSkgLSBOdW1iZXIobTIuZ3JvdXBzW1wib3JkZXJcIl0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgbWF0Y2hfc3RyID0gY3Vyc29yX21hdGNoZXNbMF1bMF07XG4gICAgICAgIGxldCBpbmRleCA9IGN1cnNvcl9tYXRjaGVzWzBdLmluZGV4O1xuXG4gICAgICAgIGxldCBzdWJzdHIgPSBjb250ZW50LnN1YnN0cigwLCBpbmRleCk7XG5cbiAgICAgICAgbGV0IGwgPSAwO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gLTE7XG4gICAgICAgIGxldCByID0gLTE7XG4gICAgICAgIGZvciAoOyAociA9IHN1YnN0ci5pbmRleE9mKFwiXFxuXCIsIHIrMSkpICE9PSAtMSA7IGwrKywgb2Zmc2V0PXIpO1xuICAgICAgICBvZmZzZXQgKz0gMTtcblxuICAgICAgICBsZXQgY2ggPSBjb250ZW50LnN1YnN0cihvZmZzZXQsIGluZGV4LW9mZnNldCkubGVuZ3RoO1xuICAgICAgICBsZXQgcG9zID0ge2xpbmU6IGwsIGNoOiBjaH07XG5cbiAgICAgICAgcmV0dXJuIHttYXRjaF9zdHJpbmc6IG1hdGNoX3N0ciwgcG9zOiBwb3N9O1xuICAgIH1cblxuICAgIHNldF9jdXJzb3JfbG9jYXRpb24ocG9zOiBFZGl0b3JQb3NpdGlvbikge1xuICAgICAgICBsZXQgYWN0aXZlX3ZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZWRpdG9yID0gYWN0aXZlX3ZpZXcuZWRpdG9yO1xuXG4gICAgICAgIGVkaXRvci5mb2N1cygpO1xuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHBvcyk7XG4gICAgfVxufSIsImltcG9ydCB7IEFwcCwgRWRpdG9yUG9zaXRpb24sIE1hcmtkb3duVmlldywgVEZpbGUsIFRGb2xkZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCAqIGFzIEV0YSBmcm9tIFwiZXRhXCI7XG5cbmltcG9ydCB7IEludGVybmFsVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi9JbnRlcm5hbFRlbXBsYXRlcy9JbnRlcm5hbFRlbXBsYXRlUGFyc2VyXCI7XG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IFVzZXJUZW1wbGF0ZVBhcnNlciB9IGZyb20gXCIuL1VzZXJUZW1wbGF0ZXMvVXNlclRlbXBsYXRlUGFyc2VyXCI7XG5pbXBvcnQgeyBUUGFyc2VyIH0gZnJvbSBcIlRQYXJzZXJcIjtcbmltcG9ydCB7IEN1cnNvckp1bXBlciB9IGZyb20gXCJDdXJzb3JKdW1wZXJcIjtcblxuZXhwb3J0IGVudW0gQ29udGV4dE1vZGUge1xuICAgIFVTRVIsXG4gICAgSU5URVJOQUwsXG4gICAgVVNFUl9JTlRFUk5BTCxcbiAgICBEWU5BTUlDLFxufTtcblxuLy8gVE9ETzogUmVtb3ZlIHRoYXRcbmNvbnN0IHRwX2N1cnNvciA9IG5ldyBSZWdFeHAoXCI8JVxcXFxzKnRwLmZpbGUuY3Vyc29yXFxcXHMqJT5cIik7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlciBleHRlbmRzIFRQYXJzZXIge1xuICAgIHB1YmxpYyBpbnRlcm5hbFRlbXBsYXRlUGFyc2VyOiBJbnRlcm5hbFRlbXBsYXRlUGFyc2VyO1xuXHRwdWJsaWMgdXNlclRlbXBsYXRlUGFyc2VyOiBVc2VyVGVtcGxhdGVQYXJzZXIgPSBudWxsO1xuICAgIHByaXZhdGUgY3VycmVudF9jb250ZXh0OiBhbnk7XG4gICAgcHVibGljIGN1cnNvcl9qdW1wZXI6IEN1cnNvckp1bXBlcjtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgICAgICB0aGlzLmN1cnNvcl9qdW1wZXIgPSBuZXcgQ3Vyc29ySnVtcGVyKHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5pbnRlcm5hbFRlbXBsYXRlUGFyc2VyID0gbmV3IEludGVybmFsVGVtcGxhdGVQYXJzZXIodGhpcy5hcHAsIHRoaXMucGx1Z2luKTtcbiAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgIGlmICghdGhpcy5hcHAuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclRlbXBsYXRlUGFyc2VyID0gbmV3IFVzZXJUZW1wbGF0ZVBhcnNlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgc2V0Q3VycmVudENvbnRleHQoZmlsZTogVEZpbGUsIGNvbnRleHRfbW9kZTogQ29udGV4dE1vZGUpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50X2NvbnRleHQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlQ29udGV4dChmaWxlLCBjb250ZXh0X21vZGUpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlQ29udGV4dChmaWxlOiBURmlsZSwgY29udGV4dF9tb2RlOiBDb250ZXh0TW9kZSA9IENvbnRleHRNb2RlLlVTRVJfSU5URVJOQUwpIHtcbiAgICAgICAgbGV0IGNvbnRleHQgPSB7fTtcbiAgICAgICAgbGV0IGludGVybmFsX2NvbnRleHQgPSBhd2FpdCB0aGlzLmludGVybmFsVGVtcGxhdGVQYXJzZXIuZ2VuZXJhdGVDb250ZXh0KGZpbGUpO1xuICAgICAgICBsZXQgdXNlcl9jb250ZXh0ID0ge307XG5cbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRfY29udGV4dCkge1xuICAgICAgICAgICAgLy8gSWYgYSB1c2VyIHN5c3RlbSBjb21tYW5kIGlzIHVzaW5nIHRwLmZpbGUuaW5jbHVkZSwgd2UgbmVlZCB0aGUgY29udGV4dCB0byBiZSBzZXQuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfY29udGV4dCA9IGludGVybmFsX2NvbnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGNvbnRleHRfbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBDb250ZXh0TW9kZS5VU0VSOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJUZW1wbGF0ZVBhcnNlcikge1xuICAgICAgICAgICAgICAgICAgICB1c2VyX2NvbnRleHQgPSBhd2FpdCB0aGlzLnVzZXJUZW1wbGF0ZVBhcnNlci5nZW5lcmF0ZUNvbnRleHQoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnVzZXJfY29udGV4dFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ29udGV4dE1vZGUuSU5URVJOQUw6XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGludGVybmFsX2NvbnRleHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENvbnRleHRNb2RlLkRZTkFNSUM6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlclRlbXBsYXRlUGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJfY29udGV4dCA9IGF3YWl0IHRoaXMudXNlclRlbXBsYXRlUGFyc2VyLmdlbmVyYXRlQ29udGV4dChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uaW50ZXJuYWxfY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi51c2VyX2NvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENvbnRleHRNb2RlLlVTRVJfSU5URVJOQUw6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlclRlbXBsYXRlUGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJfY29udGV4dCA9IGF3YWl0IHRoaXMudXNlclRlbXBsYXRlUGFyc2VyLmdlbmVyYXRlQ29udGV4dChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uaW50ZXJuYWxfY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4udXNlcl9jb250ZXh0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VUZW1wbGF0ZXMoY29udGVudDogc3RyaW5nLCBjb250ZXh0PzogYW55KSB7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXMuY3VycmVudF9jb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRlbnQubWF0Y2godHBfY3Vyc29yKSkge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ubG9nX3VwZGF0ZShgdHAuZmlsZS5jdXJzb3Igd2FzIHVwZGF0ZWQhIEl0J3Mgbm93IGFuIGludGVybmFsIGZ1bmN0aW9uLCB5b3Ugc2hvdWxkIGNhbGwgaXQgbGlrZSBzbzogdHAuZmlsZS5jdXJzb3IoKSA8YnIvPlxudHAuZmlsZS5jdXJzb3Igbm93IHN1cHBvcnRzIGN1cnNvciBqdW1wIG9yZGVyISBTcGVjaWZ5IHRoZSBqdW1wIG9yZGVyIGFzIGFuIGFyZ3VtZW50ICh0cC5maWxlLmN1cnNvcigxKSwgdHAuZmlsZS5jdXJzb3IoMiksIC4uLiksIGlmIHlvdSB3aXNoIHRvIGNoYW5nZSB0aGUgZGVmYXVsdCB0b3AgdG8gYm90dG9tIG9yZGVyLjxici8+XG5DaGVjayB0aGUgPGEgaHJlZj0naHR0cHM6Ly9zaWxlbnR2b2lkMTMuZ2l0aHViLmlvL1RlbXBsYXRlci9kb2NzL2ludGVybmFsLXZhcmlhYmxlcy1mdW5jdGlvbnMvaW50ZXJuYWwtbW9kdWxlcy9maWxlLW1vZHVsZSc+ZG9jdW1lbnRhdGlvbjwvYT4gZm9yIG1vcmUgaW5mb3JtYXRpb25zLmApO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb250ZW50ID0gYXdhaXQgRXRhLnJlbmRlckFzeW5jKGNvbnRlbnQsIGNvbnRleHQsIHtcbiAgICAgICAgICAgICAgICB2YXJOYW1lOiBcInRwXCIsXG4gICAgICAgICAgICAgICAgcGFyc2U6IHtcbiAgICAgICAgICAgICAgICAgICAgZXhlYzogXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRlOiBcIn5cIixcbiAgICAgICAgICAgICAgICAgICAgcmF3OiBcIlwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYXV0b1RyaW06IGZhbHNlLFxuICAgICAgICAgICAgICAgIGdsb2JhbEF3YWl0OiB0cnVlLFxuICAgICAgICAgICAgfSkgYXMgc3RyaW5nO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfZXJyb3IoXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIiwgZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcmVwbGFjZV9pbl9hY3RpdmVfZmlsZSgpOiB2b2lkIHtcblx0XHR0cnkge1xuXHRcdFx0bGV0IGFjdGl2ZV92aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcblx0XHRcdGlmIChhY3RpdmVfdmlldyA9PT0gbnVsbCkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmUgdmlldyBpcyBudWxsXCIpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5yZXBsYWNlX3RlbXBsYXRlc19hbmRfb3ZlcndyaXRlX2luX2ZpbGUoYWN0aXZlX3ZpZXcuZmlsZSk7XG5cdFx0fVxuXHRcdGNhdGNoKGVycm9yKSB7XG5cdFx0XHR0aGlzLnBsdWdpbi5sb2dfZXJyb3IoZXJyb3IpO1xuXHRcdH1cblx0fVxuXG4gICAgYXN5bmMgY3JlYXRlX25ld19ub3RlX2Zyb21fdGVtcGxhdGUodGVtcGxhdGVfZmlsZTogVEZpbGUsIGZvbGRlcj86IFRGb2xkZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0ZW1wbGF0ZV9maWxlKTtcblxuICAgICAgICAgICAgaWYgKCFmb2xkZXIpIHtcbiAgICAgICAgICAgICAgICBmb2xkZXIgPSB0aGlzLmFwcC5maWxlTWFuYWdlci5nZXROZXdGaWxlUGFyZW50KFwiXCIpO1xuICAgICAgICAgICAgICAgIC8vZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0Q29uZmlnKFwibmV3RmlsZUZvbGRlclBhdGhcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE86IENoYW5nZSB0aGF0LCBub3Qgc3RhYmxlIGF0bVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRfbm90ZSA9IGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmNyZWF0ZU5ld01hcmtkb3duRmlsZShmb2xkZXIsIFwiVW50aXRsZWRcIik7XG4gICAgICAgICAgICAvL2xldCBjcmVhdGVkX25vdGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoXCJVbnRpdGxlZC5tZFwiLCBcIlwiKTtcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXRDdXJyZW50Q29udGV4dChjcmVhdGVkX25vdGUsIENvbnRleHRNb2RlLlVTRVJfSU5URVJOQUwpO1xuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLnBsdWdpbi5wYXJzZXIucGFyc2VUZW1wbGF0ZXModGVtcGxhdGVfY29udGVudCk7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShjcmVhdGVkX25vdGUsIGNvbnRlbnQpO1xuXG4gICAgICAgICAgICBsZXQgYWN0aXZlX2xlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcbiAgICAgICAgICAgIGlmICghYWN0aXZlX2xlYWYpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY3RpdmUgbGVhZlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IGFjdGl2ZV9sZWFmLm9wZW5GaWxlKGNyZWF0ZWRfbm90ZSwge3N0YXRlOiB7bW9kZTogJ3NvdXJjZSd9LCBlU3RhdGU6IHtyZW5hbWU6ICdhbGwnfX0pO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmN1cnNvcl9qdW1wZXIuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpO1xuICAgICAgICB9XG5cdFx0Y2F0Y2goZXJyb3IpIHtcblx0XHRcdHRoaXMucGx1Z2luLmxvZ19lcnJvcihlcnJvcik7XG5cdFx0fVxuICAgIH1cblxuICAgIGFzeW5jIHJlcGxhY2VfdGVtcGxhdGVzX2FuZF9hcHBlbmQodGVtcGxhdGVfZmlsZTogVEZpbGUpIHtcbiAgICAgICAgbGV0IGFjdGl2ZV92aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKGFjdGl2ZV92aWV3ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY3RpdmUgdmlldywgY2FuJ3QgYXBwZW5kIHRlbXBsYXRlcy5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWRpdG9yID0gYWN0aXZlX3ZpZXcuZWRpdG9yO1xuICAgICAgICBsZXQgZG9jID0gZWRpdG9yLmdldERvYygpO1xuXG4gICAgICAgIGxldCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0ZW1wbGF0ZV9maWxlKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnNldEN1cnJlbnRDb250ZXh0KGFjdGl2ZV92aWV3LmZpbGUsIENvbnRleHRNb2RlLlVTRVJfSU5URVJOQUwpO1xuICAgICAgICBjb250ZW50ID0gYXdhaXQgdGhpcy5wYXJzZVRlbXBsYXRlcyhjb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIGRvYy5yZXBsYWNlU2VsZWN0aW9uKGNvbnRlbnQpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuY3Vyc29yX2p1bXBlci5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk7XG4gICAgICAgIGVkaXRvci5mb2N1cygpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlcGxhY2VfdGVtcGxhdGVzX2FuZF9vdmVyd3JpdGVfaW5fZmlsZShmaWxlOiBURmlsZSkge1xuICAgICAgICBsZXQgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5zZXRDdXJyZW50Q29udGV4dChmaWxlLCBDb250ZXh0TW9kZS5VU0VSX0lOVEVSTkFMKTtcbiAgICAgICAgbGV0IG5ld19jb250ZW50ID0gYXdhaXQgdGhpcy5wYXJzZVRlbXBsYXRlcyhjb250ZW50KTtcblxuICAgICAgICBpZiAobmV3X2NvbnRlbnQgIT09IGNvbnRlbnQpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCBuZXdfY29udGVudCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpID09PSBmaWxlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jdXJzb3JfanVtcGVyLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBhZGRJY29uLCBNYXJrZG93blZpZXcsIE1lbnUsIE1lbnVJdGVtLCBOb3RpY2UsIFBsdWdpbiwgVEFic3RyYWN0RmlsZSwgVEZpbGUsIFRGb2xkZXIgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBUZW1wbGF0ZXJTZXR0aW5ncywgVGVtcGxhdGVyU2V0dGluZ1RhYiB9IGZyb20gJ1NldHRpbmdzJztcclxuaW1wb3J0IHsgVGVtcGxhdGVyRnV6enlTdWdnZXN0TW9kYWwgfSBmcm9tICdUZW1wbGF0ZXJGdXp6eVN1Z2dlc3QnO1xyXG5pbXBvcnQgeyBDb250ZXh0TW9kZSwgVGVtcGxhdGVQYXJzZXIgfSBmcm9tICdUZW1wbGF0ZVBhcnNlcic7XHJcbmltcG9ydCB7IGRlbGF5IH0gZnJvbSAnVFBhcnNlcic7XHJcblxyXG5jb25zdCBJQ09OX0RBVEEgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MS4xMzI4IDI4LjdcIj48cGF0aCBkPVwiTTAgMTUuMTQgMCAxMC4xNSAxOC42NyAxLjUxIDE4LjY3IDYuMDMgNC43MiAxMi4zMyA0LjcyIDEyLjc2IDE4LjY3IDE5LjIyIDE4LjY3IDIzLjc0IDAgMTUuMTRaTTMzLjY5MjggMS44NEMzMy42OTI4IDEuODQgMzMuOTc2MSAyLjE0NjcgMzQuNTQyOCAyLjc2QzM1LjEwOTQgMy4zOCAzNS4zOTI4IDQuNTYgMzUuMzkyOCA2LjNDMzUuMzkyOCA4LjA0NjYgMzQuODE5NSA5LjU0IDMzLjY3MjggMTAuNzhDMzIuNTI2MSAxMi4wMiAzMS4wOTk1IDEyLjY0IDI5LjM5MjggMTIuNjRDMjcuNjg2MiAxMi42NCAyNi4yNjYxIDEyLjAyNjcgMjUuMTMyOCAxMC44QzIzLjk5MjggOS41NzMzIDIzLjQyMjggOC4wODY3IDIzLjQyMjggNi4zNEMyMy40MjI4IDQuNiAyMy45OTk1IDMuMTA2NiAyNS4xNTI4IDEuODZDMjYuMjk5NC42MiAyNy43MjYxIDAgMjkuNDMyOCAwQzMxLjEzOTUgMCAzMi41NTk0LjYxMzMgMzMuNjkyOCAxLjg0TTQ5LjgyMjguNjcgMjkuNTMyOCAyOC4zOCAyNC40MTI4IDI4LjM4IDQ0LjcxMjguNjcgNDkuODIyOC42N00zMS4wMzI4IDguMzhDMzEuMDMyOCA4LjM4IDMxLjEzOTUgOC4yNDY3IDMxLjM1MjggNy45OEMzMS41NjYyIDcuNzA2NyAzMS42NzI4IDcuMTczMyAzMS42NzI4IDYuMzhDMzEuNjcyOCA1LjU4NjcgMzEuNDQ2MSA0LjkyIDMwLjk5MjggNC4zOEMzMC41NDYxIDMuODQgMjkuOTk5NSAzLjU3IDI5LjM1MjggMy41N0MyOC43MDYxIDMuNTcgMjguMTY5NSAzLjg0IDI3Ljc0MjggNC4zOEMyNy4zMjI4IDQuOTIgMjcuMTEyOCA1LjU4NjcgMjcuMTEyOCA2LjM4QzI3LjExMjggNy4xNzMzIDI3LjMzNjEgNy44NCAyNy43ODI4IDguMzhDMjguMjM2MSA4LjkyNjcgMjguNzg2MSA5LjIgMjkuNDMyOCA5LjJDMzAuMDc5NSA5LjIgMzAuNjEyOCA4LjkyNjcgMzEuMDMyOCA4LjM4TTQ5LjQzMjggMTcuOUM0OS40MzI4IDE3LjkgNDkuNzE2MSAxOC4yMDY3IDUwLjI4MjggMTguODJDNTAuODQ5NSAxOS40MzMzIDUxLjEzMjggMjAuNjEzMyA1MS4xMzI4IDIyLjM2QzUxLjEzMjggMjQuMSA1MC41NTk0IDI1LjU5IDQ5LjQxMjggMjYuODNDNDguMjU5NSAyOC4wNzY2IDQ2LjgyOTUgMjguNyA0NS4xMjI4IDI4LjdDNDMuNDIyOCAyOC43IDQyLjAwMjggMjguMDgzMyA0MC44NjI4IDI2Ljg1QzM5LjcyOTUgMjUuNjIzMyAzOS4xNjI4IDI0LjEzNjYgMzkuMTYyOCAyMi4zOUMzOS4xNjI4IDIwLjY1IDM5LjczNjEgMTkuMTYgNDAuODgyOCAxNy45MkM0Mi4wMzYxIDE2LjY3MzMgNDMuNDYyOCAxNi4wNSA0NS4xNjI4IDE2LjA1QzQ2Ljg2OTQgMTYuMDUgNDguMjkyOCAxNi42NjY3IDQ5LjQzMjggMTcuOU00Ni44NTI4IDI0LjUyQzQ2Ljg1MjggMjQuNTIgNDYuOTU5NSAyNC4zODMzIDQ3LjE3MjggMjQuMTFDNDcuMzc5NSAyMy44MzY3IDQ3LjQ4MjggMjMuMzAzMyA0Ny40ODI4IDIyLjUxQzQ3LjQ4MjggMjEuNzE2NyA0Ny4yNTk1IDIxLjA1IDQ2LjgxMjggMjAuNTFDNDYuMzY2MSAxOS45NyA0NS44MTYyIDE5LjcgNDUuMTYyOCAxOS43QzQ0LjUxNjEgMTkuNyA0My45ODI4IDE5Ljk3IDQzLjU2MjggMjAuNTFDNDMuMTQyOCAyMS4wNSA0Mi45MzI4IDIxLjcxNjcgNDIuOTMyOCAyMi41MUM0Mi45MzI4IDIzLjMwMzMgNDMuMTU2MSAyMy45NzMzIDQzLjYwMjggMjQuNTJDNDQuMDQ5NCAyNS4wNiA0NC41OTYxIDI1LjMzIDQ1LjI0MjggMjUuMzNDNDUuODg5NSAyNS4zMyA0Ni40MjYxIDI1LjA2IDQ2Ljg1MjggMjQuNTJaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz48L3N2Zz5gO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuXHRwdWJsaWMgZnV6enlTdWdnZXN0OiBUZW1wbGF0ZXJGdXp6eVN1Z2dlc3RNb2RhbDtcclxuXHRwdWJsaWMgc2V0dGluZ3M6IFRlbXBsYXRlclNldHRpbmdzOyBcclxuXHRwdWJsaWMgcGFyc2VyOiBUZW1wbGF0ZVBhcnNlclxyXG5cclxuXHRhc3luYyBvbmxvYWQoKSB7XHJcblx0XHRhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG5cclxuXHRcdHRoaXMuZnV6enlTdWdnZXN0ID0gbmV3IFRlbXBsYXRlckZ1enp5U3VnZ2VzdE1vZGFsKHRoaXMuYXBwLCB0aGlzKTtcclxuXHRcdHRoaXMucGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKHRoaXMuYXBwLCB0aGlzKTtcclxuXHJcblx0XHR0aGlzLnJlZ2lzdGVyTWFya2Rvd25Qb3N0UHJvY2Vzc29yKChlbCwgY3R4KSA9PiB0aGlzLmR5bmFtaWNfdGVtcGxhdGVzX3Byb2Nlc3NvcihlbCwgY3R4KSk7XHJcblxyXG5cdFx0YWRkSWNvbihcInRlbXBsYXRlci1pY29uXCIsIElDT05fREFUQSk7XHJcblx0XHR0aGlzLmFkZFJpYmJvbkljb24oJ3RlbXBsYXRlci1pY29uJywgJ1RlbXBsYXRlcicsIGFzeW5jICgpID0+IHtcclxuXHRcdFx0dGhpcy5mdXp6eVN1Z2dlc3QuaW5zZXJ0X3RlbXBsYXRlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogXCJpbnNlcnQtdGVtcGxhdGVyXCIsXHJcblx0XHRcdG5hbWU6IFwiSW5zZXJ0IFRlbXBsYXRlXCIsXHJcblx0XHRcdGhvdGtleXM6IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRtb2RpZmllcnM6IFtcIkFsdFwiXSxcclxuXHRcdFx0XHRcdGtleTogJ2UnLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdF0sXHJcblx0XHRcdGNhbGxiYWNrOiAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5mdXp6eVN1Z2dlc3QuaW5zZXJ0X3RlbXBsYXRlKCk7XHJcblx0XHRcdH0sXHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogXCJyZXBsYWNlLWluLWZpbGUtdGVtcGxhdGVyXCIsXHJcbiAgICAgICAgICAgIG5hbWU6IFwiUmVwbGFjZSB0ZW1wbGF0ZXMgaW4gdGhlIGFjdGl2ZSBmaWxlXCIsXHJcbiAgICAgICAgICAgIGhvdGtleXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IFtcIkFsdFwiXSxcclxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdyJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5wYXJzZXIucmVwbGFjZV9pbl9hY3RpdmVfZmlsZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XHJcblx0XHRcdGlkOiBcImp1bXAtdG8tbmV4dC1jdXJzb3ItbG9jYXRpb25cIixcclxuXHRcdFx0bmFtZTogXCJKdW1wIHRvIG5leHQgY3Vyc29yIGxvY2F0aW9uXCIsXHJcblx0XHRcdGhvdGtleXM6IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRtb2RpZmllcnM6IFtcIkFsdFwiXSxcclxuXHRcdFx0XHRcdGtleTogXCJUYWJcIixcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdLFxyXG5cdFx0XHRjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR0aGlzLnBhcnNlci5jdXJzb3JfanVtcGVyLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2goZXJyb3IpIHtcclxuXHRcdFx0XHRcdHRoaXMubG9nX2Vycm9yKGVycm9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XHJcblx0XHRcdGlkOiBcImNyZWF0ZS1uZXctbm90ZS1mcm9tLXRlbXBsYXRlXCIsXHJcblx0XHRcdG5hbWU6IFwiQ3JlYXRlIG5ldyBub3RlIGZyb20gdGVtcGxhdGVcIixcclxuXHRcdFx0aG90a2V5czogW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG1vZGlmaWVyczogW1wiQWx0XCJdLFxyXG5cdFx0XHRcdFx0a2V5OiBcIm5cIixcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdLFxyXG5cdFx0XHRjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZnV6enlTdWdnZXN0LmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcclxuXHRcdFx0dGhpcy5yZWdpc3RlckV2ZW50KFxyXG5cdFx0XHRcdC8vIFRPRE86IEZpbmQgYSB3YXkgdG8gbm90IHRyaWdnZXIgdGhpcyBvbiBmaWxlcyBjb3B5XHJcblx0XHRcdFx0dGhpcy5hcHAudmF1bHQub24oXCJjcmVhdGVcIiwgYXN5bmMgKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcclxuXHRcdFx0XHRcdC8vIFRPRE86IGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXNcclxuXHRcdFx0XHRcdC8vIEN1cnJlbnRseSwgSSBoYXZlIHRvIHdhaXQgZm9yIHRoZSBkYWlseSBub3RlIHBsdWdpbiB0byBhZGQgdGhlIGZpbGUgY29udGVudCBiZWZvcmUgcmVwbGFjaW5nXHJcblx0XHRcdFx0XHQvLyBOb3QgYSBwcm9ibGVtIHdpdGggQ2FsZW5kYXIgaG93ZXZlciBzaW5jZSBpdCBjcmVhdGVzIHRoZSBmaWxlIHdpdGggdGhlIGV4aXN0aW5nIGNvbnRlbnRcclxuXHRcdFx0XHRcdGF3YWl0IGRlbGF5KDMwMCk7XHJcblx0XHRcdFx0XHQvLyAhIFRoaXMgY291bGQgY29ycnVwdCBiaW5hcnkgZmlsZXNcclxuXHRcdFx0XHRcdGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkgfHwgZmlsZS5leHRlbnNpb24gIT09IFwibWRcIikge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLnBhcnNlci5yZXBsYWNlX3RlbXBsYXRlc19hbmRfb3ZlcndyaXRlX2luX2ZpbGUoZmlsZSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMucmVnaXN0ZXJFdmVudChcclxuXHRcdFx0dGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1tZW51XCIsIChtZW51OiBNZW51LCBmaWxlOiBURmlsZSkgPT4ge1xyXG5cdFx0XHRcdGlmIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlcikge1xyXG5cdFx0XHRcdFx0bWVudS5hZGRJdGVtKChpdGVtOiBNZW51SXRlbSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRpdGVtLnNldFRpdGxlKFwiQ3JlYXRlIG5ldyBub3RlIGZyb20gdGVtcGxhdGVcIilcclxuXHRcdFx0XHRcdFx0XHQuc2V0SWNvbihcInRlbXBsYXRlci1pY29uXCIpXHJcblx0XHRcdFx0XHRcdFx0Lm9uQ2xpY2soZXZ0ID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZnV6enlTdWdnZXN0LmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKGZpbGUpO1xyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHQpO1xyXG5cclxuXHRcdHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgVGVtcGxhdGVyU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG5cdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xyXG5cdH1cdFxyXG5cclxuXHRsb2dfdXBkYXRlKG1zZzogc3RyaW5nKSB7XHJcblx0XHRsZXQgbm90aWNlID0gbmV3IE5vdGljZShcIlwiLCAxNTAwMCk7XHJcblx0XHQvLyBUT0RPOiBGaW5kIGJldHRlciB3YXkgZm9yIHRoaXNcclxuXHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdG5vdGljZS5ub3RpY2VFbC5pbm5lckhUTUwgPSBgPGI+VGVtcGxhdGVyIHVwZGF0ZTwvYj46ICR7bXNnfWA7XHJcblx0fVxyXG5cclxuXHRsb2dfZXJyb3IobXNnOiBzdHJpbmcsIGVycm9yPzogc3RyaW5nKSB7XHJcblx0XHRsZXQgbm90aWNlID0gbmV3IE5vdGljZShcIlwiLCA4MDAwKTtcclxuXHRcdGlmIChlcnJvcikge1xyXG5cdFx0XHQvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSBmb3IgdGhpc1xyXG5cdFx0XHQvLyBAdHMtaWdub3JlXHJcblx0XHRcdG5vdGljZS5ub3RpY2VFbC5pbm5lckhUTUwgPSBgPGI+VGVtcGxhdGVyIEVycm9yPC9iPjogJHttc2d9PGJyLz5DaGVjayBjb25zb2xlIGZvciBtb3JlIGluZm9ybWF0aW9uc2A7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IobXNnLCBlcnJvcik7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxyXG5cdFx0XHRub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYFRlbXBsYXRlciBFcnJvcjogJHttc2d9YDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGFzeW5jIGR5bmFtaWNfdGVtcGxhdGVzX3Byb2Nlc3NvcihlbDogSFRNTEVsZW1lbnQsIGN0eDogYW55KSB7XHJcblx0XHRpZiAoZWwudGV4dENvbnRlbnQuY29udGFpbnMoXCJ0cC5keW5hbWljXCIpKSB7XHJcblx0XHRcdC8vIFRPRE86IFRoaXMgd2lsbCBub3QgYWx3YXlzIGJlIHRoZSBhY3RpdmUgZmlsZSwgXHJcblx0XHRcdC8vIEkgbmVlZCB0byB1c2UgZ2V0Rmlyc3RMaW5rcGF0aERlc3QgYW5kIGN0eCB0byBmaW5kIHRoZSBhY3R1YWwgZmlsZVxyXG5cdFx0XHRsZXQgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XHJcblxyXG5cdFx0XHRhd2FpdCB0aGlzLnBhcnNlci5zZXRDdXJyZW50Q29udGV4dChmaWxlLCBDb250ZXh0TW9kZS5EWU5BTUlDKTtcclxuXHRcdFx0bGV0IG5ld19odG1sID0gYXdhaXQgdGhpcy5wYXJzZXIucGFyc2VUZW1wbGF0ZXMoZWwuaW5uZXJIVE1MKTtcclxuXHRcdFx0ZWwuaW5uZXJIVE1MID0gbmV3X2h0bWw7XHJcblx0XHR9XHJcblx0fVxyXG59OyJdLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIkZ1enp5U3VnZ2VzdE1vZGFsIiwibm9ybWFsaXplUGF0aCIsIlRGb2xkZXIiLCJWYXVsdCIsIlRGaWxlIiwidGhpcyIsIkZpbGVTeXN0ZW1BZGFwdGVyIiwiTWFya2Rvd25WaWV3IiwiZ2V0QWxsVGFncyIsInByb21pc2lmeSIsImV4ZWMiLCJFdGEucmVuZGVyQXN5bmMiLCJQbHVnaW4iLCJhZGRJY29uIiwiTm90aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFD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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsb0VBQW9FLENBQUMsQ0FBQyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUFFLENBQUMsQ0FBQyx3Q0FBd0MsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLHNDQUFxQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBSyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLCtCQUErQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLHlDQUF5QyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUMsOENBQThDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxD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
