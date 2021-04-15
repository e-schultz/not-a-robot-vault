'use strict';

var obsidian = require('obsidian');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var obsidian__default = /*#__PURE__*/_interopDefaultLegacy(obsidian);

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

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

var main = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });



const DEFAULT_DAILY_NOTE_FORMAT = "YYYY-MM-DD";
const DEFAULT_WEEKLY_NOTE_FORMAT = "gggg-[W]ww";
const DEFAULT_MONTHLY_NOTE_FORMAT = "YYYY-MM";

function shouldUsePeriodicNotesSettings(periodicity) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = window.app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.[periodicity]?.enabled;
}
/**
 * Read the user settings for the `daily-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getDailyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { internalPlugins, plugins } = window.app;
        if (shouldUsePeriodicNotesSettings("daily")) {
            const { format, folder, template } = plugins.getPlugin("periodic-notes")?.settings?.daily || {};
            return {
                format: format || DEFAULT_DAILY_NOTE_FORMAT,
                folder: folder?.trim() || "",
                template: template?.trim() || "",
            };
        }
        const { folder, format, template } = internalPlugins.getPluginById("daily-notes")?.instance?.options || {};
        return {
            format: format || DEFAULT_DAILY_NOTE_FORMAT,
            folder: folder?.trim() || "",
            template: template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom daily note settings found!", err);
    }
}
/**
 * Read the user settings for the `weekly-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getWeeklyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pluginManager = window.app.plugins;
        const calendarSettings = pluginManager.getPlugin("calendar")?.options;
        const periodicNotesSettings = pluginManager.getPlugin("periodic-notes")
            ?.settings?.weekly;
        if (shouldUsePeriodicNotesSettings("weekly")) {
            return {
                format: periodicNotesSettings.format || DEFAULT_WEEKLY_NOTE_FORMAT,
                folder: periodicNotesSettings.folder?.trim() || "",
                template: periodicNotesSettings.template?.trim() || "",
            };
        }
        const settings = calendarSettings || {};
        return {
            format: settings.weeklyNoteFormat || DEFAULT_WEEKLY_NOTE_FORMAT,
            folder: settings.weeklyNoteFolder?.trim() || "",
            template: settings.weeklyNoteTemplate?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom weekly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getMonthlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("monthly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.monthly) ||
            {};
        return {
            format: settings.format || DEFAULT_MONTHLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom monthly note settings found!", err);
    }
}

/**
 * dateUID is a way of weekly identifying daily/weekly/monthly notes.
 * They are prefixed with the granularity to avoid ambiguity.
 */
function getDateUID(date, granularity = "day") {
    const ts = date.clone().startOf(granularity).format();
    return `${granularity}-${ts}`;
}
function removeEscapedCharacters(format) {
    return format.replace(/\[[^\]]*\]/g, ""); // remove everything within brackets
}
/**
 * XXX: When parsing dates that contain both week numbers and months,
 * Moment choses to ignore the week numbers. For the week dateUID, we
 * want the opposite behavior. Strip the MMM from the format to patch.
 */
function isFormatAmbiguous(format, granularity) {
    if (granularity === "week") {
        const cleanFormat = removeEscapedCharacters(format);
        return (/w{1,2}/i.test(cleanFormat) &&
            (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat)));
    }
    return false;
}
function getDateFromFile(file, granularity) {
    const getSettings = {
        day: getDailyNoteSettings,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
    };
    const format = getSettings[granularity]().format.split("/").pop();
    const noteDate = window.moment(file.basename, format, true);
    if (!noteDate.isValid()) {
        return null;
    }
    if (isFormatAmbiguous(format, granularity)) {
        if (granularity === "week") {
            const cleanFormat = removeEscapedCharacters(format);
            if (/w{1,2}/i.test(cleanFormat)) {
                return window.moment(file.basename, 
                // If format contains week, remove day & month formatting
                format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""), false);
            }
        }
    }
    return noteDate;
}

// Credit: @creationix/path.js
function join(...partSegments) {
    // Split the inputs into a list of path commands.
    let parts = [];
    for (let i = 0, l = partSegments.length; i < l; i++) {
        parts = parts.concat(partSegments[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    const newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        const part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".")
            continue;
        // Push new path segments.
        else
            newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "")
        newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/");
}
async function ensureFolderExists(path) {
    const dirs = path.replace(/\\/g, "/").split("/");
    dirs.pop(); // remove basename
    if (dirs.length) {
        const dir = join(...dirs);
        if (!window.app.vault.getAbstractFileByPath(dir)) {
            await window.app.vault.createFolder(dir);
        }
    }
}
async function getNotePath(directory, filename) {
    if (!filename.endsWith(".md")) {
        filename += ".md";
    }
    const path = obsidian__default['default'].normalizePath(join(directory, filename));
    await ensureFolderExists(path);
    return path;
}
async function getTemplateContents(template) {
    const app = window.app;
    const { metadataCache, vault } = app;
    const templatePath = obsidian__default['default'].normalizePath(template);
    if (templatePath === "/") {
        return Promise.resolve("");
    }
    try {
        const templateFile = metadataCache.getFirstLinkpathDest(templatePath, "");
        const contents = await vault.cachedRead(templateFile);
        return contents;
    }
    catch (err) {
        console.error(`Failed to read the daily note template '${templatePath}'`, err);
        new obsidian__default['default'].Notice("Failed to read the daily note template");
        return "";
    }
}

class DailyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createDailyNote(date) {
    const app = window.app;
    const { vault } = app;
    const moment = window.moment;
    const { template, format, folder } = getDailyNoteSettings();
    const templateContents = await getTemplateContents(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*:(.*?)}}/gi, (_, _timeOrDate, momentFormat) => {
            const now = moment();
            return date
                .set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            })
                .format(momentFormat.trim());
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getDailyNote(date, dailyNotes) {
    return dailyNotes[getDateUID(date, "day")] ?? null;
}
function getAllDailyNotes() {
    /**
     * Find all daily notes in the daily note folder
     */
    const { vault } = window.app;
    const { folder } = getDailyNoteSettings();
    const dailyNotesFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!dailyNotesFolder) {
        throw new DailyNotesFolderMissingError("Failed to find daily notes folder");
    }
    const dailyNotes = {};
    obsidian__default['default'].Vault.recurseChildren(dailyNotesFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
            const date = getDateFromFile(note, "day");
            if (date) {
                const dateString = getDateUID(date, "day");
                dailyNotes[dateString] = note;
            }
        }
    });
    return dailyNotes;
}

class WeeklyNotesFolderMissingError extends Error {
}
function getDaysOfWeek() {
    const { moment } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let weekStart = moment.localeData()._week.dow;
    const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    while (weekStart) {
        daysOfWeek.push(daysOfWeek.shift());
        weekStart--;
    }
    return daysOfWeek;
}
function getDayOfWeekNumericalValue(dayOfWeekName) {
    return getDaysOfWeek().indexOf(dayOfWeekName.toLowerCase());
}
async function createWeeklyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getWeeklyNoteSettings();
    const templateContents = await getTemplateContents(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*:(.*?)}}/gi, (_, _timeOrDate, momentFormat) => {
            const now = window.moment();
            return date
                .set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            })
                .format(momentFormat.trim());
        })
            .replace(/{{\s*title\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*:(.*?)}}/gi, (_, dayOfWeek, momentFormat) => {
            const day = getDayOfWeekNumericalValue(dayOfWeek);
            return date.weekday(day).format(momentFormat.trim());
        }));
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getWeeklyNote(date, weeklyNotes) {
    return weeklyNotes[getDateUID(date, "week")] ?? null;
}
function getAllWeeklyNotes() {
    const { vault } = window.app;
    const { folder } = getWeeklyNoteSettings();
    const weeklyNotesFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!weeklyNotesFolder) {
        throw new WeeklyNotesFolderMissingError("Failed to find weekly notes folder");
    }
    const weeklyNotes = {};
    obsidian__default['default'].Vault.recurseChildren(weeklyNotesFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
            const date = getDateFromFile(note, "week");
            if (date) {
                const dateString = getDateUID(date, "week");
                weeklyNotes[dateString] = note;
            }
        }
    });
    return weeklyNotes;
}

class MonthlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createMonthlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getMonthlyNoteSettings();
    const templateContents = await getTemplateContents(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*:(.*?)}}/gi, (_, _timeOrDate, momentFormat) => {
            const now = window.moment();
            return date
                .set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            })
                .format(momentFormat.trim());
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getMonthlyNote(date, monthlyNotes) {
    return monthlyNotes[getDateUID(date, "month")] ?? null;
}
function getAllMonthlyNotes() {
    const { vault } = window.app;
    const { folder } = getMonthlyNoteSettings();
    const monthlyNotesFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!monthlyNotesFolder) {
        throw new MonthlyNotesFolderMissingError("Failed to find monthly notes folder");
    }
    const monthlyNotes = {};
    obsidian__default['default'].Vault.recurseChildren(monthlyNotesFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
            const date = getDateFromFile(note, "month");
            if (date) {
                const dateString = getDateUID(date, "month");
                monthlyNotes[dateString] = note;
            }
        }
    });
    return monthlyNotes;
}

function appHasDailyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dailyNotesPlugin = app.internalPlugins.plugins["daily-notes"];
    if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.daily?.enabled;
}
/**
 * XXX: "Weekly Notes" live in either the Calendar plugin or the periodic-notes plugin.
 * Check both until the weekly notes feature is removed from the Calendar plugin.
 */
function appHasWeeklyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (app.plugins.getPlugin("calendar")) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.weekly?.enabled;
}
function appHasMonthlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.monthly?.enabled;
}

exports.DEFAULT_DAILY_NOTE_FORMAT = DEFAULT_DAILY_NOTE_FORMAT;
exports.DEFAULT_MONTHLY_NOTE_FORMAT = DEFAULT_MONTHLY_NOTE_FORMAT;
exports.DEFAULT_WEEKLY_NOTE_FORMAT = DEFAULT_WEEKLY_NOTE_FORMAT;
exports.appHasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded;
exports.appHasMonthlyNotesPluginLoaded = appHasMonthlyNotesPluginLoaded;
exports.appHasWeeklyNotesPluginLoaded = appHasWeeklyNotesPluginLoaded;
exports.createDailyNote = createDailyNote;
exports.createMonthlyNote = createMonthlyNote;
exports.createWeeklyNote = createWeeklyNote;
exports.getAllDailyNotes = getAllDailyNotes;
exports.getAllMonthlyNotes = getAllMonthlyNotes;
exports.getAllWeeklyNotes = getAllWeeklyNotes;
exports.getDailyNote = getDailyNote;
exports.getDailyNoteSettings = getDailyNoteSettings;
exports.getDateFromFile = getDateFromFile;
exports.getDateUID = getDateUID;
exports.getMonthlyNote = getMonthlyNote;
exports.getMonthlyNoteSettings = getMonthlyNoteSettings;
exports.getTemplateContents = getTemplateContents;
exports.getWeeklyNote = getWeeklyNote;
exports.getWeeklyNoteSettings = getWeeklyNoteSettings;
});

var pattern = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAnyPattern = exports.extractTerms = exports.repeatedTimeunitPattern = void 0;
function repeatedTimeunitPattern(prefix, singleTimeunitPattern) {
    const singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
    return `${prefix}${singleTimeunitPatternNoCapture}\\s*(?:,?\\s{0,5}${singleTimeunitPatternNoCapture}){0,10}`;
}
exports.repeatedTimeunitPattern = repeatedTimeunitPattern;
function extractTerms(dictionary) {
    let keys;
    if (dictionary instanceof Array) {
        keys = [...dictionary];
    }
    else if (dictionary instanceof Map) {
        keys = Array.from(dictionary.keys());
    }
    else {
        keys = Object.keys(dictionary);
    }
    return keys;
}
exports.extractTerms = extractTerms;
function matchAnyPattern(dictionary) {
    const joinedTerms = extractTerms(dictionary)
        .sort((a, b) => b.length - a.length)
        .join("|")
        .replace(/\./g, "\\.");
    return `(?:${joinedTerms})`;
}
exports.matchAnyPattern = matchAnyPattern;
});

var dayjs_min = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",a="quarter",o="year",f="date",h=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,c=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,d={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},$=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},l={s:$,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+$(r,2,"0")+":"+$(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,u),s=n-i<0,a=e.clone().add(r+(s?-1:1),u);return +(-(r+(n-i)/(s?i-a:a-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:o,w:s,d:i,D:f,h:r,m:n,s:e,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},y="en",M={};M[y]=d;var m=function(t){return t instanceof S},D=function(t,e,n){var r;if(!t)return y;if("string"==typeof t)M[t]&&(r=t),e&&(M[t]=e,r=t);else {var i=t.name;M[i]=t,r=i;}return !n&&r&&(y=r),r||!n&&y},v=function(t,e){if(m(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new S(n)},g=l;g.l=D,g.i=m,g.w=function(t,e){return v(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var S=function(){function d(t){this.$L=D(t.locale,null,!0),this.parse(t);}var $=d.prototype;return $.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(g.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},$.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},$.$utils=function(){return g},$.isValid=function(){return !("Invalid Date"===this.$d.toString())},$.isSame=function(t,e){var n=v(t);return this.startOf(e)<=n&&n<=this.endOf(e)},$.isAfter=function(t,e){return v(t)<this.startOf(e)},$.isBefore=function(t,e){return this.endOf(e)<v(t)},$.$g=function(t,e,n){return g.u(t)?this[e]:this.set(n,t)},$.unix=function(){return Math.floor(this.valueOf()/1e3)},$.valueOf=function(){return this.$d.getTime()},$.startOf=function(t,a){var h=this,c=!!g.u(a)||a,d=g.p(t),$=function(t,e){var n=g.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return c?n:n.endOf(i)},l=function(t,e){return g.w(h.toDate()[t].apply(h.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},y=this.$W,M=this.$M,m=this.$D,D="set"+(this.$u?"UTC":"");switch(d){case o:return c?$(1,0):$(31,11);case u:return c?$(1,M):$(0,M+1);case s:var v=this.$locale().weekStart||0,S=(y<v?y+7:y)-v;return $(c?m-S:m+(6-S),M);case i:case f:return l(D+"Hours",0);case r:return l(D+"Minutes",1);case n:return l(D+"Seconds",2);case e:return l(D+"Milliseconds",3);default:return this.clone()}},$.endOf=function(t){return this.startOf(t,!1)},$.$set=function(s,a){var h,c=g.p(s),d="set"+(this.$u?"UTC":""),$=(h={},h[i]=d+"Date",h[f]=d+"Date",h[u]=d+"Month",h[o]=d+"FullYear",h[r]=d+"Hours",h[n]=d+"Minutes",h[e]=d+"Seconds",h[t]=d+"Milliseconds",h)[c],l=c===i?this.$D+(a-this.$W):a;if(c===u||c===o){var y=this.clone().set(f,1);y.$d[$](l),y.init(),this.$d=y.set(f,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},$.set=function(t,e){return this.clone().$set(t,e)},$.get=function(t){return this[g.p(t)]()},$.add=function(t,a){var f,h=this;t=Number(t);var c=g.p(a),d=function(e){var n=v(h);return g.w(n.date(n.date()+Math.round(e*t)),h)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(f={},f[n]=6e4,f[r]=36e5,f[e]=1e3,f)[c]||1,l=this.$d.getTime()+t*$;return g.w(l,this)},$.subtract=function(t,e){return this.add(-1*t,e)},$.format=function(t){var e=this;if(!this.isValid())return "Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=g.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,f=i.months,h=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return g.s(s%12||12,t,"0")},$=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:g.s(a+1,2,"0"),MMM:h(i.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:g.s(this.$D,2,"0"),d:String(this.$W),dd:h(i.weekdaysMin,this.$W,o,2),ddd:h(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:g.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:g.s(u,2,"0"),s:String(this.$s),ss:g.s(this.$s,2,"0"),SSS:g.s(this.$ms,3,"0"),Z:r};return n.replace(c,function(t,e){return e||l[t]||r.replace(":","")})},$.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},$.diff=function(t,f,h){var c,d=g.p(f),$=v(t),l=6e4*($.utcOffset()-this.utcOffset()),y=this-$,M=g.m(this,$);return M=(c={},c[o]=M/12,c[u]=M,c[a]=M/3,c[s]=(y-l)/6048e5,c[i]=(y-l)/864e5,c[r]=y/36e5,c[n]=y/6e4,c[e]=y/1e3,c)[d]||y,h?M:g.a(M)},$.daysInMonth=function(){return this.endOf(u).$D},$.$locale=function(){return M[this.$L]},$.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=D(t,e,!0);return r&&(n.$L=r),n},$.clone=function(){return g.w(this.$d,this)},$.toDate=function(){return new Date(this.valueOf())},$.toJSON=function(){return this.isValid()?this.toISOString():null},$.toISOString=function(){return this.$d.toISOString()},$.toString=function(){return this.$d.toUTCString()},d}(),p=S.prototype;return v.prototype=p,[["$ms",t],["$s",e],["$m",n],["$H",r],["$W",i],["$M",u],["$y",o],["$D",f]].forEach(function(t){p[t[1]]=function(e){return this.$g(e,t[0],t[1])};}),v.extend=function(t,e){return t.$i||(t(e,S,v),t.$i=!0),v},v.locale=D,v.isDayjs=m,v.unix=function(t){return v(1e3*t)},v.en=M[y],v.Ls=M,v.p={},v});
});

var years = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYearClosestToRef = exports.findMostLikelyADYear = void 0;
const dayjs_1 = __importDefault(dayjs_min);
function findMostLikelyADYear(yearNumber) {
    if (yearNumber < 100) {
        if (yearNumber > 50) {
            yearNumber = yearNumber + 1900;
        }
        else {
            yearNumber = yearNumber + 2000;
        }
    }
    return yearNumber;
}
exports.findMostLikelyADYear = findMostLikelyADYear;
function findYearClosestToRef(refDate, day, month) {
    const refMoment = dayjs_1.default(refDate);
    let dateMoment = refMoment;
    dateMoment = dateMoment.month(month - 1);
    dateMoment = dateMoment.date(day);
    dateMoment = dateMoment.year(refMoment.year());
    const nextYear = dateMoment.add(1, "y");
    const lastYear = dateMoment.add(-1, "y");
    if (Math.abs(nextYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
        dateMoment = nextYear;
    }
    else if (Math.abs(lastYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
        dateMoment = lastYear;
    }
    return dateMoment.year();
}
exports.findYearClosestToRef = findYearClosestToRef;
});

var constants$5 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    sunday: 0,
    sun: 0,
    "sun.": 0,
    monday: 1,
    mon: 1,
    "mon.": 1,
    tuesday: 2,
    tue: 2,
    "tue.": 2,
    wednesday: 3,
    wed: 3,
    "wed.": 3,
    thursday: 4,
    thurs: 4,
    "thurs.": 4,
    thur: 4,
    "thur.": 4,
    thu: 4,
    "thu.": 4,
    friday: 5,
    fri: 5,
    "fri.": 5,
    saturday: 6,
    sat: 6,
    "sat.": 6,
};
exports.FULL_MONTH_NAME_DICTIONARY = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
};
exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { jan: 1, "jan.": 1, feb: 2, "feb.": 2, mar: 3, "mar.": 3, apr: 4, "apr.": 4, jun: 6, "jun.": 6, jul: 7, "jul.": 7, aug: 8, "aug.": 8, sep: 9, "sep.": 9, sept: 9, "sept.": 9, oct: 10, "oct.": 10, nov: 11, "nov.": 11, dec: 12, "dec.": 12 });
exports.INTEGER_WORD_DICTIONARY = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
};
exports.ORDINAL_WORD_DICTIONARY = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10,
    eleventh: 11,
    twelfth: 12,
    thirteenth: 13,
    fourteenth: 14,
    fifteenth: 15,
    sixteenth: 16,
    seventeenth: 17,
    eighteenth: 18,
    nineteenth: 19,
    twentieth: 20,
    "twenty first": 21,
    "twenty-first": 21,
    "twenty second": 22,
    "twenty-second": 22,
    "twenty third": 23,
    "twenty-third": 23,
    "twenty fourth": 24,
    "twenty-fourth": 24,
    "twenty fifth": 25,
    "twenty-fifth": 25,
    "twenty sixth": 26,
    "twenty-sixth": 26,
    "twenty seventh": 27,
    "twenty-seventh": 27,
    "twenty eighth": 28,
    "twenty-eighth": 28,
    "twenty ninth": 29,
    "twenty-ninth": 29,
    "thirtieth": 30,
    "thirty first": 31,
    "thirty-first": 31,
};
exports.TIME_UNIT_DICTIONARY = {
    sec: "second",
    second: "second",
    seconds: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minutes: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hour: "hour",
    hours: "hour",
    day: "d",
    days: "d",
    week: "week",
    weeks: "week",
    month: "month",
    months: "month",
    y: "year",
    yr: "year",
    year: "year",
    years: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "a" || num === "an") {
        return 1;
    }
    else if (num.match(/few/)) {
        return 3;
    }
    else if (num.match(/half/)) {
        return 0.5;
    }
    else if (num.match(/couple/)) {
        return 2;
    }
    else if (num.match(/several/)) {
        return 7;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:st|nd|rd|th)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
        return exports.ORDINAL_WORD_DICTIONARY[num];
    }
    num = num.replace(/(?:st|nd|rd|th)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:BE|AD|BC)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/BE/i.test(match)) {
        match = match.replace(/BE/i, "");
        return parseInt(match) - 543;
    }
    if (/BC/i.test(match)) {
        match = match.replace(/BC/i, "");
        return -parseInt(match);
    }
    if (/AD/i.test(match)) {
        match = match.replace(/AD/i, "");
        return parseInt(match);
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern(`(?:(?:about|around)\\s*)?`, SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
});

var quarterOfYear = createCommonjsModule(function (module, exports) {
!function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="month",n="quarter";return function(r,i){var e=i.prototype;e.quarter=function(t){return this.$utils().u(t)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(t-1))};var u=e.add;e.add=function(r,i){return r=Number(r),this.$utils().p(i)===n?this.add(3*r,t):u.bind(this)(r,i)};var s=e.startOf;e.startOf=function(r,i){var e=this.$utils(),u=!!e.u(i)||i;if(e.p(r)===n){var a=this.quarter()-1;return u?this.month(3*a).startOf(t).startOf("day"):this.month(3*a+2).endOf(t).endOf("day")}return s.bind(this)(r,i)};}});
});

var dayjs = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.implySimilarTime = exports.assignSimilarTime = exports.assignSimilarDate = exports.assignTheNextDay = void 0;
function assignTheNextDay(component, targetDayJs) {
    targetDayJs = targetDayJs.add(1, "day");
    assignSimilarDate(component, targetDayJs);
    implySimilarTime(component, targetDayJs);
}
exports.assignTheNextDay = assignTheNextDay;
function assignSimilarDate(component, targetDayJs) {
    component.assign("day", targetDayJs.date());
    component.assign("month", targetDayJs.month() + 1);
    component.assign("year", targetDayJs.year());
}
exports.assignSimilarDate = assignSimilarDate;
function assignSimilarTime(component, targetDayJs) {
    component.assign("hour", targetDayJs.hour());
    component.assign("minute", targetDayJs.minute());
    component.assign("second", targetDayJs.second());
    component.assign("millisecond", targetDayJs.millisecond());
    component.assign("timezoneOffset", targetDayJs.utcOffset());
}
exports.assignSimilarTime = assignSimilarTime;
function implySimilarTime(component, targetDayJs) {
    component.imply("hour", targetDayJs.hour());
    component.imply("minute", targetDayJs.minute());
    component.imply("second", targetDayJs.second());
    component.imply("millisecond", targetDayJs.millisecond());
    component.imply("timezoneOffset", targetDayJs.utcOffset());
}
exports.implySimilarTime = implySimilarTime;
});

var results = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingResult = exports.ParsingComponents = void 0;
const quarterOfYear_1 = __importDefault(quarterOfYear);
const dayjs_1 = __importDefault(dayjs_min);

dayjs_1.default.extend(quarterOfYear_1.default);
class ParsingComponents {
    constructor(refDate, knownComponents) {
        this.knownValues = {};
        this.impliedValues = {};
        if (knownComponents) {
            for (const key in knownComponents) {
                this.knownValues[key] = knownComponents[key];
            }
        }
        const refDayJs = dayjs_1.default(refDate);
        this.imply("day", refDayJs.date());
        this.imply("month", refDayJs.month() + 1);
        this.imply("year", refDayJs.year());
        this.imply("hour", 12);
        this.imply("minute", 0);
        this.imply("second", 0);
        this.imply("millisecond", 0);
    }
    get(component) {
        if (component in this.knownValues) {
            return this.knownValues[component];
        }
        if (component in this.impliedValues) {
            return this.impliedValues[component];
        }
        return null;
    }
    isCertain(component) {
        return component in this.knownValues;
    }
    getCertainComponents() {
        return Object.keys(this.knownValues);
    }
    imply(component, value) {
        if (component in this.knownValues) {
            return this;
        }
        this.impliedValues[component] = value;
        return this;
    }
    assign(component, value) {
        this.knownValues[component] = value;
        delete this.impliedValues[component];
        return this;
    }
    delete(component) {
        delete this.knownValues[component];
        delete this.impliedValues[component];
    }
    clone() {
        const component = new ParsingComponents(new Date());
        component.knownValues = {};
        component.impliedValues = {};
        for (const key in this.knownValues) {
            component.knownValues[key] = this.knownValues[key];
        }
        for (const key in this.impliedValues) {
            component.impliedValues[key] = this.impliedValues[key];
        }
        return component;
    }
    isOnlyDate() {
        return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
    }
    isOnlyTime() {
        return !this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    }
    isOnlyWeekdayComponent() {
        return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    }
    isOnlyDayMonthComponent() {
        return this.isCertain("day") && this.isCertain("month") && !this.isCertain("year");
    }
    isValidDate() {
        const date = this.isCertain("timezoneOffset") ? this.dateWithoutTimezoneAdjustment() : this.date();
        if (date.getFullYear() !== this.get("year"))
            return false;
        if (date.getMonth() !== this.get("month") - 1)
            return false;
        if (date.getDate() !== this.get("day"))
            return false;
        if (this.get("hour") != null && date.getHours() != this.get("hour"))
            return false;
        if (this.get("minute") != null && date.getMinutes() != this.get("minute"))
            return false;
        return true;
    }
    toString() {
        return `[ParsingComponents {knownValues: ${JSON.stringify(this.knownValues)}, impliedValues: ${JSON.stringify(this.impliedValues)}}]`;
    }
    dayjs() {
        return dayjs_1.default(this.date());
    }
    date() {
        const date = this.dateWithoutTimezoneAdjustment();
        return new Date(date.getTime() + this.getTimezoneAdjustmentMinute(date) * 60000);
    }
    dateWithoutTimezoneAdjustment() {
        const date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
        date.setFullYear(this.get("year"));
        return date;
    }
    getTimezoneAdjustmentMinute(date) {
        var _a;
        date = date !== null && date !== void 0 ? date : new Date();
        const currentTimezoneOffset = -date.getTimezoneOffset();
        const targetTimezoneOffset = (_a = this.get("timezoneOffset")) !== null && _a !== void 0 ? _a : currentTimezoneOffset;
        return currentTimezoneOffset - targetTimezoneOffset;
    }
    static createRelativeFromRefDate(refDate, fragments) {
        let date = dayjs_1.default(refDate);
        for (const key in fragments) {
            date = date.add(fragments[key], key);
        }
        const components = new ParsingComponents(refDate);
        if (fragments["hour"] || fragments["minute"] || fragments["second"]) {
            dayjs.assignSimilarTime(components, date);
            dayjs.assignSimilarDate(components, date);
        }
        else {
            dayjs.implySimilarTime(components, date);
            if (fragments["d"]) {
                components.assign("day", date.date());
                components.assign("month", date.month() + 1);
                components.assign("year", date.year());
            }
            else {
                if (fragments["week"]) {
                    components.imply("weekday", date.day());
                }
                components.imply("day", date.date());
                if (fragments["month"]) {
                    components.assign("month", date.month() + 1);
                    components.assign("year", date.year());
                }
                else {
                    components.imply("month", date.month() + 1);
                    if (fragments["year"]) {
                        components.assign("year", date.year());
                    }
                    else {
                        components.imply("year", date.year());
                    }
                }
            }
        }
        return components;
    }
}
exports.ParsingComponents = ParsingComponents;
class ParsingResult {
    constructor(refDate, index, text, start, end) {
        this.refDate = refDate;
        this.index = index;
        this.text = text;
        this.start = start || new ParsingComponents(this.refDate);
        this.end = end;
    }
    clone() {
        const result = new ParsingResult(this.refDate, this.index, this.text);
        result.start = this.start ? this.start.clone() : null;
        result.end = this.end ? this.end.clone() : null;
        return result;
    }
    date() {
        return this.start.date();
    }
    toString() {
        return `[ParsingResult {index: ${this.index}, text: '${this.text}', ...}]`;
    }
}
exports.ParsingResult = ParsingResult;
});

var AbstractParserWithWordBoundary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractParserWithWordBoundaryChecking = void 0;
class AbstractParserWithWordBoundaryChecking {
    constructor() {
        this.cachedInnerPattern = null;
        this.cachedPattern = null;
    }
    pattern(context) {
        const innerPattern = this.innerPattern(context);
        if (innerPattern == this.cachedInnerPattern) {
            return this.cachedPattern;
        }
        this.cachedPattern = new RegExp(`(\\W|^)${innerPattern.source}`, innerPattern.flags);
        this.cachedInnerPattern = innerPattern;
        return this.cachedPattern;
    }
    extract(context, match) {
        const header = match[1];
        match.index = match.index + header.length;
        match[0] = match[0].substring(header.length);
        for (let i = 2; i < match.length; i++) {
            match[i - 1] = match[i];
        }
        return this.innerExtract(context, match);
    }
}
exports.AbstractParserWithWordBoundaryChecking = AbstractParserWithWordBoundaryChecking;
});

var ENTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN_WITH_PREFIX = new RegExp(`(?:within|in|for)\\s*` +
    `(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants$5.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
const PATTERN_WITHOUT_PREFIX = new RegExp(`(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants$5.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
class ENTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return context.option.forwardDate ? PATTERN_WITHOUT_PREFIX : PATTERN_WITH_PREFIX;
    }
    innerExtract(context, match) {
        const timeUnits = constants$5.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = ENTimeUnitWithinFormatParser;
});

var ENMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$5;
const constants_3 = constants$5;


const PATTERN = new RegExp("(?:on\\s*?)?" +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    "(?:\\s*" +
    "(?:to|\\-|\\–|until|through|till|\\s)\\s*" +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    ")?" +
    "(?:-|/|\\s*(?:of)?\\s*)" +
    "(" +
    pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY) +
    ")" +
    "(?:" +
    "(?:-|/|,?\\s*)" +
    `(${constants_2.YEAR_PATTERN}(?![^\\s]\\d))` +
    ")?" +
    "(?=\\W|$)", "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class ENMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$5.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = ENMonthNameLittleEndianParser;
});

var ENMonthNameMiddleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$5;
const constants_3 = constants$5;


const PATTERN = new RegExp(`(${pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY)})` +
    "(?:-|/|\\s*,?\\s*)" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})(?!\\s*(?:am|pm))\\s*` +
    "(?:" +
    "(?:to|\\-)\\s*" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})\\s*` +
    ")?" +
    "(?:" +
    "(?:-|/|\\s*,?\\s*)" +
    `(${constants_3.YEAR_PATTERN})` +
    ")?" +
    "(?=\\W|$)(?!\\:\\d)", "i");
const MONTH_NAME_GROUP = 1;
const DATE_GROUP = 2;
const DATE_TO_GROUP = 3;
const YEAR_GROUP = 4;
class ENMonthNameMiddleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = constants$5.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            return null;
        }
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[YEAR_GROUP]) {
            const year = constants_3.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        if (!match[DATE_TO_GROUP]) {
            return components;
        }
        const endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
        const result = context.createParsingResult(match.index, match[0]);
        result.start = components;
        result.end = components.clone();
        result.end.assign("day", endDate);
        return result;
    }
}
exports.default = ENMonthNameMiddleEndianParser;
});

var ENMonthNameParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const constants_2 = constants$5;

const PATTERN = new RegExp(`((?:in)\\s*)?` +
    `(${pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY)})` +
    `\\s*` +
    `(?:` +
    `[,-]?\\s*(${constants_2.YEAR_PATTERN})?` +
    ")?" +
    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
const PREFIX_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const YEAR_GROUP = 3;
class ENMonthNameParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const monthName = match[MONTH_NAME_GROUP].toLowerCase();
        if (match[0].length <= 3 && !constants$5.FULL_MONTH_NAME_DICTIONARY[monthName]) {
            return null;
        }
        const result = context.createParsingResult(match.index + (match[PREFIX_GROUP] || "").length, match.index + match[0].length);
        result.start.imply("day", 1);
        const month = constants$5.MONTH_DICTIONARY[monthName];
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
            const year = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, 1, month);
            result.start.imply("year", year);
        }
        return result;
    }
}
exports.default = ENMonthNameParser;
});

var ENCasualYearMonthDayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp(`([0-9]{4})[\\.\\/\\s]` +
    `(?:(${pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]` +
    `([0-9]{1,2})` +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const MONTH_NUMBER_GROUP = 3;
const DATE_NUMBER_GROUP = 4;
class ENCasualYearMonthDayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = match[MONTH_NUMBER_GROUP]
            ? parseInt(match[MONTH_NUMBER_GROUP])
            : constants$5.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        if (month < 1 || month > 12) {
            return null;
        }
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);
        return {
            day: day,
            month: month,
            year: year,
        };
    }
}
exports.default = ENCasualYearMonthDayParser;
});

var ENSlashMonthFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
const MONTH_GROUP = 1;
const YEAR_GROUP = 2;
class ENSlashMonthFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const year = parseInt(match[YEAR_GROUP]);
        const month = parseInt(match[MONTH_GROUP]);
        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
    }
}
exports.default = ENSlashMonthFormatParser;
});

var AbstractTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTimeExpressionParser = void 0;

function primaryTimePattern(primaryPrefix, primarySuffix) {
    return new RegExp("(^|\\s|T)" +
        `${primaryPrefix}` +
        "(\\d{1,4})" +
        "(?:" +
        "(?:\\.|\\:|\\：)" +
        "(\\d{1,2})" +
        "(?:" +
        "(?:\\:|\\：)" +
        "(\\d{2})" +
        "(?:\\.(\\d{1,6}))?" +
        ")?" +
        ")?" +
        "(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?" +
        `${primarySuffix}`, "i");
}
function followingTimePatten(followingPhase, followingSuffix) {
    return new RegExp(`^(${followingPhase})` +
        "(\\d{1,4})" +
        "(?:" +
        "(?:\\.|\\:|\\：)" +
        "(\\d{1,2})" +
        "(?:" +
        "(?:\\.|\\:|\\：)" +
        "(\\d{1,2})(?:\\.(\\d{1,6}))?" +
        ")?" +
        ")?" +
        "(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?" +
        `${followingSuffix}`, "i");
}
const HOUR_GROUP = 2;
const MINUTE_GROUP = 3;
const SECOND_GROUP = 4;
const MILLI_SECOND_GROUP = 5;
const AM_PM_HOUR_GROUP = 6;
class AbstractTimeExpressionParser {
    constructor(strictMode = false) {
        this.cachedPrimaryPrefix = null;
        this.cachedPrimarySuffix = null;
        this.cachedPrimaryTimePattern = null;
        this.cachedFollowingPhase = null;
        this.cachedFollowingSuffix = null;
        this.cachedFollowingTimePatten = null;
        this.strictMode = strictMode;
    }
    primarySuffix() {
        return "(?=\\W|$)";
    }
    followingSuffix() {
        return "(?=\\W|$)";
    }
    pattern(context) {
        return this.getPrimaryTimePatternThroughCache();
    }
    extract(context, match) {
        const startComponents = this.extractPrimaryTimeComponents(context, match);
        if (!startComponents) {
            match.index += match[0].length;
            return null;
        }
        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length), startComponents);
        const remainingText = context.text.substring(match.index + match[0].length);
        const followingPattern = this.getFollowingTimePatternThroughCache();
        match = followingPattern.exec(remainingText);
        if (!match ||
            match[0].match(/^\s*([+-])\s*\d{3,4}$/)) {
            return this.checkAndReturnWithoutFollowingPattern(result);
        }
        result.end = this.extractFollowingTimeComponents(context, match, result);
        if (result.end) {
            if (result.end) {
                result.text += match[0];
            }
        }
        return result;
    }
    extractPrimaryTimeComponents(context, match, strict = false) {
        const components = context.createParsingComponents();
        let hour = 0;
        let minute = 0;
        let meridiem = null;
        hour = parseInt(match[HOUR_GROUP]);
        if (match[MINUTE_GROUP] != null) {
            if (match[MINUTE_GROUP].length == 1 && !match[AM_PM_HOUR_GROUP]) {
                return null;
            }
            minute = parseInt(match[MINUTE_GROUP]);
        }
        else if (hour > 100) {
            if (this.strictMode) {
                return null;
            }
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (minute >= 60 || hour > 24) {
            return null;
        }
        if (hour > 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12) {
                    hour += 12;
                }
            }
        }
        components.assign("hour", hour);
        components.assign("minute", minute);
        if (meridiem !== null) {
            components.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                components.imply("meridiem", dist.Meridiem.AM);
            }
            else {
                components.imply("meridiem", dist.Meridiem.PM);
            }
        }
        if (match[MILLI_SECOND_GROUP] != null) {
            const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
            if (millisecond >= 1000)
                return null;
            components.assign("millisecond", millisecond);
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            components.assign("second", second);
        }
        return components;
    }
    extractFollowingTimeComponents(context, match, result) {
        const components = context.createParsingComponents();
        if (match[MILLI_SECOND_GROUP] != null) {
            const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
            if (millisecond >= 1000)
                return null;
            components.assign("millisecond", millisecond);
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            components.assign("second", second);
        }
        let hour = parseInt(match[HOUR_GROUP]);
        let minute = 0;
        let meridiem = -1;
        if (match[MINUTE_GROUP] != null) {
            minute = parseInt(match[MINUTE_GROUP]);
        }
        else if (hour > 100) {
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (minute >= 60 || hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12) {
                return null;
            }
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                    if (!components.isCertain("day")) {
                        components.imply("day", components.get("day") + 1);
                    }
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12)
                    hour += 12;
            }
            if (!result.start.isCertain("meridiem")) {
                if (meridiem == dist.Meridiem.AM) {
                    result.start.imply("meridiem", dist.Meridiem.AM);
                    if (result.start.get("hour") == 12) {
                        result.start.assign("hour", 0);
                    }
                }
                else {
                    result.start.imply("meridiem", dist.Meridiem.PM);
                    if (result.start.get("hour") != 12) {
                        result.start.assign("hour", result.start.get("hour") + 12);
                    }
                }
            }
        }
        components.assign("hour", hour);
        components.assign("minute", minute);
        if (meridiem >= 0) {
            components.assign("meridiem", meridiem);
        }
        else {
            const startAtPM = result.start.isCertain("meridiem") && result.start.get("hour") > 12;
            if (startAtPM) {
                if (result.start.get("hour") - 12 > hour) {
                    components.imply("meridiem", dist.Meridiem.AM);
                }
                else if (hour <= 12) {
                    components.assign("hour", hour + 12);
                    components.assign("meridiem", dist.Meridiem.PM);
                }
            }
            else if (hour > 12) {
                components.imply("meridiem", dist.Meridiem.PM);
            }
            else if (hour <= 12) {
                components.imply("meridiem", dist.Meridiem.AM);
            }
        }
        if (components.date().getTime() < result.start.date().getTime()) {
            components.imply("day", components.get("day") + 1);
        }
        return components;
    }
    checkAndReturnWithoutFollowingPattern(result) {
        if (result.text.match(/^\d$/)) {
            return null;
        }
        const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)$/);
        if (endingWithNumbers) {
            const endingNumbers = endingWithNumbers[1];
            if (this.strictMode) {
                return null;
            }
            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                return null;
            }
            const endingNumberVal = parseInt(endingNumbers);
            if (endingNumberVal > 24) {
                return null;
            }
        }
        return result;
    }
    getPrimaryTimePatternThroughCache() {
        const primaryPrefix = this.primaryPrefix();
        const primarySuffix = this.primarySuffix();
        if (this.cachedPrimaryPrefix === primaryPrefix && this.cachedPrimarySuffix === primarySuffix) {
            return this.cachedPrimaryTimePattern;
        }
        this.cachedPrimaryTimePattern = primaryTimePattern(primaryPrefix, primarySuffix);
        this.cachedPrimaryPrefix = primaryPrefix;
        this.cachedPrimarySuffix = primarySuffix;
        return this.cachedPrimaryTimePattern;
    }
    getFollowingTimePatternThroughCache() {
        const followingPhase = this.followingPhase();
        const followingSuffix = this.followingSuffix();
        if (this.cachedFollowingPhase === followingPhase && this.cachedFollowingSuffix === followingSuffix) {
            return this.cachedFollowingTimePatten;
        }
        this.cachedFollowingTimePatten = followingTimePatten(followingPhase, followingSuffix);
        this.cachedFollowingPhase = followingPhase;
        this.cachedFollowingSuffix = followingSuffix;
        return this.cachedFollowingTimePatten;
    }
}
exports.AbstractTimeExpressionParser = AbstractTimeExpressionParser;
});

var ENTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class ENTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    constructor(strictMode) {
        super(strictMode);
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|to|\\?)\\s*";
    }
    primaryPrefix() {
        return "(?:(?:at|from)\\s*)??";
    }
    primarySuffix() {
        return "(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?=\\W|$)";
    }
    extractPrimaryTimeComponents(context, match) {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
            if (match[0].endsWith("night")) {
                const hour = components.get("hour");
                if (hour >= 6 && hour < 12) {
                    components.assign("hour", components.get("hour") + 12);
                    components.assign("meridiem", dist.Meridiem.PM);
                }
                else if (hour < 6) {
                    components.assign("meridiem", dist.Meridiem.AM);
                }
            }
            if (match[0].endsWith("afternoon")) {
                components.assign("meridiem", dist.Meridiem.PM);
                const hour = components.get("hour");
                if (hour >= 0 && hour <= 6) {
                    components.assign("hour", components.get("hour") + 12);
                }
            }
            if (match[0].endsWith("morning")) {
                components.assign("meridiem", dist.Meridiem.AM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour"));
                }
            }
        }
        return components;
    }
}
exports.default = ENTimeExpressionParser;
});

var timeunits = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImpliedTimeUnits = exports.reverseTimeUnits = void 0;
function reverseTimeUnits(timeUnits) {
    const reversed = {};
    for (const key in timeUnits) {
        reversed[key] = -timeUnits[key];
    }
    return reversed;
}
exports.reverseTimeUnits = reverseTimeUnits;
function addImpliedTimeUnits(components, timeUnits) {
    const output = components.clone();
    let date = components.dayjs();
    for (const key in timeUnits) {
        date = date.add(timeUnits[key], key);
    }
    if ("day" in timeUnits || "d" in timeUnits || "week" in timeUnits || "month" in timeUnits || "year" in timeUnits) {
        output.imply("day", date.date());
        output.imply("month", date.month() + 1);
        output.imply("year", date.year());
    }
    if ("second" in timeUnits || "minute" in timeUnits || "hour" in timeUnits) {
        output.imply("second", date.second());
        output.imply("minute", date.minute());
        output.imply("hour", date.hour());
    }
    return output;
}
exports.addImpliedTimeUnits = addImpliedTimeUnits;
});

var ENTimeUnitAgoFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("" + "(" + constants$5.TIME_UNITS_PATTERN + ")" + "(?:ago|before|earlier)(?=(?:\\W|$))", "i");
const STRICT_PATTERN = new RegExp("" + "(" + constants$5.TIME_UNITS_PATTERN + ")" + "ago(?=(?:\\W|$))", "i");
class ENTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
    }
    innerExtract(context, match) {
        const timeUnits = constants$5.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits.reverseTimeUnits(timeUnits);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, outputTimeUnits);
    }
}
exports.default = ENTimeUnitAgoFormatParser;
});

var ENTimeUnitLaterFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp("" + "(" + constants$5.TIME_UNITS_PATTERN + ")" + "(later|after|from now|henceforth|forward|out)" + "(?=(?:\\W|$))", "i");
const STRICT_PATTERN = new RegExp("" + "(" + constants$5.TIME_UNITS_PATTERN + ")" + "(later|from now)" + "(?=(?:\\W|$))", "i");
const GROUP_NUM_TIMEUNITS = 1;
class ENTimeUnitLaterFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
    }
    innerExtract(context, match) {
        const fragments = constants$5.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, fragments);
    }
}
exports.default = ENTimeUnitLaterFormatParser;
});

var abstractRefiners = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergingRefiner = exports.Filter = void 0;
class Filter {
    refine(context, results) {
        return results.filter((r) => this.isValid(context, r));
    }
}
exports.Filter = Filter;
class MergingRefiner {
    refine(context, results) {
        if (results.length < 2) {
            return results;
        }
        const mergedResults = [];
        let curResult = results[0];
        let nextResult = null;
        for (let i = 1; i < results.length; i++) {
            nextResult = results[i];
            const textBetween = context.text.substring(curResult.index + curResult.text.length, nextResult.index);
            if (!this.shouldMergeResults(textBetween, curResult, nextResult, context)) {
                mergedResults.push(curResult);
                curResult = nextResult;
            }
            else {
                const left = curResult;
                const right = nextResult;
                const mergedResult = this.mergeResults(textBetween, left, right, context);
                context.debug(() => {
                    console.log(`${this.constructor.name} merged ${left} and ${right} into ${mergedResult}`);
                });
                curResult = mergedResult;
            }
        }
        if (curResult != null) {
            mergedResults.push(curResult);
        }
        return mergedResults;
    }
}
exports.MergingRefiner = MergingRefiner;
});

var AbstractMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class AbstractMergeDateRangeRefiner extends abstractRefiners.MergingRefiner {
    shouldMergeResults(textBetween, currentResult, nextResult) {
        return !currentResult.end && !nextResult.end && textBetween.match(this.patternBetween()) != null;
    }
    mergeResults(textBetween, fromResult, toResult) {
        if (!fromResult.start.isOnlyWeekdayComponent() && !toResult.start.isOnlyWeekdayComponent()) {
            toResult.start.getCertainComponents().forEach((key) => {
                if (!fromResult.start.isCertain(key)) {
                    fromResult.start.assign(key, toResult.start.get(key));
                }
            });
            fromResult.start.getCertainComponents().forEach((key) => {
                if (!toResult.start.isCertain(key)) {
                    toResult.start.assign(key, fromResult.start.get(key));
                }
            });
        }
        if (fromResult.start.date().getTime() > toResult.start.date().getTime()) {
            let fromMoment = fromResult.start.dayjs();
            let toMoment = toResult.start.dayjs();
            if (fromResult.start.isOnlyWeekdayComponent() && fromMoment.add(-7, "days").isBefore(toMoment)) {
                fromMoment = fromMoment.add(-7, "days");
                fromResult.start.imply("day", fromMoment.date());
                fromResult.start.imply("month", fromMoment.month() + 1);
                fromResult.start.imply("year", fromMoment.year());
            }
            else if (toResult.start.isOnlyWeekdayComponent() && toMoment.add(7, "days").isAfter(fromMoment)) {
                toMoment = toMoment.add(7, "days");
                toResult.start.imply("day", toMoment.date());
                toResult.start.imply("month", toMoment.month() + 1);
                toResult.start.imply("year", toMoment.year());
            }
            else {
                [toResult, fromResult] = [fromResult, toResult];
            }
        }
        const result = fromResult.clone();
        result.start = fromResult.start;
        result.end = toResult.start;
        result.index = Math.min(fromResult.index, toResult.index);
        if (fromResult.index < toResult.index) {
            result.text = fromResult.text + textBetween + toResult.text;
        }
        else {
            result.text = toResult.text + textBetween + fromResult.text;
        }
        return result;
    }
}
exports.default = AbstractMergeDateRangeRefiner;
});

var ENMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class ENMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(to|-)\s*$/i;
    }
}
exports.default = ENMergeDateRangeRefiner;
});

var mergingCalculation = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDateTimeComponent = exports.mergeDateTimeResult = void 0;

function mergeDateTimeResult(dateResult, timeResult) {
    const result = dateResult.clone();
    const beginDate = dateResult.start;
    const beginTime = timeResult.start;
    result.start = mergeDateTimeComponent(beginDate, beginTime);
    if (dateResult.end != null || timeResult.end != null) {
        const endDate = dateResult.end == null ? dateResult.start : dateResult.end;
        const endTime = timeResult.end == null ? timeResult.start : timeResult.end;
        const endDateTime = mergeDateTimeComponent(endDate, endTime);
        if (dateResult.end == null && endDateTime.date().getTime() < result.start.date().getTime()) {
            if (endDateTime.isCertain("day")) {
                endDateTime.assign("day", endDateTime.get("day") + 1);
            }
            else {
                endDateTime.imply("day", endDateTime.get("day") + 1);
            }
        }
        result.end = endDateTime;
    }
    return result;
}
exports.mergeDateTimeResult = mergeDateTimeResult;
function mergeDateTimeComponent(dateComponent, timeComponent) {
    const dateTimeComponent = dateComponent.clone();
    if (timeComponent.isCertain("hour")) {
        dateTimeComponent.assign("hour", timeComponent.get("hour"));
        dateTimeComponent.assign("minute", timeComponent.get("minute"));
        if (timeComponent.isCertain("second")) {
            dateTimeComponent.assign("second", timeComponent.get("second"));
            if (timeComponent.isCertain("millisecond")) {
                dateTimeComponent.assign("millisecond", timeComponent.get("millisecond"));
            }
            else {
                dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
            }
        }
        else {
            dateTimeComponent.imply("second", timeComponent.get("second"));
            dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
        }
    }
    else {
        dateTimeComponent.imply("hour", timeComponent.get("hour"));
        dateTimeComponent.imply("minute", timeComponent.get("minute"));
        dateTimeComponent.imply("second", timeComponent.get("second"));
        dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
    }
    if (timeComponent.isCertain("timezoneOffset")) {
        dateTimeComponent.assign("timezoneOffset", timeComponent.get("timezoneOffset"));
    }
    if (timeComponent.isCertain("meridiem")) {
        dateTimeComponent.assign("meridiem", timeComponent.get("meridiem"));
    }
    else if (timeComponent.get("meridiem") != null && dateTimeComponent.get("meridiem") == null) {
        dateTimeComponent.imply("meridiem", timeComponent.get("meridiem"));
    }
    if (dateTimeComponent.get("meridiem") == dist.Meridiem.PM && dateTimeComponent.get("hour") < 12) {
        if (timeComponent.isCertain("hour")) {
            dateTimeComponent.assign("hour", dateTimeComponent.get("hour") + 12);
        }
        else {
            dateTimeComponent.imply("hour", dateTimeComponent.get("hour") + 12);
        }
    }
    return dateTimeComponent;
}
exports.mergeDateTimeComponent = mergeDateTimeComponent;
});

var AbstractMergeDateTimeRefiner = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class ENMergeDateTimeRefiner extends abstractRefiners.MergingRefiner {
    shouldMergeResults(textBetween, currentResult, nextResult) {
        return (((currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime()) ||
            (nextResult.start.isOnlyDate() && currentResult.start.isOnlyTime())) &&
            textBetween.match(this.patternBetween()) != null);
    }
    mergeResults(textBetween, currentResult, nextResult) {
        const result = currentResult.start.isOnlyDate()
            ? mergingCalculation.mergeDateTimeResult(currentResult, nextResult)
            : mergingCalculation.mergeDateTimeResult(nextResult, currentResult);
        result.index = currentResult.index;
        result.text = currentResult.text + textBetween + nextResult.text;
        return result;
    }
}
exports.default = ENMergeDateTimeRefiner;
});

var ENMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class ENMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|at|after|before|on|of|,|-)?\\s*$");
    }
}
exports.default = ENMergeDateTimeRefiner;
});

var ExtractTimezoneAbbrRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
const TIMEZONE_NAME_PATTERN = new RegExp("^\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", "i");
const DEFAULT_TIMEZONE_ABBR_MAP = {
    ACDT: 630,
    ACST: 570,
    ADT: -180,
    AEDT: 660,
    AEST: 600,
    AFT: 270,
    AKDT: -480,
    AKST: -540,
    ALMT: 360,
    AMST: -180,
    AMT: -240,
    ANAST: 720,
    ANAT: 720,
    AQTT: 300,
    ART: -180,
    AST: -240,
    AWDT: 540,
    AWST: 480,
    AZOST: 0,
    AZOT: -60,
    AZST: 300,
    AZT: 240,
    BNT: 480,
    BOT: -240,
    BRST: -120,
    BRT: -180,
    BST: 60,
    BTT: 360,
    CAST: 480,
    CAT: 120,
    CCT: 390,
    CDT: -300,
    CEST: 120,
    CET: 60,
    CHADT: 825,
    CHAST: 765,
    CKT: -600,
    CLST: -180,
    CLT: -240,
    COT: -300,
    CST: -360,
    CVT: -60,
    CXT: 420,
    ChST: 600,
    DAVT: 420,
    EASST: -300,
    EAST: -360,
    EAT: 180,
    ECT: -300,
    EDT: -240,
    EEST: 180,
    EET: 120,
    EGST: 0,
    EGT: -60,
    EST: -300,
    ET: -300,
    FJST: 780,
    FJT: 720,
    FKST: -180,
    FKT: -240,
    FNT: -120,
    GALT: -360,
    GAMT: -540,
    GET: 240,
    GFT: -180,
    GILT: 720,
    GMT: 0,
    GST: 240,
    GYT: -240,
    HAA: -180,
    HAC: -300,
    HADT: -540,
    HAE: -240,
    HAP: -420,
    HAR: -360,
    HAST: -600,
    HAT: -90,
    HAY: -480,
    HKT: 480,
    HLV: -210,
    HNA: -240,
    HNC: -360,
    HNE: -300,
    HNP: -480,
    HNR: -420,
    HNT: -150,
    HNY: -540,
    HOVT: 420,
    ICT: 420,
    IDT: 180,
    IOT: 360,
    IRDT: 270,
    IRKST: 540,
    IRKT: 540,
    IRST: 210,
    IST: 330,
    JST: 540,
    KGT: 360,
    KRAST: 480,
    KRAT: 480,
    KST: 540,
    KUYT: 240,
    LHDT: 660,
    LHST: 630,
    LINT: 840,
    MAGST: 720,
    MAGT: 720,
    MART: -510,
    MAWT: 300,
    MDT: -360,
    MESZ: 120,
    MEZ: 60,
    MHT: 720,
    MMT: 390,
    MSD: 240,
    MSK: 240,
    MST: -420,
    MUT: 240,
    MVT: 300,
    MYT: 480,
    NCT: 660,
    NDT: -90,
    NFT: 690,
    NOVST: 420,
    NOVT: 360,
    NPT: 345,
    NST: -150,
    NUT: -660,
    NZDT: 780,
    NZST: 720,
    OMSST: 420,
    OMST: 420,
    PDT: -420,
    PET: -300,
    PETST: 720,
    PETT: 720,
    PGT: 600,
    PHOT: 780,
    PHT: 480,
    PKT: 300,
    PMDT: -120,
    PMST: -180,
    PONT: 660,
    PST: -480,
    PT: -480,
    PWT: 540,
    PYST: -180,
    PYT: -240,
    RET: 240,
    SAMT: 240,
    SAST: 120,
    SBT: 660,
    SCT: 240,
    SGT: 480,
    SRT: -180,
    SST: -660,
    TAHT: -600,
    TFT: 300,
    TJT: 300,
    TKT: 780,
    TLT: 540,
    TMT: 300,
    TVT: 720,
    ULAT: 480,
    UTC: 0,
    UYST: -120,
    UYT: -180,
    UZT: 300,
    VET: -210,
    VLAST: 660,
    VLAT: 660,
    VUT: 660,
    WAST: 120,
    WAT: 60,
    WEST: 60,
    WESZ: 60,
    WET: 0,
    WEZ: 0,
    WFT: 720,
    WGST: -120,
    WGT: -180,
    WIB: 420,
    WIT: 540,
    WITA: 480,
    WST: 780,
    WT: 0,
    YAKST: 600,
    YAKT: 600,
    YAPT: 600,
    YEKST: 360,
    YEKT: 360,
};
class ExtractTimezoneAbbrRefiner {
    constructor(timezoneOverrides) {
        this.timezone = Object.assign(Object.assign({}, DEFAULT_TIMEZONE_ABBR_MAP), timezoneOverrides);
    }
    refine(context, results) {
        var _a;
        const timezoneOverrides = (_a = context.option.timezones) !== null && _a !== void 0 ? _a : {};
        results.forEach((result) => {
            var _a, _b;
            const suffix = context.text.substring(result.index + result.text.length);
            const match = TIMEZONE_NAME_PATTERN.exec(suffix);
            if (!match) {
                return;
            }
            const timezoneAbbr = match[1].toUpperCase();
            const extractedTimezoneOffset = (_b = (_a = timezoneOverrides[timezoneAbbr]) !== null && _a !== void 0 ? _a : this.timezone[timezoneAbbr]) !== null && _b !== void 0 ? _b : null;
            if (extractedTimezoneOffset === null) {
                return;
            }
            context.debug(() => {
                console.log(`Extracting timezone: '${timezoneAbbr}' into : ${extractedTimezoneOffset}`);
            });
            const currentTimezoneOffset = result.start.get("timezoneOffset");
            if (currentTimezoneOffset !== null && extractedTimezoneOffset != currentTimezoneOffset) {
                return;
            }
            result.text += match[0];
            if (!result.start.isCertain("timezoneOffset")) {
                result.start.assign("timezoneOffset", extractedTimezoneOffset);
            }
            if (result.end != null && !result.end.isCertain("timezoneOffset")) {
                result.end.assign("timezoneOffset", extractedTimezoneOffset);
            }
        });
        return results;
    }
}
exports.default = ExtractTimezoneAbbrRefiner;
});

var ExtractTimezoneOffsetRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
const TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(?:(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?", "i");
const TIMEZONE_OFFSET_SIGN_GROUP = 1;
const TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 2;
const TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 3;
class ExtractTimezoneOffsetRefiner {
    refine(context, results) {
        results.forEach(function (result) {
            if (result.start.isCertain("timezoneOffset")) {
                return;
            }
            const suffix = context.text.substring(result.index + result.text.length);
            const match = TIMEZONE_OFFSET_PATTERN.exec(suffix);
            if (!match) {
                return;
            }
            context.debug(() => {
                console.log(`Extracting timezone: '${match[0]}' into : ${result}`);
            });
            const hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
            const minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP] || "0");
            let timezoneOffset = hourOffset * 60 + minuteOffset;
            if (match[TIMEZONE_OFFSET_SIGN_GROUP] === "-") {
                timezoneOffset = -timezoneOffset;
            }
            if (result.end != null) {
                result.end.assign("timezoneOffset", timezoneOffset);
            }
            result.start.assign("timezoneOffset", timezoneOffset);
            result.text += match[0];
        });
        return results;
    }
}
exports.default = ExtractTimezoneOffsetRefiner;
});

var OverlapRemovalRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
class OverlapRemovalRefiner {
    refine(context, results) {
        if (results.length < 2) {
            return results;
        }
        const filteredResults = [];
        let prevResult = results[0];
        for (let i = 1; i < results.length; i++) {
            const result = results[i];
            if (result.index < prevResult.index + prevResult.text.length) {
                if (result.text.length > prevResult.text.length) {
                    prevResult = result;
                }
            }
            else {
                filteredResults.push(prevResult);
                prevResult = result;
            }
        }
        if (prevResult != null) {
            filteredResults.push(prevResult);
        }
        return filteredResults;
    }
}
exports.default = OverlapRemovalRefiner;
});

var ForwardDateRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);
class ForwardDateRefiner {
    refine(context, results) {
        if (!context.option.forwardDate) {
            return results;
        }
        results.forEach(function (result) {
            let refMoment = dayjs_1.default(context.refDate);
            if (result.start.isOnlyDayMonthComponent() && refMoment.isAfter(result.start.dayjs())) {
                for (let i = 0; i < 3 && refMoment.isAfter(result.start.dayjs()); i++) {
                    result.start.imply("year", result.start.get("year") + 1);
                    context.debug(() => {
                        console.log(`Forward yearly adjusted for ${result} (${result.start})`);
                    });
                    if (result.end && !result.end.isCertain("year")) {
                        result.end.imply("year", result.end.get("year") + 1);
                        context.debug(() => {
                            console.log(`Forward yearly adjusted for ${result} (${result.end})`);
                        });
                    }
                }
            }
            if (result.start.isOnlyWeekdayComponent() && refMoment.isAfter(result.start.dayjs())) {
                if (refMoment.day() > result.start.get("weekday")) {
                    refMoment = refMoment.day(result.start.get("weekday") + 7);
                }
                else {
                    refMoment = refMoment.day(result.start.get("weekday"));
                }
                result.start.imply("day", refMoment.date());
                result.start.imply("month", refMoment.month() + 1);
                result.start.imply("year", refMoment.year());
                context.debug(() => {
                    console.log(`Forward weekly adjusted for ${result} (${result.start})`);
                });
                if (result.end && result.end.isOnlyWeekdayComponent()) {
                    if (refMoment.day() > result.end.get("weekday")) {
                        refMoment = refMoment.day(result.end.get("weekday") + 7);
                    }
                    else {
                        refMoment = refMoment.day(result.end.get("weekday"));
                    }
                    result.end.imply("day", refMoment.date());
                    result.end.imply("month", refMoment.month() + 1);
                    result.end.imply("year", refMoment.year());
                    context.debug(() => {
                        console.log(`Forward weekly adjusted for ${result} (${result.end})`);
                    });
                }
            }
        });
        return results;
    }
}
exports.default = ForwardDateRefiner;
});

var UnlikelyFormatFilter_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class UnlikelyFormatFilter extends abstractRefiners.Filter {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    isValid(context, result) {
        if (result.text.replace(" ", "").match(/^\d*(\.\d*)?$/)) {
            context.debug(() => {
                console.log(`Removing unlikely result '${result.text}'`);
            });
            return false;
        }
        if (!result.start.isValidDate()) {
            context.debug(() => {
                console.log(`Removing invalid result: ${result} (${result.start})`);
            });
            return false;
        }
        if (result.end && !result.end.isValidDate()) {
            context.debug(() => {
                console.log(`Removing invalid result: ${result} (${result.end})`);
            });
            return false;
        }
        if (this.strictMode) {
            return this.isStrictModeValid(context, result);
        }
        return true;
    }
    isStrictModeValid(context, result) {
        if (result.start.isOnlyWeekdayComponent()) {
            context.debug(() => {
                console.log(`(Strict) Removing weekday only component: ${result} (${result.end})`);
            });
            return false;
        }
        if (result.start.isOnlyTime() && (!result.start.isCertain("hour") || !result.start.isCertain("minute"))) {
            context.debug(() => {
                console.log(`(Strict) Removing uncertain time component: ${result} (${result.end})`);
            });
            return false;
        }
        return true;
    }
}
exports.default = UnlikelyFormatFilter;
});

var ISOFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})" +
    "(?:T" +
    "([0-9]{1,2}):([0-9]{1,2})" +
    "(?:" +
    ":([0-9]{1,2})(?:\\.(\\d{1,4}))?" +
    ")?" +
    "(?:" +
    "Z|([+-]\\d{2}):?(\\d{2})?" +
    ")?" +
    ")?" +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NUMBER_GROUP = 2;
const DATE_NUMBER_GROUP = 3;
const HOUR_NUMBER_GROUP = 4;
const MINUTE_NUMBER_GROUP = 5;
const SECOND_NUMBER_GROUP = 6;
const MILLISECOND_NUMBER_GROUP = 7;
const TZD_HOUR_OFFSET_GROUP = 8;
const TZD_MINUTE_OFFSET_GROUP = 9;
class ISOFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const components = {};
        components["year"] = parseInt(match[YEAR_NUMBER_GROUP]);
        components["month"] = parseInt(match[MONTH_NUMBER_GROUP]);
        components["day"] = parseInt(match[DATE_NUMBER_GROUP]);
        if (match[HOUR_NUMBER_GROUP] != null) {
            components["hour"] = parseInt(match[HOUR_NUMBER_GROUP]);
            components["minute"] = parseInt(match[MINUTE_NUMBER_GROUP]);
            if (match[SECOND_NUMBER_GROUP] != null) {
                components["second"] = parseInt(match[SECOND_NUMBER_GROUP]);
            }
            if (match[MILLISECOND_NUMBER_GROUP] != null) {
                components["millisecond"] = parseInt(match[MILLISECOND_NUMBER_GROUP]);
            }
            if (match[TZD_HOUR_OFFSET_GROUP] == null) {
                components["timezoneOffset"] = 0;
            }
            else {
                const hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
                let minuteOffset = 0;
                if (match[TZD_MINUTE_OFFSET_GROUP] != null) {
                    minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);
                }
                let offset = hourOffset * 60;
                if (offset < 0) {
                    offset -= minuteOffset;
                }
                else {
                    offset += minuteOffset;
                }
                components["timezoneOffset"] = offset;
            }
        }
        return components;
    }
}
exports.default = ISOFormatParser;
});

var MergeWeekdayComponentRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class MergeWeekdayComponentRefiner extends abstractRefiners.MergingRefiner {
    mergeResults(textBetween, currentResult, nextResult) {
        const newResult = nextResult.clone();
        newResult.index = currentResult.index;
        newResult.text = currentResult.text + textBetween + newResult.text;
        newResult.start.assign("weekday", currentResult.start.get("weekday"));
        if (newResult.end) {
            newResult.end.assign("weekday", currentResult.start.get("weekday"));
        }
        return newResult;
    }
    shouldMergeResults(textBetween, currentResult, nextResult) {
        const weekdayThenNormalDate = currentResult.start.isOnlyWeekdayComponent() &&
            !currentResult.start.isCertain("hour") &&
            nextResult.start.isCertain("day");
        return weekdayThenNormalDate && textBetween.match(/^,?\s*$/) != null;
    }
}
exports.default = MergeWeekdayComponentRefiner;
});

var configurations = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeCommonConfiguration = void 0;
const ExtractTimezoneAbbrRefiner_1$1 = __importDefault(ExtractTimezoneAbbrRefiner_1);
const ExtractTimezoneOffsetRefiner_1$1 = __importDefault(ExtractTimezoneOffsetRefiner_1);
const OverlapRemovalRefiner_1$1 = __importDefault(OverlapRemovalRefiner_1);
const ForwardDateRefiner_1$1 = __importDefault(ForwardDateRefiner_1);
const UnlikelyFormatFilter_1$1 = __importDefault(UnlikelyFormatFilter_1);
const ISOFormatParser_1$1 = __importDefault(ISOFormatParser_1);
const MergeWeekdayComponentRefiner_1$1 = __importDefault(MergeWeekdayComponentRefiner_1);
function includeCommonConfiguration(configuration, strictMode = false) {
    configuration.parsers.unshift(new ISOFormatParser_1$1.default());
    configuration.refiners.unshift(new MergeWeekdayComponentRefiner_1$1.default());
    configuration.refiners.unshift(new ExtractTimezoneAbbrRefiner_1$1.default());
    configuration.refiners.unshift(new ExtractTimezoneOffsetRefiner_1$1.default());
    configuration.refiners.unshift(new OverlapRemovalRefiner_1$1.default());
    configuration.refiners.push(new ForwardDateRefiner_1$1.default());
    configuration.refiners.push(new UnlikelyFormatFilter_1$1.default(strictMode));
    return configuration;
}
exports.includeCommonConfiguration = includeCommonConfiguration;
});

var casualReferences = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tonight = exports.tomorrow = exports.yesterday = exports.today = exports.now = void 0;

const dayjs_1 = __importDefault(dayjs_min);


function now(refDate) {
    const targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.assignSimilarTime(component, targetDate);
    return component;
}
exports.now = now;
function today(refDate) {
    const targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.implySimilarTime(component, targetDate);
    return component;
}
exports.today = today;
function yesterday(refDate) {
    let targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    targetDate = targetDate.add(-1, "day");
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.implySimilarTime(component, targetDate);
    return component;
}
exports.yesterday = yesterday;
function tomorrow(refDate) {
    const targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    dayjs.assignTheNextDay(component, targetDate);
    return component;
}
exports.tomorrow = tomorrow;
function tonight(refDate, implyHour = 22) {
    const targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    component.imply("hour", implyHour);
    component.imply("meridiem", dist.Meridiem.PM);
    dayjs.assignSimilarDate(component, targetDate);
    return component;
}
exports.tonight = tonight;
});

var ENCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const references = __importStar(casualReferences);
const PATTERN = /(now|today|tonight|tomorrow|tmr|yesterday|last\s*night)(?=\W|$)/i;
class ENCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return PATTERN;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "now":
                return references.now(context.refDate);
            case "today":
                return references.today(context.refDate);
            case "yesterday":
                return references.yesterday(context.refDate);
            case "tomorrow":
            case "tmr":
                return references.tomorrow(context.refDate);
            case "tonight":
                return references.tonight(context.refDate);
            default:
                if (lowerText.match(/last\s*night/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
                break;
        }
        return component;
    }
}
exports.default = ENCasualDateParser;
});

var ENCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);

const PATTERN = /(?:this)?\s*(morning|afternoon|evening|night|midnight|noon)(?=\W|$)/i;
class ENCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const component = context.createParsingComponents();
        switch (match[1].toLowerCase()) {
            case "afternoon":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "evening":
            case "night":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 20);
                break;
            case "midnight":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "morning":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "noon":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = ENCasualTimeParser;
});

var weeks = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDayJSClosestWeekday = exports.toDayJSWeekday = void 0;
const dayjs_1 = __importDefault(dayjs_min);
function toDayJSWeekday(refDate, offset, modifier) {
    if (!modifier) {
        return toDayJSClosestWeekday(refDate, offset);
    }
    let date = dayjs_1.default(refDate);
    switch (modifier) {
        case "this":
            date = date.day(offset);
            break;
        case "next":
            date = date.day(offset + 7);
            break;
        case "last":
            date = date.day(offset - 7);
            break;
    }
    return date;
}
exports.toDayJSWeekday = toDayJSWeekday;
function toDayJSClosestWeekday(refDate, offset) {
    let date = dayjs_1.default(refDate);
    const refOffset = date.day();
    if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
        date = date.day(offset - 7);
    }
    else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
        date = date.day(offset + 7);
    }
    else {
        date = date.day(offset);
    }
    return date;
}
exports.toDayJSClosestWeekday = toDayJSClosestWeekday;
});

var ENWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:on\\s*?)?" +
    "(?:(this|last|past|next)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$5.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(this|last|past|next)\\s*week)?" +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class ENWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$5.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "last" || modifierWord == "past") {
            modifier = "last";
        }
        else if (modifierWord == "next") {
            modifier = "next";
        }
        else if (modifierWord == "this") {
            modifier = "this";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = ENWeekdayParser;
});

var ENRelativeDateFormatParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp(`(this|next|last|past)\\s*(${pattern.matchAnyPattern(constants$5.TIME_UNIT_DICTIONARY)})(?=\\s*)` + "(?=\\W|$)", "i");
const MODIFIER_WORD_GROUP = 1;
const RELATIVE_WORD_GROUP = 2;
class ENRelativeDateFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
        const timeunit = constants$5.TIME_UNIT_DICTIONARY[unitWord];
        if (modifier == "next") {
            const timeUnits = {};
            timeUnits[timeunit] = 1;
            return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
        }
        if (modifier == "last" || modifier == "past") {
            const timeUnits = {};
            timeUnits[timeunit] = -1;
            return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
        }
        const components = context.createParsingComponents();
        let date = dayjs_1.default(context.refDate);
        if (unitWord.match(/week/i)) {
            date = date.add(-date.get("d"), "d");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.imply("year", date.year());
        }
        else if (unitWord.match(/month/i)) {
            date = date.add(-date.date() + 1, "d");
            components.imply("day", date.date());
            components.assign("year", date.year());
            components.assign("month", date.month() + 1);
        }
        else if (unitWord.match(/year/i)) {
            date = date.add(-date.date() + 1, "d");
            date = date.add(-date.month(), "month");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.assign("year", date.year());
        }
        return components;
    }
}
exports.default = ENRelativeDateFormatParser;
});

var chrono$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingContext = exports.Chrono = void 0;


class Chrono {
    constructor(configuration) {
        configuration = configuration || en.createCasualConfiguration();
        this.parsers = [...configuration.parsers];
        this.refiners = [...configuration.refiners];
    }
    clone() {
        return new Chrono({
            parsers: [...this.parsers],
            refiners: [...this.refiners],
        });
    }
    parseDate(text, referenceDate, option) {
        const results = this.parse(text, referenceDate, option);
        return results.length > 0 ? results[0].start.date() : null;
    }
    parse(text, referenceDate, option) {
        const context = new ParsingContext(text, referenceDate || new Date(), option || {});
        let results = [];
        this.parsers.forEach((parser) => {
            const parsedResults = Chrono.executeParser(context, parser);
            results = results.concat(parsedResults);
        });
        results.sort((a, b) => {
            return a.index - b.index;
        });
        this.refiners.forEach(function (refiner) {
            results = refiner.refine(context, results);
        });
        return results;
    }
    static executeParser(context, parser) {
        const results$1 = [];
        const pattern = parser.pattern(context);
        const originalText = context.text;
        let remainingText = context.text;
        let match = pattern.exec(remainingText);
        while (match) {
            const index = match.index + originalText.length - remainingText.length;
            match.index = index;
            const result = parser.extract(context, match);
            if (!result) {
                remainingText = originalText.substring(match.index + 1);
                match = pattern.exec(remainingText);
                continue;
            }
            let parsedResult = null;
            if (result instanceof results.ParsingResult) {
                parsedResult = result;
            }
            else if (result instanceof results.ParsingComponents) {
                parsedResult = context.createParsingResult(match.index, match[0]);
                parsedResult.start = result;
            }
            else {
                parsedResult = context.createParsingResult(match.index, match[0], result);
            }
            context.debug(() => console.log(`${parser.constructor.name} extracted result ${parsedResult}`));
            results$1.push(parsedResult);
            remainingText = originalText.substring(index + parsedResult.text.length);
            match = pattern.exec(remainingText);
        }
        return results$1;
    }
}
exports.Chrono = Chrono;
class ParsingContext {
    constructor(text, refDate, option) {
        this.text = text;
        this.refDate = refDate;
        this.option = option;
    }
    createParsingComponents(components) {
        if (components instanceof results.ParsingComponents) {
            return components;
        }
        return new results.ParsingComponents(this.refDate, components);
    }
    createParsingResult(index, textOrEndIndex, startComponents, endComponents) {
        const text = typeof textOrEndIndex === "string" ? textOrEndIndex : this.text.substring(index, textOrEndIndex);
        const start = startComponents ? this.createParsingComponents(startComponents) : null;
        const end = endComponents ? this.createParsingComponents(endComponents) : null;
        return new results.ParsingResult(this.refDate, index, text, start, end);
    }
    debug(block) {
        if (this.option.debug) {
            if (this.option.debug instanceof Function) {
                this.option.debug(block);
            }
            else {
                const handler = this.option.debug;
                handler.debug(block);
            }
        }
    }
}
exports.ParsingContext = ParsingContext;
});

var SlashDateFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([^\\d]|^)" +
    "([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})" +
    "(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?" +
    "(\\W|$)", "i");
const OPENING_GROUP = 1;
const ENDING_GROUP = 5;
const FIRST_NUMBERS_GROUP = 2;
const SECOND_NUMBERS_GROUP = 3;
const YEAR_GROUP = 4;
class SlashDateFormatParser {
    constructor(littleEndian) {
        this.groupNumberMonth = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
        this.groupNumberDay = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;
    }
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        if (match[OPENING_GROUP] == "/" || match[ENDING_GROUP] == "/") {
            match.index += match[0].length;
            return;
        }
        const index = match.index + match[OPENING_GROUP].length;
        const text = match[0].substr(match[OPENING_GROUP].length, match[0].length - match[OPENING_GROUP].length - match[ENDING_GROUP].length);
        if (text.match(/^\d\.\d$/) || text.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/)) {
            return;
        }
        if (!match[YEAR_GROUP] && match[0].indexOf("/") < 0) {
            return;
        }
        const result = context.createParsingResult(index, text);
        let month = parseInt(match[this.groupNumberMonth]);
        let day = parseInt(match[this.groupNumberDay]);
        if (month < 1 || month > 12) {
            if (month > 12) {
                if (day >= 1 && day <= 12 && month <= 31) {
                    [day, month] = [month, day];
                }
                else {
                    return null;
                }
            }
        }
        if (day < 1 || day > 31) {
            return null;
        }
        result.start.assign("day", day);
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
            const rawYearNumber = parseInt(match[YEAR_GROUP]);
            const year = years.findMostLikelyADYear(rawYearNumber);
            result.start.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        return result;
    }
}
exports.default = SlashDateFormatParser;
});

var ENTimeUnitCasualRelativeFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp(`(this|last|past|next|\\+|-)\\s*(${constants$5.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
class ENTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const prefix = match[1].toLowerCase();
        let timeUnits = constants$5.parseTimeUnits(match[2]);
        switch (prefix) {
            case "last":
            case "past":
            case "-":
                timeUnits = timeunits.reverseTimeUnits(timeUnits);
                break;
        }
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = ENTimeUnitCasualRelativeFormatParser;
});

var en = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.GB = exports.strict = exports.casual = void 0;
const ENTimeUnitWithinFormatParser_1$1 = __importDefault(ENTimeUnitWithinFormatParser_1);
const ENMonthNameLittleEndianParser_1$1 = __importDefault(ENMonthNameLittleEndianParser_1);
const ENMonthNameMiddleEndianParser_1$1 = __importDefault(ENMonthNameMiddleEndianParser_1);
const ENMonthNameParser_1$1 = __importDefault(ENMonthNameParser_1);
const ENCasualYearMonthDayParser_1$1 = __importDefault(ENCasualYearMonthDayParser_1);
const ENSlashMonthFormatParser_1$1 = __importDefault(ENSlashMonthFormatParser_1);
const ENTimeExpressionParser_1$1 = __importDefault(ENTimeExpressionParser_1);
const ENTimeUnitAgoFormatParser_1$1 = __importDefault(ENTimeUnitAgoFormatParser_1);
const ENTimeUnitLaterFormatParser_1$1 = __importDefault(ENTimeUnitLaterFormatParser_1);
const ENMergeDateRangeRefiner_1$1 = __importDefault(ENMergeDateRangeRefiner_1);
const ENMergeDateTimeRefiner_1$1 = __importDefault(ENMergeDateTimeRefiner_1);

const ENCasualDateParser_1$1 = __importDefault(ENCasualDateParser_1);
const ENCasualTimeParser_1$1 = __importDefault(ENCasualTimeParser_1);
const ENWeekdayParser_1$1 = __importDefault(ENWeekdayParser_1);
const ENRelativeDateFormatParser_1$1 = __importDefault(ENRelativeDateFormatParser_1);

const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const ENTimeUnitCasualRelativeFormatParser_1$1 = __importDefault(ENTimeUnitCasualRelativeFormatParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration(false));
exports.strict = new chrono$1.Chrono(createConfiguration(true, false));
exports.GB = new chrono$1.Chrono(createConfiguration(false, true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = false) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new ENCasualDateParser_1$1.default());
    option.parsers.unshift(new ENCasualTimeParser_1$1.default());
    option.parsers.unshift(new ENMonthNameParser_1$1.default());
    option.parsers.unshift(new ENRelativeDateFormatParser_1$1.default());
    option.parsers.unshift(new ENTimeUnitCasualRelativeFormatParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = false) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new ENTimeUnitWithinFormatParser_1$1.default(),
            new ENMonthNameLittleEndianParser_1$1.default(),
            new ENMonthNameMiddleEndianParser_1$1.default(),
            new ENWeekdayParser_1$1.default(),
            new ENCasualYearMonthDayParser_1$1.default(),
            new ENSlashMonthFormatParser_1$1.default(),
            new ENTimeExpressionParser_1$1.default(strictMode),
            new ENTimeUnitAgoFormatParser_1$1.default(strictMode),
            new ENTimeUnitLaterFormatParser_1$1.default(strictMode),
        ],
        refiners: [new ENMergeDateTimeRefiner_1$1.default(), new ENMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var DETimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class DETimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:um|von)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|bis)\\s*";
    }
    primarySuffix() {
        return "(?:\\s*uhr)?(?:\\s*(?:morgens|vormittags|nachmittags|abends|nachts))?(?=\\W|$)";
    }
    extractPrimaryTimeComponents(context, match) {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
            if (match[0].endsWith("morgens") || match[0].endsWith("vormittags")) {
                components.assign("meridiem", dist.Meridiem.AM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour"));
                }
            }
            if (match[0].endsWith("nachmittags") || match[0].endsWith("abends") || match[0].endsWith("nachts")) {
                components.assign("meridiem", dist.Meridiem.PM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour") + 12);
                }
            }
        }
        return components;
    }
}
exports.default = DETimeExpressionParser;
});

var constants$4 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    "sonntag": 0,
    "so": 0,
    "montag": 1,
    "mo": 1,
    "dienstag": 2,
    "di": 2,
    "mittwoch": 3,
    "mi": 3,
    "donnerstag": 4,
    "do": 4,
    "freitag": 5,
    "fr": 5,
    "samstag": 6,
    "sa": 6,
};
exports.MONTH_DICTIONARY = {
    "januar": 1,
    "jan": 1,
    "jan.": 1,
    "februar": 2,
    "feb": 2,
    "feb.": 2,
    "märz": 3,
    "maerz": 3,
    "mär": 3,
    "mär.": 3,
    "mrz": 3,
    "mrz.": 3,
    "april": 4,
    "apr": 4,
    "apr.": 4,
    "mai": 5,
    "juni": 6,
    "jun": 6,
    "jun.": 6,
    "juli": 7,
    "jul": 7,
    "jul.": 7,
    "august": 8,
    "aug": 8,
    "aug.": 8,
    "september": 9,
    "sep": 9,
    "sep.": 9,
    "sept": 9,
    "sept.": 9,
    "oktober": 10,
    "okt": 10,
    "okt.": 10,
    "november": 11,
    "nov": 11,
    "nov.": 11,
    "dezember": 12,
    "dez": 12,
    "dez.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    "eins": 1,
    "zwei": 2,
    "drei": 3,
    "vier": 4,
    "fünf": 5,
    "fuenf": 5,
    "sechs": 6,
    "sieben": 7,
    "acht": 8,
    "neun": 9,
    "zehn": 10,
    "elf": 11,
    "zwölf": 12,
    "zwoelf": 12,
};
exports.TIME_UNIT_DICTIONARY = {
    sec: "second",
    second: "second",
    seconds: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minutes: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hour: "hour",
    hours: "hour",
    day: "d",
    days: "d",
    week: "week",
    weeks: "week",
    month: "month",
    months: "month",
    y: "year",
    yr: "year",
    year: "year",
    years: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "a" || num === "an") {
        return 1;
    }
    else if (num.match(/few/)) {
        return 3;
    }
    else if (num.match(/half/)) {
        return 0.5;
    }
    else if (num.match(/couple/)) {
        return 2;
    }
    else if (num.match(/several/)) {
        return 7;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.YEAR_PATTERN = `(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*C(?:hr)?\\.?)?)`;
function parseYear(match) {
    if (/v/i.test(match)) {
        return -parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    if (/n/i.test(match)) {
        return parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
});

var DEWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:a[mn]\\s*?)?" +
    "(?:(diese[mn]|letzte[mn]|n(?:ä|ae)chste[mn])\\s*)?" +
    `(${pattern.matchAnyPattern(constants$4.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(diese|letzte|n(?:ä|ae)chste)\\s*woche)?" +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const SUFFIX_GROUP = 3;
const WEEKDAY_GROUP = 2;
class DEWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$4.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[SUFFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord.match(/letzte/)) {
            modifier = "last";
        }
        else if (modifierWord.match(/chste/)) {
            modifier = "next";
        }
        else if (modifierWord.match(/diese/)) {
            modifier = "this";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = DEWeekdayParser;
});

var DEMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class DEMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(bis(?:\s*(?:am|zum))?|-)\s*$/i;
    }
}
exports.default = DEMergeDateRangeRefiner;
});

var DEMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class DEMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|um|am|,|-)?\\s*$");
    }
}
exports.default = DEMergeDateTimeRefiner;
});

var DECasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);




class DECasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(diesen)?\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const timeKeywordPattern = match[2].toLowerCase();
        const component = context.createParsingComponents();
        dayjs.implySimilarTime(component, targetDate);
        return DECasualTimeParser.extractTimeComponents(component, timeKeywordPattern);
    }
    static extractTimeComponents(component, timeKeywordPattern) {
        switch (timeKeywordPattern) {
            case "morgen":
                component.imply("hour", 6);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "vormittag":
                component.imply("hour", 9);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "mittag":
            case "mittags":
                component.imply("hour", 12);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "nachmittag":
                component.imply("hour", 15);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "abend":
                component.imply("hour", 18);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "nacht":
                component.imply("hour", 22);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "mitternacht":
                if (component.get("hour") > 1) {
                    component = timeunits.addImpliedTimeUnits(component, { "day": 1 });
                }
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
        }
        return component;
    }
}
exports.default = DECasualTimeParser;
});

var DECasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const DECasualTimeParser_1$1 = __importDefault(DECasualTimeParser_1);
const references = __importStar(casualReferences);
const PATTERN = new RegExp(`(jetzt|heute|morgen|übermorgen|uebermorgen|gestern|vorgestern|letzte\\s*nacht)` +
    `(?:\\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const TIME_GROUP = 2;
class DECasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return PATTERN;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const dateKeyword = (match[DATE_GROUP] || "").toLowerCase();
        const timeKeyword = (match[TIME_GROUP] || "").toLowerCase();
        let component = context.createParsingComponents();
        switch (dateKeyword) {
            case "jetzt":
                component = references.now(context.refDate);
                break;
            case "heute":
                component = references.today(context.refDate);
                break;
            case "morgen":
                dayjs.assignTheNextDay(component, targetDate);
                break;
            case "übermorgen":
            case "uebermorgen":
                targetDate = targetDate.add(1, "day");
                dayjs.assignTheNextDay(component, targetDate);
                break;
            case "gestern":
                targetDate = targetDate.add(-1, "day");
                dayjs.assignSimilarDate(component, targetDate);
                dayjs.implySimilarTime(component, targetDate);
                break;
            case "vorgestern":
                targetDate = targetDate.add(-2, "day");
                dayjs.assignSimilarDate(component, targetDate);
                dayjs.implySimilarTime(component, targetDate);
                break;
            default:
                if (dateKeyword.match(/letzte\s*nacht/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
                break;
        }
        if (timeKeyword) {
            component = DECasualTimeParser_1$1.default.extractTimeComponents(component, timeKeyword);
        }
        return component;
    }
}
exports.default = DECasualDateParser;
});

var DEMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$4;


const PATTERN = new RegExp("(?:am\\s*?)?" +
    "(?:den\\s*?)?" +
    `([0-9]{1,2})\\.` +
    `(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\–|\\s)\\s*([0-9]{1,2})\\.?)?\\s*` +
    `(${pattern.matchAnyPattern(constants$4.MONTH_DICTIONARY)})` +
    `(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class DEMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$4.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = parseInt(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = DEMonthNameLittleEndianParser;
});

var de = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const ISOFormatParser_1$1 = __importDefault(ISOFormatParser_1);
const DETimeExpressionParser_1$1 = __importDefault(DETimeExpressionParser_1);
const DEWeekdayParser_1$1 = __importDefault(DEWeekdayParser_1);
const DEMergeDateRangeRefiner_1$1 = __importDefault(DEMergeDateRangeRefiner_1);
const DEMergeDateTimeRefiner_1$1 = __importDefault(DEMergeDateTimeRefiner_1);
const DECasualDateParser_1$1 = __importDefault(DECasualDateParser_1);
const DECasualTimeParser_1$1 = __importDefault(DECasualTimeParser_1);
const DEMonthNameLittleEndianParser_1$1 = __importDefault(DEMonthNameLittleEndianParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new DECasualTimeParser_1$1.default());
    option.parsers.unshift(new DECasualDateParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new ISOFormatParser_1$1.default(),
            new SlashDateFormatParser_1$1.default(littleEndian),
            new DETimeExpressionParser_1$1.default(),
            new DEMonthNameLittleEndianParser_1$1.default(),
            new DEWeekdayParser_1$1.default(),
        ],
        refiners: [new DEMergeDateRangeRefiner_1$1.default(), new DEMergeDateTimeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var FRCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);



const references = __importStar(casualReferences);
class FRCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(maintenant|aujourd'hui|demain|hier|cette\s*nuit|la\s*veille)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "maintenant":
                return references.now(context.refDate);
            case "aujourd'hui":
                return references.today(context.refDate);
            case "hier":
                return references.yesterday(context.refDate);
            case "demain":
                return references.tomorrow(context.refDate);
            default:
                if (lowerText.match(/cette\s*nuit/)) {
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 22);
                    component.imply("meridiem", dist.Meridiem.PM);
                }
                else if (lowerText.match(/la\s*veille/)) {
                    targetDate = targetDate.add(-1, "day");
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
        }
        return component;
    }
}
exports.default = FRCasualDateParser;
});

var FRCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class FRCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(cet?)?\s*(matin|soir|après-midi|aprem|a midi|à minuit)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const suffixLower = match[2].toLowerCase();
        const component = context.createParsingComponents();
        switch (suffixLower) {
            case "après-midi":
            case "aprem":
                component.imply("hour", 14);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "soir":
                component.imply("hour", 18);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "matin":
                component.imply("hour", 8);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "a midi":
                component.imply("hour", 12);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "à minuit":
                component.imply("hour", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
        }
        return component;
    }
}
exports.default = FRCasualTimeParser;
});

var FRTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class FRTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:[àa])\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*";
    }
    extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
            return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
    }
}
exports.default = FRTimeExpressionParser;
});

var FRMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class FRMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|à|a|vers|de|,|-)?\\s*$");
    }
}
exports.default = FRMergeDateTimeRefiner;
});

var FRMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class FRMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(à|a|-)\s*$/i;
    }
}
exports.default = FRMergeDateRangeRefiner;
});

var constants$3 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;

exports.WEEKDAY_DICTIONARY = {
    "dimanche": 0,
    "dim": 0,
    "lundi": 1,
    "lun": 1,
    "mardi": 2,
    "mar": 2,
    "mercredi": 3,
    "mer": 3,
    "jeudi": 4,
    "jeu": 4,
    "vendredi": 5,
    "ven": 5,
    "samedi": 6,
    "sam": 6,
};
exports.MONTH_DICTIONARY = {
    "janvier": 1,
    "jan": 1,
    "jan.": 1,
    "février": 2,
    "fév": 2,
    "fév.": 2,
    "fevrier": 2,
    "fev": 2,
    "fev.": 2,
    "mars": 3,
    "mar": 3,
    "mar.": 3,
    "avril": 4,
    "avr": 4,
    "avr.": 4,
    "mai": 5,
    "juin": 6,
    "jun": 6,
    "juillet": 7,
    "juil": 7,
    "jul": 7,
    "jul.": 7,
    "août": 8,
    "aout": 8,
    "septembre": 9,
    "sep": 9,
    "sep.": 9,
    "sept": 9,
    "sept.": 9,
    "octobre": 10,
    "oct": 10,
    "oct.": 10,
    "novembre": 11,
    "nov": 11,
    "nov.": 11,
    "décembre": 12,
    "decembre": 12,
    "dec": 12,
    "dec.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    "un": 1,
    "deux": 2,
    "trois": 3,
    "quatre": 4,
    "cinq": 5,
    "six": 6,
    "sept": 7,
    "huit": 8,
    "neuf": 9,
    "dix": 10,
    "onze": 11,
    "douze": 12,
    "treize": 13,
};
exports.TIME_UNIT_DICTIONARY = {
    "sec": "second",
    "seconde": "second",
    "secondes": "second",
    "min": "minute",
    "mins": "minute",
    "minute": "minute",
    "minutes": "minute",
    "h": "hour",
    "hr": "hour",
    "hrs": "hour",
    "heure": "hour",
    "heures": "hour",
    "jour": "d",
    "jours": "d",
    "semaine": "week",
    "semaines": "week",
    "mois": "month",
    "trimestre": "quarter",
    "trimestres": "quarter",
    "ans": "year",
    "année": "year",
    "années": "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|une?|quelques?|demi-?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "une" || num === "un") {
        return 1;
    }
    else if (num.match(/quelques?/)) {
        return 3;
    }
    else if (num.match(/demi-?/)) {
        return 0.5;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:[0-9]{1,2}(?:er)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    num = num.replace(/(?:er)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:AC|AD|p\\.\\s*C(?:hr?)?\\.\\s*n\\.)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/AC/i.test(match)) {
        match = match.replace(/BC/i, "");
        return -parseInt(match);
    }
    if (/AD/i.test(match) || /C/i.test(match)) {
        match = match.replace(/[^\d]+/i, "");
        return parseInt(match);
    }
    let yearNumber = parseInt(match);
    if (yearNumber < 100) {
        if (yearNumber > 50) {
            yearNumber = yearNumber + 1900;
        }
        else {
            yearNumber = yearNumber + 2000;
        }
    }
    return yearNumber;
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
});

var FRWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:(?:ce)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$3.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(dernier|prochain)\\s*)?" +
    "(?=\\W|\\d|$)", "i");
const WEEKDAY_GROUP = 1;
const POSTFIX_GROUP = 2;
class FRWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$3.WEEKDAY_DICTIONARY[dayOfWeek];
        if (offset === undefined) {
            return null;
        }
        let suffix = match[POSTFIX_GROUP];
        suffix = suffix || "";
        suffix = suffix.toLowerCase();
        let modifier = null;
        if (suffix == "dernier") {
            modifier = "last";
        }
        else if (suffix == "prochain") {
            modifier = "next";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = FRWeekdayParser;
});

var FRSpecificTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" +
    "(?:(?:[àa])\\s*)?" +
    "(\\d{1,2})(?:h|:)?" +
    "(?:(\\d{1,2})(?:m|:)?)?" +
    "(?:(\\d{1,2})(?:s|:)?)?" +
    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
    "(?=\\W|$)", "i");
const SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*" +
    "(\\d{1,2})(?:h|:)?" +
    "(?:(\\d{1,2})(?:m|:)?)?" +
    "(?:(\\d{1,2})(?:s|:)?)?" +
    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
    "(?=\\W|$)", "i");
const HOUR_GROUP = 2;
const MINUTE_GROUP = 3;
const SECOND_GROUP = 4;
const AM_PM_HOUR_GROUP = 5;
class FRSpecificTimeExpressionParser {
    pattern(context) {
        return FIRST_REG_PATTERN;
    }
    extract(context, match) {
        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
        if (result.text.match(/^\d{4}$/)) {
            match.index += match[0].length;
            return null;
        }
        result.start = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
        if (!result.start) {
            match.index += match[0].length;
            return null;
        }
        const remainingText = context.text.substring(match.index + match[0].length);
        const secondMatch = SECOND_REG_PATTERN.exec(remainingText);
        if (secondMatch) {
            result.end = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
            if (result.end) {
                result.text += secondMatch[0];
            }
        }
        return result;
    }
    static extractTimeComponent(extractingComponents, match) {
        let hour = 0;
        let minute = 0;
        let meridiem = null;
        hour = parseInt(match[HOUR_GROUP]);
        if (match[MINUTE_GROUP] != null) {
            minute = parseInt(match[MINUTE_GROUP]);
        }
        if (minute >= 60 || hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12) {
                    hour += 12;
                }
            }
        }
        extractingComponents.assign("hour", hour);
        extractingComponents.assign("minute", minute);
        if (meridiem !== null) {
            extractingComponents.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                extractingComponents.imply("meridiem", dist.Meridiem.AM);
            }
            else {
                extractingComponents.imply("meridiem", dist.Meridiem.PM);
            }
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            extractingComponents.assign("second", second);
        }
        return extractingComponents;
    }
}
exports.default = FRSpecificTimeExpressionParser;
});

var FRMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$3;
const constants_3 = constants$3;


const PATTERN = new RegExp("(?:on\\s*?)?" +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    `(?:\\s*(?:au|\\-|\\–|jusqu'au?|\\s)\\s*(${constants_3.ORDINAL_NUMBER_PATTERN}))?` +
    `(?:-|/|\\s*(?:de)?\\s*)` +
    `(${pattern.matchAnyPattern(constants$3.MONTH_DICTIONARY)})` +
    `(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class FRMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$3.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = FRMonthNameLittleEndianParser;
});

var FRTimeUnitAgoFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




class FRTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor() {
        super();
    }
    innerPattern() {
        return new RegExp(`il y a\\s*(${constants$3.TIME_UNITS_PATTERN})(?=(?:\\W|$))`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants$3.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits.reverseTimeUnits(timeUnits);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, outputTimeUnits);
    }
}
exports.default = FRTimeUnitAgoFormatParser;
});

var FRTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



class FRTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return new RegExp(`(?:dans|en|pour|pendant)\\s*(${constants$3.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants$3.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = FRTimeUnitWithinFormatParser;
});

var FRTimeUnitRelativeFormatParser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });





class FRTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor() {
        super();
    }
    innerPattern() {
        return new RegExp(`(?:les?|la|l'|du|des?)\\s*` +
            `(${constants$3.NUMBER_PATTERN})?` +
            `(?:\\s*(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?))?` +
            `\\s*(${pattern.matchAnyPattern(constants$3.TIME_UNIT_DICTIONARY)})` +
            `(?:\\s*(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?))?`, "i");
    }
    innerExtract(context, match) {
        const num = match[1] ? constants$3.parseNumberPattern(match[1]) : 1;
        const unit = constants$3.TIME_UNIT_DICTIONARY[match[3].toLowerCase()];
        let timeUnits = {};
        timeUnits[unit] = num;
        let modifier = match[2] || match[4] || "";
        modifier = modifier.toLowerCase();
        if (!modifier) {
            return;
        }
        if (/derni[eè]re?s?/.test(modifier) || /pass[ée]e?s?/.test(modifier) || /pr[ée]c[ée]dents?/.test(modifier)) {
            timeUnits = timeunits.reverseTimeUnits(timeUnits);
        }
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = FRTimeUnitAgoFormatParser;
});

var fr = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const FRCasualDateParser_1$1 = __importDefault(FRCasualDateParser_1);
const FRCasualTimeParser_1$1 = __importDefault(FRCasualTimeParser_1);
const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const FRTimeExpressionParser_1$1 = __importDefault(FRTimeExpressionParser_1);
const FRMergeDateTimeRefiner_1$1 = __importDefault(FRMergeDateTimeRefiner_1);
const FRMergeDateRangeRefiner_1$1 = __importDefault(FRMergeDateRangeRefiner_1);
const FRWeekdayParser_1$1 = __importDefault(FRWeekdayParser_1);
const FRSpecificTimeExpressionParser_1$1 = __importDefault(FRSpecificTimeExpressionParser_1);
const FRMonthNameLittleEndianParser_1$1 = __importDefault(FRMonthNameLittleEndianParser_1);
const FRTimeUnitAgoFormatParser_1$1 = __importDefault(FRTimeUnitAgoFormatParser_1);
const FRTimeUnitWithinFormatParser_1$1 = __importDefault(FRTimeUnitWithinFormatParser_1);
const FRTimeUnitRelativeFormatParser_1 = __importDefault(FRTimeUnitRelativeFormatParser);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new FRCasualDateParser_1$1.default());
    option.parsers.unshift(new FRCasualTimeParser_1$1.default());
    option.parsers.unshift(new FRTimeUnitRelativeFormatParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new FRMonthNameLittleEndianParser_1$1.default(),
            new FRTimeExpressionParser_1$1.default(),
            new FRSpecificTimeExpressionParser_1$1.default(),
            new FRTimeUnitAgoFormatParser_1$1.default(),
            new FRTimeUnitWithinFormatParser_1$1.default(),
            new FRWeekdayParser_1$1.default(),
        ],
        refiners: [new FRMergeDateTimeRefiner_1$1.default(), new FRMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var constants$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHankaku = void 0;
function toHankaku(text) {
    return String(text)
        .replace(/\u2019/g, "\u0027")
        .replace(/\u201D/g, "\u0022")
        .replace(/\u3000/g, "\u0020")
        .replace(/\uFFE5/g, "\u00A5")
        .replace(/[\uFF01\uFF03-\uFF06\uFF08\uFF09\uFF0C-\uFF19\uFF1C-\uFF1F\uFF21-\uFF3B\uFF3D\uFF3F\uFF41-\uFF5B\uFF5D\uFF5E]/g, alphaNum);
}
exports.toHankaku = toHankaku;
function alphaNum(token) {
    return String.fromCharCode(token.charCodeAt(0) - 65248);
}
});

var JPStandardParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);
const PATTERN = /(?:(?:([同今本])|((昭和|平成|令和)?([0-9０-９]{1,4}|元)))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i;
const SPECIAL_YEAR_GROUP = 1;
const TYPICAL_YEAR_GROUP = 2;
const ERA_GROUP = 3;
const YEAR_NUMBER_GROUP = 4;
const MONTH_GROUP = 5;
const DAY_GROUP = 6;
class JPStandardParser {
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        const month = parseInt(constants$2.toHankaku(match[MONTH_GROUP]));
        const day = parseInt(constants$2.toHankaku(match[DAY_GROUP]));
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[SPECIAL_YEAR_GROUP] && match[SPECIAL_YEAR_GROUP].match("同|今|本")) {
            const moment = dayjs_1.default(context.refDate);
            components.assign("year", moment.year());
        }
        if (match[TYPICAL_YEAR_GROUP]) {
            const yearNumText = match[YEAR_NUMBER_GROUP];
            let year = yearNumText == "元" ? 1 : parseInt(constants$2.toHankaku(yearNumText));
            if (match[ERA_GROUP] == "令和") {
                year += 2018;
            }
            else if (match[ERA_GROUP] == "平成") {
                year += 1988;
            }
            else if (match[ERA_GROUP] == "昭和") {
                year += 1925;
            }
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        return components;
    }
}
exports.default = JPStandardParser;
});

var JPMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class JPMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(から|ー|-)\s*$/i;
    }
}
exports.default = JPMergeDateRangeRefiner;
});

var JPCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);

const references = __importStar(casualReferences);
const PATTERN = /今日|当日|昨日|明日|今夜|今夕|今晩|今朝/i;
class JPCasualDateParser {
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        const text = match[0];
        const date = dayjs_1.default(context.refDate);
        const components = context.createParsingComponents();
        switch (text) {
            case "昨日":
                return references.yesterday(context.refDate);
            case "明日":
                return references.tomorrow(context.refDate);
            case "今日":
            case "当日":
                return references.today(context.refDate);
        }
        if (text == "今夜" || text == "今夕" || text == "今晩") {
            components.imply("hour", 22);
            components.assign("meridiem", dist.Meridiem.PM);
        }
        else if (text.match("今朝")) {
            components.imply("hour", 6);
            components.assign("meridiem", dist.Meridiem.AM);
        }
        components.assign("day", date.date());
        components.assign("month", date.month() + 1);
        components.assign("year", date.year());
        return components;
    }
}
exports.default = JPCasualDateParser;
});

var ja = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
const JPStandardParser_1$1 = __importDefault(JPStandardParser_1);
const JPMergeDateRangeRefiner_1$1 = __importDefault(JPMergeDateRangeRefiner_1);
const JPCasualDateParser_1$1 = __importDefault(JPCasualDateParser_1);

exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration());
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration() {
    const option = createConfiguration();
    option.parsers.unshift(new JPCasualDateParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration() {
    return {
        parsers: [new JPStandardParser_1$1.default()],
        refiners: [new JPMergeDateRangeRefiner_1$1.default()],
    };
}
exports.createConfiguration = createConfiguration;
});

var constants$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYear = exports.YEAR_PATTERN = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
exports.WEEKDAY_DICTIONARY = {
    "domingo": 0,
    "dom": 0,
    "segunda": 1,
    "segunda-feira": 1,
    "seg": 1,
    "terça": 2,
    "terça-feira": 2,
    "ter": 2,
    "quarta": 3,
    "quarta-feira": 3,
    "qua": 3,
    "quinta": 4,
    "quinta-feira": 4,
    "qui": 4,
    "sexta": 5,
    "sexta-feira": 5,
    "sex": 5,
    "sábado": 6,
    "sabado": 6,
    "sab": 6,
};
exports.MONTH_DICTIONARY = {
    "janeiro": 1,
    "jan": 1,
    "jan.": 1,
    "fevereiro": 2,
    "fev": 2,
    "fev.": 2,
    "março": 3,
    "mar": 3,
    "mar.": 3,
    "abril": 4,
    "abr": 4,
    "abr.": 4,
    "maio": 5,
    "mai": 5,
    "mai.": 5,
    "junho": 6,
    "jun": 6,
    "jun.": 6,
    "julho": 7,
    "jul": 7,
    "jul.": 7,
    "agosto": 8,
    "ago": 8,
    "ago.": 8,
    "setembro": 9,
    "set": 9,
    "set.": 9,
    "outubro": 10,
    "out": 10,
    "out.": 10,
    "novembro": 11,
    "nov": 11,
    "nov.": 11,
    "dezembro": 12,
    "dez": 12,
    "dez.": 12,
};
exports.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
function parseYear(match) {
    if (match.match(/^[0-9]{1,4}$/)) {
        let yearNumber = parseInt(match);
        if (yearNumber < 100) {
            if (yearNumber > 50) {
                yearNumber = yearNumber + 1900;
            }
            else {
                yearNumber = yearNumber + 2000;
            }
        }
        return yearNumber;
    }
    if (match.match(/a\.?\s*c\.?/i)) {
        match = match.replace(/a\.?\s*c\.?/i, "");
        return -parseInt(match);
    }
    return parseInt(match);
}
exports.parseYear = parseYear;
});

var PTWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:(este|esta|passado|pr[oó]ximo)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$1.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(este|esta|passado|pr[óo]ximo)\\s*semana)?" +
    "(?=\\W|\\d|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class PTWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$1.WEEKDAY_DICTIONARY[dayOfWeek];
        if (offset === undefined) {
            return null;
        }
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let norm = prefix || postfix || "";
        norm = norm.toLowerCase();
        let modifier = null;
        if (norm == "passado") {
            modifier = "this";
        }
        else if (norm == "próximo" || norm == "proximo") {
            modifier = "next";
        }
        else if (norm == "este") {
            modifier = "this";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = PTWeekdayParser;
});

var PTTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class PTTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:ao?|às?|das|da|de|do)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|a(?:o)?|\\?)\\s*";
    }
}
exports.default = PTTimeExpressionParser;
});

var PTMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class PTMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(?:,|à)?\\s*$");
    }
}
exports.default = PTMergeDateTimeRefiner;
});

var PTMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class PTMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(?:-)\s*$/i;
    }
}
exports.default = PTMergeDateRangeRefiner;
});

var PTMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$1;


const PATTERN = new RegExp(`([0-9]{1,2})(?:º|ª|°)?` +
    "(?:\\s*(?:desde|de|\\-|\\–|ao?|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*" +
    `(?:-|/|\\s*(?:de|,)?\\s*)` +
    `(${pattern.matchAnyPattern(constants$1.MONTH_DICTIONARY)})` +
    `(?:\\s*(?:de|,)?\\s*(${constants_2.YEAR_PATTERN}))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class PTMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = parseInt(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = PTMonthNameLittleEndianParser;
});

var PTCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);
class PTCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(agora|hoje|amanha|amanhã|ontem)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "agora":
                return references.now(context.refDate);
            case "hoje":
                return references.today(context.refDate);
            case "amanha":
            case "amanhã":
                return references.tomorrow(context.refDate);
            case "ontem":
                return references.yesterday(context.refDate);
        }
        return component;
    }
}
exports.default = PTCasualDateParser;
});

var PTCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });



const dayjs_2 = __importDefault(dayjs_min);
class PTCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return /(?:esta\s*)?(manha|manhã|tarde|meia-noite|meio-dia|noite)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_2.default(context.refDate);
        const component = context.createParsingComponents();
        switch (match[1].toLowerCase()) {
            case "tarde":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "noite":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 22);
                break;
            case "manha":
            case "manhã":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "meia-noite":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "meio-dia":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = PTCasualTimeParser;
});

var pt = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const PTWeekdayParser_1$1 = __importDefault(PTWeekdayParser_1);
const PTTimeExpressionParser_1$1 = __importDefault(PTTimeExpressionParser_1);
const PTMergeDateTimeRefiner_1$1 = __importDefault(PTMergeDateTimeRefiner_1);
const PTMergeDateRangeRefiner_1$1 = __importDefault(PTMergeDateRangeRefiner_1);
const PTMonthNameLittleEndianParser_1$1 = __importDefault(PTMonthNameLittleEndianParser_1);
const PTCasualDateParser_1$1 = __importDefault(PTCasualDateParser_1);
const PTCasualTimeParser_1$1 = __importDefault(PTCasualTimeParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.push(new PTCasualDateParser_1$1.default());
    option.parsers.push(new PTCasualTimeParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new PTWeekdayParser_1$1.default(),
            new PTTimeExpressionParser_1$1.default(),
            new PTMonthNameLittleEndianParser_1$1.default(),
        ],
        refiners: [new PTMergeDateTimeRefiner_1$1.default(), new PTMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var NLMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class NLMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(tot|-)\s*$/i;
    }
}
exports.default = NLMergeDateRangeRefiner;
});

var NLMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class NLMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(om|na|voor|in de|,|-)?\\s*$");
    }
}
exports.default = NLMergeDateTimeRefiner;
});

var NLCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);
class NLCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(nu|vandaag|morgen|morgend|gisteren)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "nu":
                return references.now(context.refDate);
            case "vandaag":
                return references.today(context.refDate);
            case "morgen":
            case "morgend":
                return references.tomorrow(context.refDate);
            case "gisteren":
                return references.yesterday(context.refDate);
        }
        return component;
    }
}
exports.default = NLCasualDateParser;
});

var NLCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);

const DAY_GROUP = 1;
const MOMENT_GROUP = 2;
class NLCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return /(deze)?\s*(namiddag|avond|middernacht|ochtend|middag|'s middags|'s avonds|'s ochtends)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const component = context.createParsingComponents();
        if (match[DAY_GROUP] === "deze") {
            component.assign("day", context.refDate.getDate());
            component.assign("month", context.refDate.getMonth() + 1);
            component.assign("year", context.refDate.getFullYear());
        }
        switch (match[MOMENT_GROUP].toLowerCase()) {
            case "namiddag":
            case "'s namiddags":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "avond":
            case "'s avonds'":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 20);
                break;
            case "middernacht":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "ochtend":
            case "'s ochtends":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "middag":
            case "'s middags":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = NLCasualTimeParser;
});

var constants = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    zondag: 0,
    zon: 0,
    "zon.": 0,
    zo: 0,
    "zo.": 0,
    maandag: 1,
    ma: 1,
    "ma.": 1,
    dinsdag: 2,
    din: 2,
    "din.": 2,
    di: 2,
    "di.": 2,
    woensdag: 3,
    woe: 3,
    "woe.": 3,
    wo: 3,
    "wo.": 3,
    donderdag: 4,
    dond: 4,
    "dond.": 4,
    do: 4,
    "do.": 4,
    vrijdag: 5,
    vrij: 5,
    "vrij.": 5,
    vr: 5,
    "vr.": 5,
    zaterdag: 6,
    zat: 6,
    "zat.": 6,
    "za": 6,
    "za.": 6,
};
exports.MONTH_DICTIONARY = {
    januari: 1,
    jan: 1,
    "jan.": 1,
    februari: 2,
    feb: 2,
    "feb.": 2,
    maart: 3,
    mar: 3,
    "mar.": 3,
    april: 4,
    apr: 4,
    "apr.": 4,
    mei: 5,
    juni: 6,
    jun: 6,
    "jun.": 6,
    juli: 7,
    jul: 7,
    "jul.": 7,
    augustus: 8,
    aug: 8,
    "aug.": 8,
    september: 9,
    sep: 9,
    "sep.": 9,
    sept: 9,
    "sept.": 9,
    oktober: 10,
    okt: 10,
    "okt.": 10,
    november: 11,
    nov: 11,
    "nov.": 11,
    december: 12,
    dec: 12,
    "dec.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    een: 1,
    twee: 2,
    drie: 3,
    vier: 4,
    vijf: 5,
    zes: 6,
    zeven: 7,
    acht: 8,
    negen: 9,
    tien: 10,
    elf: 11,
    twaalf: 12,
};
exports.ORDINAL_WORD_DICTIONARY = {
    eerste: 1,
    tweede: 2,
    derde: 3,
    vierde: 4,
    vijfde: 5,
    zesde: 6,
    zevende: 7,
    achtste: 8,
    negende: 9,
    tiende: 10,
    elfde: 11,
    twaalfde: 12,
    dertiende: 13,
    veertiende: 14,
    vijftiende: 15,
    zestiende: 16,
    zeventiende: 17,
    achttiende: 18,
    negentiende: 19,
    twintigste: 20,
    "eenentwintigste": 21,
    "tweeëntwintigste": 22,
    "drieentwintigste": 23,
    "vierentwintigste": 24,
    "vijfentwintigste": 25,
    "zesentwintigste": 26,
    "zevenentwintigste": 27,
    "achtentwintig": 28,
    "negenentwintig": 29,
    "dertigste": 30,
    "eenendertigste": 31,
};
exports.TIME_UNIT_DICTIONARY = {
    sec: "second",
    second: "second",
    seconden: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minuten: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    uur: "hour",
    uren: "hour",
    dag: "d",
    dagen: "d",
    week: "week",
    weken: "week",
    maand: "month",
    maanden: "month",
    jaar: "year",
    jr: "year",
    jaren: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|een?|halve?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "een") {
        return 1;
    }
    else if (num.match(/halve?/)) {
        return 0.5;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:ste|de)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
        return exports.ORDINAL_WORD_DICTIONARY[num];
    }
    num = num.replace(/(?:ste|de)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:voor Christus|na Christus)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/voor Christus/i.test(match)) {
        match = match.replace(/voor Christus/i, "");
        return -parseInt(match);
    }
    if (/na Christus/i.test(match)) {
        match = match.replace(/na Christus/i, "");
        return parseInt(match);
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern(`(?:(?:binnen|in)\\s*)?`, SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
});

var NLTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



class NLTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return new RegExp(`(?:binnen|in|binnen de|voor)\\s*` + "(" + constants.TIME_UNITS_PATTERN + ")" + `(?=\\W|$)`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = NLTimeUnitWithinFormatParser;
});

var NLWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:op\\s*?)?" +
    "(?:(deze|vorige|volgende)\\s*(?:week\\s*)?)?" +
    `(${pattern.matchAnyPattern(constants.WEEKDAY_DICTIONARY)})` +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class NLWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "vorige") {
            modifier = "last";
        }
        else if (modifierWord == "volgende") {
            modifier = "next";
        }
        else if (modifierWord == "deze") {
            modifier = "this";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = NLWeekdayParser;
});

var NLMonthNameMiddleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants;
const constants_3 = constants;


const PATTERN = new RegExp("(?:on\\s*?)?" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})` +
    "(?:\\s*" +
    "(?:tot|\\-|\\–|until|through|till|\\s)\\s*" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})` +
    ")?" +
    "(?:-|/|\\s*(?:of)?\\s*)" +
    "(" +
    pattern.matchAnyPattern(constants.MONTH_DICTIONARY) +
    ")" +
    "(?:" +
    "(?:-|/|,?\\s*)" +
    `(${constants_3.YEAR_PATTERN}(?![^\\s]\\d))` +
    ")?" +
    "(?=\\W|$)", "i");
const MONTH_NAME_GROUP = 3;
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const YEAR_GROUP = 4;
class NLMonthNameMiddleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = constants.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[YEAR_GROUP]) {
            const year = constants_3.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        if (!match[DATE_TO_GROUP]) {
            return components;
        }
        const endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
        const result = context.createParsingResult(match.index, match[0]);
        result.start = components;
        result.end = components.clone();
        result.end.assign("day", endDate);
        return result;
    }
}
exports.default = NLMonthNameMiddleEndianParser;
});

var NLMonthNameParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const constants_2 = constants;

const PATTERN = new RegExp(`(${pattern.matchAnyPattern(constants.MONTH_DICTIONARY)})` +
    `\\s*` +
    `(?:` +
    `[,-]?\\s*(${constants_2.YEAR_PATTERN})?` +
    ")?" +
    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
const MONTH_NAME_GROUP = 1;
const YEAR_GROUP = 2;
class NLMonthNameParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const components = context.createParsingComponents();
        components.imply("day", 1);
        const monthName = match[MONTH_NAME_GROUP];
        const month = constants.MONTH_DICTIONARY[monthName.toLowerCase()];
        components.assign("month", month);
        if (match[YEAR_GROUP]) {
            const year = constants_2.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, 1, month);
            components.imply("year", year);
        }
        return components;
    }
}
exports.default = NLMonthNameParser;
});

var NLSlashMonthFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
const MONTH_GROUP = 1;
const YEAR_GROUP = 2;
class NLSlashMonthFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const year = parseInt(match[YEAR_GROUP]);
        const month = parseInt(match[MONTH_GROUP]);
        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
    }
}
exports.default = NLSlashMonthFormatParser;
});

var NLTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class NLTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:om)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|om|\\?)\\s*";
    }
    extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
            return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
    }
}
exports.default = NLTimeExpressionParser;
});

var NLCasualYearMonthDayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp(`([0-9]{4})[\\.\\/\\s]` +
    `(?:(${pattern.matchAnyPattern(constants.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]` +
    `([0-9]{1,2})` +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const MONTH_NUMBER_GROUP = 3;
const DATE_NUMBER_GROUP = 4;
class NLCasualYearMonthDayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = match[MONTH_NUMBER_GROUP]
            ? parseInt(match[MONTH_NUMBER_GROUP])
            : constants.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        if (month < 1 || month > 12) {
            return null;
        }
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);
        return {
            day: day,
            month: month,
            year: year,
        };
    }
}
exports.default = NLCasualYearMonthDayParser;
});

var NLCasualDateTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });



const dayjs_2 = __importDefault(dayjs_min);
const DATE_GROUP = 1;
const TIME_OF_DAY_GROUP = 2;
class NLCasualDateTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(gisteren|morgen|van)(ochtend|middag|namiddag|avond|nacht)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const dateText = match[DATE_GROUP].toLowerCase();
        const timeText = match[TIME_OF_DAY_GROUP].toLowerCase();
        const component = context.createParsingComponents();
        const targetDate = dayjs_2.default(context.refDate);
        switch (dateText) {
            case "gisteren":
                dayjs.assignSimilarDate(component, targetDate.add(-1, "day"));
                break;
            case "van":
                dayjs.assignSimilarDate(component, targetDate);
                break;
            case "morgen":
                dayjs.assignTheNextDay(component, targetDate);
                break;
        }
        switch (timeText) {
            case "ochtend":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "middag":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
            case "namiddag":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "avond":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 20);
                break;
        }
        return component;
    }
}
exports.default = NLCasualDateTimeParser;
});

var nl = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const NLMergeDateRangeRefiner_1$1 = __importDefault(NLMergeDateRangeRefiner_1);
const NLMergeDateTimeRefiner_1$1 = __importDefault(NLMergeDateTimeRefiner_1);
const NLCasualDateParser_1$1 = __importDefault(NLCasualDateParser_1);
const NLCasualTimeParser_1$1 = __importDefault(NLCasualTimeParser_1);
const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const NLTimeUnitWithinFormatParser_1$1 = __importDefault(NLTimeUnitWithinFormatParser_1);
const NLWeekdayParser_1$1 = __importDefault(NLWeekdayParser_1);
const NLMonthNameMiddleEndianParser_1$1 = __importDefault(NLMonthNameMiddleEndianParser_1);
const NLMonthNameParser_1$1 = __importDefault(NLMonthNameParser_1);
const NLSlashMonthFormatParser_1$1 = __importDefault(NLSlashMonthFormatParser_1);
const NLTimeExpressionParser_1$1 = __importDefault(NLTimeExpressionParser_1);
const NLCasualYearMonthDayParser_1$1 = __importDefault(NLCasualYearMonthDayParser_1);
const NLCasualDateTimeParser_1$1 = __importDefault(NLCasualDateTimeParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new NLCasualDateParser_1$1.default());
    option.parsers.unshift(new NLCasualTimeParser_1$1.default());
    option.parsers.unshift(new NLCasualDateTimeParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new NLMonthNameMiddleEndianParser_1$1.default(),
            new NLMonthNameParser_1$1.default(),
            new NLTimeExpressionParser_1$1.default(),
            new NLTimeUnitWithinFormatParser_1$1.default(),
            new NLSlashMonthFormatParser_1$1.default(),
            new NLWeekdayParser_1$1.default(),
            new NLCasualYearMonthDayParser_1$1.default(),
        ],
        refiners: [new NLMergeDateTimeRefiner_1$1.default(), new NLMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var dist = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.parse = exports.casual = exports.strict = exports.nl = exports.pt = exports.ja = exports.fr = exports.de = exports.Meridiem = exports.Chrono = exports.en = void 0;
const en$1 = __importStar(en);
exports.en = en$1;

Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono$1.Chrono; } });
(function (Meridiem) {
    Meridiem[Meridiem["AM"] = 0] = "AM";
    Meridiem[Meridiem["PM"] = 1] = "PM";
})(exports.Meridiem || (exports.Meridiem = {}));
const de$1 = __importStar(de);
exports.de = de$1;
const fr$1 = __importStar(fr);
exports.fr = fr$1;
const ja$1 = __importStar(ja);
exports.ja = ja$1;
const pt$1 = __importStar(pt);
exports.pt = pt$1;
const nl$1 = __importStar(nl);
exports.nl = nl$1;
exports.strict = en$1.strict;
exports.casual = en$1.casual;
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
});

var chrono = /*@__PURE__*/getDefaultExportFromCjs(dist);

var getLastDayOfMonth = function (y, m) {
    return new Date(y, m, 0).getDate();
};
var custom = chrono.casual.clone();
custom.parsers.push({
    pattern: function () {
        return /\bChristmas\b/i;
    },
    extract: function (context, match) {
        return {
            day: 25,
            month: 12,
        };
    },
});
var NaturalLanguageDates = /** @class */ (function (_super) {
    __extends(NaturalLanguageDates, _super);
    function NaturalLanguageDates() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NaturalLanguageDates.prototype.onInit = function () { };
    NaturalLanguageDates.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Loading natural language date parser plugin");
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addCommand({
                            id: "nlp-dates",
                            name: "Parse natural language date",
                            callback: function () { return _this.onTrigger("replace"); },
                            hotkeys: [],
                        });
                        this.addCommand({
                            id: "nlp-dates-link",
                            name: "Parse natural language date (as link)",
                            callback: function () { return _this.onTrigger("link"); },
                            hotkeys: [],
                        });
                        this.addCommand({
                            id: "nlp-date-clean",
                            name: "Parse natural language date (as plain text)",
                            callback: function () { return _this.onTrigger("clean"); },
                            hotkeys: [],
                        });
                        this.addCommand({
                            id: "nlp-parse-time",
                            name: "Parse natural language time",
                            callback: function () { return _this.onTrigger("time"); },
                            hotkeys: [],
                        });
                        this.addCommand({
                            id: "nlp-now",
                            name: "Insert the current date and time",
                            callback: function () { return _this.getNowCommand(); },
                            hotkeys: [],
                        });
                        this.addCommand({
                            id: "nlp-today",
                            name: "Insert the current date",
                            callback: function () { return _this.getDateCommand(); },
                            hotkeys: [],
                        });
                        this.addCommand({
                            id: "nlp-time",
                            name: "Insert the current time",
                            callback: function () { return _this.getTimeCommand(); },
                            hotkeys: [],
                        });
                        this.addCommand({
                            id: "nlp-picker",
                            name: "Date picker",
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        new ParseMomentModal(_this.app, _this).open();
                                    }
                                    return true;
                                }
                                return false;
                            },
                            hotkeys: [],
                        });
                        this.addSettingTab(new NLDSettingsTab(this.app, this));
                        this.registerObsidianProtocolHandler("nldates", this.actionHandler.bind(this));
                        return [2 /*return*/];
                }
            });
        });
    };
    NaturalLanguageDates.prototype.onunload = function () {
        console.log("Unloading natural language date parser plugin");
    };
    NaturalLanguageDates.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    NaturalLanguageDates.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NaturalLanguageDates.prototype.getParsedDate = function (selectedText) {
        var nextDateMatch = selectedText.match(/next\s([\w]+)/i);
        var lastDayOfMatch = selectedText.match(/(last day of|end of)\s*([^\n\r]*)/i);
        var midOf = selectedText.match(/mid\s([\w]+)/i);
        if (nextDateMatch && nextDateMatch[1] === "week") {
            return custom.parseDate("next " + this.settings.weekStart, new Date(), {
                forwardDate: true,
            });
        }
        else if (nextDateMatch && nextDateMatch[1] === "month") {
            var thisMonth = custom.parseDate("this month", new Date(), {
                forwardDate: true,
            });
            return custom.parseDate(selectedText, thisMonth, {
                forwardDate: true,
            });
        }
        else if (nextDateMatch && nextDateMatch[1] === "year") {
            var thisYear = custom.parseDate("this year", new Date(), {
                forwardDate: true,
            });
            return custom.parseDate(selectedText, thisYear, {
                forwardDate: true,
            });
        }
        else if (lastDayOfMatch) {
            var tempDate = custom.parse(lastDayOfMatch[2]);
            var year = tempDate[0].start.get("year"), month = tempDate[0].start.get("month");
            var lastDay = getLastDayOfMonth(year, month);
            return custom.parseDate(year + "-" + month + "-" + lastDay, new Date(), {
                forwardDate: true,
            });
        }
        else if (midOf) {
            return custom.parseDate(midOf[1] + " 15th", new Date(), {
                forwardDate: true,
            });
        }
        else {
            return custom.parseDate(selectedText, new Date(), {});
        }
    };
    NaturalLanguageDates.prototype.getSelectedText = function (editor) {
        if (editor.somethingSelected()) {
            return editor.getSelection();
        }
        else {
            var wordBoundaries = this.getWordBoundaries(editor);
            editor.getDoc().setSelection(wordBoundaries.start, wordBoundaries.end);
            return editor.getSelection();
        }
    };
    NaturalLanguageDates.prototype.getWordBoundaries = function (editor) {
        var cursor = editor.getCursor();
        var line = cursor.line;
        var word = editor.findWordAt({
            line: line,
            ch: cursor.ch
        });
        var wordStart = word.anchor.ch;
        var wordEnd = word.head.ch;
        return {
            start: {
                line: line,
                ch: wordStart
            },
            end: {
                line: line,
                ch: wordEnd
            },
        };
    };
    NaturalLanguageDates.prototype.getMoment = function (date) {
        return window.moment(date);
    };
    NaturalLanguageDates.prototype.getFormattedDate = function (date) {
        var formattedDate = this.getMoment(date).format(this.settings.format);
        return formattedDate;
    };
    NaturalLanguageDates.prototype.getFormattedTime = function (date) {
        var formattedTime = this.getMoment(date).format(this.settings.timeFormat);
        return formattedTime;
    };
    /*
    @param dateString: A string that contains a date in natural language, e.g. today, tomorrow, next week
    @returns NLDResult: An object containing the date, a cloned Moment and the formatted string.
  
    */
    NaturalLanguageDates.prototype.parseDate = function (dateString) {
        var date = this.getParsedDate(dateString);
        var formattedDate = this.getFormattedDate(date);
        if (formattedDate === "Invalid date") {
            console.debug("Input date " + dateString + " can't be parsed by nldates");
        }
        var result = {
            formattedString: formattedDate,
            date: date,
            moment: this.getMoment(date),
        };
        return result;
    };
    NaturalLanguageDates.prototype.parseTime = function (dateString) {
        var date = this.getParsedDate(dateString);
        var formattedTime = this.getFormattedTime(date);
        if (formattedTime === "Invalid date") {
            console.debug("Input date " + dateString + " can't be parsed by nldates");
        }
        var result = {
            formattedString: formattedTime,
            date: date,
            moment: this.getMoment(date),
        };
        return result;
    };
    NaturalLanguageDates.prototype.parseTruthy = function (flag) {
        return ["y", "yes", "1", "t", "true"].indexOf(flag.toLowerCase()) >= 0;
    };
    NaturalLanguageDates.prototype.onTrigger = function (mode) {
        var activeLeaf = this.app.workspace.activeLeaf;
        var editor = activeLeaf.view.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var selectedText = this.getSelectedText(editor);
        var date = this.parseDate(selectedText);
        if (!date.moment.isValid()) {
            editor.setCursor({
                line: cursor.line,
                ch: cursor.ch
            });
        }
        else {
            //mode == "replace"
            var newStr = "[[" + date.formattedString + "]]";
            if (mode == "link") {
                newStr = "[" + selectedText + "](" + date.formattedString + ")";
            }
            else if (mode == "clean") {
                newStr = "" + date.formattedString;
            }
            else if (mode == "time") {
                var time = this.parseTime(selectedText);
                newStr = "" + time.formattedString;
            }
            editor.replaceSelection(newStr);
            this.adjustCursor(editor, cursor, newStr, selectedText);
            editor.focus();
        }
    };
    NaturalLanguageDates.prototype.adjustCursor = function (editor, cursor, newStr, oldStr) {
        var cursorOffset = newStr.length - oldStr.length;
        editor.setCursor({
            line: cursor.line,
            ch: cursor.ch + cursorOffset
        });
    };
    NaturalLanguageDates.prototype.getNowCommand = function () {
        var activeLeaf = this.app.workspace.activeLeaf;
        var editor = activeLeaf.view.sourceMode.cmEditor;
        editor.replaceSelection(this.getMoment(new Date()).format("" + this.settings.format + this.settings.separator + this.settings.timeFormat));
    };
    NaturalLanguageDates.prototype.getDateCommand = function () {
        var activeLeaf = this.app.workspace.activeLeaf;
        var editor = activeLeaf.view.sourceMode.cmEditor;
        editor.replaceSelection(this.getMoment(new Date()).format(this.settings.format));
    };
    NaturalLanguageDates.prototype.getTimeCommand = function () {
        var activeLeaf = this.app.workspace.activeLeaf;
        var editor = activeLeaf.view.sourceMode.cmEditor;
        editor.replaceSelection(this.getMoment(new Date()).format(this.settings.timeFormat));
    };
    NaturalLanguageDates.prototype.insertDateString = function (dateString, editor, cursor) {
        editor.replaceSelection(dateString);
    };
    NaturalLanguageDates.prototype.getDateRange = function () { };
    NaturalLanguageDates.prototype.actionHandler = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var date, newPane, workspace, dailyNote, leaf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        date = this.parseDate(params.day);
                        newPane = this.parseTruthy(params.newPane || "yes");
                        console.log(date);
                        workspace = this.app.workspace;
                        if (!date.moment.isValid()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getDailyNote(date.moment)];
                    case 1:
                        dailyNote = _a.sent();
                        leaf = workspace.activeLeaf;
                        if (newPane) {
                            leaf = workspace.splitActiveLeaf();
                        }
                        return [4 /*yield*/, leaf.openFile(dailyNote)];
                    case 2:
                        _a.sent();
                        workspace.setActiveLeaf(leaf);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NaturalLanguageDates.prototype.getDailyNote = function (date) {
        // Borrowed from the Slated plugin:
        // https://github.com/tgrosinger/slated-obsidian/blob/main/src/vault.ts#L17
        var desiredNote = main.getDailyNote(date, main.getAllDailyNotes());
        if (desiredNote) {
            console.log("Note exists");
            return Promise.resolve(desiredNote);
        }
        else {
            console.log("Creating daily note");
            return Promise.resolve(main.createDailyNote(date));
        }
    };
    return NaturalLanguageDates;
}(obsidian.Plugin));
var DEFAULT_SETTINGS = {
    format: "YYYY-MM-DD",
    timeFormat: "HH:mm",
    separator: " ",
    weekStart: "Monday",
    modalToggleTime: false,
    modalToggleLink: false,
    modalMomentFormat: "YYYY-MM-DD HH:mm",
};
var NLDSettingsTab = /** @class */ (function (_super) {
    __extends(NLDSettingsTab, _super);
    function NLDSettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    NLDSettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Date format")
            .setDesc("Output format for parsed dates")
            .addMomentFormat(function (text) {
            return text
                .setDefaultFormat("YYYY-MM-DD")
                .setValue(_this.plugin.settings.format)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (value === "") {
                                this.plugin.settings.format = "YYYY-MM-DD";
                            }
                            else {
                                this.plugin.settings.format = value.trim();
                            }
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName("Week starts on")
            .setDesc("Which day to consider as the start of the week")
            .addDropdown(function (day) {
            return day
                .addOption("Monday", "Monday")
                .addOption("Sunday", "Sunday")
                .setValue(_this.plugin.settings.weekStart)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.weekStart = value.trim();
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        containerEl.createEl("h3", {
            text: "Hotkey formatting settings"
        });
        new obsidian.Setting(containerEl)
            .setName("Time format")
            .setDesc("Format for the hotkeys that include the current time")
            .addMomentFormat(function (text) {
            return text
                .setDefaultFormat("HH:mm")
                .setValue(_this.plugin.settings.timeFormat)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (value === "") {
                                this.plugin.settings.timeFormat = "HH:mm";
                            }
                            else {
                                this.plugin.settings.timeFormat = value.trim();
                            }
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName("Separator")
            .setDesc("Separator between date and time for entries that have both")
            .addText(function (text) {
            return text
                .setPlaceholder("Separator is empty")
                .setValue(_this.plugin.settings.separator)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.separator = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return NLDSettingsTab;
}(obsidian.PluginSettingTab));
var ParseMomentModal = /** @class */ (function (_super) {
    __extends(ParseMomentModal, _super);
    function ParseMomentModal(app, plugin) {
        var _this = _super.call(this, app) || this;
        _this.parsedDateString = "";
        _this.plugin = plugin;
        _this.activeView = _this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!_this.activeView)
            return _this;
        _this.activeEditor = _this.activeView.sourceMode.cmEditor;
        _this.activeCursor = _this.activeEditor.getCursor();
        return _this;
    }
    ParseMomentModal.prototype.onOpen = function () {
        var _this = this;
        var contentEl = this.contentEl;
        contentEl.appendText("Date: ");
        var inputDateField = new obsidian.TextComponent(contentEl).setPlaceholder("Date");
        contentEl.createEl("br");
        contentEl.appendText("Format: ");
        var momentFormatField = new obsidian.MomentFormatComponent(contentEl)
            .setDefaultFormat("YYYY-MM-DD HH:mm")
            .setValue(this.plugin.settings.modalMomentFormat)
            .onChange(function (value) {
            _this.plugin.settings.modalMomentFormat = value ? value : "YYYY-MM-DD HH:mm";
            _this.plugin.saveSettings();
        });
        contentEl.createEl("br");
        contentEl.appendText("Add as link?");
        var toggleLink = new obsidian.ToggleComponent(contentEl)
            .setValue(this.plugin.settings.modalToggleLink)
            .onChange(function (value) {
            _this.plugin.settings.modalToggleLink = value;
            _this.plugin.saveSettings();
        });
        contentEl.createEl("br");
        new obsidian.ButtonComponent(contentEl)
            .setButtonText("Insert date")
            .onClick(function () {
            var parsedDate = _this.plugin.parseDate(inputDateField.getValue());
            _this.parsedDateString = parsedDate.moment.format(momentFormatField.getValue());
            if (!parsedDate.moment.isValid())
                _this.parsedDateString = "";
            if (toggleLink.getValue() && _this.parsedDateString !== "")
                _this.parsedDateString = "[[" + _this.parsedDateString + "]]";
            _this.activeEditor.focus();
            _this.activeEditor.setCursor(_this.activeCursor);
            _this.plugin.insertDateString(_this.parsedDateString, _this.activeEditor, _this.activeCursor);
            _this.close();
        });
        inputDateField.inputEl.focus();
    };
    ParseMomentModal.prototype.onClose = function () {
        var contentEl = this.contentEl;
        contentEl.empty();
    };
    return ParseMomentModal;
}(obsidian.Modal));

module.exports = NaturalLanguageDates;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5vZGVfbW9kdWxlcy9vYnNpZGlhbi1kYWlseS1ub3Rlcy1pbnRlcmZhY2UvZGlzdC9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvdXRpbHMvcGF0dGVybi5qcyIsIm5vZGVfbW9kdWxlcy9kYXlqcy9kYXlqcy5taW4uanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jYWxjdWxhdGlvbi95ZWFycy5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZW4vY29uc3RhbnRzLmpzIiwibm9kZV9tb2R1bGVzL2RheWpzL3BsdWdpbi9xdWFydGVyT2ZZZWFyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvdXRpbHMvZGF5anMuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9yZXN1bHRzLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5Nb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5Nb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5Nb250aE5hbWVQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5DYXN1YWxZZWFyTW9udGhEYXlQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5TbGFzaE1vbnRoRm9ybWF0UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZW4vcGFyc2Vycy9FTlRpbWVFeHByZXNzaW9uUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvdXRpbHMvdGltZXVuaXRzLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5UaW1lVW5pdExhdGVyRm9ybWF0UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL2Fic3RyYWN0UmVmaW5lcnMuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3JlZmluZXJzL0VOTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY2FsY3VsYXRpb24vbWVyZ2luZ0NhbGN1bGF0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3JlZmluZXJzL0Fic3RyYWN0TWVyZ2VEYXRlVGltZVJlZmluZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3JlZmluZXJzL0VOTWVyZ2VEYXRlVGltZVJlZmluZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jb21tb24vcmVmaW5lcnMvRXh0cmFjdFRpbWV6b25lQWJiclJlZmluZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jb21tb24vcmVmaW5lcnMvRXh0cmFjdFRpbWV6b25lT2Zmc2V0UmVmaW5lci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9yZWZpbmVycy9PdmVybGFwUmVtb3ZhbFJlZmluZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jb21tb24vcmVmaW5lcnMvRm9yd2FyZERhdGVSZWZpbmVyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3JlZmluZXJzL1VubGlrZWx5Rm9ybWF0RmlsdGVyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3BhcnNlcnMvSVNPRm9ybWF0UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3JlZmluZXJzL01lcmdlV2Vla2RheUNvbXBvbmVudFJlZmluZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jb25maWd1cmF0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9jYXN1YWxSZWZlcmVuY2VzLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOQ2FzdWFsRGF0ZVBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZW4vcGFyc2Vycy9FTkNhc3VhbFRpbWVQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jYWxjdWxhdGlvbi93ZWVrcy5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZW4vcGFyc2Vycy9FTldlZWtkYXlQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5SZWxhdGl2ZURhdGVGb3JtYXRQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jaHJvbm8uanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jb21tb24vcGFyc2Vycy9TbGFzaERhdGVGb3JtYXRQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5UaW1lVW5pdENhc3VhbFJlbGF0aXZlRm9ybWF0UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZGUvcGFyc2Vycy9ERVRpbWVFeHByZXNzaW9uUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9kZS9jb25zdGFudHMuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2RlL3BhcnNlcnMvREVXZWVrZGF5UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9kZS9yZWZpbmVycy9ERU1lcmdlRGF0ZVJhbmdlUmVmaW5lci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZGUvcmVmaW5lcnMvREVNZXJnZURhdGVUaW1lUmVmaW5lci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZGUvcGFyc2Vycy9ERUNhc3VhbFRpbWVQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2RlL3BhcnNlcnMvREVDYXN1YWxEYXRlUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9kZS9wYXJzZXJzL0RFTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9kZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZnIvcGFyc2Vycy9GUkNhc3VhbERhdGVQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2ZyL3BhcnNlcnMvRlJDYXN1YWxUaW1lUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9wYXJzZXJzL0ZSVGltZUV4cHJlc3Npb25QYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2ZyL3JlZmluZXJzL0ZSTWVyZ2VEYXRlVGltZVJlZmluZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2ZyL3JlZmluZXJzL0ZSTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9jb25zdGFudHMuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2ZyL3BhcnNlcnMvRlJXZWVrZGF5UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9wYXJzZXJzL0ZSU3BlY2lmaWNUaW1lRXhwcmVzc2lvblBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZnIvcGFyc2Vycy9GUk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZnIvcGFyc2Vycy9GUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9wYXJzZXJzL0ZSVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2ZyL3BhcnNlcnMvRlJUaW1lVW5pdFJlbGF0aXZlRm9ybWF0UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvamEvY29uc3RhbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9qYS9wYXJzZXJzL0pQU3RhbmRhcmRQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2phL3JlZmluZXJzL0pQTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9qYS9wYXJzZXJzL0pQQ2FzdWFsRGF0ZVBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvamEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL3B0L2NvbnN0YW50cy5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvcHQvcGFyc2Vycy9QVFdlZWtkYXlQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL3B0L3BhcnNlcnMvUFRUaW1lRXhwcmVzc2lvblBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvcHQvcmVmaW5lcnMvUFRNZXJnZURhdGVUaW1lUmVmaW5lci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvcHQvcmVmaW5lcnMvUFRNZXJnZURhdGVSYW5nZVJlZmluZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL3B0L3BhcnNlcnMvUFRNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL3B0L3BhcnNlcnMvUFRDYXN1YWxEYXRlUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9wdC9wYXJzZXJzL1BUQ2FzdWFsVGltZVBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvcHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3JlZmluZXJzL05MTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9ubC9yZWZpbmVycy9OTE1lcmdlRGF0ZVRpbWVSZWZpbmVyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9ubC9wYXJzZXJzL05MQ2FzdWFsRGF0ZVBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTENhc3VhbFRpbWVQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL2NvbnN0YW50cy5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTFRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9ubC9wYXJzZXJzL05MV2Vla2RheVBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTE1vbnRoTmFtZU1pZGRsZUVuZGlhblBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTE1vbnRoTmFtZVBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTFNsYXNoTW9udGhGb3JtYXRQYXJzZXIuanMiLCJub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3BhcnNlcnMvTkxUaW1lRXhwcmVzc2lvblBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTENhc3VhbFllYXJNb250aERheVBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTENhc3VhbERhdGVUaW1lUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9ubC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2luZGV4LmpzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgb2JzaWRpYW4gPSByZXF1aXJlKCdvYnNpZGlhbicpO1xuXG5jb25zdCBERUZBVUxUX0RBSUxZX05PVEVfRk9STUFUID0gXCJZWVlZLU1NLUREXCI7XG5jb25zdCBERUZBVUxUX1dFRUtMWV9OT1RFX0ZPUk1BVCA9IFwiZ2dnZy1bV113d1wiO1xuY29uc3QgREVGQVVMVF9NT05USExZX05PVEVfRk9STUFUID0gXCJZWVlZLU1NXCI7XG5cbmZ1bmN0aW9uIHNob3VsZFVzZVBlcmlvZGljTm90ZXNTZXR0aW5ncyhwZXJpb2RpY2l0eSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgcGVyaW9kaWNOb3RlcyA9IHdpbmRvdy5hcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJwZXJpb2RpYy1ub3Rlc1wiKTtcbiAgICByZXR1cm4gcGVyaW9kaWNOb3RlcyAmJiBwZXJpb2RpY05vdGVzLnNldHRpbmdzPy5bcGVyaW9kaWNpdHldPy5lbmFibGVkO1xufVxuLyoqXG4gKiBSZWFkIHRoZSB1c2VyIHNldHRpbmdzIGZvciB0aGUgYGRhaWx5LW5vdGVzYCBwbHVnaW5cbiAqIHRvIGtlZXAgYmVoYXZpb3Igb2YgY3JlYXRpbmcgYSBuZXcgbm90ZSBpbi1zeW5jLlxuICovXG5mdW5jdGlvbiBnZXREYWlseU5vdGVTZXR0aW5ncygpIHtcbiAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICBjb25zdCB7IGludGVybmFsUGx1Z2lucywgcGx1Z2lucyB9ID0gd2luZG93LmFwcDtcbiAgICAgICAgaWYgKHNob3VsZFVzZVBlcmlvZGljTm90ZXNTZXR0aW5ncyhcImRhaWx5XCIpKSB7XG4gICAgICAgICAgICBjb25zdCB7IGZvcm1hdCwgZm9sZGVyLCB0ZW1wbGF0ZSB9ID0gcGx1Z2lucy5nZXRQbHVnaW4oXCJwZXJpb2RpYy1ub3Rlc1wiKT8uc2V0dGluZ3M/LmRhaWx5IHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IGZvcm1hdCB8fCBERUZBVUxUX0RBSUxZX05PVEVfRk9STUFULFxuICAgICAgICAgICAgICAgIGZvbGRlcjogZm9sZGVyPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGU/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGZvbGRlciwgZm9ybWF0LCB0ZW1wbGF0ZSB9ID0gaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoXCJkYWlseS1ub3Rlc1wiKT8uaW5zdGFuY2U/Lm9wdGlvbnMgfHwge307XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmb3JtYXQ6IGZvcm1hdCB8fCBERUZBVUxUX0RBSUxZX05PVEVfRk9STUFULFxuICAgICAgICAgICAgZm9sZGVyOiBmb2xkZXI/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJObyBjdXN0b20gZGFpbHkgbm90ZSBzZXR0aW5ncyBmb3VuZCFcIiwgZXJyKTtcbiAgICB9XG59XG4vKipcbiAqIFJlYWQgdGhlIHVzZXIgc2V0dGluZ3MgZm9yIHRoZSBgd2Vla2x5LW5vdGVzYCBwbHVnaW5cbiAqIHRvIGtlZXAgYmVoYXZpb3Igb2YgY3JlYXRpbmcgYSBuZXcgbm90ZSBpbi1zeW5jLlxuICovXG5mdW5jdGlvbiBnZXRXZWVrbHlOb3RlU2V0dGluZ3MoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgY29uc3QgcGx1Z2luTWFuYWdlciA9IHdpbmRvdy5hcHAucGx1Z2lucztcbiAgICAgICAgY29uc3QgY2FsZW5kYXJTZXR0aW5ncyA9IHBsdWdpbk1hbmFnZXIuZ2V0UGx1Z2luKFwiY2FsZW5kYXJcIik/Lm9wdGlvbnM7XG4gICAgICAgIGNvbnN0IHBlcmlvZGljTm90ZXNTZXR0aW5ncyA9IHBsdWdpbk1hbmFnZXIuZ2V0UGx1Z2luKFwicGVyaW9kaWMtbm90ZXNcIilcbiAgICAgICAgICAgID8uc2V0dGluZ3M/LndlZWtseTtcbiAgICAgICAgaWYgKHNob3VsZFVzZVBlcmlvZGljTm90ZXNTZXR0aW5ncyhcIndlZWtseVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IHBlcmlvZGljTm90ZXNTZXR0aW5ncy5mb3JtYXQgfHwgREVGQVVMVF9XRUVLTFlfTk9URV9GT1JNQVQsXG4gICAgICAgICAgICAgICAgZm9sZGVyOiBwZXJpb2RpY05vdGVzU2V0dGluZ3MuZm9sZGVyPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcGVyaW9kaWNOb3Rlc1NldHRpbmdzLnRlbXBsYXRlPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBjYWxlbmRhclNldHRpbmdzIHx8IHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZm9ybWF0OiBzZXR0aW5ncy53ZWVrbHlOb3RlRm9ybWF0IHx8IERFRkFVTFRfV0VFS0xZX05PVEVfRk9STUFULFxuICAgICAgICAgICAgZm9sZGVyOiBzZXR0aW5ncy53ZWVrbHlOb3RlRm9sZGVyPy50cmltKCkgfHwgXCJcIixcbiAgICAgICAgICAgIHRlbXBsYXRlOiBzZXR0aW5ncy53ZWVrbHlOb3RlVGVtcGxhdGU/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIk5vIGN1c3RvbSB3ZWVrbHkgbm90ZSBzZXR0aW5ncyBmb3VuZCFcIiwgZXJyKTtcbiAgICB9XG59XG4vKipcbiAqIFJlYWQgdGhlIHVzZXIgc2V0dGluZ3MgZm9yIHRoZSBgcGVyaW9kaWMtbm90ZXNgIHBsdWdpblxuICogdG8ga2VlcCBiZWhhdmlvciBvZiBjcmVhdGluZyBhIG5ldyBub3RlIGluLXN5bmMuXG4gKi9cbmZ1bmN0aW9uIGdldE1vbnRobHlOb3RlU2V0dGluZ3MoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBjb25zdCBwbHVnaW5NYW5hZ2VyID0gd2luZG93LmFwcC5wbHVnaW5zO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gKHNob3VsZFVzZVBlcmlvZGljTm90ZXNTZXR0aW5ncyhcIm1vbnRobHlcIikgJiZcbiAgICAgICAgICAgIHBsdWdpbk1hbmFnZXIuZ2V0UGx1Z2luKFwicGVyaW9kaWMtbm90ZXNcIik/LnNldHRpbmdzPy5tb250aGx5KSB8fFxuICAgICAgICAgICAge307XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmb3JtYXQ6IHNldHRpbmdzLmZvcm1hdCB8fCBERUZBVUxUX01PTlRITFlfTk9URV9GT1JNQVQsXG4gICAgICAgICAgICBmb2xkZXI6IHNldHRpbmdzLmZvbGRlcj8udHJpbSgpIHx8IFwiXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogc2V0dGluZ3MudGVtcGxhdGU/LnRyaW0oKSB8fCBcIlwiLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIk5vIGN1c3RvbSBtb250aGx5IG5vdGUgc2V0dGluZ3MgZm91bmQhXCIsIGVycik7XG4gICAgfVxufVxuXG4vKipcbiAqIGRhdGVVSUQgaXMgYSB3YXkgb2Ygd2Vla2x5IGlkZW50aWZ5aW5nIGRhaWx5L3dlZWtseS9tb250aGx5IG5vdGVzLlxuICogVGhleSBhcmUgcHJlZml4ZWQgd2l0aCB0aGUgZ3JhbnVsYXJpdHkgdG8gYXZvaWQgYW1iaWd1aXR5LlxuICovXG5mdW5jdGlvbiBnZXREYXRlVUlEKGRhdGUsIGdyYW51bGFyaXR5ID0gXCJkYXlcIikge1xuICAgIGNvbnN0IHRzID0gZGF0ZS5jbG9uZSgpLnN0YXJ0T2YoZ3JhbnVsYXJpdHkpLmZvcm1hdCgpO1xuICAgIHJldHVybiBgJHtncmFudWxhcml0eX0tJHt0c31gO1xufVxuZnVuY3Rpb24gcmVtb3ZlRXNjYXBlZENoYXJhY3RlcnMoZm9ybWF0KSB7XG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKC9cXFtbXlxcXV0qXFxdL2csIFwiXCIpOyAvLyByZW1vdmUgZXZlcnl0aGluZyB3aXRoaW4gYnJhY2tldHNcbn1cbi8qKlxuICogWFhYOiBXaGVuIHBhcnNpbmcgZGF0ZXMgdGhhdCBjb250YWluIGJvdGggd2VlayBudW1iZXJzIGFuZCBtb250aHMsXG4gKiBNb21lbnQgY2hvc2VzIHRvIGlnbm9yZSB0aGUgd2VlayBudW1iZXJzLiBGb3IgdGhlIHdlZWsgZGF0ZVVJRCwgd2VcbiAqIHdhbnQgdGhlIG9wcG9zaXRlIGJlaGF2aW9yLiBTdHJpcCB0aGUgTU1NIGZyb20gdGhlIGZvcm1hdCB0byBwYXRjaC5cbiAqL1xuZnVuY3Rpb24gaXNGb3JtYXRBbWJpZ3VvdXMoZm9ybWF0LCBncmFudWxhcml0eSkge1xuICAgIGlmIChncmFudWxhcml0eSA9PT0gXCJ3ZWVrXCIpIHtcbiAgICAgICAgY29uc3QgY2xlYW5Gb3JtYXQgPSByZW1vdmVFc2NhcGVkQ2hhcmFjdGVycyhmb3JtYXQpO1xuICAgICAgICByZXR1cm4gKC93ezEsMn0vaS50ZXN0KGNsZWFuRm9ybWF0KSAmJlxuICAgICAgICAgICAgKC9NezEsNH0vLnRlc3QoY2xlYW5Gb3JtYXQpIHx8IC9EezEsNH0vLnRlc3QoY2xlYW5Gb3JtYXQpKSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGdldERhdGVGcm9tRmlsZShmaWxlLCBncmFudWxhcml0eSkge1xuICAgIGNvbnN0IGdldFNldHRpbmdzID0ge1xuICAgICAgICBkYXk6IGdldERhaWx5Tm90ZVNldHRpbmdzLFxuICAgICAgICB3ZWVrOiBnZXRXZWVrbHlOb3RlU2V0dGluZ3MsXG4gICAgICAgIG1vbnRoOiBnZXRNb250aGx5Tm90ZVNldHRpbmdzLFxuICAgIH07XG4gICAgY29uc3QgZm9ybWF0ID0gZ2V0U2V0dGluZ3NbZ3JhbnVsYXJpdHldKCkuZm9ybWF0LnNwbGl0KFwiL1wiKS5wb3AoKTtcbiAgICBjb25zdCBub3RlRGF0ZSA9IHdpbmRvdy5tb21lbnQoZmlsZS5iYXNlbmFtZSwgZm9ybWF0LCB0cnVlKTtcbiAgICBpZiAoIW5vdGVEYXRlLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGlzRm9ybWF0QW1iaWd1b3VzKGZvcm1hdCwgZ3JhbnVsYXJpdHkpKSB7XG4gICAgICAgIGlmIChncmFudWxhcml0eSA9PT0gXCJ3ZWVrXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsZWFuRm9ybWF0ID0gcmVtb3ZlRXNjYXBlZENoYXJhY3RlcnMoZm9ybWF0KTtcbiAgICAgICAgICAgIGlmICgvd3sxLDJ9L2kudGVzdChjbGVhbkZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93Lm1vbWVudChmaWxlLmJhc2VuYW1lLCBcbiAgICAgICAgICAgICAgICAvLyBJZiBmb3JtYXQgY29udGFpbnMgd2VlaywgcmVtb3ZlIGRheSAmIG1vbnRoIGZvcm1hdHRpbmdcbiAgICAgICAgICAgICAgICBmb3JtYXQucmVwbGFjZSgvTXsxLDR9L2csIFwiXCIpLnJlcGxhY2UoL0R7MSw0fS9nLCBcIlwiKSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub3RlRGF0ZTtcbn1cblxuLy8gQ3JlZGl0OiBAY3JlYXRpb25peC9wYXRoLmpzXG5mdW5jdGlvbiBqb2luKC4uLnBhcnRTZWdtZW50cykge1xuICAgIC8vIFNwbGl0IHRoZSBpbnB1dHMgaW50byBhIGxpc3Qgb2YgcGF0aCBjb21tYW5kcy5cbiAgICBsZXQgcGFydHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHBhcnRTZWdtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgcGFydHMgPSBwYXJ0cy5jb25jYXQocGFydFNlZ21lbnRzW2ldLnNwbGl0KFwiL1wiKSk7XG4gICAgfVxuICAgIC8vIEludGVycHJldCB0aGUgcGF0aCBjb21tYW5kcyB0byBnZXQgdGhlIG5ldyByZXNvbHZlZCBwYXRoLlxuICAgIGNvbnN0IG5ld1BhcnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXJ0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgcGFydCA9IHBhcnRzW2ldO1xuICAgICAgICAvLyBSZW1vdmUgbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlc1xuICAgICAgICAvLyBBbHNvIHJlbW92ZSBcIi5cIiBzZWdtZW50c1xuICAgICAgICBpZiAoIXBhcnQgfHwgcGFydCA9PT0gXCIuXCIpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgLy8gUHVzaCBuZXcgcGF0aCBzZWdtZW50cy5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV3UGFydHMucHVzaChwYXJ0KTtcbiAgICB9XG4gICAgLy8gUHJlc2VydmUgdGhlIGluaXRpYWwgc2xhc2ggaWYgdGhlcmUgd2FzIG9uZS5cbiAgICBpZiAocGFydHNbMF0gPT09IFwiXCIpXG4gICAgICAgIG5ld1BhcnRzLnVuc2hpZnQoXCJcIik7XG4gICAgLy8gVHVybiBiYWNrIGludG8gYSBzaW5nbGUgc3RyaW5nIHBhdGguXG4gICAgcmV0dXJuIG5ld1BhcnRzLmpvaW4oXCIvXCIpO1xufVxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlRm9sZGVyRXhpc3RzKHBhdGgpIHtcbiAgICBjb25zdCBkaXJzID0gcGF0aC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKS5zcGxpdChcIi9cIik7XG4gICAgZGlycy5wb3AoKTsgLy8gcmVtb3ZlIGJhc2VuYW1lXG4gICAgaWYgKGRpcnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGRpciA9IGpvaW4oLi4uZGlycyk7XG4gICAgICAgIGlmICghd2luZG93LmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZGlyKSkge1xuICAgICAgICAgICAgYXdhaXQgd2luZG93LmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoZGlyKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGdldE5vdGVQYXRoKGRpcmVjdG9yeSwgZmlsZW5hbWUpIHtcbiAgICBpZiAoIWZpbGVuYW1lLmVuZHNXaXRoKFwiLm1kXCIpKSB7XG4gICAgICAgIGZpbGVuYW1lICs9IFwiLm1kXCI7XG4gICAgfVxuICAgIGNvbnN0IHBhdGggPSBvYnNpZGlhbi5ub3JtYWxpemVQYXRoKGpvaW4oZGlyZWN0b3J5LCBmaWxlbmFtZSkpO1xuICAgIGF3YWl0IGVuc3VyZUZvbGRlckV4aXN0cyhwYXRoKTtcbiAgICByZXR1cm4gcGF0aDtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldFRlbXBsYXRlQ29udGVudHModGVtcGxhdGUpIHtcbiAgICBjb25zdCBhcHAgPSB3aW5kb3cuYXBwO1xuICAgIGNvbnN0IHsgbWV0YWRhdGFDYWNoZSwgdmF1bHQgfSA9IGFwcDtcbiAgICBjb25zdCB0ZW1wbGF0ZVBhdGggPSBvYnNpZGlhbi5ub3JtYWxpemVQYXRoKHRlbXBsYXRlKTtcbiAgICBpZiAodGVtcGxhdGVQYXRoID09PSBcIi9cIikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFwiXCIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZUZpbGUgPSBtZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KHRlbXBsYXRlUGF0aCwgXCJcIik7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgdmF1bHQuY2FjaGVkUmVhZCh0ZW1wbGF0ZUZpbGUpO1xuICAgICAgICByZXR1cm4gY29udGVudHM7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHJlYWQgdGhlIGRhaWx5IG5vdGUgdGVtcGxhdGUgJyR7dGVtcGxhdGVQYXRofSdgLCBlcnIpO1xuICAgICAgICBuZXcgb2JzaWRpYW4uTm90aWNlKFwiRmFpbGVkIHRvIHJlYWQgdGhlIGRhaWx5IG5vdGUgdGVtcGxhdGVcIik7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbn1cblxuY2xhc3MgRGFpbHlOb3Rlc0ZvbGRlck1pc3NpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbn1cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBtaW1pY3MgdGhlIGJlaGF2aW9yIG9mIHRoZSBkYWlseS1ub3RlcyBwbHVnaW5cbiAqIHNvIGl0IHdpbGwgcmVwbGFjZSB7e2RhdGV9fSwge3t0aXRsZX19LCBhbmQge3t0aW1lfX0gd2l0aCB0aGVcbiAqIGZvcm1hdHRlZCB0aW1lc3RhbXAuXG4gKlxuICogTm90ZTogaXQgaGFzIGFuIGFkZGVkIGJvbnVzIHRoYXQgaXQncyBub3QgJ3RvZGF5JyBzcGVjaWZpYy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlRGFpbHlOb3RlKGRhdGUpIHtcbiAgICBjb25zdCBhcHAgPSB3aW5kb3cuYXBwO1xuICAgIGNvbnN0IHsgdmF1bHQgfSA9IGFwcDtcbiAgICBjb25zdCBtb21lbnQgPSB3aW5kb3cubW9tZW50O1xuICAgIGNvbnN0IHsgdGVtcGxhdGUsIGZvcm1hdCwgZm9sZGVyIH0gPSBnZXREYWlseU5vdGVTZXR0aW5ncygpO1xuICAgIGNvbnN0IHRlbXBsYXRlQ29udGVudHMgPSBhd2FpdCBnZXRUZW1wbGF0ZUNvbnRlbnRzKHRlbXBsYXRlKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGRhdGUuZm9ybWF0KGZvcm1hdCk7XG4gICAgY29uc3Qgbm9ybWFsaXplZFBhdGggPSBhd2FpdCBnZXROb3RlUGF0aChmb2xkZXIsIGZpbGVuYW1lKTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjcmVhdGVkRmlsZSA9IGF3YWl0IHZhdWx0LmNyZWF0ZShub3JtYWxpemVkUGF0aCwgdGVtcGxhdGVDb250ZW50c1xuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKihkYXRlfHRpbWUpXFxzKjooLio/KX19L2dpLCAoXywgX3RpbWVPckRhdGUsIG1vbWVudEZvcm1hdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gbW9tZW50KCk7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZVxuICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgIGhvdXI6IG5vdy5nZXQoXCJob3VyXCIpLFxuICAgICAgICAgICAgICAgIG1pbnV0ZTogbm93LmdldChcIm1pbnV0ZVwiKSxcbiAgICAgICAgICAgICAgICBzZWNvbmQ6IG5vdy5nZXQoXCJzZWNvbmRcIiksXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mb3JtYXQobW9tZW50Rm9ybWF0LnRyaW0oKSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqZGF0ZVxccyp9fS9naSwgZmlsZW5hbWUpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdGltZVxccyp9fS9naSwgbW9tZW50KCkuZm9ybWF0KFwiSEg6bW1cIikpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdGl0bGVcXHMqfX0vZ2ksIGZpbGVuYW1lKSk7XG4gICAgICAgIHJldHVybiBjcmVhdGVkRmlsZTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIGZpbGU6ICcke25vcm1hbGl6ZWRQYXRofSdgLCBlcnIpO1xuICAgICAgICBuZXcgb2JzaWRpYW4uTm90aWNlKFwiVW5hYmxlIHRvIGNyZWF0ZSBuZXcgZmlsZS5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0RGFpbHlOb3RlKGRhdGUsIGRhaWx5Tm90ZXMpIHtcbiAgICByZXR1cm4gZGFpbHlOb3Rlc1tnZXREYXRlVUlEKGRhdGUsIFwiZGF5XCIpXSA/PyBudWxsO1xufVxuZnVuY3Rpb24gZ2V0QWxsRGFpbHlOb3RlcygpIHtcbiAgICAvKipcbiAgICAgKiBGaW5kIGFsbCBkYWlseSBub3RlcyBpbiB0aGUgZGFpbHkgbm90ZSBmb2xkZXJcbiAgICAgKi9cbiAgICBjb25zdCB7IHZhdWx0IH0gPSB3aW5kb3cuYXBwO1xuICAgIGNvbnN0IHsgZm9sZGVyIH0gPSBnZXREYWlseU5vdGVTZXR0aW5ncygpO1xuICAgIGNvbnN0IGRhaWx5Tm90ZXNGb2xkZXIgPSB2YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgob2JzaWRpYW4ubm9ybWFsaXplUGF0aChmb2xkZXIpKTtcbiAgICBpZiAoIWRhaWx5Tm90ZXNGb2xkZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IERhaWx5Tm90ZXNGb2xkZXJNaXNzaW5nRXJyb3IoXCJGYWlsZWQgdG8gZmluZCBkYWlseSBub3RlcyBmb2xkZXJcIik7XG4gICAgfVxuICAgIGNvbnN0IGRhaWx5Tm90ZXMgPSB7fTtcbiAgICBvYnNpZGlhbi5WYXVsdC5yZWN1cnNlQ2hpbGRyZW4oZGFpbHlOb3Rlc0ZvbGRlciwgKG5vdGUpID0+IHtcbiAgICAgICAgaWYgKG5vdGUgaW5zdGFuY2VvZiBvYnNpZGlhbi5URmlsZSkge1xuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IGdldERhdGVGcm9tRmlsZShub3RlLCBcImRheVwiKTtcbiAgICAgICAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IGdldERhdGVVSUQoZGF0ZSwgXCJkYXlcIik7XG4gICAgICAgICAgICAgICAgZGFpbHlOb3Rlc1tkYXRlU3RyaW5nXSA9IG5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGFpbHlOb3Rlcztcbn1cblxuY2xhc3MgV2Vla2x5Tm90ZXNGb2xkZXJNaXNzaW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG5mdW5jdGlvbiBnZXREYXlzT2ZXZWVrKCkge1xuICAgIGNvbnN0IHsgbW9tZW50IH0gPSB3aW5kb3c7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBsZXQgd2Vla1N0YXJ0ID0gbW9tZW50LmxvY2FsZURhdGEoKS5fd2Vlay5kb3c7XG4gICAgY29uc3QgZGF5c09mV2VlayA9IFtcbiAgICAgICAgXCJzdW5kYXlcIixcbiAgICAgICAgXCJtb25kYXlcIixcbiAgICAgICAgXCJ0dWVzZGF5XCIsXG4gICAgICAgIFwid2VkbmVzZGF5XCIsXG4gICAgICAgIFwidGh1cnNkYXlcIixcbiAgICAgICAgXCJmcmlkYXlcIixcbiAgICAgICAgXCJzYXR1cmRheVwiLFxuICAgIF07XG4gICAgd2hpbGUgKHdlZWtTdGFydCkge1xuICAgICAgICBkYXlzT2ZXZWVrLnB1c2goZGF5c09mV2Vlay5zaGlmdCgpKTtcbiAgICAgICAgd2Vla1N0YXJ0LS07XG4gICAgfVxuICAgIHJldHVybiBkYXlzT2ZXZWVrO1xufVxuZnVuY3Rpb24gZ2V0RGF5T2ZXZWVrTnVtZXJpY2FsVmFsdWUoZGF5T2ZXZWVrTmFtZSkge1xuICAgIHJldHVybiBnZXREYXlzT2ZXZWVrKCkuaW5kZXhPZihkYXlPZldlZWtOYW1lLnRvTG93ZXJDYXNlKCkpO1xufVxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2Vla2x5Tm90ZShkYXRlKSB7XG4gICAgY29uc3QgeyB2YXVsdCB9ID0gd2luZG93LmFwcDtcbiAgICBjb25zdCB7IHRlbXBsYXRlLCBmb3JtYXQsIGZvbGRlciB9ID0gZ2V0V2Vla2x5Tm90ZVNldHRpbmdzKCk7XG4gICAgY29uc3QgdGVtcGxhdGVDb250ZW50cyA9IGF3YWl0IGdldFRlbXBsYXRlQ29udGVudHModGVtcGxhdGUpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gZGF0ZS5mb3JtYXQoZm9ybWF0KTtcbiAgICBjb25zdCBub3JtYWxpemVkUGF0aCA9IGF3YWl0IGdldE5vdGVQYXRoKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNyZWF0ZWRGaWxlID0gYXdhaXQgdmF1bHQuY3JlYXRlKG5vcm1hbGl6ZWRQYXRoLCB0ZW1wbGF0ZUNvbnRlbnRzXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqKGRhdGV8dGltZSlcXHMqOiguKj8pfX0vZ2ksIChfLCBfdGltZU9yRGF0ZSwgbW9tZW50Rm9ybWF0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSB3aW5kb3cubW9tZW50KCk7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZVxuICAgICAgICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgICAgIGhvdXI6IG5vdy5nZXQoXCJob3VyXCIpLFxuICAgICAgICAgICAgICAgIG1pbnV0ZTogbm93LmdldChcIm1pbnV0ZVwiKSxcbiAgICAgICAgICAgICAgICBzZWNvbmQ6IG5vdy5nZXQoXCJzZWNvbmRcIiksXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mb3JtYXQobW9tZW50Rm9ybWF0LnRyaW0oKSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdGl0bGVcXHMqfX0vZ2ksIGZpbGVuYW1lKVxuICAgICAgICAgICAgLnJlcGxhY2UoL3t7XFxzKnRpbWVcXHMqfX0vZ2ksIHdpbmRvdy5tb21lbnQoKS5mb3JtYXQoXCJISDptbVwiKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccyooc3VuZGF5fG1vbmRheXx0dWVzZGF5fHdlZG5lc2RheXx0aHVyc2RheXxmcmlkYXl8c2F0dXJkYXkpXFxzKjooLio/KX19L2dpLCAoXywgZGF5T2ZXZWVrLCBtb21lbnRGb3JtYXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRheSA9IGdldERheU9mV2Vla051bWVyaWNhbFZhbHVlKGRheU9mV2Vlayk7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZS53ZWVrZGF5KGRheSkuZm9ybWF0KG1vbWVudEZvcm1hdC50cmltKCkpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBjcmVhdGVkRmlsZTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIGZpbGU6ICcke25vcm1hbGl6ZWRQYXRofSdgLCBlcnIpO1xuICAgICAgICBuZXcgb2JzaWRpYW4uTm90aWNlKFwiVW5hYmxlIHRvIGNyZWF0ZSBuZXcgZmlsZS5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0V2Vla2x5Tm90ZShkYXRlLCB3ZWVrbHlOb3Rlcykge1xuICAgIHJldHVybiB3ZWVrbHlOb3Rlc1tnZXREYXRlVUlEKGRhdGUsIFwid2Vla1wiKV0gPz8gbnVsbDtcbn1cbmZ1bmN0aW9uIGdldEFsbFdlZWtseU5vdGVzKCkge1xuICAgIGNvbnN0IHsgdmF1bHQgfSA9IHdpbmRvdy5hcHA7XG4gICAgY29uc3QgeyBmb2xkZXIgfSA9IGdldFdlZWtseU5vdGVTZXR0aW5ncygpO1xuICAgIGNvbnN0IHdlZWtseU5vdGVzRm9sZGVyID0gdmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKG9ic2lkaWFuLm5vcm1hbGl6ZVBhdGgoZm9sZGVyKSk7XG4gICAgaWYgKCF3ZWVrbHlOb3Rlc0ZvbGRlcikge1xuICAgICAgICB0aHJvdyBuZXcgV2Vla2x5Tm90ZXNGb2xkZXJNaXNzaW5nRXJyb3IoXCJGYWlsZWQgdG8gZmluZCB3ZWVrbHkgbm90ZXMgZm9sZGVyXCIpO1xuICAgIH1cbiAgICBjb25zdCB3ZWVrbHlOb3RlcyA9IHt9O1xuICAgIG9ic2lkaWFuLlZhdWx0LnJlY3Vyc2VDaGlsZHJlbih3ZWVrbHlOb3Rlc0ZvbGRlciwgKG5vdGUpID0+IHtcbiAgICAgICAgaWYgKG5vdGUgaW5zdGFuY2VvZiBvYnNpZGlhbi5URmlsZSkge1xuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IGdldERhdGVGcm9tRmlsZShub3RlLCBcIndlZWtcIik7XG4gICAgICAgICAgICBpZiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBnZXREYXRlVUlEKGRhdGUsIFwid2Vla1wiKTtcbiAgICAgICAgICAgICAgICB3ZWVrbHlOb3Rlc1tkYXRlU3RyaW5nXSA9IG5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gd2Vla2x5Tm90ZXM7XG59XG5cbmNsYXNzIE1vbnRobHlOb3Rlc0ZvbGRlck1pc3NpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbn1cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBtaW1pY3MgdGhlIGJlaGF2aW9yIG9mIHRoZSBkYWlseS1ub3RlcyBwbHVnaW5cbiAqIHNvIGl0IHdpbGwgcmVwbGFjZSB7e2RhdGV9fSwge3t0aXRsZX19LCBhbmQge3t0aW1lfX0gd2l0aCB0aGVcbiAqIGZvcm1hdHRlZCB0aW1lc3RhbXAuXG4gKlxuICogTm90ZTogaXQgaGFzIGFuIGFkZGVkIGJvbnVzIHRoYXQgaXQncyBub3QgJ3RvZGF5JyBzcGVjaWZpYy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTW9udGhseU5vdGUoZGF0ZSkge1xuICAgIGNvbnN0IHsgdmF1bHQgfSA9IHdpbmRvdy5hcHA7XG4gICAgY29uc3QgeyB0ZW1wbGF0ZSwgZm9ybWF0LCBmb2xkZXIgfSA9IGdldE1vbnRobHlOb3RlU2V0dGluZ3MoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZUNvbnRlbnRzID0gYXdhaXQgZ2V0VGVtcGxhdGVDb250ZW50cyh0ZW1wbGF0ZSk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBkYXRlLmZvcm1hdChmb3JtYXQpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gYXdhaXQgZ2V0Tm90ZVBhdGgoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY3JlYXRlZEZpbGUgPSBhd2FpdCB2YXVsdC5jcmVhdGUobm9ybWFsaXplZFBhdGgsIHRlbXBsYXRlQ29udGVudHNcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccyooZGF0ZXx0aW1lKVxccyo6KC4qPyl9fS9naSwgKF8sIF90aW1lT3JEYXRlLCBtb21lbnRGb3JtYXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IHdpbmRvdy5tb21lbnQoKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRlXG4gICAgICAgICAgICAgICAgLnNldCh7XG4gICAgICAgICAgICAgICAgaG91cjogbm93LmdldChcImhvdXJcIiksXG4gICAgICAgICAgICAgICAgbWludXRlOiBub3cuZ2V0KFwibWludXRlXCIpLFxuICAgICAgICAgICAgICAgIHNlY29uZDogbm93LmdldChcInNlY29uZFwiKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZvcm1hdChtb21lbnRGb3JtYXQudHJpbSgpKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccypkYXRlXFxzKn19L2dpLCBmaWxlbmFtZSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97e1xccyp0aW1lXFxzKn19L2dpLCB3aW5kb3cubW9tZW50KCkuZm9ybWF0KFwiSEg6bW1cIikpXG4gICAgICAgICAgICAucmVwbGFjZSgve3tcXHMqdGl0bGVcXHMqfX0vZ2ksIGZpbGVuYW1lKSk7XG4gICAgICAgIHJldHVybiBjcmVhdGVkRmlsZTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIGZpbGU6ICcke25vcm1hbGl6ZWRQYXRofSdgLCBlcnIpO1xuICAgICAgICBuZXcgb2JzaWRpYW4uTm90aWNlKFwiVW5hYmxlIHRvIGNyZWF0ZSBuZXcgZmlsZS5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0TW9udGhseU5vdGUoZGF0ZSwgbW9udGhseU5vdGVzKSB7XG4gICAgcmV0dXJuIG1vbnRobHlOb3Rlc1tnZXREYXRlVUlEKGRhdGUsIFwibW9udGhcIildID8/IG51bGw7XG59XG5mdW5jdGlvbiBnZXRBbGxNb250aGx5Tm90ZXMoKSB7XG4gICAgY29uc3QgeyB2YXVsdCB9ID0gd2luZG93LmFwcDtcbiAgICBjb25zdCB7IGZvbGRlciB9ID0gZ2V0TW9udGhseU5vdGVTZXR0aW5ncygpO1xuICAgIGNvbnN0IG1vbnRobHlOb3Rlc0ZvbGRlciA9IHZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChvYnNpZGlhbi5ub3JtYWxpemVQYXRoKGZvbGRlcikpO1xuICAgIGlmICghbW9udGhseU5vdGVzRm9sZGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBNb250aGx5Tm90ZXNGb2xkZXJNaXNzaW5nRXJyb3IoXCJGYWlsZWQgdG8gZmluZCBtb250aGx5IG5vdGVzIGZvbGRlclwiKTtcbiAgICB9XG4gICAgY29uc3QgbW9udGhseU5vdGVzID0ge307XG4gICAgb2JzaWRpYW4uVmF1bHQucmVjdXJzZUNoaWxkcmVuKG1vbnRobHlOb3Rlc0ZvbGRlciwgKG5vdGUpID0+IHtcbiAgICAgICAgaWYgKG5vdGUgaW5zdGFuY2VvZiBvYnNpZGlhbi5URmlsZSkge1xuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IGdldERhdGVGcm9tRmlsZShub3RlLCBcIm1vbnRoXCIpO1xuICAgICAgICAgICAgaWYgKGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gZ2V0RGF0ZVVJRChkYXRlLCBcIm1vbnRoXCIpO1xuICAgICAgICAgICAgICAgIG1vbnRobHlOb3Rlc1tkYXRlU3RyaW5nXSA9IG5vdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbW9udGhseU5vdGVzO1xufVxuXG5mdW5jdGlvbiBhcHBIYXNEYWlseU5vdGVzUGx1Z2luTG9hZGVkKCkge1xuICAgIGNvbnN0IHsgYXBwIH0gPSB3aW5kb3c7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBjb25zdCBkYWlseU5vdGVzUGx1Z2luID0gYXBwLmludGVybmFsUGx1Z2lucy5wbHVnaW5zW1wiZGFpbHktbm90ZXNcIl07XG4gICAgaWYgKGRhaWx5Tm90ZXNQbHVnaW4gJiYgZGFpbHlOb3Rlc1BsdWdpbi5lbmFibGVkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IHBlcmlvZGljTm90ZXMgPSBhcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJwZXJpb2RpYy1ub3Rlc1wiKTtcbiAgICByZXR1cm4gcGVyaW9kaWNOb3RlcyAmJiBwZXJpb2RpY05vdGVzLnNldHRpbmdzPy5kYWlseT8uZW5hYmxlZDtcbn1cbi8qKlxuICogWFhYOiBcIldlZWtseSBOb3Rlc1wiIGxpdmUgaW4gZWl0aGVyIHRoZSBDYWxlbmRhciBwbHVnaW4gb3IgdGhlIHBlcmlvZGljLW5vdGVzIHBsdWdpbi5cbiAqIENoZWNrIGJvdGggdW50aWwgdGhlIHdlZWtseSBub3RlcyBmZWF0dXJlIGlzIHJlbW92ZWQgZnJvbSB0aGUgQ2FsZW5kYXIgcGx1Z2luLlxuICovXG5mdW5jdGlvbiBhcHBIYXNXZWVrbHlOb3Rlc1BsdWdpbkxvYWRlZCgpIHtcbiAgICBjb25zdCB7IGFwcCB9ID0gd2luZG93O1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgaWYgKGFwcC5wbHVnaW5zLmdldFBsdWdpbihcImNhbGVuZGFyXCIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IHBlcmlvZGljTm90ZXMgPSBhcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJwZXJpb2RpYy1ub3Rlc1wiKTtcbiAgICByZXR1cm4gcGVyaW9kaWNOb3RlcyAmJiBwZXJpb2RpY05vdGVzLnNldHRpbmdzPy53ZWVrbHk/LmVuYWJsZWQ7XG59XG5mdW5jdGlvbiBhcHBIYXNNb250aGx5Tm90ZXNQbHVnaW5Mb2FkZWQoKSB7XG4gICAgY29uc3QgeyBhcHAgfSA9IHdpbmRvdztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IHBlcmlvZGljTm90ZXMgPSBhcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJwZXJpb2RpYy1ub3Rlc1wiKTtcbiAgICByZXR1cm4gcGVyaW9kaWNOb3RlcyAmJiBwZXJpb2RpY05vdGVzLnNldHRpbmdzPy5tb250aGx5Py5lbmFibGVkO1xufVxuXG5leHBvcnRzLkRFRkFVTFRfREFJTFlfTk9URV9GT1JNQVQgPSBERUZBVUxUX0RBSUxZX05PVEVfRk9STUFUO1xuZXhwb3J0cy5ERUZBVUxUX01PTlRITFlfTk9URV9GT1JNQVQgPSBERUZBVUxUX01PTlRITFlfTk9URV9GT1JNQVQ7XG5leHBvcnRzLkRFRkFVTFRfV0VFS0xZX05PVEVfRk9STUFUID0gREVGQVVMVF9XRUVLTFlfTk9URV9GT1JNQVQ7XG5leHBvcnRzLmFwcEhhc0RhaWx5Tm90ZXNQbHVnaW5Mb2FkZWQgPSBhcHBIYXNEYWlseU5vdGVzUGx1Z2luTG9hZGVkO1xuZXhwb3J0cy5hcHBIYXNNb250aGx5Tm90ZXNQbHVnaW5Mb2FkZWQgPSBhcHBIYXNNb250aGx5Tm90ZXNQbHVnaW5Mb2FkZWQ7XG5leHBvcnRzLmFwcEhhc1dlZWtseU5vdGVzUGx1Z2luTG9hZGVkID0gYXBwSGFzV2Vla2x5Tm90ZXNQbHVnaW5Mb2FkZWQ7XG5leHBvcnRzLmNyZWF0ZURhaWx5Tm90ZSA9IGNyZWF0ZURhaWx5Tm90ZTtcbmV4cG9ydHMuY3JlYXRlTW9udGhseU5vdGUgPSBjcmVhdGVNb250aGx5Tm90ZTtcbmV4cG9ydHMuY3JlYXRlV2Vla2x5Tm90ZSA9IGNyZWF0ZVdlZWtseU5vdGU7XG5leHBvcnRzLmdldEFsbERhaWx5Tm90ZXMgPSBnZXRBbGxEYWlseU5vdGVzO1xuZXhwb3J0cy5nZXRBbGxNb250aGx5Tm90ZXMgPSBnZXRBbGxNb250aGx5Tm90ZXM7XG5leHBvcnRzLmdldEFsbFdlZWtseU5vdGVzID0gZ2V0QWxsV2Vla2x5Tm90ZXM7XG5leHBvcnRzLmdldERhaWx5Tm90ZSA9IGdldERhaWx5Tm90ZTtcbmV4cG9ydHMuZ2V0RGFpbHlOb3RlU2V0dGluZ3MgPSBnZXREYWlseU5vdGVTZXR0aW5ncztcbmV4cG9ydHMuZ2V0RGF0ZUZyb21GaWxlID0gZ2V0RGF0ZUZyb21GaWxlO1xuZXhwb3J0cy5nZXREYXRlVUlEID0gZ2V0RGF0ZVVJRDtcbmV4cG9ydHMuZ2V0TW9udGhseU5vdGUgPSBnZXRNb250aGx5Tm90ZTtcbmV4cG9ydHMuZ2V0TW9udGhseU5vdGVTZXR0aW5ncyA9IGdldE1vbnRobHlOb3RlU2V0dGluZ3M7XG5leHBvcnRzLmdldFRlbXBsYXRlQ29udGVudHMgPSBnZXRUZW1wbGF0ZUNvbnRlbnRzO1xuZXhwb3J0cy5nZXRXZWVrbHlOb3RlID0gZ2V0V2Vla2x5Tm90ZTtcbmV4cG9ydHMuZ2V0V2Vla2x5Tm90ZVNldHRpbmdzID0gZ2V0V2Vla2x5Tm90ZVNldHRpbmdzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1hdGNoQW55UGF0dGVybiA9IGV4cG9ydHMuZXh0cmFjdFRlcm1zID0gZXhwb3J0cy5yZXBlYXRlZFRpbWV1bml0UGF0dGVybiA9IHZvaWQgMDtcbmZ1bmN0aW9uIHJlcGVhdGVkVGltZXVuaXRQYXR0ZXJuKHByZWZpeCwgc2luZ2xlVGltZXVuaXRQYXR0ZXJuKSB7XG4gICAgY29uc3Qgc2luZ2xlVGltZXVuaXRQYXR0ZXJuTm9DYXB0dXJlID0gc2luZ2xlVGltZXVuaXRQYXR0ZXJuLnJlcGxhY2UoL1xcKCg/IVxcPykvZywgXCIoPzpcIik7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0ke3NpbmdsZVRpbWV1bml0UGF0dGVybk5vQ2FwdHVyZX1cXFxccyooPzosP1xcXFxzezAsNX0ke3NpbmdsZVRpbWV1bml0UGF0dGVybk5vQ2FwdHVyZX0pezAsMTB9YDtcbn1cbmV4cG9ydHMucmVwZWF0ZWRUaW1ldW5pdFBhdHRlcm4gPSByZXBlYXRlZFRpbWV1bml0UGF0dGVybjtcbmZ1bmN0aW9uIGV4dHJhY3RUZXJtcyhkaWN0aW9uYXJ5KSB7XG4gICAgbGV0IGtleXM7XG4gICAgaWYgKGRpY3Rpb25hcnkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBrZXlzID0gWy4uLmRpY3Rpb25hcnldO1xuICAgIH1cbiAgICBlbHNlIGlmIChkaWN0aW9uYXJ5IGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgIGtleXMgPSBBcnJheS5mcm9tKGRpY3Rpb25hcnkua2V5cygpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhkaWN0aW9uYXJ5KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG59XG5leHBvcnRzLmV4dHJhY3RUZXJtcyA9IGV4dHJhY3RUZXJtcztcbmZ1bmN0aW9uIG1hdGNoQW55UGF0dGVybihkaWN0aW9uYXJ5KSB7XG4gICAgY29uc3Qgam9pbmVkVGVybXMgPSBleHRyYWN0VGVybXMoZGljdGlvbmFyeSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpXG4gICAgICAgIC5qb2luKFwifFwiKVxuICAgICAgICAucmVwbGFjZSgvXFwuL2csIFwiXFxcXC5cIik7XG4gICAgcmV0dXJuIGAoPzoke2pvaW5lZFRlcm1zfSlgO1xufVxuZXhwb3J0cy5tYXRjaEFueVBhdHRlcm4gPSBtYXRjaEFueVBhdHRlcm47XG4iLCIhZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKTp0LmRheWpzPWUoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO3ZhciB0PVwibWlsbGlzZWNvbmRcIixlPVwic2Vjb25kXCIsbj1cIm1pbnV0ZVwiLHI9XCJob3VyXCIsaT1cImRheVwiLHM9XCJ3ZWVrXCIsdT1cIm1vbnRoXCIsYT1cInF1YXJ0ZXJcIixvPVwieWVhclwiLGY9XCJkYXRlXCIsaD0vXihcXGR7NH0pWy0vXT8oXFxkezEsMn0pP1stL10/KFxcZHswLDJ9KVteMC05XSooXFxkezEsMn0pPzo/KFxcZHsxLDJ9KT86PyhcXGR7MSwyfSk/Wy46XT8oXFxkKyk/JC8sYz0vXFxbKFteXFxdXSspXXxZezEsNH18TXsxLDR9fER7MSwyfXxkezEsNH18SHsxLDJ9fGh7MSwyfXxhfEF8bXsxLDJ9fHN7MSwyfXxaezEsMn18U1NTL2csZD17bmFtZTpcImVuXCIsd2Vla2RheXM6XCJTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheVwiLnNwbGl0KFwiX1wiKSxtb250aHM6XCJKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyXCIuc3BsaXQoXCJfXCIpfSwkPWZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1TdHJpbmcodCk7cmV0dXJuIXJ8fHIubGVuZ3RoPj1lP3Q6XCJcIitBcnJheShlKzEtci5sZW5ndGgpLmpvaW4obikrdH0sbD17czokLHo6ZnVuY3Rpb24odCl7dmFyIGU9LXQudXRjT2Zmc2V0KCksbj1NYXRoLmFicyhlKSxyPU1hdGguZmxvb3Iobi82MCksaT1uJTYwO3JldHVybihlPD0wP1wiK1wiOlwiLVwiKSskKHIsMixcIjBcIikrXCI6XCIrJChpLDIsXCIwXCIpfSxtOmZ1bmN0aW9uIHQoZSxuKXtpZihlLmRhdGUoKTxuLmRhdGUoKSlyZXR1cm4tdChuLGUpO3ZhciByPTEyKihuLnllYXIoKS1lLnllYXIoKSkrKG4ubW9udGgoKS1lLm1vbnRoKCkpLGk9ZS5jbG9uZSgpLmFkZChyLHUpLHM9bi1pPDAsYT1lLmNsb25lKCkuYWRkKHIrKHM/LTE6MSksdSk7cmV0dXJuKygtKHIrKG4taSkvKHM/aS1hOmEtaSkpfHwwKX0sYTpmdW5jdGlvbih0KXtyZXR1cm4gdDwwP01hdGguY2VpbCh0KXx8MDpNYXRoLmZsb29yKHQpfSxwOmZ1bmN0aW9uKGgpe3JldHVybntNOnUseTpvLHc6cyxkOmksRDpmLGg6cixtOm4sczplLG1zOnQsUTphfVtoXXx8U3RyaW5nKGh8fFwiXCIpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvcyQvLFwiXCIpfSx1OmZ1bmN0aW9uKHQpe3JldHVybiB2b2lkIDA9PT10fX0seT1cImVuXCIsTT17fTtNW3ldPWQ7dmFyIG09ZnVuY3Rpb24odCl7cmV0dXJuIHQgaW5zdGFuY2VvZiBTfSxEPWZ1bmN0aW9uKHQsZSxuKXt2YXIgcjtpZighdClyZXR1cm4geTtpZihcInN0cmluZ1wiPT10eXBlb2YgdClNW3RdJiYocj10KSxlJiYoTVt0XT1lLHI9dCk7ZWxzZXt2YXIgaT10Lm5hbWU7TVtpXT10LHI9aX1yZXR1cm4hbiYmciYmKHk9cikscnx8IW4mJnl9LHY9ZnVuY3Rpb24odCxlKXtpZihtKHQpKXJldHVybiB0LmNsb25lKCk7dmFyIG49XCJvYmplY3RcIj09dHlwZW9mIGU/ZTp7fTtyZXR1cm4gbi5kYXRlPXQsbi5hcmdzPWFyZ3VtZW50cyxuZXcgUyhuKX0sZz1sO2cubD1ELGcuaT1tLGcudz1mdW5jdGlvbih0LGUpe3JldHVybiB2KHQse2xvY2FsZTplLiRMLHV0YzplLiR1LHg6ZS4keCwkb2Zmc2V0OmUuJG9mZnNldH0pfTt2YXIgUz1mdW5jdGlvbigpe2Z1bmN0aW9uIGQodCl7dGhpcy4kTD1EKHQubG9jYWxlLG51bGwsITApLHRoaXMucGFyc2UodCl9dmFyICQ9ZC5wcm90b3R5cGU7cmV0dXJuICQucGFyc2U9ZnVuY3Rpb24odCl7dGhpcy4kZD1mdW5jdGlvbih0KXt2YXIgZT10LmRhdGUsbj10LnV0YztpZihudWxsPT09ZSlyZXR1cm4gbmV3IERhdGUoTmFOKTtpZihnLnUoZSkpcmV0dXJuIG5ldyBEYXRlO2lmKGUgaW5zdGFuY2VvZiBEYXRlKXJldHVybiBuZXcgRGF0ZShlKTtpZihcInN0cmluZ1wiPT10eXBlb2YgZSYmIS9aJC9pLnRlc3QoZSkpe3ZhciByPWUubWF0Y2goaCk7aWYocil7dmFyIGk9clsyXS0xfHwwLHM9KHJbN118fFwiMFwiKS5zdWJzdHJpbmcoMCwzKTtyZXR1cm4gbj9uZXcgRGF0ZShEYXRlLlVUQyhyWzFdLGksclszXXx8MSxyWzRdfHwwLHJbNV18fDAscls2XXx8MCxzKSk6bmV3IERhdGUoclsxXSxpLHJbM118fDEscls0XXx8MCxyWzVdfHwwLHJbNl18fDAscyl9fXJldHVybiBuZXcgRGF0ZShlKX0odCksdGhpcy4keD10Lnh8fHt9LHRoaXMuaW5pdCgpfSwkLmluaXQ9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLiRkO3RoaXMuJHk9dC5nZXRGdWxsWWVhcigpLHRoaXMuJE09dC5nZXRNb250aCgpLHRoaXMuJEQ9dC5nZXREYXRlKCksdGhpcy4kVz10LmdldERheSgpLHRoaXMuJEg9dC5nZXRIb3VycygpLHRoaXMuJG09dC5nZXRNaW51dGVzKCksdGhpcy4kcz10LmdldFNlY29uZHMoKSx0aGlzLiRtcz10LmdldE1pbGxpc2Vjb25kcygpfSwkLiR1dGlscz1mdW5jdGlvbigpe3JldHVybiBnfSwkLmlzVmFsaWQ9ZnVuY3Rpb24oKXtyZXR1cm4hKFwiSW52YWxpZCBEYXRlXCI9PT10aGlzLiRkLnRvU3RyaW5nKCkpfSwkLmlzU2FtZT1mdW5jdGlvbih0LGUpe3ZhciBuPXYodCk7cmV0dXJuIHRoaXMuc3RhcnRPZihlKTw9biYmbjw9dGhpcy5lbmRPZihlKX0sJC5pc0FmdGVyPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHYodCk8dGhpcy5zdGFydE9mKGUpfSwkLmlzQmVmb3JlPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuZW5kT2YoZSk8dih0KX0sJC4kZz1mdW5jdGlvbih0LGUsbil7cmV0dXJuIGcudSh0KT90aGlzW2VdOnRoaXMuc2V0KG4sdCl9LCQudW5peD1mdW5jdGlvbigpe3JldHVybiBNYXRoLmZsb29yKHRoaXMudmFsdWVPZigpLzFlMyl9LCQudmFsdWVPZj1mdW5jdGlvbigpe3JldHVybiB0aGlzLiRkLmdldFRpbWUoKX0sJC5zdGFydE9mPWZ1bmN0aW9uKHQsYSl7dmFyIGg9dGhpcyxjPSEhZy51KGEpfHxhLGQ9Zy5wKHQpLCQ9ZnVuY3Rpb24odCxlKXt2YXIgbj1nLncoaC4kdT9EYXRlLlVUQyhoLiR5LGUsdCk6bmV3IERhdGUoaC4keSxlLHQpLGgpO3JldHVybiBjP246bi5lbmRPZihpKX0sbD1mdW5jdGlvbih0LGUpe3JldHVybiBnLncoaC50b0RhdGUoKVt0XS5hcHBseShoLnRvRGF0ZShcInNcIiksKGM/WzAsMCwwLDBdOlsyMyw1OSw1OSw5OTldKS5zbGljZShlKSksaCl9LHk9dGhpcy4kVyxNPXRoaXMuJE0sbT10aGlzLiRELEQ9XCJzZXRcIisodGhpcy4kdT9cIlVUQ1wiOlwiXCIpO3N3aXRjaChkKXtjYXNlIG86cmV0dXJuIGM/JCgxLDApOiQoMzEsMTEpO2Nhc2UgdTpyZXR1cm4gYz8kKDEsTSk6JCgwLE0rMSk7Y2FzZSBzOnZhciB2PXRoaXMuJGxvY2FsZSgpLndlZWtTdGFydHx8MCxTPSh5PHY/eSs3OnkpLXY7cmV0dXJuICQoYz9tLVM6bSsoNi1TKSxNKTtjYXNlIGk6Y2FzZSBmOnJldHVybiBsKEQrXCJIb3Vyc1wiLDApO2Nhc2UgcjpyZXR1cm4gbChEK1wiTWludXRlc1wiLDEpO2Nhc2UgbjpyZXR1cm4gbChEK1wiU2Vjb25kc1wiLDIpO2Nhc2UgZTpyZXR1cm4gbChEK1wiTWlsbGlzZWNvbmRzXCIsMyk7ZGVmYXVsdDpyZXR1cm4gdGhpcy5jbG9uZSgpfX0sJC5lbmRPZj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5zdGFydE9mKHQsITEpfSwkLiRzZXQ9ZnVuY3Rpb24ocyxhKXt2YXIgaCxjPWcucChzKSxkPVwic2V0XCIrKHRoaXMuJHU/XCJVVENcIjpcIlwiKSwkPShoPXt9LGhbaV09ZCtcIkRhdGVcIixoW2ZdPWQrXCJEYXRlXCIsaFt1XT1kK1wiTW9udGhcIixoW29dPWQrXCJGdWxsWWVhclwiLGhbcl09ZCtcIkhvdXJzXCIsaFtuXT1kK1wiTWludXRlc1wiLGhbZV09ZCtcIlNlY29uZHNcIixoW3RdPWQrXCJNaWxsaXNlY29uZHNcIixoKVtjXSxsPWM9PT1pP3RoaXMuJEQrKGEtdGhpcy4kVyk6YTtpZihjPT09dXx8Yz09PW8pe3ZhciB5PXRoaXMuY2xvbmUoKS5zZXQoZiwxKTt5LiRkWyRdKGwpLHkuaW5pdCgpLHRoaXMuJGQ9eS5zZXQoZixNYXRoLm1pbih0aGlzLiRELHkuZGF5c0luTW9udGgoKSkpLiRkfWVsc2UgJCYmdGhpcy4kZFskXShsKTtyZXR1cm4gdGhpcy5pbml0KCksdGhpc30sJC5zZXQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5jbG9uZSgpLiRzZXQodCxlKX0sJC5nZXQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXNbZy5wKHQpXSgpfSwkLmFkZD1mdW5jdGlvbih0LGEpe3ZhciBmLGg9dGhpczt0PU51bWJlcih0KTt2YXIgYz1nLnAoYSksZD1mdW5jdGlvbihlKXt2YXIgbj12KGgpO3JldHVybiBnLncobi5kYXRlKG4uZGF0ZSgpK01hdGgucm91bmQoZSp0KSksaCl9O2lmKGM9PT11KXJldHVybiB0aGlzLnNldCh1LHRoaXMuJE0rdCk7aWYoYz09PW8pcmV0dXJuIHRoaXMuc2V0KG8sdGhpcy4keSt0KTtpZihjPT09aSlyZXR1cm4gZCgxKTtpZihjPT09cylyZXR1cm4gZCg3KTt2YXIgJD0oZj17fSxmW25dPTZlNCxmW3JdPTM2ZTUsZltlXT0xZTMsZilbY118fDEsbD10aGlzLiRkLmdldFRpbWUoKSt0KiQ7cmV0dXJuIGcudyhsLHRoaXMpfSwkLnN1YnRyYWN0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuYWRkKC0xKnQsZSl9LCQuZm9ybWF0PWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7aWYoIXRoaXMuaXNWYWxpZCgpKXJldHVyblwiSW52YWxpZCBEYXRlXCI7dmFyIG49dHx8XCJZWVlZLU1NLUREVEhIOm1tOnNzWlwiLHI9Zy56KHRoaXMpLGk9dGhpcy4kbG9jYWxlKCkscz10aGlzLiRILHU9dGhpcy4kbSxhPXRoaXMuJE0sbz1pLndlZWtkYXlzLGY9aS5tb250aHMsaD1mdW5jdGlvbih0LHIsaSxzKXtyZXR1cm4gdCYmKHRbcl18fHQoZSxuKSl8fGlbcl0uc3Vic3RyKDAscyl9LGQ9ZnVuY3Rpb24odCl7cmV0dXJuIGcucyhzJTEyfHwxMix0LFwiMFwiKX0sJD1pLm1lcmlkaWVtfHxmdW5jdGlvbih0LGUsbil7dmFyIHI9dDwxMj9cIkFNXCI6XCJQTVwiO3JldHVybiBuP3IudG9Mb3dlckNhc2UoKTpyfSxsPXtZWTpTdHJpbmcodGhpcy4keSkuc2xpY2UoLTIpLFlZWVk6dGhpcy4keSxNOmErMSxNTTpnLnMoYSsxLDIsXCIwXCIpLE1NTTpoKGkubW9udGhzU2hvcnQsYSxmLDMpLE1NTU06aChmLGEpLEQ6dGhpcy4kRCxERDpnLnModGhpcy4kRCwyLFwiMFwiKSxkOlN0cmluZyh0aGlzLiRXKSxkZDpoKGkud2Vla2RheXNNaW4sdGhpcy4kVyxvLDIpLGRkZDpoKGkud2Vla2RheXNTaG9ydCx0aGlzLiRXLG8sMyksZGRkZDpvW3RoaXMuJFddLEg6U3RyaW5nKHMpLEhIOmcucyhzLDIsXCIwXCIpLGg6ZCgxKSxoaDpkKDIpLGE6JChzLHUsITApLEE6JChzLHUsITEpLG06U3RyaW5nKHUpLG1tOmcucyh1LDIsXCIwXCIpLHM6U3RyaW5nKHRoaXMuJHMpLHNzOmcucyh0aGlzLiRzLDIsXCIwXCIpLFNTUzpnLnModGhpcy4kbXMsMyxcIjBcIiksWjpyfTtyZXR1cm4gbi5yZXBsYWNlKGMsZnVuY3Rpb24odCxlKXtyZXR1cm4gZXx8bFt0XXx8ci5yZXBsYWNlKFwiOlwiLFwiXCIpfSl9LCQudXRjT2Zmc2V0PWZ1bmN0aW9uKCl7cmV0dXJuIDE1Ki1NYXRoLnJvdW5kKHRoaXMuJGQuZ2V0VGltZXpvbmVPZmZzZXQoKS8xNSl9LCQuZGlmZj1mdW5jdGlvbih0LGYsaCl7dmFyIGMsZD1nLnAoZiksJD12KHQpLGw9NmU0KigkLnV0Y09mZnNldCgpLXRoaXMudXRjT2Zmc2V0KCkpLHk9dGhpcy0kLE09Zy5tKHRoaXMsJCk7cmV0dXJuIE09KGM9e30sY1tvXT1NLzEyLGNbdV09TSxjW2FdPU0vMyxjW3NdPSh5LWwpLzYwNDhlNSxjW2ldPSh5LWwpLzg2NGU1LGNbcl09eS8zNmU1LGNbbl09eS82ZTQsY1tlXT15LzFlMyxjKVtkXXx8eSxoP006Zy5hKE0pfSwkLmRheXNJbk1vbnRoPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZW5kT2YodSkuJER9LCQuJGxvY2FsZT1mdW5jdGlvbigpe3JldHVybiBNW3RoaXMuJExdfSwkLmxvY2FsZT1mdW5jdGlvbih0LGUpe2lmKCF0KXJldHVybiB0aGlzLiRMO3ZhciBuPXRoaXMuY2xvbmUoKSxyPUQodCxlLCEwKTtyZXR1cm4gciYmKG4uJEw9ciksbn0sJC5jbG9uZT1mdW5jdGlvbigpe3JldHVybiBnLncodGhpcy4kZCx0aGlzKX0sJC50b0RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IERhdGUodGhpcy52YWx1ZU9mKCkpfSwkLnRvSlNPTj1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlzVmFsaWQoKT90aGlzLnRvSVNPU3RyaW5nKCk6bnVsbH0sJC50b0lTT1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLiRkLnRvSVNPU3RyaW5nKCl9LCQudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kZC50b1VUQ1N0cmluZygpfSxkfSgpLHA9Uy5wcm90b3R5cGU7cmV0dXJuIHYucHJvdG90eXBlPXAsW1tcIiRtc1wiLHRdLFtcIiRzXCIsZV0sW1wiJG1cIixuXSxbXCIkSFwiLHJdLFtcIiRXXCIsaV0sW1wiJE1cIix1XSxbXCIkeVwiLG9dLFtcIiREXCIsZl1dLmZvckVhY2goZnVuY3Rpb24odCl7cFt0WzFdXT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy4kZyhlLHRbMF0sdFsxXSl9fSksdi5leHRlbmQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdC4kaXx8KHQoZSxTLHYpLHQuJGk9ITApLHZ9LHYubG9jYWxlPUQsdi5pc0RheWpzPW0sdi51bml4PWZ1bmN0aW9uKHQpe3JldHVybiB2KDFlMyp0KX0sdi5lbj1NW3ldLHYuTHM9TSx2LnA9e30sdn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZpbmRZZWFyQ2xvc2VzdFRvUmVmID0gZXhwb3J0cy5maW5kTW9zdExpa2VseUFEWWVhciA9IHZvaWQgMDtcbmNvbnN0IGRheWpzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmZ1bmN0aW9uIGZpbmRNb3N0TGlrZWx5QURZZWFyKHllYXJOdW1iZXIpIHtcbiAgICBpZiAoeWVhck51bWJlciA8IDEwMCkge1xuICAgICAgICBpZiAoeWVhck51bWJlciA+IDUwKSB7XG4gICAgICAgICAgICB5ZWFyTnVtYmVyID0geWVhck51bWJlciArIDE5MDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB5ZWFyTnVtYmVyID0geWVhck51bWJlciArIDIwMDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHllYXJOdW1iZXI7XG59XG5leHBvcnRzLmZpbmRNb3N0TGlrZWx5QURZZWFyID0gZmluZE1vc3RMaWtlbHlBRFllYXI7XG5mdW5jdGlvbiBmaW5kWWVhckNsb3Nlc3RUb1JlZihyZWZEYXRlLCBkYXksIG1vbnRoKSB7XG4gICAgY29uc3QgcmVmTW9tZW50ID0gZGF5anNfMS5kZWZhdWx0KHJlZkRhdGUpO1xuICAgIGxldCBkYXRlTW9tZW50ID0gcmVmTW9tZW50O1xuICAgIGRhdGVNb21lbnQgPSBkYXRlTW9tZW50Lm1vbnRoKG1vbnRoIC0gMSk7XG4gICAgZGF0ZU1vbWVudCA9IGRhdGVNb21lbnQuZGF0ZShkYXkpO1xuICAgIGRhdGVNb21lbnQgPSBkYXRlTW9tZW50LnllYXIocmVmTW9tZW50LnllYXIoKSk7XG4gICAgY29uc3QgbmV4dFllYXIgPSBkYXRlTW9tZW50LmFkZCgxLCBcInlcIik7XG4gICAgY29uc3QgbGFzdFllYXIgPSBkYXRlTW9tZW50LmFkZCgtMSwgXCJ5XCIpO1xuICAgIGlmIChNYXRoLmFicyhuZXh0WWVhci5kaWZmKHJlZk1vbWVudCkpIDwgTWF0aC5hYnMoZGF0ZU1vbWVudC5kaWZmKHJlZk1vbWVudCkpKSB7XG4gICAgICAgIGRhdGVNb21lbnQgPSBuZXh0WWVhcjtcbiAgICB9XG4gICAgZWxzZSBpZiAoTWF0aC5hYnMobGFzdFllYXIuZGlmZihyZWZNb21lbnQpKSA8IE1hdGguYWJzKGRhdGVNb21lbnQuZGlmZihyZWZNb21lbnQpKSkge1xuICAgICAgICBkYXRlTW9tZW50ID0gbGFzdFllYXI7XG4gICAgfVxuICAgIHJldHVybiBkYXRlTW9tZW50LnllYXIoKTtcbn1cbmV4cG9ydHMuZmluZFllYXJDbG9zZXN0VG9SZWYgPSBmaW5kWWVhckNsb3Nlc3RUb1JlZjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVRpbWVVbml0cyA9IGV4cG9ydHMuVElNRV9VTklUU19QQVRURVJOID0gZXhwb3J0cy5wYXJzZVllYXIgPSBleHBvcnRzLllFQVJfUEFUVEVSTiA9IGV4cG9ydHMucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybiA9IGV4cG9ydHMuT1JESU5BTF9OVU1CRVJfUEFUVEVSTiA9IGV4cG9ydHMucGFyc2VOdW1iZXJQYXR0ZXJuID0gZXhwb3J0cy5OVU1CRVJfUEFUVEVSTiA9IGV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUlkgPSBleHBvcnRzLk9SRElOQUxfV09SRF9ESUNUSU9OQVJZID0gZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWSA9IGV4cG9ydHMuTU9OVEhfRElDVElPTkFSWSA9IGV4cG9ydHMuRlVMTF9NT05USF9OQU1FX0RJQ1RJT05BUlkgPSBleHBvcnRzLldFRUtEQVlfRElDVElPTkFSWSA9IHZvaWQgMDtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgeWVhcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jYWxjdWxhdGlvbi95ZWFyc1wiKTtcbmV4cG9ydHMuV0VFS0RBWV9ESUNUSU9OQVJZID0ge1xuICAgIHN1bmRheTogMCxcbiAgICBzdW46IDAsXG4gICAgXCJzdW4uXCI6IDAsXG4gICAgbW9uZGF5OiAxLFxuICAgIG1vbjogMSxcbiAgICBcIm1vbi5cIjogMSxcbiAgICB0dWVzZGF5OiAyLFxuICAgIHR1ZTogMixcbiAgICBcInR1ZS5cIjogMixcbiAgICB3ZWRuZXNkYXk6IDMsXG4gICAgd2VkOiAzLFxuICAgIFwid2VkLlwiOiAzLFxuICAgIHRodXJzZGF5OiA0LFxuICAgIHRodXJzOiA0LFxuICAgIFwidGh1cnMuXCI6IDQsXG4gICAgdGh1cjogNCxcbiAgICBcInRodXIuXCI6IDQsXG4gICAgdGh1OiA0LFxuICAgIFwidGh1LlwiOiA0LFxuICAgIGZyaWRheTogNSxcbiAgICBmcmk6IDUsXG4gICAgXCJmcmkuXCI6IDUsXG4gICAgc2F0dXJkYXk6IDYsXG4gICAgc2F0OiA2LFxuICAgIFwic2F0LlwiOiA2LFxufTtcbmV4cG9ydHMuRlVMTF9NT05USF9OQU1FX0RJQ1RJT05BUlkgPSB7XG4gICAgamFudWFyeTogMSxcbiAgICBmZWJydWFyeTogMixcbiAgICBtYXJjaDogMyxcbiAgICBhcHJpbDogNCxcbiAgICBtYXk6IDUsXG4gICAganVuZTogNixcbiAgICBqdWx5OiA3LFxuICAgIGF1Z3VzdDogOCxcbiAgICBzZXB0ZW1iZXI6IDksXG4gICAgb2N0b2JlcjogMTAsXG4gICAgbm92ZW1iZXI6IDExLFxuICAgIGRlY2VtYmVyOiAxMixcbn07XG5leHBvcnRzLk1PTlRIX0RJQ1RJT05BUlkgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGV4cG9ydHMuRlVMTF9NT05USF9OQU1FX0RJQ1RJT05BUlkpLCB7IGphbjogMSwgXCJqYW4uXCI6IDEsIGZlYjogMiwgXCJmZWIuXCI6IDIsIG1hcjogMywgXCJtYXIuXCI6IDMsIGFwcjogNCwgXCJhcHIuXCI6IDQsIGp1bjogNiwgXCJqdW4uXCI6IDYsIGp1bDogNywgXCJqdWwuXCI6IDcsIGF1ZzogOCwgXCJhdWcuXCI6IDgsIHNlcDogOSwgXCJzZXAuXCI6IDksIHNlcHQ6IDksIFwic2VwdC5cIjogOSwgb2N0OiAxMCwgXCJvY3QuXCI6IDEwLCBub3Y6IDExLCBcIm5vdi5cIjogMTEsIGRlYzogMTIsIFwiZGVjLlwiOiAxMiB9KTtcbmV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkgPSB7XG4gICAgb25lOiAxLFxuICAgIHR3bzogMixcbiAgICB0aHJlZTogMyxcbiAgICBmb3VyOiA0LFxuICAgIGZpdmU6IDUsXG4gICAgc2l4OiA2LFxuICAgIHNldmVuOiA3LFxuICAgIGVpZ2h0OiA4LFxuICAgIG5pbmU6IDksXG4gICAgdGVuOiAxMCxcbiAgICBlbGV2ZW46IDExLFxuICAgIHR3ZWx2ZTogMTIsXG59O1xuZXhwb3J0cy5PUkRJTkFMX1dPUkRfRElDVElPTkFSWSA9IHtcbiAgICBmaXJzdDogMSxcbiAgICBzZWNvbmQ6IDIsXG4gICAgdGhpcmQ6IDMsXG4gICAgZm91cnRoOiA0LFxuICAgIGZpZnRoOiA1LFxuICAgIHNpeHRoOiA2LFxuICAgIHNldmVudGg6IDcsXG4gICAgZWlnaHRoOiA4LFxuICAgIG5pbnRoOiA5LFxuICAgIHRlbnRoOiAxMCxcbiAgICBlbGV2ZW50aDogMTEsXG4gICAgdHdlbGZ0aDogMTIsXG4gICAgdGhpcnRlZW50aDogMTMsXG4gICAgZm91cnRlZW50aDogMTQsXG4gICAgZmlmdGVlbnRoOiAxNSxcbiAgICBzaXh0ZWVudGg6IDE2LFxuICAgIHNldmVudGVlbnRoOiAxNyxcbiAgICBlaWdodGVlbnRoOiAxOCxcbiAgICBuaW5ldGVlbnRoOiAxOSxcbiAgICB0d2VudGlldGg6IDIwLFxuICAgIFwidHdlbnR5IGZpcnN0XCI6IDIxLFxuICAgIFwidHdlbnR5LWZpcnN0XCI6IDIxLFxuICAgIFwidHdlbnR5IHNlY29uZFwiOiAyMixcbiAgICBcInR3ZW50eS1zZWNvbmRcIjogMjIsXG4gICAgXCJ0d2VudHkgdGhpcmRcIjogMjMsXG4gICAgXCJ0d2VudHktdGhpcmRcIjogMjMsXG4gICAgXCJ0d2VudHkgZm91cnRoXCI6IDI0LFxuICAgIFwidHdlbnR5LWZvdXJ0aFwiOiAyNCxcbiAgICBcInR3ZW50eSBmaWZ0aFwiOiAyNSxcbiAgICBcInR3ZW50eS1maWZ0aFwiOiAyNSxcbiAgICBcInR3ZW50eSBzaXh0aFwiOiAyNixcbiAgICBcInR3ZW50eS1zaXh0aFwiOiAyNixcbiAgICBcInR3ZW50eSBzZXZlbnRoXCI6IDI3LFxuICAgIFwidHdlbnR5LXNldmVudGhcIjogMjcsXG4gICAgXCJ0d2VudHkgZWlnaHRoXCI6IDI4LFxuICAgIFwidHdlbnR5LWVpZ2h0aFwiOiAyOCxcbiAgICBcInR3ZW50eSBuaW50aFwiOiAyOSxcbiAgICBcInR3ZW50eS1uaW50aFwiOiAyOSxcbiAgICBcInRoaXJ0aWV0aFwiOiAzMCxcbiAgICBcInRoaXJ0eSBmaXJzdFwiOiAzMSxcbiAgICBcInRoaXJ0eS1maXJzdFwiOiAzMSxcbn07XG5leHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZID0ge1xuICAgIHNlYzogXCJzZWNvbmRcIixcbiAgICBzZWNvbmQ6IFwic2Vjb25kXCIsXG4gICAgc2Vjb25kczogXCJzZWNvbmRcIixcbiAgICBtaW46IFwibWludXRlXCIsXG4gICAgbWluczogXCJtaW51dGVcIixcbiAgICBtaW51dGU6IFwibWludXRlXCIsXG4gICAgbWludXRlczogXCJtaW51dGVcIixcbiAgICBoOiBcImhvdXJcIixcbiAgICBocjogXCJob3VyXCIsXG4gICAgaHJzOiBcImhvdXJcIixcbiAgICBob3VyOiBcImhvdXJcIixcbiAgICBob3VyczogXCJob3VyXCIsXG4gICAgZGF5OiBcImRcIixcbiAgICBkYXlzOiBcImRcIixcbiAgICB3ZWVrOiBcIndlZWtcIixcbiAgICB3ZWVrczogXCJ3ZWVrXCIsXG4gICAgbW9udGg6IFwibW9udGhcIixcbiAgICBtb250aHM6IFwibW9udGhcIixcbiAgICB5OiBcInllYXJcIixcbiAgICB5cjogXCJ5ZWFyXCIsXG4gICAgeWVhcjogXCJ5ZWFyXCIsXG4gICAgeWVhcnM6IFwieWVhclwiLFxufTtcbmV4cG9ydHMuTlVNQkVSX1BBVFRFUk4gPSBgKD86JHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkpfXxbMC05XSt8WzAtOV0rXFxcXC5bMC05XSt8aGFsZig/OlxcXFxzKmFuPyk/fGFuPyg/OlxcXFxzKmZldyk/fGZld3xzZXZlcmFsfGE/XFxcXHMqY291cGxlXFxcXHMqKD86b2YpPylgO1xuZnVuY3Rpb24gcGFyc2VOdW1iZXJQYXR0ZXJuKG1hdGNoKSB7XG4gICAgY29uc3QgbnVtID0gbWF0Y2gudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWVtudW1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUllbbnVtXTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtID09PSBcImFcIiB8fCBudW0gPT09IFwiYW5cIikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9mZXcvKSkge1xuICAgICAgICByZXR1cm4gMztcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9oYWxmLykpIHtcbiAgICAgICAgcmV0dXJuIDAuNTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9jb3VwbGUvKSkge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9zZXZlcmFsLykpIHtcbiAgICAgICAgcmV0dXJuIDc7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KG51bSk7XG59XG5leHBvcnRzLnBhcnNlTnVtYmVyUGF0dGVybiA9IHBhcnNlTnVtYmVyUGF0dGVybjtcbmV4cG9ydHMuT1JESU5BTF9OVU1CRVJfUEFUVEVSTiA9IGAoPzoke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oZXhwb3J0cy5PUkRJTkFMX1dPUkRfRElDVElPTkFSWSl9fFswLTldezEsMn0oPzpzdHxuZHxyZHx0aCk/KWA7XG5mdW5jdGlvbiBwYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoKSB7XG4gICAgbGV0IG51bSA9IG1hdGNoLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGV4cG9ydHMuT1JESU5BTF9XT1JEX0RJQ1RJT05BUllbbnVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLk9SRElOQUxfV09SRF9ESUNUSU9OQVJZW251bV07XG4gICAgfVxuICAgIG51bSA9IG51bS5yZXBsYWNlKC8oPzpzdHxuZHxyZHx0aCkkL2ksIFwiXCIpO1xuICAgIHJldHVybiBwYXJzZUludChudW0pO1xufVxuZXhwb3J0cy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuID0gcGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybjtcbmV4cG9ydHMuWUVBUl9QQVRURVJOID0gYCg/OlsxLTldWzAtOV17MCwzfVxcXFxzKig/OkJFfEFEfEJDKXxbMS0yXVswLTldezN9fFs1LTldWzAtOV0pYDtcbmZ1bmN0aW9uIHBhcnNlWWVhcihtYXRjaCkge1xuICAgIGlmICgvQkUvaS50ZXN0KG1hdGNoKSkge1xuICAgICAgICBtYXRjaCA9IG1hdGNoLnJlcGxhY2UoL0JFL2ksIFwiXCIpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQobWF0Y2gpIC0gNTQzO1xuICAgIH1cbiAgICBpZiAoL0JDL2kudGVzdChtYXRjaCkpIHtcbiAgICAgICAgbWF0Y2ggPSBtYXRjaC5yZXBsYWNlKC9CQy9pLCBcIlwiKTtcbiAgICAgICAgcmV0dXJuIC1wYXJzZUludChtYXRjaCk7XG4gICAgfVxuICAgIGlmICgvQUQvaS50ZXN0KG1hdGNoKSkge1xuICAgICAgICBtYXRjaCA9IG1hdGNoLnJlcGxhY2UoL0FEL2ksIFwiXCIpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQobWF0Y2gpO1xuICAgIH1cbiAgICBjb25zdCByYXdZZWFyTnVtYmVyID0gcGFyc2VJbnQobWF0Y2gpO1xuICAgIHJldHVybiB5ZWFyc18xLmZpbmRNb3N0TGlrZWx5QURZZWFyKHJhd1llYXJOdW1iZXIpO1xufVxuZXhwb3J0cy5wYXJzZVllYXIgPSBwYXJzZVllYXI7XG5jb25zdCBTSU5HTEVfVElNRV9VTklUX1BBVFRFUk4gPSBgKCR7ZXhwb3J0cy5OVU1CRVJfUEFUVEVSTn0pXFxcXHN7MCw1fSgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWSl9KVxcXFxzezAsNX1gO1xuY29uc3QgU0lOR0xFX1RJTUVfVU5JVF9SRUdFWCA9IG5ldyBSZWdFeHAoU0lOR0xFX1RJTUVfVU5JVF9QQVRURVJOLCBcImlcIik7XG5leHBvcnRzLlRJTUVfVU5JVFNfUEFUVEVSTiA9IHBhdHRlcm5fMS5yZXBlYXRlZFRpbWV1bml0UGF0dGVybihgKD86KD86YWJvdXR8YXJvdW5kKVxcXFxzKik/YCwgU0lOR0xFX1RJTUVfVU5JVF9QQVRURVJOKTtcbmZ1bmN0aW9uIHBhcnNlVGltZVVuaXRzKHRpbWV1bml0VGV4dCkge1xuICAgIGNvbnN0IGZyYWdtZW50cyA9IHt9O1xuICAgIGxldCByZW1haW5pbmdUZXh0ID0gdGltZXVuaXRUZXh0O1xuICAgIGxldCBtYXRjaCA9IFNJTkdMRV9USU1FX1VOSVRfUkVHRVguZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgY29sbGVjdERhdGVUaW1lRnJhZ21lbnQoZnJhZ21lbnRzLCBtYXRjaCk7XG4gICAgICAgIHJlbWFpbmluZ1RleHQgPSByZW1haW5pbmdUZXh0LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICBtYXRjaCA9IFNJTkdMRV9USU1FX1VOSVRfUkVHRVguZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZyYWdtZW50cztcbn1cbmV4cG9ydHMucGFyc2VUaW1lVW5pdHMgPSBwYXJzZVRpbWVVbml0cztcbmZ1bmN0aW9uIGNvbGxlY3REYXRlVGltZUZyYWdtZW50KGZyYWdtZW50cywgbWF0Y2gpIHtcbiAgICBjb25zdCBudW0gPSBwYXJzZU51bWJlclBhdHRlcm4obWF0Y2hbMV0pO1xuICAgIGNvbnN0IHVuaXQgPSBleHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZW21hdGNoWzJdLnRvTG93ZXJDYXNlKCldO1xuICAgIGZyYWdtZW50c1t1bml0XSA9IG51bTtcbn1cbiIsIiFmdW5jdGlvbih0LG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPW4oKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKG4pOnQuZGF5anNfcGx1Z2luX3F1YXJ0ZXJPZlllYXI9bigpfSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJtb250aFwiLG49XCJxdWFydGVyXCI7cmV0dXJuIGZ1bmN0aW9uKHIsaSl7dmFyIGU9aS5wcm90b3R5cGU7ZS5xdWFydGVyPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLiR1dGlscygpLnUodCk/TWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkrMSkvMyk6dGhpcy5tb250aCh0aGlzLm1vbnRoKCklMyszKih0LTEpKX07dmFyIHU9ZS5hZGQ7ZS5hZGQ9ZnVuY3Rpb24ocixpKXtyZXR1cm4gcj1OdW1iZXIociksdGhpcy4kdXRpbHMoKS5wKGkpPT09bj90aGlzLmFkZCgzKnIsdCk6dS5iaW5kKHRoaXMpKHIsaSl9O3ZhciBzPWUuc3RhcnRPZjtlLnN0YXJ0T2Y9ZnVuY3Rpb24ocixpKXt2YXIgZT10aGlzLiR1dGlscygpLHU9ISFlLnUoaSl8fGk7aWYoZS5wKHIpPT09bil7dmFyIGE9dGhpcy5xdWFydGVyKCktMTtyZXR1cm4gdT90aGlzLm1vbnRoKDMqYSkuc3RhcnRPZih0KS5zdGFydE9mKFwiZGF5XCIpOnRoaXMubW9udGgoMyphKzIpLmVuZE9mKHQpLmVuZE9mKFwiZGF5XCIpfXJldHVybiBzLmJpbmQodGhpcykocixpKX19fSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaW1wbHlTaW1pbGFyVGltZSA9IGV4cG9ydHMuYXNzaWduU2ltaWxhclRpbWUgPSBleHBvcnRzLmFzc2lnblNpbWlsYXJEYXRlID0gZXhwb3J0cy5hc3NpZ25UaGVOZXh0RGF5ID0gdm9pZCAwO1xuZnVuY3Rpb24gYXNzaWduVGhlTmV4dERheShjb21wb25lbnQsIHRhcmdldERheUpzKSB7XG4gICAgdGFyZ2V0RGF5SnMgPSB0YXJnZXREYXlKcy5hZGQoMSwgXCJkYXlcIik7XG4gICAgYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXlKcyk7XG4gICAgaW1wbHlTaW1pbGFyVGltZShjb21wb25lbnQsIHRhcmdldERheUpzKTtcbn1cbmV4cG9ydHMuYXNzaWduVGhlTmV4dERheSA9IGFzc2lnblRoZU5leHREYXk7XG5mdW5jdGlvbiBhc3NpZ25TaW1pbGFyRGF0ZShjb21wb25lbnQsIHRhcmdldERheUpzKSB7XG4gICAgY29tcG9uZW50LmFzc2lnbihcImRheVwiLCB0YXJnZXREYXlKcy5kYXRlKCkpO1xuICAgIGNvbXBvbmVudC5hc3NpZ24oXCJtb250aFwiLCB0YXJnZXREYXlKcy5tb250aCgpICsgMSk7XG4gICAgY29tcG9uZW50LmFzc2lnbihcInllYXJcIiwgdGFyZ2V0RGF5SnMueWVhcigpKTtcbn1cbmV4cG9ydHMuYXNzaWduU2ltaWxhckRhdGUgPSBhc3NpZ25TaW1pbGFyRGF0ZTtcbmZ1bmN0aW9uIGFzc2lnblNpbWlsYXJUaW1lKGNvbXBvbmVudCwgdGFyZ2V0RGF5SnMpIHtcbiAgICBjb21wb25lbnQuYXNzaWduKFwiaG91clwiLCB0YXJnZXREYXlKcy5ob3VyKCkpO1xuICAgIGNvbXBvbmVudC5hc3NpZ24oXCJtaW51dGVcIiwgdGFyZ2V0RGF5SnMubWludXRlKCkpO1xuICAgIGNvbXBvbmVudC5hc3NpZ24oXCJzZWNvbmRcIiwgdGFyZ2V0RGF5SnMuc2Vjb25kKCkpO1xuICAgIGNvbXBvbmVudC5hc3NpZ24oXCJtaWxsaXNlY29uZFwiLCB0YXJnZXREYXlKcy5taWxsaXNlY29uZCgpKTtcbiAgICBjb21wb25lbnQuYXNzaWduKFwidGltZXpvbmVPZmZzZXRcIiwgdGFyZ2V0RGF5SnMudXRjT2Zmc2V0KCkpO1xufVxuZXhwb3J0cy5hc3NpZ25TaW1pbGFyVGltZSA9IGFzc2lnblNpbWlsYXJUaW1lO1xuZnVuY3Rpb24gaW1wbHlTaW1pbGFyVGltZShjb21wb25lbnQsIHRhcmdldERheUpzKSB7XG4gICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCB0YXJnZXREYXlKcy5ob3VyKCkpO1xuICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCB0YXJnZXREYXlKcy5taW51dGUoKSk7XG4gICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIHRhcmdldERheUpzLnNlY29uZCgpKTtcbiAgICBjb21wb25lbnQuaW1wbHkoXCJtaWxsaXNlY29uZFwiLCB0YXJnZXREYXlKcy5taWxsaXNlY29uZCgpKTtcbiAgICBjb21wb25lbnQuaW1wbHkoXCJ0aW1lem9uZU9mZnNldFwiLCB0YXJnZXREYXlKcy51dGNPZmZzZXQoKSk7XG59XG5leHBvcnRzLmltcGx5U2ltaWxhclRpbWUgPSBpbXBseVNpbWlsYXJUaW1lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBhcnNpbmdSZXN1bHQgPSBleHBvcnRzLlBhcnNpbmdDb21wb25lbnRzID0gdm9pZCAwO1xuY29uc3QgcXVhcnRlck9mWWVhcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqcy9wbHVnaW4vcXVhcnRlck9mWWVhclwiKSk7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBkYXlqc18yID0gcmVxdWlyZShcIi4vdXRpbHMvZGF5anNcIik7XG5kYXlqc18xLmRlZmF1bHQuZXh0ZW5kKHF1YXJ0ZXJPZlllYXJfMS5kZWZhdWx0KTtcbmNsYXNzIFBhcnNpbmdDb21wb25lbnRzIHtcbiAgICBjb25zdHJ1Y3RvcihyZWZEYXRlLCBrbm93bkNvbXBvbmVudHMpIHtcbiAgICAgICAgdGhpcy5rbm93blZhbHVlcyA9IHt9O1xuICAgICAgICB0aGlzLmltcGxpZWRWYWx1ZXMgPSB7fTtcbiAgICAgICAgaWYgKGtub3duQ29tcG9uZW50cykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4ga25vd25Db21wb25lbnRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rbm93blZhbHVlc1trZXldID0ga25vd25Db21wb25lbnRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVmRGF5SnMgPSBkYXlqc18xLmRlZmF1bHQocmVmRGF0ZSk7XG4gICAgICAgIHRoaXMuaW1wbHkoXCJkYXlcIiwgcmVmRGF5SnMuZGF0ZSgpKTtcbiAgICAgICAgdGhpcy5pbXBseShcIm1vbnRoXCIsIHJlZkRheUpzLm1vbnRoKCkgKyAxKTtcbiAgICAgICAgdGhpcy5pbXBseShcInllYXJcIiwgcmVmRGF5SnMueWVhcigpKTtcbiAgICAgICAgdGhpcy5pbXBseShcImhvdXJcIiwgMTIpO1xuICAgICAgICB0aGlzLmltcGx5KFwibWludXRlXCIsIDApO1xuICAgICAgICB0aGlzLmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICB0aGlzLmltcGx5KFwibWlsbGlzZWNvbmRcIiwgMCk7XG4gICAgfVxuICAgIGdldChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbiB0aGlzLmtub3duVmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rbm93blZhbHVlc1tjb21wb25lbnRdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wb25lbnQgaW4gdGhpcy5pbXBsaWVkVmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbXBsaWVkVmFsdWVzW2NvbXBvbmVudF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlzQ2VydGFpbihjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudCBpbiB0aGlzLmtub3duVmFsdWVzO1xuICAgIH1cbiAgICBnZXRDZXJ0YWluQ29tcG9uZW50cygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMua25vd25WYWx1ZXMpO1xuICAgIH1cbiAgICBpbXBseShjb21wb25lbnQsIHZhbHVlKSB7XG4gICAgICAgIGlmIChjb21wb25lbnQgaW4gdGhpcy5rbm93blZhbHVlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbXBsaWVkVmFsdWVzW2NvbXBvbmVudF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGFzc2lnbihjb21wb25lbnQsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMua25vd25WYWx1ZXNbY29tcG9uZW50XSA9IHZhbHVlO1xuICAgICAgICBkZWxldGUgdGhpcy5pbXBsaWVkVmFsdWVzW2NvbXBvbmVudF07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkZWxldGUoY29tcG9uZW50KSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmtub3duVmFsdWVzW2NvbXBvbmVudF07XG4gICAgICAgIGRlbGV0ZSB0aGlzLmltcGxpZWRWYWx1ZXNbY29tcG9uZW50XTtcbiAgICB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBQYXJzaW5nQ29tcG9uZW50cyhuZXcgRGF0ZSgpKTtcbiAgICAgICAgY29tcG9uZW50Lmtub3duVmFsdWVzID0ge307XG4gICAgICAgIGNvbXBvbmVudC5pbXBsaWVkVmFsdWVzID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMua25vd25WYWx1ZXMpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5rbm93blZhbHVlc1trZXldID0gdGhpcy5rbm93blZhbHVlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuaW1wbGllZFZhbHVlcykge1xuICAgICAgICAgICAgY29tcG9uZW50LmltcGxpZWRWYWx1ZXNba2V5XSA9IHRoaXMuaW1wbGllZFZhbHVlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxuICAgIGlzT25seURhdGUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0NlcnRhaW4oXCJob3VyXCIpICYmICF0aGlzLmlzQ2VydGFpbihcIm1pbnV0ZVwiKSAmJiAhdGhpcy5pc0NlcnRhaW4oXCJzZWNvbmRcIik7XG4gICAgfVxuICAgIGlzT25seVRpbWUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0NlcnRhaW4oXCJ3ZWVrZGF5XCIpICYmICF0aGlzLmlzQ2VydGFpbihcImRheVwiKSAmJiAhdGhpcy5pc0NlcnRhaW4oXCJtb250aFwiKTtcbiAgICB9XG4gICAgaXNPbmx5V2Vla2RheUNvbXBvbmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNDZXJ0YWluKFwid2Vla2RheVwiKSAmJiAhdGhpcy5pc0NlcnRhaW4oXCJkYXlcIikgJiYgIXRoaXMuaXNDZXJ0YWluKFwibW9udGhcIik7XG4gICAgfVxuICAgIGlzT25seURheU1vbnRoQ29tcG9uZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0NlcnRhaW4oXCJkYXlcIikgJiYgdGhpcy5pc0NlcnRhaW4oXCJtb250aFwiKSAmJiAhdGhpcy5pc0NlcnRhaW4oXCJ5ZWFyXCIpO1xuICAgIH1cbiAgICBpc1ZhbGlkRGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuaXNDZXJ0YWluKFwidGltZXpvbmVPZmZzZXRcIikgPyB0aGlzLmRhdGVXaXRob3V0VGltZXpvbmVBZGp1c3RtZW50KCkgOiB0aGlzLmRhdGUoKTtcbiAgICAgICAgaWYgKGRhdGUuZ2V0RnVsbFllYXIoKSAhPT0gdGhpcy5nZXQoXCJ5ZWFyXCIpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoZGF0ZS5nZXRNb250aCgpICE9PSB0aGlzLmdldChcIm1vbnRoXCIpIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGRhdGUuZ2V0RGF0ZSgpICE9PSB0aGlzLmdldChcImRheVwiKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KFwiaG91clwiKSAhPSBudWxsICYmIGRhdGUuZ2V0SG91cnMoKSAhPSB0aGlzLmdldChcImhvdXJcIikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmdldChcIm1pbnV0ZVwiKSAhPSBudWxsICYmIGRhdGUuZ2V0TWludXRlcygpICE9IHRoaXMuZ2V0KFwibWludXRlXCIpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgW1BhcnNpbmdDb21wb25lbnRzIHtrbm93blZhbHVlczogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmtub3duVmFsdWVzKX0sIGltcGxpZWRWYWx1ZXM6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5pbXBsaWVkVmFsdWVzKX19XWA7XG4gICAgfVxuICAgIGRheWpzKCkge1xuICAgICAgICByZXR1cm4gZGF5anNfMS5kZWZhdWx0KHRoaXMuZGF0ZSgpKTtcbiAgICB9XG4gICAgZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuZGF0ZVdpdGhvdXRUaW1lem9uZUFkanVzdG1lbnQoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgdGhpcy5nZXRUaW1lem9uZUFkanVzdG1lbnRNaW51dGUoZGF0ZSkgKiA2MDAwMCk7XG4gICAgfVxuICAgIGRhdGVXaXRob3V0VGltZXpvbmVBZGp1c3RtZW50KCkge1xuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcy5nZXQoXCJ5ZWFyXCIpLCB0aGlzLmdldChcIm1vbnRoXCIpIC0gMSwgdGhpcy5nZXQoXCJkYXlcIiksIHRoaXMuZ2V0KFwiaG91clwiKSwgdGhpcy5nZXQoXCJtaW51dGVcIiksIHRoaXMuZ2V0KFwic2Vjb25kXCIpLCB0aGlzLmdldChcIm1pbGxpc2Vjb25kXCIpKTtcbiAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih0aGlzLmdldChcInllYXJcIikpO1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgZ2V0VGltZXpvbmVBZGp1c3RtZW50TWludXRlKGRhdGUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBkYXRlID0gZGF0ZSAhPT0gbnVsbCAmJiBkYXRlICE9PSB2b2lkIDAgPyBkYXRlIDogbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWV6b25lT2Zmc2V0ID0gLWRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0VGltZXpvbmVPZmZzZXQgPSAoX2EgPSB0aGlzLmdldChcInRpbWV6b25lT2Zmc2V0XCIpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBjdXJyZW50VGltZXpvbmVPZmZzZXQ7XG4gICAgICAgIHJldHVybiBjdXJyZW50VGltZXpvbmVPZmZzZXQgLSB0YXJnZXRUaW1lem9uZU9mZnNldDtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZVJlbGF0aXZlRnJvbVJlZkRhdGUocmVmRGF0ZSwgZnJhZ21lbnRzKSB7XG4gICAgICAgIGxldCBkYXRlID0gZGF5anNfMS5kZWZhdWx0KHJlZkRhdGUpO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBmcmFnbWVudHMpIHtcbiAgICAgICAgICAgIGRhdGUgPSBkYXRlLmFkZChmcmFnbWVudHNba2V5XSwga2V5KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gbmV3IFBhcnNpbmdDb21wb25lbnRzKHJlZkRhdGUpO1xuICAgICAgICBpZiAoZnJhZ21lbnRzW1wiaG91clwiXSB8fCBmcmFnbWVudHNbXCJtaW51dGVcIl0gfHwgZnJhZ21lbnRzW1wic2Vjb25kXCJdKSB7XG4gICAgICAgICAgICBkYXlqc18yLmFzc2lnblNpbWlsYXJUaW1lKGNvbXBvbmVudHMsIGRhdGUpO1xuICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25TaW1pbGFyRGF0ZShjb21wb25lbnRzLCBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRheWpzXzIuaW1wbHlTaW1pbGFyVGltZShjb21wb25lbnRzLCBkYXRlKTtcbiAgICAgICAgICAgIGlmIChmcmFnbWVudHNbXCJkXCJdKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJkYXlcIiwgZGF0ZS5kYXRlKCkpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibW9udGhcIiwgZGF0ZS5tb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudHNbXCJ3ZWVrXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJ3ZWVrZGF5XCIsIGRhdGUuZGF5KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwiZGF5XCIsIGRhdGUuZGF0ZSgpKTtcbiAgICAgICAgICAgICAgICBpZiAoZnJhZ21lbnRzW1wibW9udGhcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50c1tcInllYXJcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxufVxuZXhwb3J0cy5QYXJzaW5nQ29tcG9uZW50cyA9IFBhcnNpbmdDb21wb25lbnRzO1xuY2xhc3MgUGFyc2luZ1Jlc3VsdCB7XG4gICAgY29uc3RydWN0b3IocmVmRGF0ZSwgaW5kZXgsIHRleHQsIHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdGhpcy5yZWZEYXRlID0gcmVmRGF0ZTtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQgfHwgbmV3IFBhcnNpbmdDb21wb25lbnRzKHRoaXMucmVmRGF0ZSk7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIH1cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFBhcnNpbmdSZXN1bHQodGhpcy5yZWZEYXRlLCB0aGlzLmluZGV4LCB0aGlzLnRleHQpO1xuICAgICAgICByZXN1bHQuc3RhcnQgPSB0aGlzLnN0YXJ0ID8gdGhpcy5zdGFydC5jbG9uZSgpIDogbnVsbDtcbiAgICAgICAgcmVzdWx0LmVuZCA9IHRoaXMuZW5kID8gdGhpcy5lbmQuY2xvbmUoKSA6IG51bGw7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGRhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0LmRhdGUoKTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgW1BhcnNpbmdSZXN1bHQge2luZGV4OiAke3RoaXMuaW5kZXh9LCB0ZXh0OiAnJHt0aGlzLnRleHR9JywgLi4ufV1gO1xuICAgIH1cbn1cbmV4cG9ydHMuUGFyc2luZ1Jlc3VsdCA9IFBhcnNpbmdSZXN1bHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcgPSB2b2lkIDA7XG5jbGFzcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2FjaGVkSW5uZXJQYXR0ZXJuID0gbnVsbDtcbiAgICAgICAgdGhpcy5jYWNoZWRQYXR0ZXJuID0gbnVsbDtcbiAgICB9XG4gICAgcGF0dGVybihjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IGlubmVyUGF0dGVybiA9IHRoaXMuaW5uZXJQYXR0ZXJuKGNvbnRleHQpO1xuICAgICAgICBpZiAoaW5uZXJQYXR0ZXJuID09IHRoaXMuY2FjaGVkSW5uZXJQYXR0ZXJuKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRQYXR0ZXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FjaGVkUGF0dGVybiA9IG5ldyBSZWdFeHAoYChcXFxcV3xeKSR7aW5uZXJQYXR0ZXJuLnNvdXJjZX1gLCBpbm5lclBhdHRlcm4uZmxhZ3MpO1xuICAgICAgICB0aGlzLmNhY2hlZElubmVyUGF0dGVybiA9IGlubmVyUGF0dGVybjtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkUGF0dGVybjtcbiAgICB9XG4gICAgZXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBtYXRjaFsxXTtcbiAgICAgICAgbWF0Y2guaW5kZXggPSBtYXRjaC5pbmRleCArIGhlYWRlci5sZW5ndGg7XG4gICAgICAgIG1hdGNoWzBdID0gbWF0Y2hbMF0uc3Vic3RyaW5nKGhlYWRlci5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IG1hdGNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaFtpIC0gMV0gPSBtYXRjaFtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpO1xuICAgIH1cbn1cbmV4cG9ydHMuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcgPSBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcmVzdWx0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3Jlc3VsdHNcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOX1dJVEhfUFJFRklYID0gbmV3IFJlZ0V4cChgKD86d2l0aGlufGlufGZvcilcXFxccypgICtcbiAgICBgKD86KD86YWJvdXR8YXJvdW5kfHJvdWdobHl8YXBwcm94aW1hdGVseXxqdXN0KVxcXFxzKig/On5cXFxccyopPyk/KCR7Y29uc3RhbnRzXzEuVElNRV9VTklUU19QQVRURVJOfSkoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbmNvbnN0IFBBVFRFUk5fV0lUSE9VVF9QUkVGSVggPSBuZXcgUmVnRXhwKGAoPzooPzphYm91dHxhcm91bmR8cm91Z2hseXxhcHByb3hpbWF0ZWx5fGp1c3QpXFxcXHMqKD86flxcXFxzKik/KT8oJHtjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk59KSg/PVxcXFxXfCQpYCwgXCJpXCIpO1xuY2xhc3MgRU5UaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gY29udGV4dC5vcHRpb24uZm9yd2FyZERhdGUgPyBQQVRURVJOX1dJVEhPVVRfUFJFRklYIDogUEFUVEVSTl9XSVRIX1BSRUZJWDtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHRpbWVVbml0cyA9IGNvbnN0YW50c18xLnBhcnNlVGltZVVuaXRzKG1hdGNoWzFdKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgdGltZVVuaXRzKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgY29uc3RhbnRzXzIgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgY29uc3RhbnRzXzMgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIig/Om9uXFxcXHMqPyk/XCIgK1xuICAgIGAoJHtjb25zdGFudHNfMy5PUkRJTkFMX05VTUJFUl9QQVRURVJOfSlgICtcbiAgICBcIig/OlxcXFxzKlwiICtcbiAgICBcIig/OnRvfFxcXFwtfFxcXFzigJN8dW50aWx8dGhyb3VnaHx0aWxsfFxcXFxzKVxcXFxzKlwiICtcbiAgICBgKCR7Y29uc3RhbnRzXzMuT1JESU5BTF9OVU1CRVJfUEFUVEVSTn0pYCArXG4gICAgXCIpP1wiICtcbiAgICBcIig/Oi18L3xcXFxccyooPzpvZik/XFxcXHMqKVwiICtcbiAgICBcIihcIiArXG4gICAgcGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZKSArXG4gICAgXCIpXCIgK1xuICAgIFwiKD86XCIgK1xuICAgIFwiKD86LXwvfCw/XFxcXHMqKVwiICtcbiAgICBgKCR7Y29uc3RhbnRzXzIuWUVBUl9QQVRURVJOfSg/IVteXFxcXHNdXFxcXGQpKWAgK1xuICAgIFwiKT9cIiArXG4gICAgXCIoPz1cXFxcV3wkKVwiLCBcImlcIik7XG5jb25zdCBEQVRFX0dST1VQID0gMTtcbmNvbnN0IERBVEVfVE9fR1JPVVAgPSAyO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDM7XG5jb25zdCBZRUFSX0dST1VQID0gNDtcbmNsYXNzIEVOTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQobWF0Y2guaW5kZXgsIG1hdGNoWzBdKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZW21hdGNoW01PTlRIX05BTUVfR1JPVVBdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBjb25zdCBkYXkgPSBjb25zdGFudHNfMy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoW0RBVEVfR1JPVVBdKTtcbiAgICAgICAgaWYgKGRheSA+IDMxKSB7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbREFURV9HUk9VUF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcIm1vbnRoXCIsIG1vbnRoKTtcbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcImRheVwiLCBkYXkpO1xuICAgICAgICBpZiAobWF0Y2hbWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXJOdW1iZXIgPSBjb25zdGFudHNfMi5wYXJzZVllYXIobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcInllYXJcIiwgeWVhck51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIGRheSwgbW9udGgpO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbREFURV9UT19HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGVuZERhdGUgPSBjb25zdGFudHNfMy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoW0RBVEVfVE9fR1JPVVBdKTtcbiAgICAgICAgICAgIHJlc3VsdC5lbmQgPSByZXN1bHQuc3RhcnQuY2xvbmUoKTtcbiAgICAgICAgICAgIHJlc3VsdC5lbmQuYXNzaWduKFwiZGF5XCIsIGVuZERhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5Nb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBjb25zdGFudHNfMiA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBjb25zdGFudHNfMyA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKGAoJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUlkpfSlgICtcbiAgICBcIig/Oi18L3xcXFxccyosP1xcXFxzKilcIiArXG4gICAgYCgke2NvbnN0YW50c18yLk9SRElOQUxfTlVNQkVSX1BBVFRFUk59KSg/IVxcXFxzKig/OmFtfHBtKSlcXFxccypgICtcbiAgICBcIig/OlwiICtcbiAgICBcIig/OnRvfFxcXFwtKVxcXFxzKlwiICtcbiAgICBgKCR7Y29uc3RhbnRzXzIuT1JESU5BTF9OVU1CRVJfUEFUVEVSTn0pXFxcXHMqYCArXG4gICAgXCIpP1wiICtcbiAgICBcIig/OlwiICtcbiAgICBcIig/Oi18L3xcXFxccyosP1xcXFxzKilcIiArXG4gICAgYCgke2NvbnN0YW50c18zLllFQVJfUEFUVEVSTn0pYCArXG4gICAgXCIpP1wiICtcbiAgICBcIig/PVxcXFxXfCQpKD8hXFxcXDpcXFxcZClcIiwgXCJpXCIpO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDE7XG5jb25zdCBEQVRFX0dST1VQID0gMjtcbmNvbnN0IERBVEVfVE9fR1JPVVAgPSAzO1xuY29uc3QgWUVBUl9HUk9VUCA9IDQ7XG5jbGFzcyBFTk1vbnRoTmFtZU1pZGRsZUVuZGlhblBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbW9udGggPSBjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZW21hdGNoW01PTlRIX05BTUVfR1JPVVBdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBjb25zdCBkYXkgPSBjb25zdGFudHNfMi5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoW0RBVEVfR1JPVVBdKTtcbiAgICAgICAgaWYgKGRheSA+IDMxKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cyh7XG4gICAgICAgICAgICBkYXk6IGRheSxcbiAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChtYXRjaFtZRUFSX0dST1VQXSkge1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IGNvbnN0YW50c18zLnBhcnNlWWVhcihtYXRjaFtZRUFSX0dST1VQXSk7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIGRheSwgbW9udGgpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYXRjaFtEQVRFX1RPX0dST1VQXSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZW5kRGF0ZSA9IGNvbnN0YW50c18yLnBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm4obWF0Y2hbREFURV9UT19HUk9VUF0pO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQobWF0Y2guaW5kZXgsIG1hdGNoWzBdKTtcbiAgICAgICAgcmVzdWx0LnN0YXJ0ID0gY29tcG9uZW50cztcbiAgICAgICAgcmVzdWx0LmVuZCA9IGNvbXBvbmVudHMuY2xvbmUoKTtcbiAgICAgICAgcmVzdWx0LmVuZC5hc3NpZ24oXCJkYXlcIiwgZW5kRGF0ZSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5Nb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IGNvbnN0YW50c18yID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKGAoKD86aW4pXFxcXHMqKT9gICtcbiAgICBgKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZKX0pYCArXG4gICAgYFxcXFxzKmAgK1xuICAgIGAoPzpgICtcbiAgICBgWywtXT9cXFxccyooJHtjb25zdGFudHNfMi5ZRUFSX1BBVFRFUk59KT9gICtcbiAgICBcIik/XCIgK1xuICAgIFwiKD89W15cXFxcc1xcXFx3XXxcXFxccytbXjAtOV18XFxcXHMrJHwkKVwiLCBcImlcIik7XG5jb25zdCBQUkVGSVhfR1JPVVAgPSAxO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDI7XG5jb25zdCBZRUFSX0dST1VQID0gMztcbmNsYXNzIEVOTW9udGhOYW1lUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBtb250aE5hbWUgPSBtYXRjaFtNT05USF9OQU1FX0dST1VQXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAobWF0Y2hbMF0ubGVuZ3RoIDw9IDMgJiYgIWNvbnN0YW50c18xLkZVTExfTU9OVEhfTkFNRV9ESUNUSU9OQVJZW21vbnRoTmFtZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ1Jlc3VsdChtYXRjaC5pbmRleCArIChtYXRjaFtQUkVGSVhfR1JPVVBdIHx8IFwiXCIpLmxlbmd0aCwgbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICByZXN1bHQuc3RhcnQuaW1wbHkoXCJkYXlcIiwgMSk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWVttb250aE5hbWVdO1xuICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwibW9udGhcIiwgbW9udGgpO1xuICAgICAgICBpZiAobWF0Y2hbWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSBjb25zdGFudHNfMi5wYXJzZVllYXIobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIDEsIG1vbnRoKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdGFydC5pbXBseShcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTk1vbnRoTmFtZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChgKFswLTldezR9KVtcXFxcLlxcXFwvXFxcXHNdYCArXG4gICAgYCg/Oigke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWSl9KXwoWzAtOV17MSwyfSkpW1xcXFwuXFxcXC9cXFxcc11gICtcbiAgICBgKFswLTldezEsMn0pYCArXG4gICAgXCIoPz1cXFxcV3wkKVwiLCBcImlcIik7XG5jb25zdCBZRUFSX05VTUJFUl9HUk9VUCA9IDE7XG5jb25zdCBNT05USF9OQU1FX0dST1VQID0gMjtcbmNvbnN0IE1PTlRIX05VTUJFUl9HUk9VUCA9IDM7XG5jb25zdCBEQVRFX05VTUJFUl9HUk9VUCA9IDQ7XG5jbGFzcyBFTkNhc3VhbFllYXJNb250aERheVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbW9udGggPSBtYXRjaFtNT05USF9OVU1CRVJfR1JPVVBdXG4gICAgICAgICAgICA/IHBhcnNlSW50KG1hdGNoW01PTlRIX05VTUJFUl9HUk9VUF0pXG4gICAgICAgICAgICA6IGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUllbbWF0Y2hbTU9OVEhfTkFNRV9HUk9VUF0udG9Mb3dlckNhc2UoKV07XG4gICAgICAgIGlmIChtb250aCA8IDEgfHwgbW9udGggPiAxMikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeWVhciA9IHBhcnNlSW50KG1hdGNoW1lFQVJfTlVNQkVSX0dST1VQXSk7XG4gICAgICAgIGNvbnN0IGRheSA9IHBhcnNlSW50KG1hdGNoW0RBVEVfTlVNQkVSX0dST1VQXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXk6IGRheSxcbiAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgIHllYXI6IHllYXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5DYXN1YWxZZWFyTW9udGhEYXlQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiKFswLTldfDBbMS05XXwxWzAxMl0pLyhbMC05XXs0fSlcIiArIFwiXCIsIFwiaVwiKTtcbmNvbnN0IE1PTlRIX0dST1VQID0gMTtcbmNvbnN0IFlFQVJfR1JPVVAgPSAyO1xuY2xhc3MgRU5TbGFzaE1vbnRoRm9ybWF0UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB5ZWFyID0gcGFyc2VJbnQobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICBjb25zdCBtb250aCA9IHBhcnNlSW50KG1hdGNoW01PTlRIX0dST1VQXSk7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCkuaW1wbHkoXCJkYXlcIiwgMSkuYXNzaWduKFwibW9udGhcIiwgbW9udGgpLmFzc2lnbihcInllYXJcIiwgeWVhcik7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5TbGFzaE1vbnRoRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXIgPSB2b2lkIDA7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uL2luZGV4XCIpO1xuZnVuY3Rpb24gcHJpbWFyeVRpbWVQYXR0ZXJuKHByaW1hcnlQcmVmaXgsIHByaW1hcnlTdWZmaXgpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChcIihefFxcXFxzfFQpXCIgK1xuICAgICAgICBgJHtwcmltYXJ5UHJlZml4fWAgK1xuICAgICAgICBcIihcXFxcZHsxLDR9KVwiICtcbiAgICAgICAgXCIoPzpcIiArXG4gICAgICAgIFwiKD86XFxcXC58XFxcXDp8XFxcXO+8milcIiArXG4gICAgICAgIFwiKFxcXFxkezEsMn0pXCIgK1xuICAgICAgICBcIig/OlwiICtcbiAgICAgICAgXCIoPzpcXFxcOnxcXFxc77yaKVwiICtcbiAgICAgICAgXCIoXFxcXGR7Mn0pXCIgK1xuICAgICAgICBcIig/OlxcXFwuKFxcXFxkezEsNn0pKT9cIiArXG4gICAgICAgIFwiKT9cIiArXG4gICAgICAgIFwiKT9cIiArXG4gICAgICAgIFwiKD86XFxcXHMqKGFcXFxcLm1cXFxcLnxwXFxcXC5tXFxcXC58YW0/fHBtPykpP1wiICtcbiAgICAgICAgYCR7cHJpbWFyeVN1ZmZpeH1gLCBcImlcIik7XG59XG5mdW5jdGlvbiBmb2xsb3dpbmdUaW1lUGF0dGVuKGZvbGxvd2luZ1BoYXNlLCBmb2xsb3dpbmdTdWZmaXgpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXigke2ZvbGxvd2luZ1BoYXNlfSlgICtcbiAgICAgICAgXCIoXFxcXGR7MSw0fSlcIiArXG4gICAgICAgIFwiKD86XCIgK1xuICAgICAgICBcIig/OlxcXFwufFxcXFw6fFxcXFzvvJopXCIgK1xuICAgICAgICBcIihcXFxcZHsxLDJ9KVwiICtcbiAgICAgICAgXCIoPzpcIiArXG4gICAgICAgIFwiKD86XFxcXC58XFxcXDp8XFxcXO+8milcIiArXG4gICAgICAgIFwiKFxcXFxkezEsMn0pKD86XFxcXC4oXFxcXGR7MSw2fSkpP1wiICtcbiAgICAgICAgXCIpP1wiICtcbiAgICAgICAgXCIpP1wiICtcbiAgICAgICAgXCIoPzpcXFxccyooYVxcXFwubVxcXFwufHBcXFxcLm1cXFxcLnxhbT98cG0/KSk/XCIgK1xuICAgICAgICBgJHtmb2xsb3dpbmdTdWZmaXh9YCwgXCJpXCIpO1xufVxuY29uc3QgSE9VUl9HUk9VUCA9IDI7XG5jb25zdCBNSU5VVEVfR1JPVVAgPSAzO1xuY29uc3QgU0VDT05EX0dST1VQID0gNDtcbmNvbnN0IE1JTExJX1NFQ09ORF9HUk9VUCA9IDU7XG5jb25zdCBBTV9QTV9IT1VSX0dST1VQID0gNjtcbmNsYXNzIEFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHN0cmljdE1vZGUgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmNhY2hlZFByaW1hcnlQcmVmaXggPSBudWxsO1xuICAgICAgICB0aGlzLmNhY2hlZFByaW1hcnlTdWZmaXggPSBudWxsO1xuICAgICAgICB0aGlzLmNhY2hlZFByaW1hcnlUaW1lUGF0dGVybiA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FjaGVkRm9sbG93aW5nUGhhc2UgPSBudWxsO1xuICAgICAgICB0aGlzLmNhY2hlZEZvbGxvd2luZ1N1ZmZpeCA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FjaGVkRm9sbG93aW5nVGltZVBhdHRlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RyaWN0TW9kZSA9IHN0cmljdE1vZGU7XG4gICAgfVxuICAgIHByaW1hcnlTdWZmaXgoKSB7XG4gICAgICAgIHJldHVybiBcIig/PVxcXFxXfCQpXCI7XG4gICAgfVxuICAgIGZvbGxvd2luZ1N1ZmZpeCgpIHtcbiAgICAgICAgcmV0dXJuIFwiKD89XFxcXFd8JClcIjtcbiAgICB9XG4gICAgcGF0dGVybihjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFByaW1hcnlUaW1lUGF0dGVyblRocm91Z2hDYWNoZSgpO1xuICAgIH1cbiAgICBleHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0Q29tcG9uZW50cyA9IHRoaXMuZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCk7XG4gICAgICAgIGlmICghc3RhcnRDb21wb25lbnRzKSB7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCArPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQobWF0Y2guaW5kZXggKyBtYXRjaFsxXS5sZW5ndGgsIG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGgpLCBzdGFydENvbXBvbmVudHMpO1xuICAgICAgICBjb25zdCByZW1haW5pbmdUZXh0ID0gY29udGV4dC50ZXh0LnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGZvbGxvd2luZ1BhdHRlcm4gPSB0aGlzLmdldEZvbGxvd2luZ1RpbWVQYXR0ZXJuVGhyb3VnaENhY2hlKCk7XG4gICAgICAgIG1hdGNoID0gZm9sbG93aW5nUGF0dGVybi5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgICAgICBpZiAoIW1hdGNoIHx8XG4gICAgICAgICAgICBtYXRjaFswXS5tYXRjaCgvXlxccyooWystXSlcXHMqXFxkezMsNH0kLykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrQW5kUmV0dXJuV2l0aG91dEZvbGxvd2luZ1BhdHRlcm4ocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuZW5kID0gdGhpcy5leHRyYWN0Rm9sbG93aW5nVGltZUNvbXBvbmVudHMoY29udGV4dCwgbWF0Y2gsIHJlc3VsdCk7XG4gICAgICAgIGlmIChyZXN1bHQuZW5kKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LmVuZCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC50ZXh0ICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGV4dHJhY3RQcmltYXJ5VGltZUNvbXBvbmVudHMoY29udGV4dCwgbWF0Y2gsIHN0cmljdCA9IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIGxldCBob3VyID0gMDtcbiAgICAgICAgbGV0IG1pbnV0ZSA9IDA7XG4gICAgICAgIGxldCBtZXJpZGllbSA9IG51bGw7XG4gICAgICAgIGhvdXIgPSBwYXJzZUludChtYXRjaFtIT1VSX0dST1VQXSk7XG4gICAgICAgIGlmIChtYXRjaFtNSU5VVEVfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaFtNSU5VVEVfR1JPVVBdLmxlbmd0aCA9PSAxICYmICFtYXRjaFtBTV9QTV9IT1VSX0dST1VQXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWludXRlID0gcGFyc2VJbnQobWF0Y2hbTUlOVVRFX0dST1VQXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaG91ciA+IDEwMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RyaWN0TW9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWludXRlID0gaG91ciAlIDEwMDtcbiAgICAgICAgICAgIGhvdXIgPSBNYXRoLmZsb29yKGhvdXIgLyAxMDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtaW51dGUgPj0gNjAgfHwgaG91ciA+IDI0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG91ciA+IDEyKSB7XG4gICAgICAgICAgICBtZXJpZGllbSA9IGluZGV4XzEuTWVyaWRpZW0uUE07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoW0FNX1BNX0hPVVJfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChob3VyID4gMTIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb25zdCBhbXBtID0gbWF0Y2hbQU1fUE1fSE9VUl9HUk9VUF1bMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChhbXBtID09IFwiYVwiKSB7XG4gICAgICAgICAgICAgICAgbWVyaWRpZW0gPSBpbmRleF8xLk1lcmlkaWVtLkFNO1xuICAgICAgICAgICAgICAgIGlmIChob3VyID09IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbXBtID09IFwicFwiKSB7XG4gICAgICAgICAgICAgICAgbWVyaWRpZW0gPSBpbmRleF8xLk1lcmlkaWVtLlBNO1xuICAgICAgICAgICAgICAgIGlmIChob3VyICE9IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwiaG91clwiLCBob3VyKTtcbiAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtaW51dGVcIiwgbWludXRlKTtcbiAgICAgICAgaWYgKG1lcmlkaWVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1lcmlkaWVtXCIsIG1lcmlkaWVtKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoW01JTExJX1NFQ09ORF9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgbWlsbGlzZWNvbmQgPSBwYXJzZUludChtYXRjaFtNSUxMSV9TRUNPTkRfR1JPVVBdLnN1YnN0cmluZygwLCAzKSk7XG4gICAgICAgICAgICBpZiAobWlsbGlzZWNvbmQgPj0gMTAwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibWlsbGlzZWNvbmRcIiwgbWlsbGlzZWNvbmQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtTRUNPTkRfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZCA9IHBhcnNlSW50KG1hdGNoW1NFQ09ORF9HUk9VUF0pO1xuICAgICAgICAgICAgaWYgKHNlY29uZCA+PSA2MClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwic2Vjb25kXCIsIHNlY29uZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxuICAgIGV4dHJhY3RGb2xsb3dpbmdUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCwgcmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIGlmIChtYXRjaFtNSUxMSV9TRUNPTkRfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IG1pbGxpc2Vjb25kID0gcGFyc2VJbnQobWF0Y2hbTUlMTElfU0VDT05EX0dST1VQXS5zdWJzdHJpbmcoMCwgMykpO1xuICAgICAgICAgICAgaWYgKG1pbGxpc2Vjb25kID49IDEwMDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1pbGxpc2Vjb25kXCIsIG1pbGxpc2Vjb25kKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbU0VDT05EX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBzZWNvbmQgPSBwYXJzZUludChtYXRjaFtTRUNPTkRfR1JPVVBdKTtcbiAgICAgICAgICAgIGlmIChzZWNvbmQgPj0gNjApXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcInNlY29uZFwiLCBzZWNvbmQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBob3VyID0gcGFyc2VJbnQobWF0Y2hbSE9VUl9HUk9VUF0pO1xuICAgICAgICBsZXQgbWludXRlID0gMDtcbiAgICAgICAgbGV0IG1lcmlkaWVtID0gLTE7XG4gICAgICAgIGlmIChtYXRjaFtNSU5VVEVfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1pbnV0ZSA9IHBhcnNlSW50KG1hdGNoW01JTlVURV9HUk9VUF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGhvdXIgPiAxMDApIHtcbiAgICAgICAgICAgIG1pbnV0ZSA9IGhvdXIgJSAxMDA7XG4gICAgICAgICAgICBob3VyID0gTWF0aC5mbG9vcihob3VyIC8gMTAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWludXRlID49IDYwIHx8IGhvdXIgPiAyNCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvdXIgPj0gMTIpIHtcbiAgICAgICAgICAgIG1lcmlkaWVtID0gaW5kZXhfMS5NZXJpZGllbS5QTTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbQU1fUE1fSE9VUl9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGhvdXIgPiAxMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYW1wbSA9IG1hdGNoW0FNX1BNX0hPVVJfR1JPVVBdWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoYW1wbSA9PSBcImFcIikge1xuICAgICAgICAgICAgICAgIG1lcmlkaWVtID0gaW5kZXhfMS5NZXJpZGllbS5BTTtcbiAgICAgICAgICAgICAgICBpZiAoaG91ciA9PSAxMikge1xuICAgICAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnRzLmlzQ2VydGFpbihcImRheVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcImRheVwiLCBjb21wb25lbnRzLmdldChcImRheVwiKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFtcG0gPT0gXCJwXCIpIHtcbiAgICAgICAgICAgICAgICBtZXJpZGllbSA9IGluZGV4XzEuTWVyaWRpZW0uUE07XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgIT0gMTIpXG4gICAgICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5zdGFydC5pc0NlcnRhaW4oXCJtZXJpZGllbVwiKSkge1xuICAgICAgICAgICAgICAgIGlmIChtZXJpZGllbSA9PSBpbmRleF8xLk1lcmlkaWVtLkFNKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zdGFydC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXJ0LmdldChcImhvdXJcIikgPT0gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJob3VyXCIsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3RhcnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGFydC5nZXQoXCJob3VyXCIpICE9IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwiaG91clwiLCByZXN1bHQuc3RhcnQuZ2V0KFwiaG91clwiKSArIDEyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcImhvdXJcIiwgaG91cik7XG4gICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibWludXRlXCIsIG1pbnV0ZSk7XG4gICAgICAgIGlmIChtZXJpZGllbSA+PSAwKSB7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1lcmlkaWVtXCIsIG1lcmlkaWVtKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0QXRQTSA9IHJlc3VsdC5zdGFydC5pc0NlcnRhaW4oXCJtZXJpZGllbVwiKSAmJiByZXN1bHQuc3RhcnQuZ2V0KFwiaG91clwiKSA+IDEyO1xuICAgICAgICAgICAgaWYgKHN0YXJ0QXRQTSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhcnQuZ2V0KFwiaG91clwiKSAtIDEyID4gaG91cikge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhvdXIgPD0gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGhvdXIgKyAxMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaG91ciA+IDEyKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaG91ciA8PSAxMikge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50cy5kYXRlKCkuZ2V0VGltZSgpIDwgcmVzdWx0LnN0YXJ0LmRhdGUoKS5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJkYXlcIiwgY29tcG9uZW50cy5nZXQoXCJkYXlcIikgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50cztcbiAgICB9XG4gICAgY2hlY2tBbmRSZXR1cm5XaXRob3V0Rm9sbG93aW5nUGF0dGVybihyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC50ZXh0Lm1hdGNoKC9eXFxkJC8pKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmRpbmdXaXRoTnVtYmVycyA9IHJlc3VsdC50ZXh0Lm1hdGNoKC9bXlxcZDouXShcXGRbXFxkLl0rKSQvKTtcbiAgICAgICAgaWYgKGVuZGluZ1dpdGhOdW1iZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBlbmRpbmdOdW1iZXJzID0gZW5kaW5nV2l0aE51bWJlcnNbMV07XG4gICAgICAgICAgICBpZiAodGhpcy5zdHJpY3RNb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZW5kaW5nTnVtYmVycy5pbmNsdWRlcyhcIi5cIikgJiYgIWVuZGluZ051bWJlcnMubWF0Y2goL1xcZChcXC5cXGR7Mn0pKyQvKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZW5kaW5nTnVtYmVyVmFsID0gcGFyc2VJbnQoZW5kaW5nTnVtYmVycyk7XG4gICAgICAgICAgICBpZiAoZW5kaW5nTnVtYmVyVmFsID4gMjQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBnZXRQcmltYXJ5VGltZVBhdHRlcm5UaHJvdWdoQ2FjaGUoKSB7XG4gICAgICAgIGNvbnN0IHByaW1hcnlQcmVmaXggPSB0aGlzLnByaW1hcnlQcmVmaXgoKTtcbiAgICAgICAgY29uc3QgcHJpbWFyeVN1ZmZpeCA9IHRoaXMucHJpbWFyeVN1ZmZpeCgpO1xuICAgICAgICBpZiAodGhpcy5jYWNoZWRQcmltYXJ5UHJlZml4ID09PSBwcmltYXJ5UHJlZml4ICYmIHRoaXMuY2FjaGVkUHJpbWFyeVN1ZmZpeCA9PT0gcHJpbWFyeVN1ZmZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkUHJpbWFyeVRpbWVQYXR0ZXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FjaGVkUHJpbWFyeVRpbWVQYXR0ZXJuID0gcHJpbWFyeVRpbWVQYXR0ZXJuKHByaW1hcnlQcmVmaXgsIHByaW1hcnlTdWZmaXgpO1xuICAgICAgICB0aGlzLmNhY2hlZFByaW1hcnlQcmVmaXggPSBwcmltYXJ5UHJlZml4O1xuICAgICAgICB0aGlzLmNhY2hlZFByaW1hcnlTdWZmaXggPSBwcmltYXJ5U3VmZml4O1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRQcmltYXJ5VGltZVBhdHRlcm47XG4gICAgfVxuICAgIGdldEZvbGxvd2luZ1RpbWVQYXR0ZXJuVGhyb3VnaENhY2hlKCkge1xuICAgICAgICBjb25zdCBmb2xsb3dpbmdQaGFzZSA9IHRoaXMuZm9sbG93aW5nUGhhc2UoKTtcbiAgICAgICAgY29uc3QgZm9sbG93aW5nU3VmZml4ID0gdGhpcy5mb2xsb3dpbmdTdWZmaXgoKTtcbiAgICAgICAgaWYgKHRoaXMuY2FjaGVkRm9sbG93aW5nUGhhc2UgPT09IGZvbGxvd2luZ1BoYXNlICYmIHRoaXMuY2FjaGVkRm9sbG93aW5nU3VmZml4ID09PSBmb2xsb3dpbmdTdWZmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlZEZvbGxvd2luZ1RpbWVQYXR0ZW47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWNoZWRGb2xsb3dpbmdUaW1lUGF0dGVuID0gZm9sbG93aW5nVGltZVBhdHRlbihmb2xsb3dpbmdQaGFzZSwgZm9sbG93aW5nU3VmZml4KTtcbiAgICAgICAgdGhpcy5jYWNoZWRGb2xsb3dpbmdQaGFzZSA9IGZvbGxvd2luZ1BoYXNlO1xuICAgICAgICB0aGlzLmNhY2hlZEZvbGxvd2luZ1N1ZmZpeCA9IGZvbGxvd2luZ1N1ZmZpeDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkRm9sbG93aW5nVGltZVBhdHRlbjtcbiAgICB9XG59XG5leHBvcnRzLkFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXIgPSBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY29uc3QgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJcIik7XG5jbGFzcyBFTlRpbWVFeHByZXNzaW9uUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xLkFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHN0cmljdE1vZGUpIHtcbiAgICAgICAgc3VwZXIoc3RyaWN0TW9kZSk7XG4gICAgfVxuICAgIGZvbGxvd2luZ1BoYXNlKCkge1xuICAgICAgICByZXR1cm4gXCJcXFxccyooPzpcXFxcLXxcXFxc4oCTfFxcXFx+fFxcXFzjgJx8dG98XFxcXD8pXFxcXHMqXCI7XG4gICAgfVxuICAgIHByaW1hcnlQcmVmaXgoKSB7XG4gICAgICAgIHJldHVybiBcIig/Oig/OmF0fGZyb20pXFxcXHMqKT8/XCI7XG4gICAgfVxuICAgIHByaW1hcnlTdWZmaXgoKSB7XG4gICAgICAgIHJldHVybiBcIig/OlxcXFxzKig/Om9cXFxcVypjbG9ja3xhdFxcXFxzKm5pZ2h0fGluXFxcXHMqdGhlXFxcXHMqKD86bW9ybmluZ3xhZnRlcm5vb24pKSk/KD89XFxcXFd8JClcIjtcbiAgICB9XG4gICAgZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gc3VwZXIuZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCk7XG4gICAgICAgIGlmIChjb21wb25lbnRzKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hbMF0uZW5kc1dpdGgoXCJuaWdodFwiKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhvdXIgPSBjb21wb25lbnRzLmdldChcImhvdXJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPj0gNiAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKSArIDEyKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaG91ciA8IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hbMF0uZW5kc1dpdGgoXCJhZnRlcm5vb25cIikpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhvdXIgPSBjb21wb25lbnRzLmdldChcImhvdXJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPj0gMCAmJiBob3VyIDw9IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKSArIDEyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hbMF0uZW5kc1dpdGgoXCJtb3JuaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb25zdCBob3VyID0gY29tcG9uZW50cy5nZXQoXCJob3VyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOVGltZUV4cHJlc3Npb25QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkSW1wbGllZFRpbWVVbml0cyA9IGV4cG9ydHMucmV2ZXJzZVRpbWVVbml0cyA9IHZvaWQgMDtcbmZ1bmN0aW9uIHJldmVyc2VUaW1lVW5pdHModGltZVVuaXRzKSB7XG4gICAgY29uc3QgcmV2ZXJzZWQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aW1lVW5pdHMpIHtcbiAgICAgICAgcmV2ZXJzZWRba2V5XSA9IC10aW1lVW5pdHNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHJldmVyc2VkO1xufVxuZXhwb3J0cy5yZXZlcnNlVGltZVVuaXRzID0gcmV2ZXJzZVRpbWVVbml0cztcbmZ1bmN0aW9uIGFkZEltcGxpZWRUaW1lVW5pdHMoY29tcG9uZW50cywgdGltZVVuaXRzKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gY29tcG9uZW50cy5jbG9uZSgpO1xuICAgIGxldCBkYXRlID0gY29tcG9uZW50cy5kYXlqcygpO1xuICAgIGZvciAoY29uc3Qga2V5IGluIHRpbWVVbml0cykge1xuICAgICAgICBkYXRlID0gZGF0ZS5hZGQodGltZVVuaXRzW2tleV0sIGtleSk7XG4gICAgfVxuICAgIGlmIChcImRheVwiIGluIHRpbWVVbml0cyB8fCBcImRcIiBpbiB0aW1lVW5pdHMgfHwgXCJ3ZWVrXCIgaW4gdGltZVVuaXRzIHx8IFwibW9udGhcIiBpbiB0aW1lVW5pdHMgfHwgXCJ5ZWFyXCIgaW4gdGltZVVuaXRzKSB7XG4gICAgICAgIG91dHB1dC5pbXBseShcImRheVwiLCBkYXRlLmRhdGUoKSk7XG4gICAgICAgIG91dHB1dC5pbXBseShcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpO1xuICAgICAgICBvdXRwdXQuaW1wbHkoXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICB9XG4gICAgaWYgKFwic2Vjb25kXCIgaW4gdGltZVVuaXRzIHx8IFwibWludXRlXCIgaW4gdGltZVVuaXRzIHx8IFwiaG91clwiIGluIHRpbWVVbml0cykge1xuICAgICAgICBvdXRwdXQuaW1wbHkoXCJzZWNvbmRcIiwgZGF0ZS5zZWNvbmQoKSk7XG4gICAgICAgIG91dHB1dC5pbXBseShcIm1pbnV0ZVwiLCBkYXRlLm1pbnV0ZSgpKTtcbiAgICAgICAgb3V0cHV0LmltcGx5KFwiaG91clwiLCBkYXRlLmhvdXIoKSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG5leHBvcnRzLmFkZEltcGxpZWRUaW1lVW5pdHMgPSBhZGRJbXBsaWVkVGltZVVuaXRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCByZXN1bHRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcmVzdWx0c1wiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHRpbWV1bml0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3RpbWV1bml0c1wiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiXCIgKyBcIihcIiArIGNvbnN0YW50c18xLlRJTUVfVU5JVFNfUEFUVEVSTiArIFwiKVwiICsgXCIoPzphZ298YmVmb3JlfGVhcmxpZXIpKD89KD86XFxcXFd8JCkpXCIsIFwiaVwiKTtcbmNvbnN0IFNUUklDVF9QQVRURVJOID0gbmV3IFJlZ0V4cChcIlwiICsgXCIoXCIgKyBjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk4gKyBcIilcIiArIFwiYWdvKD89KD86XFxcXFd8JCkpXCIsIFwiaVwiKTtcbmNsYXNzIEVOVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgY29uc3RydWN0b3Ioc3RyaWN0TW9kZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0cmljdE1vZGUgPSBzdHJpY3RNb2RlO1xuICAgIH1cbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmljdE1vZGUgPyBTVFJJQ1RfUEFUVEVSTiA6IFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB0aW1lVW5pdHMgPSBjb25zdGFudHNfMS5wYXJzZVRpbWVVbml0cyhtYXRjaFsxXSk7XG4gICAgICAgIGNvbnN0IG91dHB1dFRpbWVVbml0cyA9IHRpbWV1bml0c18xLnJldmVyc2VUaW1lVW5pdHModGltZVVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgb3V0cHV0VGltZVVuaXRzKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCByZXN1bHRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcmVzdWx0c1wiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiXCIgKyBcIihcIiArIGNvbnN0YW50c18xLlRJTUVfVU5JVFNfUEFUVEVSTiArIFwiKVwiICsgXCIobGF0ZXJ8YWZ0ZXJ8ZnJvbSBub3d8aGVuY2Vmb3J0aHxmb3J3YXJkfG91dClcIiArIFwiKD89KD86XFxcXFd8JCkpXCIsIFwiaVwiKTtcbmNvbnN0IFNUUklDVF9QQVRURVJOID0gbmV3IFJlZ0V4cChcIlwiICsgXCIoXCIgKyBjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk4gKyBcIilcIiArIFwiKGxhdGVyfGZyb20gbm93KVwiICsgXCIoPz0oPzpcXFxcV3wkKSlcIiwgXCJpXCIpO1xuY29uc3QgR1JPVVBfTlVNX1RJTUVVTklUUyA9IDE7XG5jbGFzcyBFTlRpbWVVbml0TGF0ZXJGb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgY29uc3RydWN0b3Ioc3RyaWN0TW9kZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0cmljdE1vZGUgPSBzdHJpY3RNb2RlO1xuICAgIH1cbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmljdE1vZGUgPyBTVFJJQ1RfUEFUVEVSTiA6IFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBmcmFnbWVudHMgPSBjb25zdGFudHNfMS5wYXJzZVRpbWVVbml0cyhtYXRjaFtHUk9VUF9OVU1fVElNRVVOSVRTXSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzXzEuUGFyc2luZ0NvbXBvbmVudHMuY3JlYXRlUmVsYXRpdmVGcm9tUmVmRGF0ZShjb250ZXh0LnJlZkRhdGUsIGZyYWdtZW50cyk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5UaW1lVW5pdExhdGVyRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLk1lcmdpbmdSZWZpbmVyID0gZXhwb3J0cy5GaWx0ZXIgPSB2b2lkIDA7XG5jbGFzcyBGaWx0ZXIge1xuICAgIHJlZmluZShjb250ZXh0LCByZXN1bHRzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRzLmZpbHRlcigocikgPT4gdGhpcy5pc1ZhbGlkKGNvbnRleHQsIHIpKTtcbiAgICB9XG59XG5leHBvcnRzLkZpbHRlciA9IEZpbHRlcjtcbmNsYXNzIE1lcmdpbmdSZWZpbmVyIHtcbiAgICByZWZpbmUoY29udGV4dCwgcmVzdWx0cykge1xuICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXJnZWRSZXN1bHRzID0gW107XG4gICAgICAgIGxldCBjdXJSZXN1bHQgPSByZXN1bHRzWzBdO1xuICAgICAgICBsZXQgbmV4dFJlc3VsdCA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbmV4dFJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICBjb25zdCB0ZXh0QmV0d2VlbiA9IGNvbnRleHQudGV4dC5zdWJzdHJpbmcoY3VyUmVzdWx0LmluZGV4ICsgY3VyUmVzdWx0LnRleHQubGVuZ3RoLCBuZXh0UmVzdWx0LmluZGV4KTtcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG91bGRNZXJnZVJlc3VsdHModGV4dEJldHdlZW4sIGN1clJlc3VsdCwgbmV4dFJlc3VsdCwgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRSZXN1bHRzLnB1c2goY3VyUmVzdWx0KTtcbiAgICAgICAgICAgICAgICBjdXJSZXN1bHQgPSBuZXh0UmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdCA9IGN1clJlc3VsdDtcbiAgICAgICAgICAgICAgICBjb25zdCByaWdodCA9IG5leHRSZXN1bHQ7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2VkUmVzdWx0ID0gdGhpcy5tZXJnZVJlc3VsdHModGV4dEJldHdlZW4sIGxlZnQsIHJpZ2h0LCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRlYnVnKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBtZXJnZWQgJHtsZWZ0fSBhbmQgJHtyaWdodH0gaW50byAke21lcmdlZFJlc3VsdH1gKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjdXJSZXN1bHQgPSBtZXJnZWRSZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1clJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtZXJnZWRSZXN1bHRzLnB1c2goY3VyUmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVyZ2VkUmVzdWx0cztcbiAgICB9XG59XG5leHBvcnRzLk1lcmdpbmdSZWZpbmVyID0gTWVyZ2luZ1JlZmluZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGFic3RyYWN0UmVmaW5lcnNfMSA9IHJlcXVpcmUoXCIuLi9hYnN0cmFjdFJlZmluZXJzXCIpO1xuY2xhc3MgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXIgZXh0ZW5kcyBhYnN0cmFjdFJlZmluZXJzXzEuTWVyZ2luZ1JlZmluZXIge1xuICAgIHNob3VsZE1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgY3VycmVudFJlc3VsdCwgbmV4dFJlc3VsdCkge1xuICAgICAgICByZXR1cm4gIWN1cnJlbnRSZXN1bHQuZW5kICYmICFuZXh0UmVzdWx0LmVuZCAmJiB0ZXh0QmV0d2Vlbi5tYXRjaCh0aGlzLnBhdHRlcm5CZXR3ZWVuKCkpICE9IG51bGw7XG4gICAgfVxuICAgIG1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgZnJvbVJlc3VsdCwgdG9SZXN1bHQpIHtcbiAgICAgICAgaWYgKCFmcm9tUmVzdWx0LnN0YXJ0LmlzT25seVdlZWtkYXlDb21wb25lbnQoKSAmJiAhdG9SZXN1bHQuc3RhcnQuaXNPbmx5V2Vla2RheUNvbXBvbmVudCgpKSB7XG4gICAgICAgICAgICB0b1Jlc3VsdC5zdGFydC5nZXRDZXJ0YWluQ29tcG9uZW50cygpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnJvbVJlc3VsdC5zdGFydC5pc0NlcnRhaW4oa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tUmVzdWx0LnN0YXJ0LmFzc2lnbihrZXksIHRvUmVzdWx0LnN0YXJ0LmdldChrZXkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZyb21SZXN1bHQuc3RhcnQuZ2V0Q2VydGFpbkNvbXBvbmVudHMoKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRvUmVzdWx0LnN0YXJ0LmlzQ2VydGFpbihrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvUmVzdWx0LnN0YXJ0LmFzc2lnbihrZXksIGZyb21SZXN1bHQuc3RhcnQuZ2V0KGtleSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmcm9tUmVzdWx0LnN0YXJ0LmRhdGUoKS5nZXRUaW1lKCkgPiB0b1Jlc3VsdC5zdGFydC5kYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICBsZXQgZnJvbU1vbWVudCA9IGZyb21SZXN1bHQuc3RhcnQuZGF5anMoKTtcbiAgICAgICAgICAgIGxldCB0b01vbWVudCA9IHRvUmVzdWx0LnN0YXJ0LmRheWpzKCk7XG4gICAgICAgICAgICBpZiAoZnJvbVJlc3VsdC5zdGFydC5pc09ubHlXZWVrZGF5Q29tcG9uZW50KCkgJiYgZnJvbU1vbWVudC5hZGQoLTcsIFwiZGF5c1wiKS5pc0JlZm9yZSh0b01vbWVudCkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTW9tZW50ID0gZnJvbU1vbWVudC5hZGQoLTcsIFwiZGF5c1wiKTtcbiAgICAgICAgICAgICAgICBmcm9tUmVzdWx0LnN0YXJ0LmltcGx5KFwiZGF5XCIsIGZyb21Nb21lbnQuZGF0ZSgpKTtcbiAgICAgICAgICAgICAgICBmcm9tUmVzdWx0LnN0YXJ0LmltcGx5KFwibW9udGhcIiwgZnJvbU1vbWVudC5tb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgZnJvbVJlc3VsdC5zdGFydC5pbXBseShcInllYXJcIiwgZnJvbU1vbWVudC55ZWFyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG9SZXN1bHQuc3RhcnQuaXNPbmx5V2Vla2RheUNvbXBvbmVudCgpICYmIHRvTW9tZW50LmFkZCg3LCBcImRheXNcIikuaXNBZnRlcihmcm9tTW9tZW50KSkge1xuICAgICAgICAgICAgICAgIHRvTW9tZW50ID0gdG9Nb21lbnQuYWRkKDcsIFwiZGF5c1wiKTtcbiAgICAgICAgICAgICAgICB0b1Jlc3VsdC5zdGFydC5pbXBseShcImRheVwiLCB0b01vbWVudC5kYXRlKCkpO1xuICAgICAgICAgICAgICAgIHRvUmVzdWx0LnN0YXJ0LmltcGx5KFwibW9udGhcIiwgdG9Nb21lbnQubW9udGgoKSArIDEpO1xuICAgICAgICAgICAgICAgIHRvUmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCB0b01vbWVudC55ZWFyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgW3RvUmVzdWx0LCBmcm9tUmVzdWx0XSA9IFtmcm9tUmVzdWx0LCB0b1Jlc3VsdF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZnJvbVJlc3VsdC5jbG9uZSgpO1xuICAgICAgICByZXN1bHQuc3RhcnQgPSBmcm9tUmVzdWx0LnN0YXJ0O1xuICAgICAgICByZXN1bHQuZW5kID0gdG9SZXN1bHQuc3RhcnQ7XG4gICAgICAgIHJlc3VsdC5pbmRleCA9IE1hdGgubWluKGZyb21SZXN1bHQuaW5kZXgsIHRvUmVzdWx0LmluZGV4KTtcbiAgICAgICAgaWYgKGZyb21SZXN1bHQuaW5kZXggPCB0b1Jlc3VsdC5pbmRleCkge1xuICAgICAgICAgICAgcmVzdWx0LnRleHQgPSBmcm9tUmVzdWx0LnRleHQgKyB0ZXh0QmV0d2VlbiArIHRvUmVzdWx0LnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQudGV4dCA9IHRvUmVzdWx0LnRleHQgKyB0ZXh0QmV0d2VlbiArIGZyb21SZXN1bHQudGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY2xhc3MgRU5NZXJnZURhdGVSYW5nZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gL15cXHMqKHRvfC0pXFxzKiQvaTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTk1lcmdlRGF0ZVJhbmdlUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tZXJnZURhdGVUaW1lQ29tcG9uZW50ID0gZXhwb3J0cy5tZXJnZURhdGVUaW1lUmVzdWx0ID0gdm9pZCAwO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi9pbmRleFwiKTtcbmZ1bmN0aW9uIG1lcmdlRGF0ZVRpbWVSZXN1bHQoZGF0ZVJlc3VsdCwgdGltZVJlc3VsdCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGRhdGVSZXN1bHQuY2xvbmUoKTtcbiAgICBjb25zdCBiZWdpbkRhdGUgPSBkYXRlUmVzdWx0LnN0YXJ0O1xuICAgIGNvbnN0IGJlZ2luVGltZSA9IHRpbWVSZXN1bHQuc3RhcnQ7XG4gICAgcmVzdWx0LnN0YXJ0ID0gbWVyZ2VEYXRlVGltZUNvbXBvbmVudChiZWdpbkRhdGUsIGJlZ2luVGltZSk7XG4gICAgaWYgKGRhdGVSZXN1bHQuZW5kICE9IG51bGwgfHwgdGltZVJlc3VsdC5lbmQgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBlbmREYXRlID0gZGF0ZVJlc3VsdC5lbmQgPT0gbnVsbCA/IGRhdGVSZXN1bHQuc3RhcnQgOiBkYXRlUmVzdWx0LmVuZDtcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IHRpbWVSZXN1bHQuZW5kID09IG51bGwgPyB0aW1lUmVzdWx0LnN0YXJ0IDogdGltZVJlc3VsdC5lbmQ7XG4gICAgICAgIGNvbnN0IGVuZERhdGVUaW1lID0gbWVyZ2VEYXRlVGltZUNvbXBvbmVudChlbmREYXRlLCBlbmRUaW1lKTtcbiAgICAgICAgaWYgKGRhdGVSZXN1bHQuZW5kID09IG51bGwgJiYgZW5kRGF0ZVRpbWUuZGF0ZSgpLmdldFRpbWUoKSA8IHJlc3VsdC5zdGFydC5kYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICBpZiAoZW5kRGF0ZVRpbWUuaXNDZXJ0YWluKFwiZGF5XCIpKSB7XG4gICAgICAgICAgICAgICAgZW5kRGF0ZVRpbWUuYXNzaWduKFwiZGF5XCIsIGVuZERhdGVUaW1lLmdldChcImRheVwiKSArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kRGF0ZVRpbWUuaW1wbHkoXCJkYXlcIiwgZW5kRGF0ZVRpbWUuZ2V0KFwiZGF5XCIpICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmVuZCA9IGVuZERhdGVUaW1lO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5tZXJnZURhdGVUaW1lUmVzdWx0ID0gbWVyZ2VEYXRlVGltZVJlc3VsdDtcbmZ1bmN0aW9uIG1lcmdlRGF0ZVRpbWVDb21wb25lbnQoZGF0ZUNvbXBvbmVudCwgdGltZUNvbXBvbmVudCkge1xuICAgIGNvbnN0IGRhdGVUaW1lQ29tcG9uZW50ID0gZGF0ZUNvbXBvbmVudC5jbG9uZSgpO1xuICAgIGlmICh0aW1lQ29tcG9uZW50LmlzQ2VydGFpbihcImhvdXJcIikpIHtcbiAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuYXNzaWduKFwiaG91clwiLCB0aW1lQ29tcG9uZW50LmdldChcImhvdXJcIikpO1xuICAgICAgICBkYXRlVGltZUNvbXBvbmVudC5hc3NpZ24oXCJtaW51dGVcIiwgdGltZUNvbXBvbmVudC5nZXQoXCJtaW51dGVcIikpO1xuICAgICAgICBpZiAodGltZUNvbXBvbmVudC5pc0NlcnRhaW4oXCJzZWNvbmRcIikpIHtcbiAgICAgICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmFzc2lnbihcInNlY29uZFwiLCB0aW1lQ29tcG9uZW50LmdldChcInNlY29uZFwiKSk7XG4gICAgICAgICAgICBpZiAodGltZUNvbXBvbmVudC5pc0NlcnRhaW4oXCJtaWxsaXNlY29uZFwiKSkge1xuICAgICAgICAgICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmFzc2lnbihcIm1pbGxpc2Vjb25kXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwibWlsbGlzZWNvbmRcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuaW1wbHkoXCJtaWxsaXNlY29uZFwiLCB0aW1lQ29tcG9uZW50LmdldChcIm1pbGxpc2Vjb25kXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwic2Vjb25kXCIpKTtcbiAgICAgICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmltcGx5KFwibWlsbGlzZWNvbmRcIiwgdGltZUNvbXBvbmVudC5nZXQoXCJtaWxsaXNlY29uZFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmltcGx5KFwiaG91clwiLCB0aW1lQ29tcG9uZW50LmdldChcImhvdXJcIikpO1xuICAgICAgICBkYXRlVGltZUNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCB0aW1lQ29tcG9uZW50LmdldChcIm1pbnV0ZVwiKSk7XG4gICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwic2Vjb25kXCIpKTtcbiAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuaW1wbHkoXCJtaWxsaXNlY29uZFwiLCB0aW1lQ29tcG9uZW50LmdldChcIm1pbGxpc2Vjb25kXCIpKTtcbiAgICB9XG4gICAgaWYgKHRpbWVDb21wb25lbnQuaXNDZXJ0YWluKFwidGltZXpvbmVPZmZzZXRcIikpIHtcbiAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuYXNzaWduKFwidGltZXpvbmVPZmZzZXRcIiwgdGltZUNvbXBvbmVudC5nZXQoXCJ0aW1lem9uZU9mZnNldFwiKSk7XG4gICAgfVxuICAgIGlmICh0aW1lQ29tcG9uZW50LmlzQ2VydGFpbihcIm1lcmlkaWVtXCIpKSB7XG4gICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmFzc2lnbihcIm1lcmlkaWVtXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwibWVyaWRpZW1cIikpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aW1lQ29tcG9uZW50LmdldChcIm1lcmlkaWVtXCIpICE9IG51bGwgJiYgZGF0ZVRpbWVDb21wb25lbnQuZ2V0KFwibWVyaWRpZW1cIikgPT0gbnVsbCkge1xuICAgICAgICBkYXRlVGltZUNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwibWVyaWRpZW1cIikpO1xuICAgIH1cbiAgICBpZiAoZGF0ZVRpbWVDb21wb25lbnQuZ2V0KFwibWVyaWRpZW1cIikgPT0gaW5kZXhfMS5NZXJpZGllbS5QTSAmJiBkYXRlVGltZUNvbXBvbmVudC5nZXQoXCJob3VyXCIpIDwgMTIpIHtcbiAgICAgICAgaWYgKHRpbWVDb21wb25lbnQuaXNDZXJ0YWluKFwiaG91clwiKSkge1xuICAgICAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuYXNzaWduKFwiaG91clwiLCBkYXRlVGltZUNvbXBvbmVudC5nZXQoXCJob3VyXCIpICsgMTIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIGRhdGVUaW1lQ29tcG9uZW50LmdldChcImhvdXJcIikgKyAxMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGVUaW1lQ29tcG9uZW50O1xufVxuZXhwb3J0cy5tZXJnZURhdGVUaW1lQ29tcG9uZW50ID0gbWVyZ2VEYXRlVGltZUNvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYWJzdHJhY3RSZWZpbmVyc18xID0gcmVxdWlyZShcIi4uL2Fic3RyYWN0UmVmaW5lcnNcIik7XG5jb25zdCBtZXJnaW5nQ2FsY3VsYXRpb25fMSA9IHJlcXVpcmUoXCIuLi8uLi9jYWxjdWxhdGlvbi9tZXJnaW5nQ2FsY3VsYXRpb25cIik7XG5jbGFzcyBFTk1lcmdlRGF0ZVRpbWVSZWZpbmVyIGV4dGVuZHMgYWJzdHJhY3RSZWZpbmVyc18xLk1lcmdpbmdSZWZpbmVyIHtcbiAgICBzaG91bGRNZXJnZVJlc3VsdHModGV4dEJldHdlZW4sIGN1cnJlbnRSZXN1bHQsIG5leHRSZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuICgoKGN1cnJlbnRSZXN1bHQuc3RhcnQuaXNPbmx5RGF0ZSgpICYmIG5leHRSZXN1bHQuc3RhcnQuaXNPbmx5VGltZSgpKSB8fFxuICAgICAgICAgICAgKG5leHRSZXN1bHQuc3RhcnQuaXNPbmx5RGF0ZSgpICYmIGN1cnJlbnRSZXN1bHQuc3RhcnQuaXNPbmx5VGltZSgpKSkgJiZcbiAgICAgICAgICAgIHRleHRCZXR3ZWVuLm1hdGNoKHRoaXMucGF0dGVybkJldHdlZW4oKSkgIT0gbnVsbCk7XG4gICAgfVxuICAgIG1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgY3VycmVudFJlc3VsdCwgbmV4dFJlc3VsdCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjdXJyZW50UmVzdWx0LnN0YXJ0LmlzT25seURhdGUoKVxuICAgICAgICAgICAgPyBtZXJnaW5nQ2FsY3VsYXRpb25fMS5tZXJnZURhdGVUaW1lUmVzdWx0KGN1cnJlbnRSZXN1bHQsIG5leHRSZXN1bHQpXG4gICAgICAgICAgICA6IG1lcmdpbmdDYWxjdWxhdGlvbl8xLm1lcmdlRGF0ZVRpbWVSZXN1bHQobmV4dFJlc3VsdCwgY3VycmVudFJlc3VsdCk7XG4gICAgICAgIHJlc3VsdC5pbmRleCA9IGN1cnJlbnRSZXN1bHQuaW5kZXg7XG4gICAgICAgIHJlc3VsdC50ZXh0ID0gY3VycmVudFJlc3VsdC50ZXh0ICsgdGV4dEJldHdlZW4gKyBuZXh0UmVzdWx0LnRleHQ7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5NZXJnZURhdGVUaW1lUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lclwiKSk7XG5jbGFzcyBFTk1lcmdlRGF0ZVRpbWVSZWZpbmVyIGV4dGVuZHMgQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl5cXFxccyooVHxhdHxhZnRlcnxiZWZvcmV8b258b2Z8LHwtKT9cXFxccyokXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOTWVyZ2VEYXRlVGltZVJlZmluZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRJTUVaT05FX05BTUVfUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqXFxcXCg/KFtBLVpdezIsNH0pXFxcXCk/KD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgREVGQVVMVF9USU1FWk9ORV9BQkJSX01BUCA9IHtcbiAgICBBQ0RUOiA2MzAsXG4gICAgQUNTVDogNTcwLFxuICAgIEFEVDogLTE4MCxcbiAgICBBRURUOiA2NjAsXG4gICAgQUVTVDogNjAwLFxuICAgIEFGVDogMjcwLFxuICAgIEFLRFQ6IC00ODAsXG4gICAgQUtTVDogLTU0MCxcbiAgICBBTE1UOiAzNjAsXG4gICAgQU1TVDogLTE4MCxcbiAgICBBTVQ6IC0yNDAsXG4gICAgQU5BU1Q6IDcyMCxcbiAgICBBTkFUOiA3MjAsXG4gICAgQVFUVDogMzAwLFxuICAgIEFSVDogLTE4MCxcbiAgICBBU1Q6IC0yNDAsXG4gICAgQVdEVDogNTQwLFxuICAgIEFXU1Q6IDQ4MCxcbiAgICBBWk9TVDogMCxcbiAgICBBWk9UOiAtNjAsXG4gICAgQVpTVDogMzAwLFxuICAgIEFaVDogMjQwLFxuICAgIEJOVDogNDgwLFxuICAgIEJPVDogLTI0MCxcbiAgICBCUlNUOiAtMTIwLFxuICAgIEJSVDogLTE4MCxcbiAgICBCU1Q6IDYwLFxuICAgIEJUVDogMzYwLFxuICAgIENBU1Q6IDQ4MCxcbiAgICBDQVQ6IDEyMCxcbiAgICBDQ1Q6IDM5MCxcbiAgICBDRFQ6IC0zMDAsXG4gICAgQ0VTVDogMTIwLFxuICAgIENFVDogNjAsXG4gICAgQ0hBRFQ6IDgyNSxcbiAgICBDSEFTVDogNzY1LFxuICAgIENLVDogLTYwMCxcbiAgICBDTFNUOiAtMTgwLFxuICAgIENMVDogLTI0MCxcbiAgICBDT1Q6IC0zMDAsXG4gICAgQ1NUOiAtMzYwLFxuICAgIENWVDogLTYwLFxuICAgIENYVDogNDIwLFxuICAgIENoU1Q6IDYwMCxcbiAgICBEQVZUOiA0MjAsXG4gICAgRUFTU1Q6IC0zMDAsXG4gICAgRUFTVDogLTM2MCxcbiAgICBFQVQ6IDE4MCxcbiAgICBFQ1Q6IC0zMDAsXG4gICAgRURUOiAtMjQwLFxuICAgIEVFU1Q6IDE4MCxcbiAgICBFRVQ6IDEyMCxcbiAgICBFR1NUOiAwLFxuICAgIEVHVDogLTYwLFxuICAgIEVTVDogLTMwMCxcbiAgICBFVDogLTMwMCxcbiAgICBGSlNUOiA3ODAsXG4gICAgRkpUOiA3MjAsXG4gICAgRktTVDogLTE4MCxcbiAgICBGS1Q6IC0yNDAsXG4gICAgRk5UOiAtMTIwLFxuICAgIEdBTFQ6IC0zNjAsXG4gICAgR0FNVDogLTU0MCxcbiAgICBHRVQ6IDI0MCxcbiAgICBHRlQ6IC0xODAsXG4gICAgR0lMVDogNzIwLFxuICAgIEdNVDogMCxcbiAgICBHU1Q6IDI0MCxcbiAgICBHWVQ6IC0yNDAsXG4gICAgSEFBOiAtMTgwLFxuICAgIEhBQzogLTMwMCxcbiAgICBIQURUOiAtNTQwLFxuICAgIEhBRTogLTI0MCxcbiAgICBIQVA6IC00MjAsXG4gICAgSEFSOiAtMzYwLFxuICAgIEhBU1Q6IC02MDAsXG4gICAgSEFUOiAtOTAsXG4gICAgSEFZOiAtNDgwLFxuICAgIEhLVDogNDgwLFxuICAgIEhMVjogLTIxMCxcbiAgICBITkE6IC0yNDAsXG4gICAgSE5DOiAtMzYwLFxuICAgIEhORTogLTMwMCxcbiAgICBITlA6IC00ODAsXG4gICAgSE5SOiAtNDIwLFxuICAgIEhOVDogLTE1MCxcbiAgICBITlk6IC01NDAsXG4gICAgSE9WVDogNDIwLFxuICAgIElDVDogNDIwLFxuICAgIElEVDogMTgwLFxuICAgIElPVDogMzYwLFxuICAgIElSRFQ6IDI3MCxcbiAgICBJUktTVDogNTQwLFxuICAgIElSS1Q6IDU0MCxcbiAgICBJUlNUOiAyMTAsXG4gICAgSVNUOiAzMzAsXG4gICAgSlNUOiA1NDAsXG4gICAgS0dUOiAzNjAsXG4gICAgS1JBU1Q6IDQ4MCxcbiAgICBLUkFUOiA0ODAsXG4gICAgS1NUOiA1NDAsXG4gICAgS1VZVDogMjQwLFxuICAgIExIRFQ6IDY2MCxcbiAgICBMSFNUOiA2MzAsXG4gICAgTElOVDogODQwLFxuICAgIE1BR1NUOiA3MjAsXG4gICAgTUFHVDogNzIwLFxuICAgIE1BUlQ6IC01MTAsXG4gICAgTUFXVDogMzAwLFxuICAgIE1EVDogLTM2MCxcbiAgICBNRVNaOiAxMjAsXG4gICAgTUVaOiA2MCxcbiAgICBNSFQ6IDcyMCxcbiAgICBNTVQ6IDM5MCxcbiAgICBNU0Q6IDI0MCxcbiAgICBNU0s6IDI0MCxcbiAgICBNU1Q6IC00MjAsXG4gICAgTVVUOiAyNDAsXG4gICAgTVZUOiAzMDAsXG4gICAgTVlUOiA0ODAsXG4gICAgTkNUOiA2NjAsXG4gICAgTkRUOiAtOTAsXG4gICAgTkZUOiA2OTAsXG4gICAgTk9WU1Q6IDQyMCxcbiAgICBOT1ZUOiAzNjAsXG4gICAgTlBUOiAzNDUsXG4gICAgTlNUOiAtMTUwLFxuICAgIE5VVDogLTY2MCxcbiAgICBOWkRUOiA3ODAsXG4gICAgTlpTVDogNzIwLFxuICAgIE9NU1NUOiA0MjAsXG4gICAgT01TVDogNDIwLFxuICAgIFBEVDogLTQyMCxcbiAgICBQRVQ6IC0zMDAsXG4gICAgUEVUU1Q6IDcyMCxcbiAgICBQRVRUOiA3MjAsXG4gICAgUEdUOiA2MDAsXG4gICAgUEhPVDogNzgwLFxuICAgIFBIVDogNDgwLFxuICAgIFBLVDogMzAwLFxuICAgIFBNRFQ6IC0xMjAsXG4gICAgUE1TVDogLTE4MCxcbiAgICBQT05UOiA2NjAsXG4gICAgUFNUOiAtNDgwLFxuICAgIFBUOiAtNDgwLFxuICAgIFBXVDogNTQwLFxuICAgIFBZU1Q6IC0xODAsXG4gICAgUFlUOiAtMjQwLFxuICAgIFJFVDogMjQwLFxuICAgIFNBTVQ6IDI0MCxcbiAgICBTQVNUOiAxMjAsXG4gICAgU0JUOiA2NjAsXG4gICAgU0NUOiAyNDAsXG4gICAgU0dUOiA0ODAsXG4gICAgU1JUOiAtMTgwLFxuICAgIFNTVDogLTY2MCxcbiAgICBUQUhUOiAtNjAwLFxuICAgIFRGVDogMzAwLFxuICAgIFRKVDogMzAwLFxuICAgIFRLVDogNzgwLFxuICAgIFRMVDogNTQwLFxuICAgIFRNVDogMzAwLFxuICAgIFRWVDogNzIwLFxuICAgIFVMQVQ6IDQ4MCxcbiAgICBVVEM6IDAsXG4gICAgVVlTVDogLTEyMCxcbiAgICBVWVQ6IC0xODAsXG4gICAgVVpUOiAzMDAsXG4gICAgVkVUOiAtMjEwLFxuICAgIFZMQVNUOiA2NjAsXG4gICAgVkxBVDogNjYwLFxuICAgIFZVVDogNjYwLFxuICAgIFdBU1Q6IDEyMCxcbiAgICBXQVQ6IDYwLFxuICAgIFdFU1Q6IDYwLFxuICAgIFdFU1o6IDYwLFxuICAgIFdFVDogMCxcbiAgICBXRVo6IDAsXG4gICAgV0ZUOiA3MjAsXG4gICAgV0dTVDogLTEyMCxcbiAgICBXR1Q6IC0xODAsXG4gICAgV0lCOiA0MjAsXG4gICAgV0lUOiA1NDAsXG4gICAgV0lUQTogNDgwLFxuICAgIFdTVDogNzgwLFxuICAgIFdUOiAwLFxuICAgIFlBS1NUOiA2MDAsXG4gICAgWUFLVDogNjAwLFxuICAgIFlBUFQ6IDYwMCxcbiAgICBZRUtTVDogMzYwLFxuICAgIFlFS1Q6IDM2MCxcbn07XG5jbGFzcyBFeHRyYWN0VGltZXpvbmVBYmJyUmVmaW5lciB7XG4gICAgY29uc3RydWN0b3IodGltZXpvbmVPdmVycmlkZXMpIHtcbiAgICAgICAgdGhpcy50aW1lem9uZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9USU1FWk9ORV9BQkJSX01BUCksIHRpbWV6b25lT3ZlcnJpZGVzKTtcbiAgICB9XG4gICAgcmVmaW5lKGNvbnRleHQsIHJlc3VsdHMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCB0aW1lem9uZU92ZXJyaWRlcyA9IChfYSA9IGNvbnRleHQub3B0aW9uLnRpbWV6b25lcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgY29uc3Qgc3VmZml4ID0gY29udGV4dC50ZXh0LnN1YnN0cmluZyhyZXN1bHQuaW5kZXggKyByZXN1bHQudGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBUSU1FWk9ORV9OQU1FX1BBVFRFUk4uZXhlYyhzdWZmaXgpO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRpbWV6b25lQWJiciA9IG1hdGNoWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCBleHRyYWN0ZWRUaW1lem9uZU9mZnNldCA9IChfYiA9IChfYSA9IHRpbWV6b25lT3ZlcnJpZGVzW3RpbWV6b25lQWJicl0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRoaXMudGltZXpvbmVbdGltZXpvbmVBYmJyXSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChleHRyYWN0ZWRUaW1lem9uZU9mZnNldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQuZGVidWcoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFeHRyYWN0aW5nIHRpbWV6b25lOiAnJHt0aW1lem9uZUFiYnJ9JyBpbnRvIDogJHtleHRyYWN0ZWRUaW1lem9uZU9mZnNldH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbWV6b25lT2Zmc2V0ID0gcmVzdWx0LnN0YXJ0LmdldChcInRpbWV6b25lT2Zmc2V0XCIpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lem9uZU9mZnNldCAhPT0gbnVsbCAmJiBleHRyYWN0ZWRUaW1lem9uZU9mZnNldCAhPSBjdXJyZW50VGltZXpvbmVPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQudGV4dCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgIGlmICghcmVzdWx0LnN0YXJ0LmlzQ2VydGFpbihcInRpbWV6b25lT2Zmc2V0XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcInRpbWV6b25lT2Zmc2V0XCIsIGV4dHJhY3RlZFRpbWV6b25lT2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQuZW5kICE9IG51bGwgJiYgIXJlc3VsdC5lbmQuaXNDZXJ0YWluKFwidGltZXpvbmVPZmZzZXRcIikpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZW5kLmFzc2lnbihcInRpbWV6b25lT2Zmc2V0XCIsIGV4dHJhY3RlZFRpbWV6b25lT2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEV4dHJhY3RUaW1lem9uZUFiYnJSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBUSU1FWk9ORV9PRkZTRVRfUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqKD86KD86R01UfFVUQylcXFxccz8pPyhbKy1dKShcXFxcZHsxLDJ9KSg/Ojo/KFxcXFxkezJ9KSk/XCIsIFwiaVwiKTtcbmNvbnN0IFRJTUVaT05FX09GRlNFVF9TSUdOX0dST1VQID0gMTtcbmNvbnN0IFRJTUVaT05FX09GRlNFVF9IT1VSX09GRlNFVF9HUk9VUCA9IDI7XG5jb25zdCBUSU1FWk9ORV9PRkZTRVRfTUlOVVRFX09GRlNFVF9HUk9VUCA9IDM7XG5jbGFzcyBFeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyIHtcbiAgICByZWZpbmUoY29udGV4dCwgcmVzdWx0cykge1xuICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGFydC5pc0NlcnRhaW4oXCJ0aW1lem9uZU9mZnNldFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN1ZmZpeCA9IGNvbnRleHQudGV4dC5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0LnRleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gVElNRVpPTkVfT0ZGU0VUX1BBVFRFUk4uZXhlYyhzdWZmaXgpO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQuZGVidWcoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFeHRyYWN0aW5nIHRpbWV6b25lOiAnJHttYXRjaFswXX0nIGludG8gOiAke3Jlc3VsdH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaG91ck9mZnNldCA9IHBhcnNlSW50KG1hdGNoW1RJTUVaT05FX09GRlNFVF9IT1VSX09GRlNFVF9HUk9VUF0pO1xuICAgICAgICAgICAgY29uc3QgbWludXRlT2Zmc2V0ID0gcGFyc2VJbnQobWF0Y2hbVElNRVpPTkVfT0ZGU0VUX01JTlVURV9PRkZTRVRfR1JPVVBdIHx8IFwiMFwiKTtcbiAgICAgICAgICAgIGxldCB0aW1lem9uZU9mZnNldCA9IGhvdXJPZmZzZXQgKiA2MCArIG1pbnV0ZU9mZnNldDtcbiAgICAgICAgICAgIGlmIChtYXRjaFtUSU1FWk9ORV9PRkZTRVRfU0lHTl9HUk9VUF0gPT09IFwiLVwiKSB7XG4gICAgICAgICAgICAgICAgdGltZXpvbmVPZmZzZXQgPSAtdGltZXpvbmVPZmZzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0LmVuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmVuZC5hc3NpZ24oXCJ0aW1lem9uZU9mZnNldFwiLCB0aW1lem9uZU9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwidGltZXpvbmVPZmZzZXRcIiwgdGltZXpvbmVPZmZzZXQpO1xuICAgICAgICAgICAgcmVzdWx0LnRleHQgKz0gbWF0Y2hbMF07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBPdmVybGFwUmVtb3ZhbFJlZmluZXIge1xuICAgIHJlZmluZShjb250ZXh0LCByZXN1bHRzKSB7XG4gICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkUmVzdWx0cyA9IFtdO1xuICAgICAgICBsZXQgcHJldlJlc3VsdCA9IHJlc3VsdHNbMF07XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXggPCBwcmV2UmVzdWx0LmluZGV4ICsgcHJldlJlc3VsdC50ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQudGV4dC5sZW5ndGggPiBwcmV2UmVzdWx0LnRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRSZXN1bHRzLnB1c2gocHJldlJlc3VsdCk7XG4gICAgICAgICAgICAgICAgcHJldlJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJldlJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZFJlc3VsdHMucHVzaChwcmV2UmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWRSZXN1bHRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE92ZXJsYXBSZW1vdmFsUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZGF5anNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anNcIikpO1xuY2xhc3MgRm9yd2FyZERhdGVSZWZpbmVyIHtcbiAgICByZWZpbmUoY29udGV4dCwgcmVzdWx0cykge1xuICAgICAgICBpZiAoIWNvbnRleHQub3B0aW9uLmZvcndhcmREYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgbGV0IHJlZk1vbWVudCA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGFydC5pc09ubHlEYXlNb250aENvbXBvbmVudCgpICYmIHJlZk1vbWVudC5pc0FmdGVyKHJlc3VsdC5zdGFydC5kYXlqcygpKSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMyAmJiByZWZNb21lbnQuaXNBZnRlcihyZXN1bHQuc3RhcnQuZGF5anMoKSk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3RhcnQuaW1wbHkoXCJ5ZWFyXCIsIHJlc3VsdC5zdGFydC5nZXQoXCJ5ZWFyXCIpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZGVidWcoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEZvcndhcmQgeWVhcmx5IGFkanVzdGVkIGZvciAke3Jlc3VsdH0gKCR7cmVzdWx0LnN0YXJ0fSlgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZW5kICYmICFyZXN1bHQuZW5kLmlzQ2VydGFpbihcInllYXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQuaW1wbHkoXCJ5ZWFyXCIsIHJlc3VsdC5lbmQuZ2V0KFwieWVhclwiKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEZvcndhcmQgeWVhcmx5IGFkanVzdGVkIGZvciAke3Jlc3VsdH0gKCR7cmVzdWx0LmVuZH0pYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhcnQuaXNPbmx5V2Vla2RheUNvbXBvbmVudCgpICYmIHJlZk1vbWVudC5pc0FmdGVyKHJlc3VsdC5zdGFydC5kYXlqcygpKSkge1xuICAgICAgICAgICAgICAgIGlmIChyZWZNb21lbnQuZGF5KCkgPiByZXN1bHQuc3RhcnQuZ2V0KFwid2Vla2RheVwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZWZNb21lbnQgPSByZWZNb21lbnQuZGF5KHJlc3VsdC5zdGFydC5nZXQoXCJ3ZWVrZGF5XCIpICsgNyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWZNb21lbnQgPSByZWZNb21lbnQuZGF5KHJlc3VsdC5zdGFydC5nZXQoXCJ3ZWVrZGF5XCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwiZGF5XCIsIHJlZk1vbWVudC5kYXRlKCkpO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zdGFydC5pbXBseShcIm1vbnRoXCIsIHJlZk1vbWVudC5tb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCByZWZNb21lbnQueWVhcigpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRlYnVnKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEZvcndhcmQgd2Vla2x5IGFkanVzdGVkIGZvciAke3Jlc3VsdH0gKCR7cmVzdWx0LnN0YXJ0fSlgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVuZCAmJiByZXN1bHQuZW5kLmlzT25seVdlZWtkYXlDb21wb25lbnQoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVmTW9tZW50LmRheSgpID4gcmVzdWx0LmVuZC5nZXQoXCJ3ZWVrZGF5XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZNb21lbnQgPSByZWZNb21lbnQuZGF5KHJlc3VsdC5lbmQuZ2V0KFwid2Vla2RheVwiKSArIDcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmTW9tZW50ID0gcmVmTW9tZW50LmRheShyZXN1bHQuZW5kLmdldChcIndlZWtkYXlcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQuaW1wbHkoXCJkYXlcIiwgcmVmTW9tZW50LmRhdGUoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQuaW1wbHkoXCJtb250aFwiLCByZWZNb21lbnQubW9udGgoKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZW5kLmltcGx5KFwieWVhclwiLCByZWZNb21lbnQueWVhcigpKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRm9yd2FyZCB3ZWVrbHkgYWRqdXN0ZWQgZm9yICR7cmVzdWx0fSAoJHtyZXN1bHQuZW5kfSlgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRm9yd2FyZERhdGVSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhYnN0cmFjdFJlZmluZXJzXzEgPSByZXF1aXJlKFwiLi4vYWJzdHJhY3RSZWZpbmVyc1wiKTtcbmNsYXNzIFVubGlrZWx5Rm9ybWF0RmlsdGVyIGV4dGVuZHMgYWJzdHJhY3RSZWZpbmVyc18xLkZpbHRlciB7XG4gICAgY29uc3RydWN0b3Ioc3RyaWN0TW9kZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0cmljdE1vZGUgPSBzdHJpY3RNb2RlO1xuICAgIH1cbiAgICBpc1ZhbGlkKGNvbnRleHQsIHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnRleHQucmVwbGFjZShcIiBcIiwgXCJcIikubWF0Y2goL15cXGQqKFxcLlxcZCopPyQvKSkge1xuICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlbW92aW5nIHVubGlrZWx5IHJlc3VsdCAnJHtyZXN1bHQudGV4dH0nYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3VsdC5zdGFydC5pc1ZhbGlkRGF0ZSgpKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlYnVnKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVtb3ZpbmcgaW52YWxpZCByZXN1bHQ6ICR7cmVzdWx0fSAoJHtyZXN1bHQuc3RhcnR9KWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5lbmQgJiYgIXJlc3VsdC5lbmQuaXNWYWxpZERhdGUoKSkge1xuICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlbW92aW5nIGludmFsaWQgcmVzdWx0OiAke3Jlc3VsdH0gKCR7cmVzdWx0LmVuZH0pYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdHJpY3RNb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc1N0cmljdE1vZGVWYWxpZChjb250ZXh0LCByZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpc1N0cmljdE1vZGVWYWxpZChjb250ZXh0LCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdGFydC5pc09ubHlXZWVrZGF5Q29tcG9uZW50KCkpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGVidWcoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAoU3RyaWN0KSBSZW1vdmluZyB3ZWVrZGF5IG9ubHkgY29tcG9uZW50OiAke3Jlc3VsdH0gKCR7cmVzdWx0LmVuZH0pYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LnN0YXJ0LmlzT25seVRpbWUoKSAmJiAoIXJlc3VsdC5zdGFydC5pc0NlcnRhaW4oXCJob3VyXCIpIHx8ICFyZXN1bHQuc3RhcnQuaXNDZXJ0YWluKFwibWludXRlXCIpKSkge1xuICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYChTdHJpY3QpIFJlbW92aW5nIHVuY2VydGFpbiB0aW1lIGNvbXBvbmVudDogJHtyZXN1bHR9ICgke3Jlc3VsdC5lbmR9KWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gVW5saWtlbHlGb3JtYXRGaWx0ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4vQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoWzAtOV17NH0pXFxcXC0oWzAtOV17MSwyfSlcXFxcLShbMC05XXsxLDJ9KVwiICtcbiAgICBcIig/OlRcIiArXG4gICAgXCIoWzAtOV17MSwyfSk6KFswLTldezEsMn0pXCIgK1xuICAgIFwiKD86XCIgK1xuICAgIFwiOihbMC05XXsxLDJ9KSg/OlxcXFwuKFxcXFxkezEsNH0pKT9cIiArXG4gICAgXCIpP1wiICtcbiAgICBcIig/OlwiICtcbiAgICBcIlp8KFsrLV1cXFxcZHsyfSk6PyhcXFxcZHsyfSk/XCIgK1xuICAgIFwiKT9cIiArXG4gICAgXCIpP1wiICtcbiAgICBcIig/PVxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IFlFQVJfTlVNQkVSX0dST1VQID0gMTtcbmNvbnN0IE1PTlRIX05VTUJFUl9HUk9VUCA9IDI7XG5jb25zdCBEQVRFX05VTUJFUl9HUk9VUCA9IDM7XG5jb25zdCBIT1VSX05VTUJFUl9HUk9VUCA9IDQ7XG5jb25zdCBNSU5VVEVfTlVNQkVSX0dST1VQID0gNTtcbmNvbnN0IFNFQ09ORF9OVU1CRVJfR1JPVVAgPSA2O1xuY29uc3QgTUlMTElTRUNPTkRfTlVNQkVSX0dST1VQID0gNztcbmNvbnN0IFRaRF9IT1VSX09GRlNFVF9HUk9VUCA9IDg7XG5jb25zdCBUWkRfTUlOVVRFX09GRlNFVF9HUk9VUCA9IDk7XG5jbGFzcyBJU09Gb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSB7fTtcbiAgICAgICAgY29tcG9uZW50c1tcInllYXJcIl0gPSBwYXJzZUludChtYXRjaFtZRUFSX05VTUJFUl9HUk9VUF0pO1xuICAgICAgICBjb21wb25lbnRzW1wibW9udGhcIl0gPSBwYXJzZUludChtYXRjaFtNT05USF9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgY29tcG9uZW50c1tcImRheVwiXSA9IHBhcnNlSW50KG1hdGNoW0RBVEVfTlVNQkVSX0dST1VQXSk7XG4gICAgICAgIGlmIChtYXRjaFtIT1VSX05VTUJFUl9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29tcG9uZW50c1tcImhvdXJcIl0gPSBwYXJzZUludChtYXRjaFtIT1VSX05VTUJFUl9HUk9VUF0pO1xuICAgICAgICAgICAgY29tcG9uZW50c1tcIm1pbnV0ZVwiXSA9IHBhcnNlSW50KG1hdGNoW01JTlVURV9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgICAgIGlmIChtYXRjaFtTRUNPTkRfTlVNQkVSX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1tcInNlY29uZFwiXSA9IHBhcnNlSW50KG1hdGNoW1NFQ09ORF9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFtNSUxMSVNFQ09ORF9OVU1CRVJfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW1wibWlsbGlzZWNvbmRcIl0gPSBwYXJzZUludChtYXRjaFtNSUxMSVNFQ09ORF9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFtUWkRfSE9VUl9PRkZTRVRfR1JPVVBdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW1widGltZXpvbmVPZmZzZXRcIl0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaG91ck9mZnNldCA9IHBhcnNlSW50KG1hdGNoW1RaRF9IT1VSX09GRlNFVF9HUk9VUF0pO1xuICAgICAgICAgICAgICAgIGxldCBtaW51dGVPZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaFtUWkRfTUlOVVRFX09GRlNFVF9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBtaW51dGVPZmZzZXQgPSBwYXJzZUludChtYXRjaFtUWkRfTUlOVVRFX09GRlNFVF9HUk9VUF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gaG91ck9mZnNldCAqIDYwO1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCAtPSBtaW51dGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgKz0gbWludXRlT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW1widGltZXpvbmVPZmZzZXRcIl0gPSBvZmZzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gSVNPRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhYnN0cmFjdFJlZmluZXJzXzEgPSByZXF1aXJlKFwiLi4vYWJzdHJhY3RSZWZpbmVyc1wiKTtcbmNsYXNzIE1lcmdlV2Vla2RheUNvbXBvbmVudFJlZmluZXIgZXh0ZW5kcyBhYnN0cmFjdFJlZmluZXJzXzEuTWVyZ2luZ1JlZmluZXIge1xuICAgIG1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgY3VycmVudFJlc3VsdCwgbmV4dFJlc3VsdCkge1xuICAgICAgICBjb25zdCBuZXdSZXN1bHQgPSBuZXh0UmVzdWx0LmNsb25lKCk7XG4gICAgICAgIG5ld1Jlc3VsdC5pbmRleCA9IGN1cnJlbnRSZXN1bHQuaW5kZXg7XG4gICAgICAgIG5ld1Jlc3VsdC50ZXh0ID0gY3VycmVudFJlc3VsdC50ZXh0ICsgdGV4dEJldHdlZW4gKyBuZXdSZXN1bHQudGV4dDtcbiAgICAgICAgbmV3UmVzdWx0LnN0YXJ0LmFzc2lnbihcIndlZWtkYXlcIiwgY3VycmVudFJlc3VsdC5zdGFydC5nZXQoXCJ3ZWVrZGF5XCIpKTtcbiAgICAgICAgaWYgKG5ld1Jlc3VsdC5lbmQpIHtcbiAgICAgICAgICAgIG5ld1Jlc3VsdC5lbmQuYXNzaWduKFwid2Vla2RheVwiLCBjdXJyZW50UmVzdWx0LnN0YXJ0LmdldChcIndlZWtkYXlcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdSZXN1bHQ7XG4gICAgfVxuICAgIHNob3VsZE1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgY3VycmVudFJlc3VsdCwgbmV4dFJlc3VsdCkge1xuICAgICAgICBjb25zdCB3ZWVrZGF5VGhlbk5vcm1hbERhdGUgPSBjdXJyZW50UmVzdWx0LnN0YXJ0LmlzT25seVdlZWtkYXlDb21wb25lbnQoKSAmJlxuICAgICAgICAgICAgIWN1cnJlbnRSZXN1bHQuc3RhcnQuaXNDZXJ0YWluKFwiaG91clwiKSAmJlxuICAgICAgICAgICAgbmV4dFJlc3VsdC5zdGFydC5pc0NlcnRhaW4oXCJkYXlcIik7XG4gICAgICAgIHJldHVybiB3ZWVrZGF5VGhlbk5vcm1hbERhdGUgJiYgdGV4dEJldHdlZW4ubWF0Y2goL14sP1xccyokLykgIT0gbnVsbDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBNZXJnZVdlZWtkYXlDb21wb25lbnRSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uID0gdm9pZCAwO1xuY29uc3QgRXh0cmFjdFRpbWV6b25lQWJiclJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb21tb24vcmVmaW5lcnMvRXh0cmFjdFRpbWV6b25lQWJiclJlZmluZXJcIikpO1xuY29uc3QgRXh0cmFjdFRpbWV6b25lT2Zmc2V0UmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvbW1vbi9yZWZpbmVycy9FeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyXCIpKTtcbmNvbnN0IE92ZXJsYXBSZW1vdmFsUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvbW1vbi9yZWZpbmVycy9PdmVybGFwUmVtb3ZhbFJlZmluZXJcIikpO1xuY29uc3QgRm9yd2FyZERhdGVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY29tbW9uL3JlZmluZXJzL0ZvcndhcmREYXRlUmVmaW5lclwiKSk7XG5jb25zdCBVbmxpa2VseUZvcm1hdEZpbHRlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvbW1vbi9yZWZpbmVycy9Vbmxpa2VseUZvcm1hdEZpbHRlclwiKSk7XG5jb25zdCBJU09Gb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb21tb24vcGFyc2Vycy9JU09Gb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgTWVyZ2VXZWVrZGF5Q29tcG9uZW50UmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvbW1vbi9yZWZpbmVycy9NZXJnZVdlZWtkYXlDb21wb25lbnRSZWZpbmVyXCIpKTtcbmZ1bmN0aW9uIGluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24sIHN0cmljdE1vZGUgPSBmYWxzZSkge1xuICAgIGNvbmZpZ3VyYXRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBJU09Gb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIGNvbmZpZ3VyYXRpb24ucmVmaW5lcnMudW5zaGlmdChuZXcgTWVyZ2VXZWVrZGF5Q29tcG9uZW50UmVmaW5lcl8xLmRlZmF1bHQoKSk7XG4gICAgY29uZmlndXJhdGlvbi5yZWZpbmVycy51bnNoaWZ0KG5ldyBFeHRyYWN0VGltZXpvbmVBYmJyUmVmaW5lcl8xLmRlZmF1bHQoKSk7XG4gICAgY29uZmlndXJhdGlvbi5yZWZpbmVycy51bnNoaWZ0KG5ldyBFeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyXzEuZGVmYXVsdCgpKTtcbiAgICBjb25maWd1cmF0aW9uLnJlZmluZXJzLnVuc2hpZnQobmV3IE92ZXJsYXBSZW1vdmFsUmVmaW5lcl8xLmRlZmF1bHQoKSk7XG4gICAgY29uZmlndXJhdGlvbi5yZWZpbmVycy5wdXNoKG5ldyBGb3J3YXJkRGF0ZVJlZmluZXJfMS5kZWZhdWx0KCkpO1xuICAgIGNvbmZpZ3VyYXRpb24ucmVmaW5lcnMucHVzaChuZXcgVW5saWtlbHlGb3JtYXRGaWx0ZXJfMS5kZWZhdWx0KHN0cmljdE1vZGUpKTtcbiAgICByZXR1cm4gY29uZmlndXJhdGlvbjtcbn1cbmV4cG9ydHMuaW5jbHVkZUNvbW1vbkNvbmZpZ3VyYXRpb24gPSBpbmNsdWRlQ29tbW9uQ29uZmlndXJhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50b25pZ2h0ID0gZXhwb3J0cy50b21vcnJvdyA9IGV4cG9ydHMueWVzdGVyZGF5ID0gZXhwb3J0cy50b2RheSA9IGV4cG9ydHMubm93ID0gdm9pZCAwO1xuY29uc3QgcmVzdWx0c18xID0gcmVxdWlyZShcIi4uL3Jlc3VsdHNcIik7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBkYXlqc18yID0gcmVxdWlyZShcIi4uL3V0aWxzL2RheWpzXCIpO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi9pbmRleFwiKTtcbmZ1bmN0aW9uIG5vdyhyZWZEYXRlKSB7XG4gICAgY29uc3QgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChyZWZEYXRlKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzKHJlZkRhdGUsIHt9KTtcbiAgICBkYXlqc18yLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgZGF5anNfMi5hc3NpZ25TaW1pbGFyVGltZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgIHJldHVybiBjb21wb25lbnQ7XG59XG5leHBvcnRzLm5vdyA9IG5vdztcbmZ1bmN0aW9uIHRvZGF5KHJlZkRhdGUpIHtcbiAgICBjb25zdCB0YXJnZXREYXRlID0gZGF5anNfMS5kZWZhdWx0KHJlZkRhdGUpO1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyByZXN1bHRzXzEuUGFyc2luZ0NvbXBvbmVudHMocmVmRGF0ZSwge30pO1xuICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICBkYXlqc18yLmltcGx5U2ltaWxhclRpbWUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZXhwb3J0cy50b2RheSA9IHRvZGF5O1xuZnVuY3Rpb24geWVzdGVyZGF5KHJlZkRhdGUpIHtcbiAgICBsZXQgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChyZWZEYXRlKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzKHJlZkRhdGUsIHt9KTtcbiAgICB0YXJnZXREYXRlID0gdGFyZ2V0RGF0ZS5hZGQoLTEsIFwiZGF5XCIpO1xuICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICBkYXlqc18yLmltcGx5U2ltaWxhclRpbWUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZXhwb3J0cy55ZXN0ZXJkYXkgPSB5ZXN0ZXJkYXk7XG5mdW5jdGlvbiB0b21vcnJvdyhyZWZEYXRlKSB7XG4gICAgY29uc3QgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChyZWZEYXRlKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzKHJlZkRhdGUsIHt9KTtcbiAgICBkYXlqc18yLmFzc2lnblRoZU5leHREYXkoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZXhwb3J0cy50b21vcnJvdyA9IHRvbW9ycm93O1xuZnVuY3Rpb24gdG9uaWdodChyZWZEYXRlLCBpbXBseUhvdXIgPSAyMikge1xuICAgIGNvbnN0IHRhcmdldERhdGUgPSBkYXlqc18xLmRlZmF1bHQocmVmRGF0ZSk7XG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cyhyZWZEYXRlLCB7fSk7XG4gICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCBpbXBseUhvdXIpO1xuICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZXhwb3J0cy50b25pZ2h0ID0gdG9uaWdodDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBkYXlqc18yID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL2RheWpzXCIpO1xuY29uc3QgcmVmZXJlbmNlcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2Nhc3VhbFJlZmVyZW5jZXNcIikpO1xuY29uc3QgUEFUVEVSTiA9IC8obm93fHRvZGF5fHRvbmlnaHR8dG9tb3Jyb3d8dG1yfHllc3RlcmRheXxsYXN0XFxzKm5pZ2h0KSg/PVxcV3wkKS9pO1xuY2xhc3MgRU5DYXN1YWxEYXRlUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybihjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgbGV0IHRhcmdldERhdGUgPSBkYXlqc18xLmRlZmF1bHQoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgY29uc3QgbG93ZXJUZXh0ID0gbWF0Y2hbMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBzd2l0Y2ggKGxvd2VyVGV4dCkge1xuICAgICAgICAgICAgY2FzZSBcIm5vd1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLm5vdyhjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcInRvZGF5XCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMudG9kYXkoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCJ5ZXN0ZXJkYXlcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy55ZXN0ZXJkYXkoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgICAgICAgY2FzZSBcInRtclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvbW9ycm93KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwidG9uaWdodFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvbmlnaHQoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKGxvd2VyVGV4dC5tYXRjaCgvbGFzdFxccypuaWdodC8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXREYXRlLmhvdXIoKSA+IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERhdGUgPSB0YXJnZXREYXRlLmFkZCgtMSwgXCJkYXlcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25TaW1pbGFyRGF0ZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOQ2FzdWFsRGF0ZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9pbmRleFwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IGRheWpzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmNvbnN0IGRheWpzXzIgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvZGF5anNcIik7XG5jb25zdCBQQVRURVJOID0gLyg/OnRoaXMpP1xccyoobW9ybmluZ3xhZnRlcm5vb258ZXZlbmluZ3xuaWdodHxtaWRuaWdodHxub29uKSg/PVxcV3wkKS9pO1xuY2xhc3MgRU5DYXN1YWxUaW1lUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB0YXJnZXREYXRlID0gZGF5anNfMS5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKTtcbiAgICAgICAgc3dpdGNoIChtYXRjaFsxXS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwiYWZ0ZXJub29uXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAxNSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXZlbmluZ1wiOlxuICAgICAgICAgICAgY2FzZSBcIm5pZ2h0XCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAyMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWlkbmlnaHRcIjpcbiAgICAgICAgICAgICAgICBkYXlqc18yLmFzc2lnblRoZU5leHREYXkoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJzZWNvbmRcIiwgMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibW9ybmluZ1wiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgNik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibm9vblwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5DYXN1YWxUaW1lUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnRvRGF5SlNDbG9zZXN0V2Vla2RheSA9IGV4cG9ydHMudG9EYXlKU1dlZWtkYXkgPSB2b2lkIDA7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5mdW5jdGlvbiB0b0RheUpTV2Vla2RheShyZWZEYXRlLCBvZmZzZXQsIG1vZGlmaWVyKSB7XG4gICAgaWYgKCFtb2RpZmllcikge1xuICAgICAgICByZXR1cm4gdG9EYXlKU0Nsb3Nlc3RXZWVrZGF5KHJlZkRhdGUsIG9mZnNldCk7XG4gICAgfVxuICAgIGxldCBkYXRlID0gZGF5anNfMS5kZWZhdWx0KHJlZkRhdGUpO1xuICAgIHN3aXRjaCAobW9kaWZpZXIpIHtcbiAgICAgICAgY2FzZSBcInRoaXNcIjpcbiAgICAgICAgICAgIGRhdGUgPSBkYXRlLmRheShvZmZzZXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuZXh0XCI6XG4gICAgICAgICAgICBkYXRlID0gZGF0ZS5kYXkob2Zmc2V0ICsgNyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImxhc3RcIjpcbiAgICAgICAgICAgIGRhdGUgPSBkYXRlLmRheShvZmZzZXQgLSA3KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZTtcbn1cbmV4cG9ydHMudG9EYXlKU1dlZWtkYXkgPSB0b0RheUpTV2Vla2RheTtcbmZ1bmN0aW9uIHRvRGF5SlNDbG9zZXN0V2Vla2RheShyZWZEYXRlLCBvZmZzZXQpIHtcbiAgICBsZXQgZGF0ZSA9IGRheWpzXzEuZGVmYXVsdChyZWZEYXRlKTtcbiAgICBjb25zdCByZWZPZmZzZXQgPSBkYXRlLmRheSgpO1xuICAgIGlmIChNYXRoLmFicyhvZmZzZXQgLSA3IC0gcmVmT2Zmc2V0KSA8IE1hdGguYWJzKG9mZnNldCAtIHJlZk9mZnNldCkpIHtcbiAgICAgICAgZGF0ZSA9IGRhdGUuZGF5KG9mZnNldCAtIDcpO1xuICAgIH1cbiAgICBlbHNlIGlmIChNYXRoLmFicyhvZmZzZXQgKyA3IC0gcmVmT2Zmc2V0KSA8IE1hdGguYWJzKG9mZnNldCAtIHJlZk9mZnNldCkpIHtcbiAgICAgICAgZGF0ZSA9IGRhdGUuZGF5KG9mZnNldCArIDcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZGF0ZSA9IGRhdGUuZGF5KG9mZnNldCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRlO1xufVxuZXhwb3J0cy50b0RheUpTQ2xvc2VzdFdlZWtkYXkgPSB0b0RheUpTQ2xvc2VzdFdlZWtkYXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3Qgd2Vla3NfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi93ZWVrc1wiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiKD86KD86XFxcXCx8XFxcXCh8XFxcXO+8iClcXFxccyopP1wiICtcbiAgICBcIig/Om9uXFxcXHMqPyk/XCIgK1xuICAgIFwiKD86KHRoaXN8bGFzdHxwYXN0fG5leHQpXFxcXHMqKT9cIiArXG4gICAgYCgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuV0VFS0RBWV9ESUNUSU9OQVJZKX0pYCArXG4gICAgXCIoPzpcXFxccyooPzpcXFxcLHxcXFxcKXxcXFxc77yJKSk/XCIgK1xuICAgIFwiKD86XFxcXHMqKHRoaXN8bGFzdHxwYXN0fG5leHQpXFxcXHMqd2Vlayk/XCIgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgUFJFRklYX0dST1VQID0gMTtcbmNvbnN0IFdFRUtEQVlfR1JPVVAgPSAyO1xuY29uc3QgUE9TVEZJWF9HUk9VUCA9IDM7XG5jbGFzcyBFTldlZWtkYXlQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGRheU9mV2VlayA9IG1hdGNoW1dFRUtEQVlfR1JPVVBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWVtkYXlPZldlZWtdO1xuICAgICAgICBjb25zdCBwcmVmaXggPSBtYXRjaFtQUkVGSVhfR1JPVVBdO1xuICAgICAgICBjb25zdCBwb3N0Zml4ID0gbWF0Y2hbUE9TVEZJWF9HUk9VUF07XG4gICAgICAgIGxldCBtb2RpZmllcldvcmQgPSBwcmVmaXggfHwgcG9zdGZpeDtcbiAgICAgICAgbW9kaWZpZXJXb3JkID0gbW9kaWZpZXJXb3JkIHx8IFwiXCI7XG4gICAgICAgIG1vZGlmaWVyV29yZCA9IG1vZGlmaWVyV29yZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgbW9kaWZpZXIgPSBudWxsO1xuICAgICAgICBpZiAobW9kaWZpZXJXb3JkID09IFwibGFzdFwiIHx8IG1vZGlmaWVyV29yZCA9PSBcInBhc3RcIikge1xuICAgICAgICAgICAgbW9kaWZpZXIgPSBcImxhc3RcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtb2RpZmllcldvcmQgPT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJuZXh0XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW9kaWZpZXJXb3JkID09IFwidGhpc1wiKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwidGhpc1wiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGUgPSB3ZWVrc18xLnRvRGF5SlNXZWVrZGF5KGNvbnRleHQucmVmRGF0ZSwgb2Zmc2V0LCBtb2RpZmllcik7XG4gICAgICAgIHJldHVybiBjb250ZXh0XG4gICAgICAgICAgICAuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKVxuICAgICAgICAgICAgLmFzc2lnbihcIndlZWtkYXlcIiwgb2Zmc2V0KVxuICAgICAgICAgICAgLmltcGx5KFwiZGF5XCIsIGRhdGUuZGF0ZSgpKVxuICAgICAgICAgICAgLmltcGx5KFwibW9udGhcIiwgZGF0ZS5tb250aCgpICsgMSlcbiAgICAgICAgICAgIC5pbXBseShcInllYXJcIiwgZGF0ZS55ZWFyKCkpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOV2Vla2RheVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcmVzdWx0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3Jlc3VsdHNcIik7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKGAodGhpc3xuZXh0fGxhc3R8cGFzdClcXFxccyooJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLlRJTUVfVU5JVF9ESUNUSU9OQVJZKX0pKD89XFxcXHMqKWAgKyBcIig/PVxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IE1PRElGSUVSX1dPUkRfR1JPVVAgPSAxO1xuY29uc3QgUkVMQVRJVkVfV09SRF9HUk9VUCA9IDI7XG5jbGFzcyBFTlJlbGF0aXZlRGF0ZUZvcm1hdFBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbW9kaWZpZXIgPSBtYXRjaFtNT0RJRklFUl9XT1JEX0dST1VQXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCB1bml0V29yZCA9IG1hdGNoW1JFTEFUSVZFX1dPUkRfR1JPVVBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IHRpbWV1bml0ID0gY29uc3RhbnRzXzEuVElNRV9VTklUX0RJQ1RJT05BUllbdW5pdFdvcmRdO1xuICAgICAgICBpZiAobW9kaWZpZXIgPT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVVbml0cyA9IHt9O1xuICAgICAgICAgICAgdGltZVVuaXRzW3RpbWV1bml0XSA9IDE7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzLmNyZWF0ZVJlbGF0aXZlRnJvbVJlZkRhdGUoY29udGV4dC5yZWZEYXRlLCB0aW1lVW5pdHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RpZmllciA9PSBcImxhc3RcIiB8fCBtb2RpZmllciA9PSBcInBhc3RcIikge1xuICAgICAgICAgICAgY29uc3QgdGltZVVuaXRzID0ge307XG4gICAgICAgICAgICB0aW1lVW5pdHNbdGltZXVuaXRdID0gLTE7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzLmNyZWF0ZVJlbGF0aXZlRnJvbVJlZkRhdGUoY29udGV4dC5yZWZEYXRlLCB0aW1lVW5pdHMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIGxldCBkYXRlID0gZGF5anNfMS5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIGlmICh1bml0V29yZC5tYXRjaCgvd2Vlay9pKSkge1xuICAgICAgICAgICAgZGF0ZSA9IGRhdGUuYWRkKC1kYXRlLmdldChcImRcIiksIFwiZFwiKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJkYXlcIiwgZGF0ZS5kYXRlKCkpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcInllYXJcIiwgZGF0ZS55ZWFyKCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVuaXRXb3JkLm1hdGNoKC9tb250aC9pKSkge1xuICAgICAgICAgICAgZGF0ZSA9IGRhdGUuYWRkKC1kYXRlLmRhdGUoKSArIDEsIFwiZFwiKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJkYXlcIiwgZGF0ZS5kYXRlKCkpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibW9udGhcIiwgZGF0ZS5tb250aCgpICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodW5pdFdvcmQubWF0Y2goL3llYXIvaSkpIHtcbiAgICAgICAgICAgIGRhdGUgPSBkYXRlLmFkZCgtZGF0ZS5kYXRlKCkgKyAxLCBcImRcIik7XG4gICAgICAgICAgICBkYXRlID0gZGF0ZS5hZGQoLWRhdGUubW9udGgoKSwgXCJtb250aFwiKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJkYXlcIiwgZGF0ZS5kYXRlKCkpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50cztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTlJlbGF0aXZlRGF0ZUZvcm1hdFBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXJzaW5nQ29udGV4dCA9IGV4cG9ydHMuQ2hyb25vID0gdm9pZCAwO1xuY29uc3QgcmVzdWx0c18xID0gcmVxdWlyZShcIi4vcmVzdWx0c1wiKTtcbmNvbnN0IGVuXzEgPSByZXF1aXJlKFwiLi9sb2NhbGVzL2VuXCIpO1xuY2xhc3MgQ2hyb25vIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWd1cmF0aW9uKSB7XG4gICAgICAgIGNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uIHx8IGVuXzEuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB0aGlzLnBhcnNlcnMgPSBbLi4uY29uZmlndXJhdGlvbi5wYXJzZXJzXTtcbiAgICAgICAgdGhpcy5yZWZpbmVycyA9IFsuLi5jb25maWd1cmF0aW9uLnJlZmluZXJzXTtcbiAgICB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2hyb25vKHtcbiAgICAgICAgICAgIHBhcnNlcnM6IFsuLi50aGlzLnBhcnNlcnNdLFxuICAgICAgICAgICAgcmVmaW5lcnM6IFsuLi50aGlzLnJlZmluZXJzXSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHBhcnNlRGF0ZSh0ZXh0LCByZWZlcmVuY2VEYXRlLCBvcHRpb24pIHtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHRoaXMucGFyc2UodGV4dCwgcmVmZXJlbmNlRGF0ZSwgb3B0aW9uKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHMubGVuZ3RoID4gMCA/IHJlc3VsdHNbMF0uc3RhcnQuZGF0ZSgpIDogbnVsbDtcbiAgICB9XG4gICAgcGFyc2UodGV4dCwgcmVmZXJlbmNlRGF0ZSwgb3B0aW9uKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgUGFyc2luZ0NvbnRleHQodGV4dCwgcmVmZXJlbmNlRGF0ZSB8fCBuZXcgRGF0ZSgpLCBvcHRpb24gfHwge30pO1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICB0aGlzLnBhcnNlcnMuZm9yRWFjaCgocGFyc2VyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRSZXN1bHRzID0gQ2hyb25vLmV4ZWN1dGVQYXJzZXIoY29udGV4dCwgcGFyc2VyKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChwYXJzZWRSZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc3VsdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZpbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChyZWZpbmVyKSB7XG4gICAgICAgICAgICByZXN1bHRzID0gcmVmaW5lci5yZWZpbmUoY29udGV4dCwgcmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gICAgc3RhdGljIGV4ZWN1dGVQYXJzZXIoY29udGV4dCwgcGFyc2VyKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgY29uc3QgcGF0dGVybiA9IHBhcnNlci5wYXR0ZXJuKGNvbnRleHQpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFRleHQgPSBjb250ZXh0LnRleHQ7XG4gICAgICAgIGxldCByZW1haW5pbmdUZXh0ID0gY29udGV4dC50ZXh0O1xuICAgICAgICBsZXQgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBtYXRjaC5pbmRleCArIG9yaWdpbmFsVGV4dC5sZW5ndGggLSByZW1haW5pbmdUZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIG1hdGNoLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIuZXh0cmFjdChjb250ZXh0LCBtYXRjaCk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJlbWFpbmluZ1RleHQgPSBvcmlnaW5hbFRleHQuc3Vic3RyaW5nKG1hdGNoLmluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcGFyc2VkUmVzdWx0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiByZXN1bHRzXzEuUGFyc2luZ1Jlc3VsdCkge1xuICAgICAgICAgICAgICAgIHBhcnNlZFJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cykge1xuICAgICAgICAgICAgICAgIHBhcnNlZFJlc3VsdCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ1Jlc3VsdChtYXRjaC5pbmRleCwgbWF0Y2hbMF0pO1xuICAgICAgICAgICAgICAgIHBhcnNlZFJlc3VsdC5zdGFydCA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcnNlZFJlc3VsdCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ1Jlc3VsdChtYXRjaC5pbmRleCwgbWF0Y2hbMF0sIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250ZXh0LmRlYnVnKCgpID0+IGNvbnNvbGUubG9nKGAke3BhcnNlci5jb25zdHJ1Y3Rvci5uYW1lfSBleHRyYWN0ZWQgcmVzdWx0ICR7cGFyc2VkUmVzdWx0fWApKTtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChwYXJzZWRSZXN1bHQpO1xuICAgICAgICAgICAgcmVtYWluaW5nVGV4dCA9IG9yaWdpbmFsVGV4dC5zdWJzdHJpbmcoaW5kZXggKyBwYXJzZWRSZXN1bHQudGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxufVxuZXhwb3J0cy5DaHJvbm8gPSBDaHJvbm87XG5jbGFzcyBQYXJzaW5nQ29udGV4dCB7XG4gICAgY29uc3RydWN0b3IodGV4dCwgcmVmRGF0ZSwgb3B0aW9uKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMucmVmRGF0ZSA9IHJlZkRhdGU7XG4gICAgICAgIHRoaXMub3B0aW9uID0gb3B0aW9uO1xuICAgIH1cbiAgICBjcmVhdGVQYXJzaW5nQ29tcG9uZW50cyhjb21wb25lbnRzKSB7XG4gICAgICAgIGlmIChjb21wb25lbnRzIGluc3RhbmNlb2YgcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cyh0aGlzLnJlZkRhdGUsIGNvbXBvbmVudHMpO1xuICAgIH1cbiAgICBjcmVhdGVQYXJzaW5nUmVzdWx0KGluZGV4LCB0ZXh0T3JFbmRJbmRleCwgc3RhcnRDb21wb25lbnRzLCBlbmRDb21wb25lbnRzKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0eXBlb2YgdGV4dE9yRW5kSW5kZXggPT09IFwic3RyaW5nXCIgPyB0ZXh0T3JFbmRJbmRleCA6IHRoaXMudGV4dC5zdWJzdHJpbmcoaW5kZXgsIHRleHRPckVuZEluZGV4KTtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBzdGFydENvbXBvbmVudHMgPyB0aGlzLmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKHN0YXJ0Q29tcG9uZW50cykgOiBudWxsO1xuICAgICAgICBjb25zdCBlbmQgPSBlbmRDb21wb25lbnRzID8gdGhpcy5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cyhlbmRDb21wb25lbnRzKSA6IG51bGw7XG4gICAgICAgIHJldHVybiBuZXcgcmVzdWx0c18xLlBhcnNpbmdSZXN1bHQodGhpcy5yZWZEYXRlLCBpbmRleCwgdGV4dCwgc3RhcnQsIGVuZCk7XG4gICAgfVxuICAgIGRlYnVnKGJsb2NrKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbi5kZWJ1Zykge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uLmRlYnVnIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbi5kZWJ1ZyhibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5vcHRpb24uZGVidWc7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5kZWJ1ZyhibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLlBhcnNpbmdDb250ZXh0ID0gUGFyc2luZ0NvbnRleHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIihbXlxcXFxkXXxeKVwiICtcbiAgICBcIihbMC0zXXswLDF9WzAtOV17MX0pW1xcXFwvXFxcXC5cXFxcLV0oWzAtM117MCwxfVswLTldezF9KVwiICtcbiAgICBcIig/OltcXFxcL1xcXFwuXFxcXC1dKFswLTldezR9fFswLTldezJ9KSk/XCIgK1xuICAgIFwiKFxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IE9QRU5JTkdfR1JPVVAgPSAxO1xuY29uc3QgRU5ESU5HX0dST1VQID0gNTtcbmNvbnN0IEZJUlNUX05VTUJFUlNfR1JPVVAgPSAyO1xuY29uc3QgU0VDT05EX05VTUJFUlNfR1JPVVAgPSAzO1xuY29uc3QgWUVBUl9HUk9VUCA9IDQ7XG5jbGFzcyBTbGFzaERhdGVGb3JtYXRQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKGxpdHRsZUVuZGlhbikge1xuICAgICAgICB0aGlzLmdyb3VwTnVtYmVyTW9udGggPSBsaXR0bGVFbmRpYW4gPyBTRUNPTkRfTlVNQkVSU19HUk9VUCA6IEZJUlNUX05VTUJFUlNfR1JPVVA7XG4gICAgICAgIHRoaXMuZ3JvdXBOdW1iZXJEYXkgPSBsaXR0bGVFbmRpYW4gPyBGSVJTVF9OVU1CRVJTX0dST1VQIDogU0VDT05EX05VTUJFUlNfR1JPVVA7XG4gICAgfVxuICAgIHBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBleHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGlmIChtYXRjaFtPUEVOSU5HX0dST1VQXSA9PSBcIi9cIiB8fCBtYXRjaFtFTkRJTkdfR1JPVVBdID09IFwiL1wiKSB7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCArPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoW09QRU5JTkdfR1JPVVBdLmxlbmd0aDtcbiAgICAgICAgY29uc3QgdGV4dCA9IG1hdGNoWzBdLnN1YnN0cihtYXRjaFtPUEVOSU5HX0dST1VQXS5sZW5ndGgsIG1hdGNoWzBdLmxlbmd0aCAtIG1hdGNoW09QRU5JTkdfR1JPVVBdLmxlbmd0aCAtIG1hdGNoW0VORElOR19HUk9VUF0ubGVuZ3RoKTtcbiAgICAgICAgaWYgKHRleHQubWF0Y2goL15cXGRcXC5cXGQkLykgfHwgdGV4dC5tYXRjaCgvXlxcZFxcLlxcZHsxLDJ9XFwuXFxkezEsMn1cXHMqJC8pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYXRjaFtZRUFSX0dST1VQXSAmJiBtYXRjaFswXS5pbmRleE9mKFwiL1wiKSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQoaW5kZXgsIHRleHQpO1xuICAgICAgICBsZXQgbW9udGggPSBwYXJzZUludChtYXRjaFt0aGlzLmdyb3VwTnVtYmVyTW9udGhdKTtcbiAgICAgICAgbGV0IGRheSA9IHBhcnNlSW50KG1hdGNoW3RoaXMuZ3JvdXBOdW1iZXJEYXldKTtcbiAgICAgICAgaWYgKG1vbnRoIDwgMSB8fCBtb250aCA+IDEyKSB7XG4gICAgICAgICAgICBpZiAobW9udGggPiAxMikge1xuICAgICAgICAgICAgICAgIGlmIChkYXkgPj0gMSAmJiBkYXkgPD0gMTIgJiYgbW9udGggPD0gMzEpIHtcbiAgICAgICAgICAgICAgICAgICAgW2RheSwgbW9udGhdID0gW21vbnRoLCBkYXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkYXkgPCAxIHx8IGRheSA+IDMxKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwiZGF5XCIsIGRheSk7XG4gICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJtb250aFwiLCBtb250aCk7XG4gICAgICAgIGlmIChtYXRjaFtZRUFSX0dST1VQXSkge1xuICAgICAgICAgICAgY29uc3QgcmF3WWVhck51bWJlciA9IHBhcnNlSW50KG1hdGNoW1lFQVJfR1JPVVBdKTtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSB5ZWFyc18xLmZpbmRNb3N0TGlrZWx5QURZZWFyKHJhd1llYXJOdW1iZXIpO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIGRheSwgbW9udGgpO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcmVzdWx0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3Jlc3VsdHNcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCB0aW1ldW5pdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy90aW1ldW5pdHNcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChgKHRoaXN8bGFzdHxwYXN0fG5leHR8XFxcXCt8LSlcXFxccyooJHtjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk59KSg/PVxcXFxXfCQpYCwgXCJpXCIpO1xuY2xhc3MgRU5UaW1lVW5pdENhc3VhbFJlbGF0aXZlRm9ybWF0UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBwcmVmaXggPSBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgdGltZVVuaXRzID0gY29uc3RhbnRzXzEucGFyc2VUaW1lVW5pdHMobWF0Y2hbMl0pO1xuICAgICAgICBzd2l0Y2ggKHByZWZpeCkge1xuICAgICAgICAgICAgY2FzZSBcImxhc3RcIjpcbiAgICAgICAgICAgIGNhc2UgXCJwYXN0XCI6XG4gICAgICAgICAgICBjYXNlIFwiLVwiOlxuICAgICAgICAgICAgICAgIHRpbWVVbml0cyA9IHRpbWV1bml0c18xLnJldmVyc2VUaW1lVW5pdHModGltZVVuaXRzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzLmNyZWF0ZVJlbGF0aXZlRnJvbVJlZkRhdGUoY29udGV4dC5yZWZEYXRlLCB0aW1lVW5pdHMpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOVGltZVVuaXRDYXN1YWxSZWxhdGl2ZUZvcm1hdFBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gZXhwb3J0cy5wYXJzZURhdGUgPSBleHBvcnRzLnBhcnNlID0gZXhwb3J0cy5HQiA9IGV4cG9ydHMuc3RyaWN0ID0gZXhwb3J0cy5jYXN1YWwgPSB2b2lkIDA7XG5jb25zdCBFTlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IEVOTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlclwiKSk7XG5jb25zdCBFTk1vbnRoTmFtZU1pZGRsZUVuZGlhblBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5Nb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXJcIikpO1xuY29uc3QgRU5Nb250aE5hbWVQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0VOTW9udGhOYW1lUGFyc2VyXCIpKTtcbmNvbnN0IEVOQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTkNhc3VhbFllYXJNb250aERheVBhcnNlclwiKSk7XG5jb25zdCBFTlNsYXNoTW9udGhGb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0VOU2xhc2hNb250aEZvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBFTlRpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTlRpbWVFeHByZXNzaW9uUGFyc2VyXCIpKTtcbmNvbnN0IEVOVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0VOVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgRU5UaW1lVW5pdExhdGVyRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTlRpbWVVbml0TGF0ZXJGb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgRU5NZXJnZURhdGVSYW5nZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWZpbmVycy9FTk1lcmdlRGF0ZVJhbmdlUmVmaW5lclwiKSk7XG5jb25zdCBFTk1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVmaW5lcnMvRU5NZXJnZURhdGVUaW1lUmVmaW5lclwiKSk7XG5jb25zdCBjb25maWd1cmF0aW9uc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbmZpZ3VyYXRpb25zXCIpO1xuY29uc3QgRU5DYXN1YWxEYXRlUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTkNhc3VhbERhdGVQYXJzZXJcIikpO1xuY29uc3QgRU5DYXN1YWxUaW1lUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTkNhc3VhbFRpbWVQYXJzZXJcIikpO1xuY29uc3QgRU5XZWVrZGF5UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTldlZWtkYXlQYXJzZXJcIikpO1xuY29uc3QgRU5SZWxhdGl2ZURhdGVGb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0VOUmVsYXRpdmVEYXRlRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IGNocm9ub18xID0gcmVxdWlyZShcIi4uLy4uL2Nocm9ub1wiKTtcbmNvbnN0IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9jb21tb24vcGFyc2Vycy9TbGFzaERhdGVGb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgRU5UaW1lVW5pdENhc3VhbFJlbGF0aXZlRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTlRpbWVVbml0Q2FzdWFsUmVsYXRpdmVGb3JtYXRQYXJzZXJcIikpO1xuZXhwb3J0cy5jYXN1YWwgPSBuZXcgY2hyb25vXzEuQ2hyb25vKGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24oZmFsc2UpKTtcbmV4cG9ydHMuc3RyaWN0ID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDb25maWd1cmF0aW9uKHRydWUsIGZhbHNlKSk7XG5leHBvcnRzLkdCID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDb25maWd1cmF0aW9uKGZhbHNlLCB0cnVlKSk7XG5mdW5jdGlvbiBwYXJzZSh0ZXh0LCByZWYsIG9wdGlvbikge1xuICAgIHJldHVybiBleHBvcnRzLmNhc3VhbC5wYXJzZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5mdW5jdGlvbiBwYXJzZURhdGUodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKTtcbn1cbmV4cG9ydHMucGFyc2VEYXRlID0gcGFyc2VEYXRlO1xuZnVuY3Rpb24gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbihsaXR0bGVFbmRpYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IG9wdGlvbiA9IGNyZWF0ZUNvbmZpZ3VyYXRpb24oZmFsc2UsIGxpdHRsZUVuZGlhbik7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgRU5DYXN1YWxEYXRlUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICBvcHRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBFTkNhc3VhbFRpbWVQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IEVOTW9udGhOYW1lUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICBvcHRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBFTlJlbGF0aXZlRGF0ZUZvcm1hdFBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgRU5UaW1lVW5pdENhc3VhbFJlbGF0aXZlRm9ybWF0UGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICByZXR1cm4gb3B0aW9uO1xufVxuZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbjtcbmZ1bmN0aW9uIGNyZWF0ZUNvbmZpZ3VyYXRpb24oc3RyaWN0TW9kZSA9IHRydWUsIGxpdHRsZUVuZGlhbiA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIGNvbmZpZ3VyYXRpb25zXzEuaW5jbHVkZUNvbW1vbkNvbmZpZ3VyYXRpb24oe1xuICAgICAgICBwYXJzZXJzOiBbXG4gICAgICAgICAgICBuZXcgU2xhc2hEYXRlRm9ybWF0UGFyc2VyXzEuZGVmYXVsdChsaXR0bGVFbmRpYW4pLFxuICAgICAgICAgICAgbmV3IEVOVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgRU5Nb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgRU5Nb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgRU5XZWVrZGF5UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IEVOQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IEVOU2xhc2hNb250aEZvcm1hdFBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBFTlRpbWVFeHByZXNzaW9uUGFyc2VyXzEuZGVmYXVsdChzdHJpY3RNb2RlKSxcbiAgICAgICAgICAgIG5ldyBFTlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyXzEuZGVmYXVsdChzdHJpY3RNb2RlKSxcbiAgICAgICAgICAgIG5ldyBFTlRpbWVVbml0TGF0ZXJGb3JtYXRQYXJzZXJfMS5kZWZhdWx0KHN0cmljdE1vZGUpLFxuICAgICAgICBdLFxuICAgICAgICByZWZpbmVyczogW25ldyBFTk1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEuZGVmYXVsdCgpLCBuZXcgRU5NZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0KCldLFxuICAgIH0sIHN0cmljdE1vZGUpO1xufVxuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJcIik7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY2xhc3MgREVUaW1lRXhwcmVzc2lvblBhcnNlciBleHRlbmRzIEFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJfMS5BYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyIHtcbiAgICBwcmltYXJ5UHJlZml4KCkge1xuICAgICAgICByZXR1cm4gXCIoPzooPzp1bXx2b24pXFxcXHMqKT9cIjtcbiAgICB9XG4gICAgZm9sbG93aW5nUGhhc2UoKSB7XG4gICAgICAgIHJldHVybiBcIlxcXFxzKig/OlxcXFwtfFxcXFzigJN8XFxcXH58XFxcXOOAnHxiaXMpXFxcXHMqXCI7XG4gICAgfVxuICAgIHByaW1hcnlTdWZmaXgoKSB7XG4gICAgICAgIHJldHVybiBcIig/OlxcXFxzKnVocik/KD86XFxcXHMqKD86bW9yZ2Vuc3x2b3JtaXR0YWdzfG5hY2htaXR0YWdzfGFiZW5kc3xuYWNodHMpKT8oPz1cXFxcV3wkKVwiO1xuICAgIH1cbiAgICBleHRyYWN0UHJpbWFyeVRpbWVDb21wb25lbnRzKGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBzdXBlci5leHRyYWN0UHJpbWFyeVRpbWVDb21wb25lbnRzKGNvbnRleHQsIG1hdGNoKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaFswXS5lbmRzV2l0aChcIm1vcmdlbnNcIikgfHwgbWF0Y2hbMF0uZW5kc1dpdGgoXCJ2b3JtaXR0YWdzXCIpKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb25zdCBob3VyID0gY29tcG9uZW50cy5nZXQoXCJob3VyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoWzBdLmVuZHNXaXRoKFwibmFjaG1pdHRhZ3NcIikgfHwgbWF0Y2hbMF0uZW5kc1dpdGgoXCJhYmVuZHNcIikgfHwgbWF0Y2hbMF0uZW5kc1dpdGgoXCJuYWNodHNcIikpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhvdXIgPSBjb21wb25lbnRzLmdldChcImhvdXJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcImhvdXJcIiwgY29tcG9uZW50cy5nZXQoXCJob3VyXCIpICsgMTIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50cztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBERVRpbWVFeHByZXNzaW9uUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlVGltZVVuaXRzID0gZXhwb3J0cy5USU1FX1VOSVRTX1BBVFRFUk4gPSBleHBvcnRzLnBhcnNlWWVhciA9IGV4cG9ydHMuWUVBUl9QQVRURVJOID0gZXhwb3J0cy5wYXJzZU51bWJlclBhdHRlcm4gPSBleHBvcnRzLk5VTUJFUl9QQVRURVJOID0gZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWSA9IGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkgPSBleHBvcnRzLk1PTlRIX0RJQ1RJT05BUlkgPSBleHBvcnRzLldFRUtEQVlfRElDVElPTkFSWSA9IHZvaWQgMDtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgeWVhcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jYWxjdWxhdGlvbi95ZWFyc1wiKTtcbmV4cG9ydHMuV0VFS0RBWV9ESUNUSU9OQVJZID0ge1xuICAgIFwic29ubnRhZ1wiOiAwLFxuICAgIFwic29cIjogMCxcbiAgICBcIm1vbnRhZ1wiOiAxLFxuICAgIFwibW9cIjogMSxcbiAgICBcImRpZW5zdGFnXCI6IDIsXG4gICAgXCJkaVwiOiAyLFxuICAgIFwibWl0dHdvY2hcIjogMyxcbiAgICBcIm1pXCI6IDMsXG4gICAgXCJkb25uZXJzdGFnXCI6IDQsXG4gICAgXCJkb1wiOiA0LFxuICAgIFwiZnJlaXRhZ1wiOiA1LFxuICAgIFwiZnJcIjogNSxcbiAgICBcInNhbXN0YWdcIjogNixcbiAgICBcInNhXCI6IDYsXG59O1xuZXhwb3J0cy5NT05USF9ESUNUSU9OQVJZID0ge1xuICAgIFwiamFudWFyXCI6IDEsXG4gICAgXCJqYW5cIjogMSxcbiAgICBcImphbi5cIjogMSxcbiAgICBcImZlYnJ1YXJcIjogMixcbiAgICBcImZlYlwiOiAyLFxuICAgIFwiZmViLlwiOiAyLFxuICAgIFwibcOkcnpcIjogMyxcbiAgICBcIm1hZXJ6XCI6IDMsXG4gICAgXCJtw6RyXCI6IDMsXG4gICAgXCJtw6RyLlwiOiAzLFxuICAgIFwibXJ6XCI6IDMsXG4gICAgXCJtcnouXCI6IDMsXG4gICAgXCJhcHJpbFwiOiA0LFxuICAgIFwiYXByXCI6IDQsXG4gICAgXCJhcHIuXCI6IDQsXG4gICAgXCJtYWlcIjogNSxcbiAgICBcImp1bmlcIjogNixcbiAgICBcImp1blwiOiA2LFxuICAgIFwianVuLlwiOiA2LFxuICAgIFwianVsaVwiOiA3LFxuICAgIFwianVsXCI6IDcsXG4gICAgXCJqdWwuXCI6IDcsXG4gICAgXCJhdWd1c3RcIjogOCxcbiAgICBcImF1Z1wiOiA4LFxuICAgIFwiYXVnLlwiOiA4LFxuICAgIFwic2VwdGVtYmVyXCI6IDksXG4gICAgXCJzZXBcIjogOSxcbiAgICBcInNlcC5cIjogOSxcbiAgICBcInNlcHRcIjogOSxcbiAgICBcInNlcHQuXCI6IDksXG4gICAgXCJva3RvYmVyXCI6IDEwLFxuICAgIFwib2t0XCI6IDEwLFxuICAgIFwib2t0LlwiOiAxMCxcbiAgICBcIm5vdmVtYmVyXCI6IDExLFxuICAgIFwibm92XCI6IDExLFxuICAgIFwibm92LlwiOiAxMSxcbiAgICBcImRlemVtYmVyXCI6IDEyLFxuICAgIFwiZGV6XCI6IDEyLFxuICAgIFwiZGV6LlwiOiAxMixcbn07XG5leHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZID0ge1xuICAgIFwiZWluc1wiOiAxLFxuICAgIFwiendlaVwiOiAyLFxuICAgIFwiZHJlaVwiOiAzLFxuICAgIFwidmllclwiOiA0LFxuICAgIFwiZsO8bmZcIjogNSxcbiAgICBcImZ1ZW5mXCI6IDUsXG4gICAgXCJzZWNoc1wiOiA2LFxuICAgIFwic2llYmVuXCI6IDcsXG4gICAgXCJhY2h0XCI6IDgsXG4gICAgXCJuZXVuXCI6IDksXG4gICAgXCJ6ZWhuXCI6IDEwLFxuICAgIFwiZWxmXCI6IDExLFxuICAgIFwienfDtmxmXCI6IDEyLFxuICAgIFwiendvZWxmXCI6IDEyLFxufTtcbmV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUlkgPSB7XG4gICAgc2VjOiBcInNlY29uZFwiLFxuICAgIHNlY29uZDogXCJzZWNvbmRcIixcbiAgICBzZWNvbmRzOiBcInNlY29uZFwiLFxuICAgIG1pbjogXCJtaW51dGVcIixcbiAgICBtaW5zOiBcIm1pbnV0ZVwiLFxuICAgIG1pbnV0ZTogXCJtaW51dGVcIixcbiAgICBtaW51dGVzOiBcIm1pbnV0ZVwiLFxuICAgIGg6IFwiaG91clwiLFxuICAgIGhyOiBcImhvdXJcIixcbiAgICBocnM6IFwiaG91clwiLFxuICAgIGhvdXI6IFwiaG91clwiLFxuICAgIGhvdXJzOiBcImhvdXJcIixcbiAgICBkYXk6IFwiZFwiLFxuICAgIGRheXM6IFwiZFwiLFxuICAgIHdlZWs6IFwid2Vla1wiLFxuICAgIHdlZWtzOiBcIndlZWtcIixcbiAgICBtb250aDogXCJtb250aFwiLFxuICAgIG1vbnRoczogXCJtb250aFwiLFxuICAgIHk6IFwieWVhclwiLFxuICAgIHlyOiBcInllYXJcIixcbiAgICB5ZWFyOiBcInllYXJcIixcbiAgICB5ZWFyczogXCJ5ZWFyXCIsXG59O1xuZXhwb3J0cy5OVU1CRVJfUEFUVEVSTiA9IGAoPzoke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWSl9fFswLTldK3xbMC05XStcXFxcLlswLTldK3xoYWxmKD86XFxcXHMqYW4/KT98YW4/KD86XFxcXHMqZmV3KT98ZmV3fHNldmVyYWx8YT9cXFxccypjb3VwbGVcXFxccyooPzpvZik/KWA7XG5mdW5jdGlvbiBwYXJzZU51bWJlclBhdHRlcm4obWF0Y2gpIHtcbiAgICBjb25zdCBudW0gPSBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZW251bV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWVtudW1dO1xuICAgIH1cbiAgICBlbHNlIGlmIChudW0gPT09IFwiYVwiIHx8IG51bSA9PT0gXCJhblwiKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICBlbHNlIGlmIChudW0ubWF0Y2goL2Zldy8pKSB7XG4gICAgICAgIHJldHVybiAzO1xuICAgIH1cbiAgICBlbHNlIGlmIChudW0ubWF0Y2goL2hhbGYvKSkge1xuICAgICAgICByZXR1cm4gMC41O1xuICAgIH1cbiAgICBlbHNlIGlmIChudW0ubWF0Y2goL2NvdXBsZS8pKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1cbiAgICBlbHNlIGlmIChudW0ubWF0Y2goL3NldmVyYWwvKSkge1xuICAgICAgICByZXR1cm4gNztcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobnVtKTtcbn1cbmV4cG9ydHMucGFyc2VOdW1iZXJQYXR0ZXJuID0gcGFyc2VOdW1iZXJQYXR0ZXJuO1xuZXhwb3J0cy5ZRUFSX1BBVFRFUk4gPSBgKD86WzAtOV17MSw0fSg/OlxcXFxzKlt2bl1cXFxcLj9cXFxccypDKD86aHIpP1xcXFwuPyk/KWA7XG5mdW5jdGlvbiBwYXJzZVllYXIobWF0Y2gpIHtcbiAgICBpZiAoL3YvaS50ZXN0KG1hdGNoKSkge1xuICAgICAgICByZXR1cm4gLXBhcnNlSW50KG1hdGNoLnJlcGxhY2UoL1teMC05XSsvZ2ksIFwiXCIpKTtcbiAgICB9XG4gICAgaWYgKC9uL2kudGVzdChtYXRjaCkpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KG1hdGNoLnJlcGxhY2UoL1teMC05XSsvZ2ksIFwiXCIpKTtcbiAgICB9XG4gICAgY29uc3QgcmF3WWVhck51bWJlciA9IHBhcnNlSW50KG1hdGNoKTtcbiAgICByZXR1cm4geWVhcnNfMS5maW5kTW9zdExpa2VseUFEWWVhcihyYXdZZWFyTnVtYmVyKTtcbn1cbmV4cG9ydHMucGFyc2VZZWFyID0gcGFyc2VZZWFyO1xuY29uc3QgU0lOR0xFX1RJTUVfVU5JVF9QQVRURVJOID0gYCgke2V4cG9ydHMuTlVNQkVSX1BBVFRFUk59KVxcXFxzezAsNX0oJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUlkpfSlcXFxcc3swLDV9YDtcbmNvbnN0IFNJTkdMRV9USU1FX1VOSVRfUkVHRVggPSBuZXcgUmVnRXhwKFNJTkdMRV9USU1FX1VOSVRfUEFUVEVSTiwgXCJpXCIpO1xuZXhwb3J0cy5USU1FX1VOSVRTX1BBVFRFUk4gPSBwYXR0ZXJuXzEucmVwZWF0ZWRUaW1ldW5pdFBhdHRlcm4oXCJcIiwgU0lOR0xFX1RJTUVfVU5JVF9QQVRURVJOKTtcbmZ1bmN0aW9uIHBhcnNlVGltZVVuaXRzKHRpbWV1bml0VGV4dCkge1xuICAgIGNvbnN0IGZyYWdtZW50cyA9IHt9O1xuICAgIGxldCByZW1haW5pbmdUZXh0ID0gdGltZXVuaXRUZXh0O1xuICAgIGxldCBtYXRjaCA9IFNJTkdMRV9USU1FX1VOSVRfUkVHRVguZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgY29sbGVjdERhdGVUaW1lRnJhZ21lbnQoZnJhZ21lbnRzLCBtYXRjaCk7XG4gICAgICAgIHJlbWFpbmluZ1RleHQgPSByZW1haW5pbmdUZXh0LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICBtYXRjaCA9IFNJTkdMRV9USU1FX1VOSVRfUkVHRVguZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZyYWdtZW50cztcbn1cbmV4cG9ydHMucGFyc2VUaW1lVW5pdHMgPSBwYXJzZVRpbWVVbml0cztcbmZ1bmN0aW9uIGNvbGxlY3REYXRlVGltZUZyYWdtZW50KGZyYWdtZW50cywgbWF0Y2gpIHtcbiAgICBjb25zdCBudW0gPSBwYXJzZU51bWJlclBhdHRlcm4obWF0Y2hbMV0pO1xuICAgIGNvbnN0IHVuaXQgPSBleHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZW21hdGNoWzJdLnRvTG93ZXJDYXNlKCldO1xuICAgIGZyYWdtZW50c1t1bml0XSA9IG51bTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCB3ZWVrc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3dlZWtzXCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoPzooPzpcXFxcLHxcXFxcKHxcXFxc77yIKVxcXFxzKik/XCIgK1xuICAgIFwiKD86YVttbl1cXFxccyo/KT9cIiArXG4gICAgXCIoPzooZGllc2VbbW5dfGxldHp0ZVttbl18big/OsOkfGFlKWNoc3RlW21uXSlcXFxccyopP1wiICtcbiAgICBgKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5XRUVLREFZX0RJQ1RJT05BUlkpfSlgICtcbiAgICBcIig/OlxcXFxzKig/OlxcXFwsfFxcXFwpfFxcXFzvvIkpKT9cIiArXG4gICAgXCIoPzpcXFxccyooZGllc2V8bGV0enRlfG4oPzrDpHxhZSljaHN0ZSlcXFxccyp3b2NoZSk/XCIgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgUFJFRklYX0dST1VQID0gMTtcbmNvbnN0IFNVRkZJWF9HUk9VUCA9IDM7XG5jb25zdCBXRUVLREFZX0dST1VQID0gMjtcbmNsYXNzIERFV2Vla2RheVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgZGF5T2ZXZWVrID0gbWF0Y2hbV0VFS0RBWV9HUk9VUF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29uc3RhbnRzXzEuV0VFS0RBWV9ESUNUSU9OQVJZW2RheU9mV2Vla107XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IG1hdGNoW1BSRUZJWF9HUk9VUF07XG4gICAgICAgIGNvbnN0IHBvc3RmaXggPSBtYXRjaFtTVUZGSVhfR1JPVVBdO1xuICAgICAgICBsZXQgbW9kaWZpZXJXb3JkID0gcHJlZml4IHx8IHBvc3RmaXg7XG4gICAgICAgIG1vZGlmaWVyV29yZCA9IG1vZGlmaWVyV29yZCB8fCBcIlwiO1xuICAgICAgICBtb2RpZmllcldvcmQgPSBtb2RpZmllcldvcmQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IG1vZGlmaWVyID0gbnVsbDtcbiAgICAgICAgaWYgKG1vZGlmaWVyV29yZC5tYXRjaCgvbGV0enRlLykpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJsYXN0XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW9kaWZpZXJXb3JkLm1hdGNoKC9jaHN0ZS8pKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwibmV4dFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vZGlmaWVyV29yZC5tYXRjaCgvZGllc2UvKSkge1xuICAgICAgICAgICAgbW9kaWZpZXIgPSBcInRoaXNcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRlID0gd2Vla3NfMS50b0RheUpTV2Vla2RheShjb250ZXh0LnJlZkRhdGUsIG9mZnNldCwgbW9kaWZpZXIpO1xuICAgICAgICByZXR1cm4gY29udGV4dFxuICAgICAgICAgICAgLmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKClcbiAgICAgICAgICAgIC5hc3NpZ24oXCJ3ZWVrZGF5XCIsIG9mZnNldClcbiAgICAgICAgICAgIC5pbXBseShcImRheVwiLCBkYXRlLmRhdGUoKSlcbiAgICAgICAgICAgIC5pbXBseShcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpXG4gICAgICAgICAgICAuaW1wbHkoXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBERVdlZWtkYXlQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9yZWZpbmVycy9BYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lclwiKSk7XG5jbGFzcyBERU1lcmdlRGF0ZVJhbmdlUmVmaW5lciBleHRlbmRzIEFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCB7XG4gICAgcGF0dGVybkJldHdlZW4oKSB7XG4gICAgICAgIHJldHVybiAvXlxccyooYmlzKD86XFxzKig/OmFtfHp1bSkpP3wtKVxccyokL2k7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gREVNZXJnZURhdGVSYW5nZVJlZmluZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0TWVyZ2VEYXRlVGltZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3JlZmluZXJzL0Fic3RyYWN0TWVyZ2VEYXRlVGltZVJlZmluZXJcIikpO1xuY2xhc3MgREVNZXJnZURhdGVUaW1lUmVmaW5lciBleHRlbmRzIEFic3RyYWN0TWVyZ2VEYXRlVGltZVJlZmluZXJfMS5kZWZhdWx0IHtcbiAgICBwYXR0ZXJuQmV0d2VlbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoXCJeXFxcXHMqKFR8dW18YW18LHwtKT9cXFxccyokXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IERFTWVyZ2VEYXRlVGltZVJlZmluZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGRheWpzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW5kZXhcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBkYXlqc18yID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL2RheWpzXCIpO1xuY29uc3QgdGltZXVuaXRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvdGltZXVuaXRzXCIpO1xuY2xhc3MgREVDYXN1YWxUaW1lUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybihjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiAvKGRpZXNlbik/XFxzKihtb3JnZW58dm9ybWl0dGFnfG1pdHRhZ3M/fG5hY2htaXR0YWd8YWJlbmR8bmFjaHR8bWl0dGVybmFjaHQpKD89XFxXfCQpL2k7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB0YXJnZXREYXRlID0gZGF5anNfMS5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIGNvbnN0IHRpbWVLZXl3b3JkUGF0dGVybiA9IG1hdGNoWzJdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKTtcbiAgICAgICAgZGF5anNfMi5pbXBseVNpbWlsYXJUaW1lKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgIHJldHVybiBERUNhc3VhbFRpbWVQYXJzZXIuZXh0cmFjdFRpbWVDb21wb25lbnRzKGNvbXBvbmVudCwgdGltZUtleXdvcmRQYXR0ZXJuKTtcbiAgICB9XG4gICAgc3RhdGljIGV4dHJhY3RUaW1lQ29tcG9uZW50cyhjb21wb25lbnQsIHRpbWVLZXl3b3JkUGF0dGVybikge1xuICAgICAgICBzd2l0Y2ggKHRpbWVLZXl3b3JkUGF0dGVybikge1xuICAgICAgICAgICAgY2FzZSBcIm1vcmdlblwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgNik7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWludXRlXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcInNlY29uZFwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ2b3JtaXR0YWdcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDkpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJzZWNvbmRcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWl0dGFnXCI6XG4gICAgICAgICAgICBjYXNlIFwibWl0dGFnc1wiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTIpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJzZWNvbmRcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibmFjaG1pdHRhZ1wiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTUpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJzZWNvbmRcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiYWJlbmRcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDE4KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm5hY2h0XCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAyMik7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWludXRlXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcInNlY29uZFwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtaXR0ZXJuYWNodFwiOlxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuZ2V0KFwiaG91clwiKSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gdGltZXVuaXRzXzEuYWRkSW1wbGllZFRpbWVVbml0cyhjb21wb25lbnQsIHsgXCJkYXlcIjogMSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gREVDYXN1YWxUaW1lUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGRheWpzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IGRheWpzXzIgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvZGF5anNcIik7XG5jb25zdCBERUNhc3VhbFRpbWVQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9ERUNhc3VhbFRpbWVQYXJzZXJcIikpO1xuY29uc3QgcmVmZXJlbmNlcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2Nhc3VhbFJlZmVyZW5jZXNcIikpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoYChqZXR6dHxoZXV0ZXxtb3JnZW58w7xiZXJtb3JnZW58dWViZXJtb3JnZW58Z2VzdGVybnx2b3JnZXN0ZXJufGxldHp0ZVxcXFxzKm5hY2h0KWAgK1xuICAgIGAoPzpcXFxccyoobW9yZ2VufHZvcm1pdHRhZ3xtaXR0YWdzP3xuYWNobWl0dGFnfGFiZW5kfG5hY2h0fG1pdHRlcm5hY2h0KSk/YCArXG4gICAgYCg/PVxcXFxXfCQpYCwgXCJpXCIpO1xuY29uc3QgREFURV9HUk9VUCA9IDE7XG5jb25zdCBUSU1FX0dST1VQID0gMjtcbmNsYXNzIERFQ2FzdWFsRGF0ZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGxldCB0YXJnZXREYXRlID0gZGF5anNfMS5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIGNvbnN0IGRhdGVLZXl3b3JkID0gKG1hdGNoW0RBVEVfR1JPVVBdIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IHRpbWVLZXl3b3JkID0gKG1hdGNoW1RJTUVfR1JPVVBdIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBjb21wb25lbnQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIHN3aXRjaCAoZGF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgIGNhc2UgXCJqZXR6dFwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IHJlZmVyZW5jZXMubm93KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiaGV1dGVcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQgPSByZWZlcmVuY2VzLnRvZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibW9yZ2VuXCI6XG4gICAgICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25UaGVOZXh0RGF5KGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiw7xiZXJtb3JnZW5cIjpcbiAgICAgICAgICAgIGNhc2UgXCJ1ZWJlcm1vcmdlblwiOlxuICAgICAgICAgICAgICAgIHRhcmdldERhdGUgPSB0YXJnZXREYXRlLmFkZCgxLCBcImRheVwiKTtcbiAgICAgICAgICAgICAgICBkYXlqc18yLmFzc2lnblRoZU5leHREYXkoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJnZXN0ZXJuXCI6XG4gICAgICAgICAgICAgICAgdGFyZ2V0RGF0ZSA9IHRhcmdldERhdGUuYWRkKC0xLCBcImRheVwiKTtcbiAgICAgICAgICAgICAgICBkYXlqc18yLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgZGF5anNfMi5pbXBseVNpbWlsYXJUaW1lKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidm9yZ2VzdGVyblwiOlxuICAgICAgICAgICAgICAgIHRhcmdldERhdGUgPSB0YXJnZXREYXRlLmFkZCgtMiwgXCJkYXlcIik7XG4gICAgICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25TaW1pbGFyRGF0ZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICAgICAgICAgIGRheWpzXzIuaW1wbHlTaW1pbGFyVGltZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZUtleXdvcmQubWF0Y2goL2xldHp0ZVxccypuYWNodC8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXREYXRlLmhvdXIoKSA+IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERhdGUgPSB0YXJnZXREYXRlLmFkZCgtMSwgXCJkYXlcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25TaW1pbGFyRGF0ZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGltZUtleXdvcmQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudCA9IERFQ2FzdWFsVGltZVBhcnNlcl8xLmRlZmF1bHQuZXh0cmFjdFRpbWVDb21wb25lbnRzKGNvbXBvbmVudCwgdGltZUtleXdvcmQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gREVDYXN1YWxEYXRlUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgY29uc3RhbnRzXzIgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIig/OmFtXFxcXHMqPyk/XCIgK1xuICAgIFwiKD86ZGVuXFxcXHMqPyk/XCIgK1xuICAgIGAoWzAtOV17MSwyfSlcXFxcLmAgK1xuICAgIGAoPzpcXFxccyooPzpiaXMoPzpcXFxccyooPzphbXx6dW0pKT98XFxcXC18XFxcXOKAk3xcXFxccylcXFxccyooWzAtOV17MSwyfSlcXFxcLj8pP1xcXFxzKmAgK1xuICAgIGAoJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUlkpfSlgICtcbiAgICBgKD86KD86LXwvfCw/XFxcXHMqKSgke2NvbnN0YW50c18yLllFQVJfUEFUVEVSTn0oPyFbXlxcXFxzXVxcXFxkKSkpP2AgK1xuICAgIGAoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbmNvbnN0IERBVEVfR1JPVVAgPSAxO1xuY29uc3QgREFURV9UT19HUk9VUCA9IDI7XG5jb25zdCBNT05USF9OQU1FX0dST1VQID0gMztcbmNvbnN0IFlFQVJfR1JPVVAgPSA0O1xuY2xhc3MgREVNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ1Jlc3VsdChtYXRjaC5pbmRleCwgbWF0Y2hbMF0pO1xuICAgICAgICBjb25zdCBtb250aCA9IGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUllbbWF0Y2hbTU9OVEhfTkFNRV9HUk9VUF0udG9Mb3dlckNhc2UoKV07XG4gICAgICAgIGNvbnN0IGRheSA9IHBhcnNlSW50KG1hdGNoW0RBVEVfR1JPVVBdKTtcbiAgICAgICAgaWYgKGRheSA+IDMxKSB7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbREFURV9HUk9VUF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcIm1vbnRoXCIsIG1vbnRoKTtcbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcImRheVwiLCBkYXkpO1xuICAgICAgICBpZiAobWF0Y2hbWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXJOdW1iZXIgPSBjb25zdGFudHNfMi5wYXJzZVllYXIobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcInllYXJcIiwgeWVhck51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIGRheSwgbW9udGgpO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbREFURV9UT19HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGVuZERhdGUgPSBwYXJzZUludChtYXRjaFtEQVRFX1RPX0dST1VQXSk7XG4gICAgICAgICAgICByZXN1bHQuZW5kID0gcmVzdWx0LnN0YXJ0LmNsb25lKCk7XG4gICAgICAgICAgICByZXN1bHQuZW5kLmFzc2lnbihcImRheVwiLCBlbmREYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IERFTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUNvbmZpZ3VyYXRpb24gPSBleHBvcnRzLmNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24gPSBleHBvcnRzLnBhcnNlRGF0ZSA9IGV4cG9ydHMucGFyc2UgPSBleHBvcnRzLnN0cmljdCA9IGV4cG9ydHMuY2FzdWFsID0gdm9pZCAwO1xuY29uc3QgY29uZmlndXJhdGlvbnNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb25maWd1cmF0aW9uc1wiKTtcbmNvbnN0IGNocm9ub18xID0gcmVxdWlyZShcIi4uLy4uL2Nocm9ub1wiKTtcbmNvbnN0IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9jb21tb24vcGFyc2Vycy9TbGFzaERhdGVGb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgSVNPRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uL2NvbW1vbi9wYXJzZXJzL0lTT0Zvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBERVRpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9ERVRpbWVFeHByZXNzaW9uUGFyc2VyXCIpKTtcbmNvbnN0IERFV2Vla2RheVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvREVXZWVrZGF5UGFyc2VyXCIpKTtcbmNvbnN0IERFTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVmaW5lcnMvREVNZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY29uc3QgREVNZXJnZURhdGVUaW1lUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JlZmluZXJzL0RFTWVyZ2VEYXRlVGltZVJlZmluZXJcIikpO1xuY29uc3QgREVDYXN1YWxEYXRlUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9ERUNhc3VhbERhdGVQYXJzZXJcIikpO1xuY29uc3QgREVDYXN1YWxUaW1lUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9ERUNhc3VhbFRpbWVQYXJzZXJcIikpO1xuY29uc3QgREVNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0RFTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXCIpKTtcbmV4cG9ydHMuY2FzdWFsID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uKCkpO1xuZXhwb3J0cy5zdHJpY3QgPSBuZXcgY2hyb25vXzEuQ2hyb25vKGNyZWF0ZUNvbmZpZ3VyYXRpb24odHJ1ZSkpO1xuZnVuY3Rpb24gcGFyc2UodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2UodGV4dCwgcmVmLCBvcHRpb24pO1xufVxuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuZnVuY3Rpb24gcGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY2FzdWFsLnBhcnNlRGF0ZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlRGF0ZSA9IHBhcnNlRGF0ZTtcbmZ1bmN0aW9uIGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24obGl0dGxlRW5kaWFuID0gdHJ1ZSkge1xuICAgIGNvbnN0IG9wdGlvbiA9IGNyZWF0ZUNvbmZpZ3VyYXRpb24oZmFsc2UsIGxpdHRsZUVuZGlhbik7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgREVDYXN1YWxUaW1lUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICBvcHRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBERUNhc3VhbERhdGVQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIHJldHVybiBvcHRpb247XG59XG5leHBvcnRzLmNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24gPSBjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uO1xuZnVuY3Rpb24gY3JlYXRlQ29uZmlndXJhdGlvbihzdHJpY3RNb2RlID0gdHJ1ZSwgbGl0dGxlRW5kaWFuID0gdHJ1ZSkge1xuICAgIHJldHVybiBjb25maWd1cmF0aW9uc18xLmluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uKHtcbiAgICAgICAgcGFyc2VyczogW1xuICAgICAgICAgICAgbmV3IElTT0Zvcm1hdFBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBTbGFzaERhdGVGb3JtYXRQYXJzZXJfMS5kZWZhdWx0KGxpdHRsZUVuZGlhbiksXG4gICAgICAgICAgICBuZXcgREVUaW1lRXhwcmVzc2lvblBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBERU1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBERVdlZWtkYXlQYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgIF0sXG4gICAgICAgIHJlZmluZXJzOiBbbmV3IERFTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCgpLCBuZXcgREVNZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQoKV0sXG4gICAgfSwgc3RyaWN0TW9kZSk7XG59XG5leHBvcnRzLmNyZWF0ZUNvbmZpZ3VyYXRpb24gPSBjcmVhdGVDb25maWd1cmF0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGRheWpzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW5kZXhcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBkYXlqc18yID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL2RheWpzXCIpO1xuY29uc3QgcmVmZXJlbmNlcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2Nhc3VhbFJlZmVyZW5jZXNcIikpO1xuY2xhc3MgRlJDYXN1YWxEYXRlUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybihjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiAvKG1haW50ZW5hbnR8YXVqb3VyZCdodWl8ZGVtYWlufGhpZXJ8Y2V0dGVcXHMqbnVpdHxsYVxccyp2ZWlsbGUpKD89XFxXfCQpL2k7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBsZXQgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICBjb25zdCBsb3dlclRleHQgPSBtYXRjaFswXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIHN3aXRjaCAobG93ZXJUZXh0KSB7XG4gICAgICAgICAgICBjYXNlIFwibWFpbnRlbmFudFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLm5vdyhjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcImF1am91cmQnaHVpXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMudG9kYXkoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCJoaWVyXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMueWVzdGVyZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwiZGVtYWluXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMudG9tb3Jyb3coY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKGxvd2VyVGV4dC5tYXRjaCgvY2V0dGVcXHMqbnVpdC8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAyMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsb3dlclRleHQubWF0Y2goL2xhXFxzKnZlaWxsZS8pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldERhdGUgPSB0YXJnZXREYXRlLmFkZCgtMSwgXCJkYXlcIik7XG4gICAgICAgICAgICAgICAgICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUkNhc3VhbERhdGVQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW5kZXhcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jbGFzcyBGUkNhc3VhbFRpbWVQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIC8oY2V0Pyk/XFxzKihtYXRpbnxzb2lyfGFwcsOocy1taWRpfGFwcmVtfGEgbWlkaXzDoCBtaW51aXQpKD89XFxXfCQpL2k7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBzdWZmaXhMb3dlciA9IG1hdGNoWzJdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKTtcbiAgICAgICAgc3dpdGNoIChzdWZmaXhMb3dlcikge1xuICAgICAgICAgICAgY2FzZSBcImFwcsOocy1taWRpXCI6XG4gICAgICAgICAgICBjYXNlIFwiYXByZW1cIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDE0KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic29pclwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTgpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtYXRpblwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgOCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWludXRlXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImEgbWlkaVwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTIpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCLDoCBtaW51aXRcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRlJDYXN1YWxUaW1lUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlclwiKTtcbmNsYXNzIEZSVGltZUV4cHJlc3Npb25QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXzEuQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlciB7XG4gICAgcHJpbWFyeVByZWZpeCgpIHtcbiAgICAgICAgcmV0dXJuIFwiKD86KD86W8OgYV0pXFxcXHMqKT9cIjtcbiAgICB9XG4gICAgZm9sbG93aW5nUGhhc2UoKSB7XG4gICAgICAgIHJldHVybiBcIlxcXFxzKig/OlxcXFwtfFxcXFzigJN8XFxcXH58XFxcXOOAnHxbw6BhXXxcXFxcPylcXFxccypcIjtcbiAgICB9XG4gICAgZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBpZiAobWF0Y2hbMF0ubWF0Y2goL15cXHMqXFxkezR9XFxzKiQvKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLmV4dHJhY3RQcmltYXJ5VGltZUNvbXBvbmVudHMoY29udGV4dCwgbWF0Y2gpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEZSVGltZUV4cHJlc3Npb25QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0TWVyZ2VEYXRlVGltZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3JlZmluZXJzL0Fic3RyYWN0TWVyZ2VEYXRlVGltZVJlZmluZXJcIikpO1xuY2xhc3MgRlJNZXJnZURhdGVUaW1lUmVmaW5lciBleHRlbmRzIEFic3RyYWN0TWVyZ2VEYXRlVGltZVJlZmluZXJfMS5kZWZhdWx0IHtcbiAgICBwYXR0ZXJuQmV0d2VlbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoXCJeXFxcXHMqKFR8w6B8YXx2ZXJzfGRlfCx8LSk/XFxcXHMqJFwiKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUk1lcmdlRGF0ZVRpbWVSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY2xhc3MgRlJNZXJnZURhdGVSYW5nZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gL15cXHMqKMOgfGF8LSlcXHMqJC9pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEZSTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlVGltZVVuaXRzID0gZXhwb3J0cy5USU1FX1VOSVRTX1BBVFRFUk4gPSBleHBvcnRzLnBhcnNlWWVhciA9IGV4cG9ydHMuWUVBUl9QQVRURVJOID0gZXhwb3J0cy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuID0gZXhwb3J0cy5PUkRJTkFMX05VTUJFUl9QQVRURVJOID0gZXhwb3J0cy5wYXJzZU51bWJlclBhdHRlcm4gPSBleHBvcnRzLk5VTUJFUl9QQVRURVJOID0gZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWSA9IGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkgPSBleHBvcnRzLk1PTlRIX0RJQ1RJT05BUlkgPSBleHBvcnRzLldFRUtEQVlfRElDVElPTkFSWSA9IHZvaWQgMDtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuZXhwb3J0cy5XRUVLREFZX0RJQ1RJT05BUlkgPSB7XG4gICAgXCJkaW1hbmNoZVwiOiAwLFxuICAgIFwiZGltXCI6IDAsXG4gICAgXCJsdW5kaVwiOiAxLFxuICAgIFwibHVuXCI6IDEsXG4gICAgXCJtYXJkaVwiOiAyLFxuICAgIFwibWFyXCI6IDIsXG4gICAgXCJtZXJjcmVkaVwiOiAzLFxuICAgIFwibWVyXCI6IDMsXG4gICAgXCJqZXVkaVwiOiA0LFxuICAgIFwiamV1XCI6IDQsXG4gICAgXCJ2ZW5kcmVkaVwiOiA1LFxuICAgIFwidmVuXCI6IDUsXG4gICAgXCJzYW1lZGlcIjogNixcbiAgICBcInNhbVwiOiA2LFxufTtcbmV4cG9ydHMuTU9OVEhfRElDVElPTkFSWSA9IHtcbiAgICBcImphbnZpZXJcIjogMSxcbiAgICBcImphblwiOiAxLFxuICAgIFwiamFuLlwiOiAxLFxuICAgIFwiZsOpdnJpZXJcIjogMixcbiAgICBcImbDqXZcIjogMixcbiAgICBcImbDqXYuXCI6IDIsXG4gICAgXCJmZXZyaWVyXCI6IDIsXG4gICAgXCJmZXZcIjogMixcbiAgICBcImZldi5cIjogMixcbiAgICBcIm1hcnNcIjogMyxcbiAgICBcIm1hclwiOiAzLFxuICAgIFwibWFyLlwiOiAzLFxuICAgIFwiYXZyaWxcIjogNCxcbiAgICBcImF2clwiOiA0LFxuICAgIFwiYXZyLlwiOiA0LFxuICAgIFwibWFpXCI6IDUsXG4gICAgXCJqdWluXCI6IDYsXG4gICAgXCJqdW5cIjogNixcbiAgICBcImp1aWxsZXRcIjogNyxcbiAgICBcImp1aWxcIjogNyxcbiAgICBcImp1bFwiOiA3LFxuICAgIFwianVsLlwiOiA3LFxuICAgIFwiYW/Du3RcIjogOCxcbiAgICBcImFvdXRcIjogOCxcbiAgICBcInNlcHRlbWJyZVwiOiA5LFxuICAgIFwic2VwXCI6IDksXG4gICAgXCJzZXAuXCI6IDksXG4gICAgXCJzZXB0XCI6IDksXG4gICAgXCJzZXB0LlwiOiA5LFxuICAgIFwib2N0b2JyZVwiOiAxMCxcbiAgICBcIm9jdFwiOiAxMCxcbiAgICBcIm9jdC5cIjogMTAsXG4gICAgXCJub3ZlbWJyZVwiOiAxMSxcbiAgICBcIm5vdlwiOiAxMSxcbiAgICBcIm5vdi5cIjogMTEsXG4gICAgXCJkw6ljZW1icmVcIjogMTIsXG4gICAgXCJkZWNlbWJyZVwiOiAxMixcbiAgICBcImRlY1wiOiAxMixcbiAgICBcImRlYy5cIjogMTIsXG59O1xuZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWSA9IHtcbiAgICBcInVuXCI6IDEsXG4gICAgXCJkZXV4XCI6IDIsXG4gICAgXCJ0cm9pc1wiOiAzLFxuICAgIFwicXVhdHJlXCI6IDQsXG4gICAgXCJjaW5xXCI6IDUsXG4gICAgXCJzaXhcIjogNixcbiAgICBcInNlcHRcIjogNyxcbiAgICBcImh1aXRcIjogOCxcbiAgICBcIm5ldWZcIjogOSxcbiAgICBcImRpeFwiOiAxMCxcbiAgICBcIm9uemVcIjogMTEsXG4gICAgXCJkb3V6ZVwiOiAxMixcbiAgICBcInRyZWl6ZVwiOiAxMyxcbn07XG5leHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZID0ge1xuICAgIFwic2VjXCI6IFwic2Vjb25kXCIsXG4gICAgXCJzZWNvbmRlXCI6IFwic2Vjb25kXCIsXG4gICAgXCJzZWNvbmRlc1wiOiBcInNlY29uZFwiLFxuICAgIFwibWluXCI6IFwibWludXRlXCIsXG4gICAgXCJtaW5zXCI6IFwibWludXRlXCIsXG4gICAgXCJtaW51dGVcIjogXCJtaW51dGVcIixcbiAgICBcIm1pbnV0ZXNcIjogXCJtaW51dGVcIixcbiAgICBcImhcIjogXCJob3VyXCIsXG4gICAgXCJoclwiOiBcImhvdXJcIixcbiAgICBcImhyc1wiOiBcImhvdXJcIixcbiAgICBcImhldXJlXCI6IFwiaG91clwiLFxuICAgIFwiaGV1cmVzXCI6IFwiaG91clwiLFxuICAgIFwiam91clwiOiBcImRcIixcbiAgICBcImpvdXJzXCI6IFwiZFwiLFxuICAgIFwic2VtYWluZVwiOiBcIndlZWtcIixcbiAgICBcInNlbWFpbmVzXCI6IFwid2Vla1wiLFxuICAgIFwibW9pc1wiOiBcIm1vbnRoXCIsXG4gICAgXCJ0cmltZXN0cmVcIjogXCJxdWFydGVyXCIsXG4gICAgXCJ0cmltZXN0cmVzXCI6IFwicXVhcnRlclwiLFxuICAgIFwiYW5zXCI6IFwieWVhclwiLFxuICAgIFwiYW5uw6llXCI6IFwieWVhclwiLFxuICAgIFwiYW5uw6llc1wiOiBcInllYXJcIixcbn07XG5leHBvcnRzLk5VTUJFUl9QQVRURVJOID0gYCg/OiR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZKX18WzAtOV0rfFswLTldK1xcXFwuWzAtOV0rfHVuZT98cXVlbHF1ZXM/fGRlbWktPylgO1xuZnVuY3Rpb24gcGFyc2VOdW1iZXJQYXR0ZXJuKG1hdGNoKSB7XG4gICAgY29uc3QgbnVtID0gbWF0Y2gudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWVtudW1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUllbbnVtXTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtID09PSBcInVuZVwiIHx8IG51bSA9PT0gXCJ1blwiKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICBlbHNlIGlmIChudW0ubWF0Y2goL3F1ZWxxdWVzPy8pKSB7XG4gICAgICAgIHJldHVybiAzO1xuICAgIH1cbiAgICBlbHNlIGlmIChudW0ubWF0Y2goL2RlbWktPy8pKSB7XG4gICAgICAgIHJldHVybiAwLjU7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KG51bSk7XG59XG5leHBvcnRzLnBhcnNlTnVtYmVyUGF0dGVybiA9IHBhcnNlTnVtYmVyUGF0dGVybjtcbmV4cG9ydHMuT1JESU5BTF9OVU1CRVJfUEFUVEVSTiA9IGAoPzpbMC05XXsxLDJ9KD86ZXIpPylgO1xuZnVuY3Rpb24gcGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybihtYXRjaCkge1xuICAgIGxldCBudW0gPSBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICAgIG51bSA9IG51bS5yZXBsYWNlKC8oPzplcikkL2ksIFwiXCIpO1xuICAgIHJldHVybiBwYXJzZUludChudW0pO1xufVxuZXhwb3J0cy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuID0gcGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybjtcbmV4cG9ydHMuWUVBUl9QQVRURVJOID0gYCg/OlsxLTldWzAtOV17MCwzfVxcXFxzKig/OkFDfEFEfHBcXFxcLlxcXFxzKkMoPzpocj8pP1xcXFwuXFxcXHMqblxcXFwuKXxbMS0yXVswLTldezN9fFs1LTldWzAtOV0pYDtcbmZ1bmN0aW9uIHBhcnNlWWVhcihtYXRjaCkge1xuICAgIGlmICgvQUMvaS50ZXN0KG1hdGNoKSkge1xuICAgICAgICBtYXRjaCA9IG1hdGNoLnJlcGxhY2UoL0JDL2ksIFwiXCIpO1xuICAgICAgICByZXR1cm4gLXBhcnNlSW50KG1hdGNoKTtcbiAgICB9XG4gICAgaWYgKC9BRC9pLnRlc3QobWF0Y2gpIHx8IC9DL2kudGVzdChtYXRjaCkpIHtcbiAgICAgICAgbWF0Y2ggPSBtYXRjaC5yZXBsYWNlKC9bXlxcZF0rL2ksIFwiXCIpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQobWF0Y2gpO1xuICAgIH1cbiAgICBsZXQgeWVhck51bWJlciA9IHBhcnNlSW50KG1hdGNoKTtcbiAgICBpZiAoeWVhck51bWJlciA8IDEwMCkge1xuICAgICAgICBpZiAoeWVhck51bWJlciA+IDUwKSB7XG4gICAgICAgICAgICB5ZWFyTnVtYmVyID0geWVhck51bWJlciArIDE5MDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB5ZWFyTnVtYmVyID0geWVhck51bWJlciArIDIwMDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHllYXJOdW1iZXI7XG59XG5leHBvcnRzLnBhcnNlWWVhciA9IHBhcnNlWWVhcjtcbmNvbnN0IFNJTkdMRV9USU1FX1VOSVRfUEFUVEVSTiA9IGAoJHtleHBvcnRzLk5VTUJFUl9QQVRURVJOfSlcXFxcc3swLDV9KCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihleHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZKX0pXFxcXHN7MCw1fWA7XG5jb25zdCBTSU5HTEVfVElNRV9VTklUX1JFR0VYID0gbmV3IFJlZ0V4cChTSU5HTEVfVElNRV9VTklUX1BBVFRFUk4sIFwiaVwiKTtcbmV4cG9ydHMuVElNRV9VTklUU19QQVRURVJOID0gcGF0dGVybl8xLnJlcGVhdGVkVGltZXVuaXRQYXR0ZXJuKFwiXCIsIFNJTkdMRV9USU1FX1VOSVRfUEFUVEVSTik7XG5mdW5jdGlvbiBwYXJzZVRpbWVVbml0cyh0aW1ldW5pdFRleHQpIHtcbiAgICBjb25zdCBmcmFnbWVudHMgPSB7fTtcbiAgICBsZXQgcmVtYWluaW5nVGV4dCA9IHRpbWV1bml0VGV4dDtcbiAgICBsZXQgbWF0Y2ggPSBTSU5HTEVfVElNRV9VTklUX1JFR0VYLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgIGNvbGxlY3REYXRlVGltZUZyYWdtZW50KGZyYWdtZW50cywgbWF0Y2gpO1xuICAgICAgICByZW1haW5pbmdUZXh0ID0gcmVtYWluaW5nVGV4dC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgbWF0Y2ggPSBTSU5HTEVfVElNRV9VTklUX1JFR0VYLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBmcmFnbWVudHM7XG59XG5leHBvcnRzLnBhcnNlVGltZVVuaXRzID0gcGFyc2VUaW1lVW5pdHM7XG5mdW5jdGlvbiBjb2xsZWN0RGF0ZVRpbWVGcmFnbWVudChmcmFnbWVudHMsIG1hdGNoKSB7XG4gICAgY29uc3QgbnVtID0gcGFyc2VOdW1iZXJQYXR0ZXJuKG1hdGNoWzFdKTtcbiAgICBjb25zdCB1bml0ID0gZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWVttYXRjaFsyXS50b0xvd2VyQ2FzZSgpXTtcbiAgICBmcmFnbWVudHNbdW5pdF0gPSBudW07XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3Qgd2Vla3NfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi93ZWVrc1wiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiKD86KD86XFxcXCx8XFxcXCh8XFxcXO+8iClcXFxccyopP1wiICtcbiAgICBcIig/Oig/OmNlKVxcXFxzKik/XCIgK1xuICAgIGAoJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWSl9KWAgK1xuICAgIFwiKD86XFxcXHMqKD86XFxcXCx8XFxcXCl8XFxcXO+8iSkpP1wiICtcbiAgICBcIig/OlxcXFxzKihkZXJuaWVyfHByb2NoYWluKVxcXFxzKik/XCIgK1xuICAgIFwiKD89XFxcXFd8XFxcXGR8JClcIiwgXCJpXCIpO1xuY29uc3QgV0VFS0RBWV9HUk9VUCA9IDE7XG5jb25zdCBQT1NURklYX0dST1VQID0gMjtcbmNsYXNzIEZSV2Vla2RheVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgZGF5T2ZXZWVrID0gbWF0Y2hbV0VFS0RBWV9HUk9VUF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29uc3RhbnRzXzEuV0VFS0RBWV9ESUNUSU9OQVJZW2RheU9mV2Vla107XG4gICAgICAgIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN1ZmZpeCA9IG1hdGNoW1BPU1RGSVhfR1JPVVBdO1xuICAgICAgICBzdWZmaXggPSBzdWZmaXggfHwgXCJcIjtcbiAgICAgICAgc3VmZml4ID0gc3VmZml4LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBtb2RpZmllciA9IG51bGw7XG4gICAgICAgIGlmIChzdWZmaXggPT0gXCJkZXJuaWVyXCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJsYXN0XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3VmZml4ID09IFwicHJvY2hhaW5cIikge1xuICAgICAgICAgICAgbW9kaWZpZXIgPSBcIm5leHRcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRlID0gd2Vla3NfMS50b0RheUpTV2Vla2RheShjb250ZXh0LnJlZkRhdGUsIG9mZnNldCwgbW9kaWZpZXIpO1xuICAgICAgICByZXR1cm4gY29udGV4dFxuICAgICAgICAgICAgLmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKClcbiAgICAgICAgICAgIC5hc3NpZ24oXCJ3ZWVrZGF5XCIsIG9mZnNldClcbiAgICAgICAgICAgIC5pbXBseShcImRheVwiLCBkYXRlLmRhdGUoKSlcbiAgICAgICAgICAgIC5pbXBseShcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpXG4gICAgICAgICAgICAuaW1wbHkoXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUldlZWtkYXlQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW5kZXhcIik7XG5jb25zdCBGSVJTVF9SRUdfUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoXnxcXFxcc3xUKVwiICtcbiAgICBcIig/Oig/OlvDoGFdKVxcXFxzKik/XCIgK1xuICAgIFwiKFxcXFxkezEsMn0pKD86aHw6KT9cIiArXG4gICAgXCIoPzooXFxcXGR7MSwyfSkoPzptfDopPyk/XCIgK1xuICAgIFwiKD86KFxcXFxkezEsMn0pKD86c3w6KT8pP1wiICtcbiAgICBcIig/OlxcXFxzKihBXFxcXC5NXFxcXC58UFxcXFwuTVxcXFwufEFNP3xQTT8pKT9cIiArXG4gICAgXCIoPz1cXFxcV3wkKVwiLCBcImlcIik7XG5jb25zdCBTRUNPTkRfUkVHX1BBVFRFUk4gPSBuZXcgUmVnRXhwKFwiXlxcXFxzKihcXFxcLXxcXFxc4oCTfFxcXFx+fFxcXFzjgJx8W8OgYV18XFxcXD8pXFxcXHMqXCIgK1xuICAgIFwiKFxcXFxkezEsMn0pKD86aHw6KT9cIiArXG4gICAgXCIoPzooXFxcXGR7MSwyfSkoPzptfDopPyk/XCIgK1xuICAgIFwiKD86KFxcXFxkezEsMn0pKD86c3w6KT8pP1wiICtcbiAgICBcIig/OlxcXFxzKihBXFxcXC5NXFxcXC58UFxcXFwuTVxcXFwufEFNP3xQTT8pKT9cIiArXG4gICAgXCIoPz1cXFxcV3wkKVwiLCBcImlcIik7XG5jb25zdCBIT1VSX0dST1VQID0gMjtcbmNvbnN0IE1JTlVURV9HUk9VUCA9IDM7XG5jb25zdCBTRUNPTkRfR1JPVVAgPSA0O1xuY29uc3QgQU1fUE1fSE9VUl9HUk9VUCA9IDU7XG5jbGFzcyBGUlNwZWNpZmljVGltZUV4cHJlc3Npb25QYXJzZXIge1xuICAgIHBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gRklSU1RfUkVHX1BBVFRFUk47XG4gICAgfVxuICAgIGV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nUmVzdWx0KG1hdGNoLmluZGV4ICsgbWF0Y2hbMV0ubGVuZ3RoLCBtYXRjaFswXS5zdWJzdHJpbmcobWF0Y2hbMV0ubGVuZ3RoKSk7XG4gICAgICAgIGlmIChyZXN1bHQudGV4dC5tYXRjaCgvXlxcZHs0fSQvKSkge1xuICAgICAgICAgICAgbWF0Y2guaW5kZXggKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnN0YXJ0ID0gRlJTcGVjaWZpY1RpbWVFeHByZXNzaW9uUGFyc2VyLmV4dHJhY3RUaW1lQ29tcG9uZW50KHJlc3VsdC5zdGFydC5jbG9uZSgpLCBtYXRjaCk7XG4gICAgICAgIGlmICghcmVzdWx0LnN0YXJ0KSB7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCArPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZW1haW5pbmdUZXh0ID0gY29udGV4dC50ZXh0LnN1YnN0cmluZyhtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IHNlY29uZE1hdGNoID0gU0VDT05EX1JFR19QQVRURVJOLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgICAgIGlmIChzZWNvbmRNYXRjaCkge1xuICAgICAgICAgICAgcmVzdWx0LmVuZCA9IEZSU3BlY2lmaWNUaW1lRXhwcmVzc2lvblBhcnNlci5leHRyYWN0VGltZUNvbXBvbmVudChyZXN1bHQuc3RhcnQuY2xvbmUoKSwgc2Vjb25kTWF0Y2gpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5lbmQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQudGV4dCArPSBzZWNvbmRNYXRjaFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBzdGF0aWMgZXh0cmFjdFRpbWVDb21wb25lbnQoZXh0cmFjdGluZ0NvbXBvbmVudHMsIG1hdGNoKSB7XG4gICAgICAgIGxldCBob3VyID0gMDtcbiAgICAgICAgbGV0IG1pbnV0ZSA9IDA7XG4gICAgICAgIGxldCBtZXJpZGllbSA9IG51bGw7XG4gICAgICAgIGhvdXIgPSBwYXJzZUludChtYXRjaFtIT1VSX0dST1VQXSk7XG4gICAgICAgIGlmIChtYXRjaFtNSU5VVEVfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1pbnV0ZSA9IHBhcnNlSW50KG1hdGNoW01JTlVURV9HUk9VUF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtaW51dGUgPj0gNjAgfHwgaG91ciA+IDI0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG91ciA+PSAxMikge1xuICAgICAgICAgICAgbWVyaWRpZW0gPSBpbmRleF8xLk1lcmlkaWVtLlBNO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtBTV9QTV9IT1VSX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaG91ciA+IDEyKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY29uc3QgYW1wbSA9IG1hdGNoW0FNX1BNX0hPVVJfR1JPVVBdWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoYW1wbSA9PSBcImFcIikge1xuICAgICAgICAgICAgICAgIG1lcmlkaWVtID0gaW5kZXhfMS5NZXJpZGllbS5BTTtcbiAgICAgICAgICAgICAgICBpZiAoaG91ciA9PSAxMikge1xuICAgICAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYW1wbSA9PSBcInBcIikge1xuICAgICAgICAgICAgICAgIG1lcmlkaWVtID0gaW5kZXhfMS5NZXJpZGllbS5QTTtcbiAgICAgICAgICAgICAgICBpZiAoaG91ciAhPSAxMikge1xuICAgICAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBleHRyYWN0aW5nQ29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGhvdXIpO1xuICAgICAgICBleHRyYWN0aW5nQ29tcG9uZW50cy5hc3NpZ24oXCJtaW51dGVcIiwgbWludXRlKTtcbiAgICAgICAgaWYgKG1lcmlkaWVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICBleHRyYWN0aW5nQ29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBtZXJpZGllbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgZXh0cmFjdGluZ0NvbXBvbmVudHMuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGV4dHJhY3RpbmdDb21wb25lbnRzLmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoW1NFQ09ORF9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kID0gcGFyc2VJbnQobWF0Y2hbU0VDT05EX0dST1VQXSk7XG4gICAgICAgICAgICBpZiAoc2Vjb25kID49IDYwKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgZXh0cmFjdGluZ0NvbXBvbmVudHMuYXNzaWduKFwic2Vjb25kXCIsIHNlY29uZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4dHJhY3RpbmdDb21wb25lbnRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEZSU3BlY2lmaWNUaW1lRXhwcmVzc2lvblBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgeWVhcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi95ZWFyc1wiKTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IGNvbnN0YW50c18yID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IGNvbnN0YW50c18zID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoPzpvblxcXFxzKj8pP1wiICtcbiAgICBgKCR7Y29uc3RhbnRzXzMuT1JESU5BTF9OVU1CRVJfUEFUVEVSTn0pYCArXG4gICAgYCg/OlxcXFxzKig/OmF1fFxcXFwtfFxcXFzigJN8anVzcXUnYXU/fFxcXFxzKVxcXFxzKigke2NvbnN0YW50c18zLk9SRElOQUxfTlVNQkVSX1BBVFRFUk59KSk/YCArXG4gICAgYCg/Oi18L3xcXFxccyooPzpkZSk/XFxcXHMqKWAgK1xuICAgIGAoJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUlkpfSlgICtcbiAgICBgKD86KD86LXwvfCw/XFxcXHMqKSgke2NvbnN0YW50c18yLllFQVJfUEFUVEVSTn0oPyFbXlxcXFxzXVxcXFxkKSkpP2AgK1xuICAgIGAoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbmNvbnN0IERBVEVfR1JPVVAgPSAxO1xuY29uc3QgREFURV9UT19HUk9VUCA9IDI7XG5jb25zdCBNT05USF9OQU1FX0dST1VQID0gMztcbmNvbnN0IFlFQVJfR1JPVVAgPSA0O1xuY2xhc3MgRlJNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ1Jlc3VsdChtYXRjaC5pbmRleCwgbWF0Y2hbMF0pO1xuICAgICAgICBjb25zdCBtb250aCA9IGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUllbbWF0Y2hbTU9OVEhfTkFNRV9HUk9VUF0udG9Mb3dlckNhc2UoKV07XG4gICAgICAgIGNvbnN0IGRheSA9IGNvbnN0YW50c18zLnBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm4obWF0Y2hbREFURV9HUk9VUF0pO1xuICAgICAgICBpZiAoZGF5ID4gMzEpIHtcbiAgICAgICAgICAgIG1hdGNoLmluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFtEQVRFX0dST1VQXS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwibW9udGhcIiwgbW9udGgpO1xuICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwiZGF5XCIsIGRheSk7XG4gICAgICAgIGlmIChtYXRjaFtZRUFSX0dST1VQXSkge1xuICAgICAgICAgICAgY29uc3QgeWVhck51bWJlciA9IGNvbnN0YW50c18yLnBhcnNlWWVhcihtYXRjaFtZRUFSX0dST1VQXSk7XG4gICAgICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwieWVhclwiLCB5ZWFyTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSB5ZWFyc18xLmZpbmRZZWFyQ2xvc2VzdFRvUmVmKGNvbnRleHQucmVmRGF0ZSwgZGF5LCBtb250aCk7XG4gICAgICAgICAgICByZXN1bHQuc3RhcnQuaW1wbHkoXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtEQVRFX1RPX0dST1VQXSkge1xuICAgICAgICAgICAgY29uc3QgZW5kRGF0ZSA9IGNvbnN0YW50c18zLnBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm4obWF0Y2hbREFURV9UT19HUk9VUF0pO1xuICAgICAgICAgICAgcmVzdWx0LmVuZCA9IHJlc3VsdC5zdGFydC5jbG9uZSgpO1xuICAgICAgICAgICAgcmVzdWx0LmVuZC5hc3NpZ24oXCJkYXlcIiwgZW5kRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcmVzdWx0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3Jlc3VsdHNcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCB0aW1ldW5pdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy90aW1ldW5pdHNcIik7XG5jbGFzcyBGUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGBpbCB5IGFcXFxccyooJHtjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk59KSg/PSg/OlxcXFxXfCQpKWAsIFwiaVwiKTtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHRpbWVVbml0cyA9IGNvbnN0YW50c18xLnBhcnNlVGltZVVuaXRzKG1hdGNoWzFdKTtcbiAgICAgICAgY29uc3Qgb3V0cHV0VGltZVVuaXRzID0gdGltZXVuaXRzXzEucmV2ZXJzZVRpbWVVbml0cyh0aW1lVW5pdHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzLmNyZWF0ZVJlbGF0aXZlRnJvbVJlZkRhdGUoY29udGV4dC5yZWZEYXRlLCBvdXRwdXRUaW1lVW5pdHMpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEZSVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHJlc3VsdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9yZXN1bHRzXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY2xhc3MgRlJUaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGAoPzpkYW5zfGVufHBvdXJ8cGVuZGFudClcXFxccyooJHtjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk59KSg/PVxcXFxXfCQpYCwgXCJpXCIpO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgdGltZVVuaXRzID0gY29uc3RhbnRzXzEucGFyc2VUaW1lVW5pdHMobWF0Y2hbMV0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzLmNyZWF0ZVJlbGF0aXZlRnJvbVJlZkRhdGUoY29udGV4dC5yZWZEYXRlLCB0aW1lVW5pdHMpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEZSVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHJlc3VsdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9yZXN1bHRzXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgdGltZXVuaXRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvdGltZXVuaXRzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jbGFzcyBGUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGAoPzpsZXM/fGxhfGwnfGR1fGRlcz8pXFxcXHMqYCArXG4gICAgICAgICAgICBgKCR7Y29uc3RhbnRzXzEuTlVNQkVSX1BBVFRFUk59KT9gICtcbiAgICAgICAgICAgIGAoPzpcXFxccyoocHJvY2hhaW5lP3M/fGRlcm5pW2XDqF1yZT9zP3xwYXNzW8OpZV1lP3M/fHByW8OpZV1jW8OpZV1kZW50cz98c3VpdmFudGU/cz8pKT9gICtcbiAgICAgICAgICAgIGBcXFxccyooJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLlRJTUVfVU5JVF9ESUNUSU9OQVJZKX0pYCArXG4gICAgICAgICAgICBgKD86XFxcXHMqKHByb2NoYWluZT9zP3xkZXJuaVtlw6hdcmU/cz98cGFzc1vDqWVdZT9zP3xwclvDqWVdY1vDqWVdZGVudHM/fHN1aXZhbnRlP3M/KSk/YCwgXCJpXCIpO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbnVtID0gbWF0Y2hbMV0gPyBjb25zdGFudHNfMS5wYXJzZU51bWJlclBhdHRlcm4obWF0Y2hbMV0pIDogMTtcbiAgICAgICAgY29uc3QgdW5pdCA9IGNvbnN0YW50c18xLlRJTUVfVU5JVF9ESUNUSU9OQVJZW21hdGNoWzNdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBsZXQgdGltZVVuaXRzID0ge307XG4gICAgICAgIHRpbWVVbml0c1t1bml0XSA9IG51bTtcbiAgICAgICAgbGV0IG1vZGlmaWVyID0gbWF0Y2hbMl0gfHwgbWF0Y2hbNF0gfHwgXCJcIjtcbiAgICAgICAgbW9kaWZpZXIgPSBtb2RpZmllci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIW1vZGlmaWVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9kZXJuaVtlw6hdcmU/cz8vLnRlc3QobW9kaWZpZXIpIHx8IC9wYXNzW8OpZV1lP3M/Ly50ZXN0KG1vZGlmaWVyKSB8fCAvcHJbw6llXWNbw6llXWRlbnRzPy8udGVzdChtb2RpZmllcikpIHtcbiAgICAgICAgICAgIHRpbWVVbml0cyA9IHRpbWV1bml0c18xLnJldmVyc2VUaW1lVW5pdHModGltZVVuaXRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzLmNyZWF0ZVJlbGF0aXZlRnJvbVJlZkRhdGUoY29udGV4dC5yZWZEYXRlLCB0aW1lVW5pdHMpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEZSVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlQ29uZmlndXJhdGlvbiA9IGV4cG9ydHMuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbiA9IGV4cG9ydHMucGFyc2VEYXRlID0gZXhwb3J0cy5wYXJzZSA9IGV4cG9ydHMuc3RyaWN0ID0gZXhwb3J0cy5jYXN1YWwgPSB2b2lkIDA7XG5jb25zdCBjb25maWd1cmF0aW9uc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbmZpZ3VyYXRpb25zXCIpO1xuY29uc3QgY2hyb25vXzEgPSByZXF1aXJlKFwiLi4vLi4vY2hyb25vXCIpO1xuY29uc3QgRlJDYXN1YWxEYXRlUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9GUkNhc3VhbERhdGVQYXJzZXJcIikpO1xuY29uc3QgRlJDYXN1YWxUaW1lUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9GUkNhc3VhbFRpbWVQYXJzZXJcIikpO1xuY29uc3QgU2xhc2hEYXRlRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uL2NvbW1vbi9wYXJzZXJzL1NsYXNoRGF0ZUZvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBGUlRpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9GUlRpbWVFeHByZXNzaW9uUGFyc2VyXCIpKTtcbmNvbnN0IEZSTWVyZ2VEYXRlVGltZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWZpbmVycy9GUk1lcmdlRGF0ZVRpbWVSZWZpbmVyXCIpKTtcbmNvbnN0IEZSTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVmaW5lcnMvRlJNZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY29uc3QgRlJXZWVrZGF5UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9GUldlZWtkYXlQYXJzZXJcIikpO1xuY29uc3QgRlJTcGVjaWZpY1RpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9GUlNwZWNpZmljVGltZUV4cHJlc3Npb25QYXJzZXJcIikpO1xuY29uc3QgRlJNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0ZSTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXCIpKTtcbmNvbnN0IEZSVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0ZSVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgRlJUaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRlJUaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBGUlRpbWVVbml0UmVsYXRpdmVGb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0ZSVGltZVVuaXRSZWxhdGl2ZUZvcm1hdFBhcnNlclwiKSk7XG5leHBvcnRzLmNhc3VhbCA9IG5ldyBjaHJvbm9fMS5DaHJvbm8oY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbigpKTtcbmV4cG9ydHMuc3RyaWN0ID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDb25maWd1cmF0aW9uKHRydWUpKTtcbmZ1bmN0aW9uIHBhcnNlKHRleHQsIHJlZiwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY2FzdWFsLnBhcnNlKHRleHQsIHJlZiwgb3B0aW9uKTtcbn1cbmV4cG9ydHMucGFyc2UgPSBwYXJzZTtcbmZ1bmN0aW9uIHBhcnNlRGF0ZSh0ZXh0LCByZWYsIG9wdGlvbikge1xuICAgIHJldHVybiBleHBvcnRzLmNhc3VhbC5wYXJzZURhdGUodGV4dCwgcmVmLCBvcHRpb24pO1xufVxuZXhwb3J0cy5wYXJzZURhdGUgPSBwYXJzZURhdGU7XG5mdW5jdGlvbiBjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uKGxpdHRsZUVuZGlhbiA9IHRydWUpIHtcbiAgICBjb25zdCBvcHRpb24gPSBjcmVhdGVDb25maWd1cmF0aW9uKGZhbHNlLCBsaXR0bGVFbmRpYW4pO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IEZSQ2FzdWFsRGF0ZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgRlJDYXN1YWxUaW1lUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICBvcHRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBGUlRpbWVVbml0UmVsYXRpdmVGb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIHJldHVybiBvcHRpb247XG59XG5leHBvcnRzLmNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24gPSBjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uO1xuZnVuY3Rpb24gY3JlYXRlQ29uZmlndXJhdGlvbihzdHJpY3RNb2RlID0gdHJ1ZSwgbGl0dGxlRW5kaWFuID0gdHJ1ZSkge1xuICAgIHJldHVybiBjb25maWd1cmF0aW9uc18xLmluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uKHtcbiAgICAgICAgcGFyc2VyczogW1xuICAgICAgICAgICAgbmV3IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xLmRlZmF1bHQobGl0dGxlRW5kaWFuKSxcbiAgICAgICAgICAgIG5ldyBGUk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBGUlRpbWVFeHByZXNzaW9uUGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IEZSU3BlY2lmaWNUaW1lRXhwcmVzc2lvblBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBGUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IEZSVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgRlJXZWVrZGF5UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICBdLFxuICAgICAgICByZWZpbmVyczogW25ldyBGUk1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEuZGVmYXVsdCgpLCBuZXcgRlJNZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0KCldLFxuICAgIH0sIHN0cmljdE1vZGUpO1xufVxuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50b0hhbmtha3UgPSB2b2lkIDA7XG5mdW5jdGlvbiB0b0hhbmtha3UodGV4dCkge1xuICAgIHJldHVybiBTdHJpbmcodGV4dClcbiAgICAgICAgLnJlcGxhY2UoL1xcdTIwMTkvZywgXCJcXHUwMDI3XCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXHUyMDFEL2csIFwiXFx1MDAyMlwiKVxuICAgICAgICAucmVwbGFjZSgvXFx1MzAwMC9nLCBcIlxcdTAwMjBcIilcbiAgICAgICAgLnJlcGxhY2UoL1xcdUZGRTUvZywgXCJcXHUwMEE1XCIpXG4gICAgICAgIC5yZXBsYWNlKC9bXFx1RkYwMVxcdUZGMDMtXFx1RkYwNlxcdUZGMDhcXHVGRjA5XFx1RkYwQy1cXHVGRjE5XFx1RkYxQy1cXHVGRjFGXFx1RkYyMS1cXHVGRjNCXFx1RkYzRFxcdUZGM0ZcXHVGRjQxLVxcdUZGNUJcXHVGRjVEXFx1RkY1RV0vZywgYWxwaGFOdW0pO1xufVxuZXhwb3J0cy50b0hhbmtha3UgPSB0b0hhbmtha3U7XG5mdW5jdGlvbiBhbHBoYU51bSh0b2tlbikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHRva2VuLmNoYXJDb2RlQXQoMCkgLSA2NTI0OCk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBQQVRURVJOID0gLyg/Oig/Oihb5ZCM5LuK5pysXSl8KCjmmK3lkox85bmz5oiQfOS7pOWSjCk/KFswLTnvvJAt77yZXXsxLDR9fOWFgykpKeW5tFxccyopPyhbMC0577yQLe+8mV17MSwyfSnmnIhcXHMqKFswLTnvvJAt77yZXXsxLDJ9KeaXpS9pO1xuY29uc3QgU1BFQ0lBTF9ZRUFSX0dST1VQID0gMTtcbmNvbnN0IFRZUElDQUxfWUVBUl9HUk9VUCA9IDI7XG5jb25zdCBFUkFfR1JPVVAgPSAzO1xuY29uc3QgWUVBUl9OVU1CRVJfR1JPVVAgPSA0O1xuY29uc3QgTU9OVEhfR1JPVVAgPSA1O1xuY29uc3QgREFZX0dST1VQID0gNjtcbmNsYXNzIEpQU3RhbmRhcmRQYXJzZXIge1xuICAgIHBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBleHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gcGFyc2VJbnQoY29uc3RhbnRzXzEudG9IYW5rYWt1KG1hdGNoW01PTlRIX0dST1VQXSkpO1xuICAgICAgICBjb25zdCBkYXkgPSBwYXJzZUludChjb25zdGFudHNfMS50b0hhbmtha3UobWF0Y2hbREFZX0dST1VQXSkpO1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cyh7XG4gICAgICAgICAgICBkYXk6IGRheSxcbiAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChtYXRjaFtTUEVDSUFMX1lFQVJfR1JPVVBdICYmIG1hdGNoW1NQRUNJQUxfWUVBUl9HUk9VUF0ubWF0Y2goXCLlkIx85LuKfOacrFwiKSkge1xuICAgICAgICAgICAgY29uc3QgbW9tZW50ID0gZGF5anNfMS5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcInllYXJcIiwgbW9tZW50LnllYXIoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoW1RZUElDQUxfWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXJOdW1UZXh0ID0gbWF0Y2hbWUVBUl9OVU1CRVJfR1JPVVBdO1xuICAgICAgICAgICAgbGV0IHllYXIgPSB5ZWFyTnVtVGV4dCA9PSBcIuWFg1wiID8gMSA6IHBhcnNlSW50KGNvbnN0YW50c18xLnRvSGFua2FrdSh5ZWFyTnVtVGV4dCkpO1xuICAgICAgICAgICAgaWYgKG1hdGNoW0VSQV9HUk9VUF0gPT0gXCLku6TlkoxcIikge1xuICAgICAgICAgICAgICAgIHllYXIgKz0gMjAxODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1hdGNoW0VSQV9HUk9VUF0gPT0gXCLlubPmiJBcIikge1xuICAgICAgICAgICAgICAgIHllYXIgKz0gMTk4ODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1hdGNoW0VSQV9HUk9VUF0gPT0gXCLmmK3lkoxcIikge1xuICAgICAgICAgICAgICAgIHllYXIgKz0gMTkyNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSB5ZWFyc18xLmZpbmRZZWFyQ2xvc2VzdFRvUmVmKGNvbnRleHQucmVmRGF0ZSwgZGF5LCBtb250aCk7XG4gICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50cztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBKUFN0YW5kYXJkUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY2xhc3MgSlBNZXJnZURhdGVSYW5nZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gL15cXHMqKOOBi+OCiXzjg7x8LSlcXHMqJC9pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEpQTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGRheWpzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW5kZXhcIik7XG5jb25zdCByZWZlcmVuY2VzID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vY2FzdWFsUmVmZXJlbmNlc1wiKSk7XG5jb25zdCBQQVRURVJOID0gL+S7iuaXpXzlvZPml6V85pio5pelfOaYjuaXpXzku4rlpJx85LuK5aSVfOS7iuaZqXzku4rmnJ0vaTtcbmNsYXNzIEpQQ2FzdWFsRGF0ZVBhcnNlciB7XG4gICAgcGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IG1hdGNoWzBdO1xuICAgICAgICBjb25zdCBkYXRlID0gZGF5anNfMS5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIHN3aXRjaCAodGV4dCkge1xuICAgICAgICAgICAgY2FzZSBcIuaYqOaXpVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnllc3RlcmRheShjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcIuaYjuaXpVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvbW9ycm93KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwi5LuK5pelXCI6XG4gICAgICAgICAgICBjYXNlIFwi5b2T5pelXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMudG9kYXkoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4dCA9PSBcIuS7iuWknFwiIHx8IHRleHQgPT0gXCLku4rlpJVcIiB8fCB0ZXh0ID09IFwi5LuK5pmpXCIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJob3VyXCIsIDIyKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGV4dC5tYXRjaChcIuS7iuacnVwiKSkge1xuICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcImhvdXJcIiwgNik7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwiZGF5XCIsIGRhdGUuZGF0ZSgpKTtcbiAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKTtcbiAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gSlBDYXN1YWxEYXRlUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUNvbmZpZ3VyYXRpb24gPSBleHBvcnRzLmNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24gPSBleHBvcnRzLnBhcnNlRGF0ZSA9IGV4cG9ydHMucGFyc2UgPSBleHBvcnRzLnN0cmljdCA9IGV4cG9ydHMuY2FzdWFsID0gdm9pZCAwO1xuY29uc3QgSlBTdGFuZGFyZFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvSlBTdGFuZGFyZFBhcnNlclwiKSk7XG5jb25zdCBKUE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JlZmluZXJzL0pQTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXCIpKTtcbmNvbnN0IEpQQ2FzdWFsRGF0ZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvSlBDYXN1YWxEYXRlUGFyc2VyXCIpKTtcbmNvbnN0IGNocm9ub18xID0gcmVxdWlyZShcIi4uLy4uL2Nocm9ub1wiKTtcbmV4cG9ydHMuY2FzdWFsID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uKCkpO1xuZXhwb3J0cy5zdHJpY3QgPSBuZXcgY2hyb25vXzEuQ2hyb25vKGNyZWF0ZUNvbmZpZ3VyYXRpb24oKSk7XG5mdW5jdGlvbiBwYXJzZSh0ZXh0LCByZWYsIG9wdGlvbikge1xuICAgIHJldHVybiBleHBvcnRzLmNhc3VhbC5wYXJzZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5mdW5jdGlvbiBwYXJzZURhdGUodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKTtcbn1cbmV4cG9ydHMucGFyc2VEYXRlID0gcGFyc2VEYXRlO1xuZnVuY3Rpb24gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbigpIHtcbiAgICBjb25zdCBvcHRpb24gPSBjcmVhdGVDb25maWd1cmF0aW9uKCk7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgSlBDYXN1YWxEYXRlUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICByZXR1cm4gb3B0aW9uO1xufVxuZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbjtcbmZ1bmN0aW9uIGNyZWF0ZUNvbmZpZ3VyYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2VyczogW25ldyBKUFN0YW5kYXJkUGFyc2VyXzEuZGVmYXVsdCgpXSxcbiAgICAgICAgcmVmaW5lcnM6IFtuZXcgSlBNZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0KCldLFxuICAgIH07XG59XG5leHBvcnRzLmNyZWF0ZUNvbmZpZ3VyYXRpb24gPSBjcmVhdGVDb25maWd1cmF0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlWWVhciA9IGV4cG9ydHMuWUVBUl9QQVRURVJOID0gZXhwb3J0cy5NT05USF9ESUNUSU9OQVJZID0gZXhwb3J0cy5XRUVLREFZX0RJQ1RJT05BUlkgPSB2b2lkIDA7XG5leHBvcnRzLldFRUtEQVlfRElDVElPTkFSWSA9IHtcbiAgICBcImRvbWluZ29cIjogMCxcbiAgICBcImRvbVwiOiAwLFxuICAgIFwic2VndW5kYVwiOiAxLFxuICAgIFwic2VndW5kYS1mZWlyYVwiOiAxLFxuICAgIFwic2VnXCI6IDEsXG4gICAgXCJ0ZXLDp2FcIjogMixcbiAgICBcInRlcsOnYS1mZWlyYVwiOiAyLFxuICAgIFwidGVyXCI6IDIsXG4gICAgXCJxdWFydGFcIjogMyxcbiAgICBcInF1YXJ0YS1mZWlyYVwiOiAzLFxuICAgIFwicXVhXCI6IDMsXG4gICAgXCJxdWludGFcIjogNCxcbiAgICBcInF1aW50YS1mZWlyYVwiOiA0LFxuICAgIFwicXVpXCI6IDQsXG4gICAgXCJzZXh0YVwiOiA1LFxuICAgIFwic2V4dGEtZmVpcmFcIjogNSxcbiAgICBcInNleFwiOiA1LFxuICAgIFwic8OhYmFkb1wiOiA2LFxuICAgIFwic2FiYWRvXCI6IDYsXG4gICAgXCJzYWJcIjogNixcbn07XG5leHBvcnRzLk1PTlRIX0RJQ1RJT05BUlkgPSB7XG4gICAgXCJqYW5laXJvXCI6IDEsXG4gICAgXCJqYW5cIjogMSxcbiAgICBcImphbi5cIjogMSxcbiAgICBcImZldmVyZWlyb1wiOiAyLFxuICAgIFwiZmV2XCI6IDIsXG4gICAgXCJmZXYuXCI6IDIsXG4gICAgXCJtYXLDp29cIjogMyxcbiAgICBcIm1hclwiOiAzLFxuICAgIFwibWFyLlwiOiAzLFxuICAgIFwiYWJyaWxcIjogNCxcbiAgICBcImFiclwiOiA0LFxuICAgIFwiYWJyLlwiOiA0LFxuICAgIFwibWFpb1wiOiA1LFxuICAgIFwibWFpXCI6IDUsXG4gICAgXCJtYWkuXCI6IDUsXG4gICAgXCJqdW5ob1wiOiA2LFxuICAgIFwianVuXCI6IDYsXG4gICAgXCJqdW4uXCI6IDYsXG4gICAgXCJqdWxob1wiOiA3LFxuICAgIFwianVsXCI6IDcsXG4gICAgXCJqdWwuXCI6IDcsXG4gICAgXCJhZ29zdG9cIjogOCxcbiAgICBcImFnb1wiOiA4LFxuICAgIFwiYWdvLlwiOiA4LFxuICAgIFwic2V0ZW1icm9cIjogOSxcbiAgICBcInNldFwiOiA5LFxuICAgIFwic2V0LlwiOiA5LFxuICAgIFwib3V0dWJyb1wiOiAxMCxcbiAgICBcIm91dFwiOiAxMCxcbiAgICBcIm91dC5cIjogMTAsXG4gICAgXCJub3ZlbWJyb1wiOiAxMSxcbiAgICBcIm5vdlwiOiAxMSxcbiAgICBcIm5vdi5cIjogMTEsXG4gICAgXCJkZXplbWJyb1wiOiAxMixcbiAgICBcImRlelwiOiAxMixcbiAgICBcImRlei5cIjogMTIsXG59O1xuZXhwb3J0cy5ZRUFSX1BBVFRFUk4gPSBcIlswLTldezEsNH0oPyFbXlxcXFxzXVxcXFxkKSg/OlxcXFxzKlthfGRdXFxcXC4/XFxcXHMqY1xcXFwuP3xcXFxccyphXFxcXC4/XFxcXHMqZFxcXFwuPyk/XCI7XG5mdW5jdGlvbiBwYXJzZVllYXIobWF0Y2gpIHtcbiAgICBpZiAobWF0Y2gubWF0Y2goL15bMC05XXsxLDR9JC8pKSB7XG4gICAgICAgIGxldCB5ZWFyTnVtYmVyID0gcGFyc2VJbnQobWF0Y2gpO1xuICAgICAgICBpZiAoeWVhck51bWJlciA8IDEwMCkge1xuICAgICAgICAgICAgaWYgKHllYXJOdW1iZXIgPiA1MCkge1xuICAgICAgICAgICAgICAgIHllYXJOdW1iZXIgPSB5ZWFyTnVtYmVyICsgMTkwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHllYXJOdW1iZXIgPSB5ZWFyTnVtYmVyICsgMjAwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geWVhck51bWJlcjtcbiAgICB9XG4gICAgaWYgKG1hdGNoLm1hdGNoKC9hXFwuP1xccypjXFwuPy9pKSkge1xuICAgICAgICBtYXRjaCA9IG1hdGNoLnJlcGxhY2UoL2FcXC4/XFxzKmNcXC4/L2ksIFwiXCIpO1xuICAgICAgICByZXR1cm4gLXBhcnNlSW50KG1hdGNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSW50KG1hdGNoKTtcbn1cbmV4cG9ydHMucGFyc2VZZWFyID0gcGFyc2VZZWFyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHdlZWtzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24vd2Vla3NcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIig/Oig/OlxcXFwsfFxcXFwofFxcXFzvvIgpXFxcXHMqKT9cIiArXG4gICAgXCIoPzooZXN0ZXxlc3RhfHBhc3NhZG98cHJbb8OzXXhpbW8pXFxcXHMqKT9cIiArXG4gICAgYCgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuV0VFS0RBWV9ESUNUSU9OQVJZKX0pYCArXG4gICAgXCIoPzpcXFxccyooPzpcXFxcLHxcXFxcKXxcXFxc77yJKSk/XCIgK1xuICAgIFwiKD86XFxcXHMqKGVzdGV8ZXN0YXxwYXNzYWRvfHByW8Ozb114aW1vKVxcXFxzKnNlbWFuYSk/XCIgK1xuICAgIFwiKD89XFxcXFd8XFxcXGR8JClcIiwgXCJpXCIpO1xuY29uc3QgUFJFRklYX0dST1VQID0gMTtcbmNvbnN0IFdFRUtEQVlfR1JPVVAgPSAyO1xuY29uc3QgUE9TVEZJWF9HUk9VUCA9IDM7XG5jbGFzcyBQVFdlZWtkYXlQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGRheU9mV2VlayA9IG1hdGNoW1dFRUtEQVlfR1JPVVBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWVtkYXlPZldlZWtdO1xuICAgICAgICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IG1hdGNoW1BSRUZJWF9HUk9VUF07XG4gICAgICAgIGNvbnN0IHBvc3RmaXggPSBtYXRjaFtQT1NURklYX0dST1VQXTtcbiAgICAgICAgbGV0IG5vcm0gPSBwcmVmaXggfHwgcG9zdGZpeCB8fCBcIlwiO1xuICAgICAgICBub3JtID0gbm9ybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgbW9kaWZpZXIgPSBudWxsO1xuICAgICAgICBpZiAobm9ybSA9PSBcInBhc3NhZG9cIikge1xuICAgICAgICAgICAgbW9kaWZpZXIgPSBcInRoaXNcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub3JtID09IFwicHLDs3hpbW9cIiB8fCBub3JtID09IFwicHJveGltb1wiKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwibmV4dFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vcm0gPT0gXCJlc3RlXCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJ0aGlzXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0ZSA9IHdlZWtzXzEudG9EYXlKU1dlZWtkYXkoY29udGV4dC5yZWZEYXRlLCBvZmZzZXQsIG1vZGlmaWVyKTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHRcbiAgICAgICAgICAgIC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpXG4gICAgICAgICAgICAuYXNzaWduKFwid2Vla2RheVwiLCBvZmZzZXQpXG4gICAgICAgICAgICAuaW1wbHkoXCJkYXlcIiwgZGF0ZS5kYXRlKCkpXG4gICAgICAgICAgICAuaW1wbHkoXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKVxuICAgICAgICAgICAgLmltcGx5KFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUFRXZWVrZGF5UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlclwiKTtcbmNsYXNzIFBUVGltZUV4cHJlc3Npb25QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXzEuQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlciB7XG4gICAgcHJpbWFyeVByZWZpeCgpIHtcbiAgICAgICAgcmV0dXJuIFwiKD86KD86YW8/fMOgcz98ZGFzfGRhfGRlfGRvKVxcXFxzKik/XCI7XG4gICAgfVxuICAgIGZvbGxvd2luZ1BoYXNlKCkge1xuICAgICAgICByZXR1cm4gXCJcXFxccyooPzpcXFxcLXxcXFxc4oCTfFxcXFx+fFxcXFzjgJx8YSg/Om8pP3xcXFxcPylcXFxccypcIjtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBQVFRpbWVFeHByZXNzaW9uUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9yZWZpbmVycy9BYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXCIpKTtcbmNsYXNzIFBUTWVyZ2VEYXRlVGltZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEuZGVmYXVsdCB7XG4gICAgcGF0dGVybkJldHdlZW4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXlxcXFxzKig/Oix8w6ApP1xcXFxzKiRcIik7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUFRNZXJnZURhdGVUaW1lUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3JlZmluZXJzL0Fic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXCIpKTtcbmNsYXNzIFBUTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyIGV4dGVuZHMgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0IHtcbiAgICBwYXR0ZXJuQmV0d2VlbigpIHtcbiAgICAgICAgcmV0dXJuIC9eXFxzKig/Oi0pXFxzKiQvaTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBQVE1lcmdlRGF0ZVJhbmdlUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgeWVhcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi95ZWFyc1wiKTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IGNvbnN0YW50c18yID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoYChbMC05XXsxLDJ9KSg/OsK6fMKqfMKwKT9gICtcbiAgICBcIig/OlxcXFxzKig/OmRlc2RlfGRlfFxcXFwtfFxcXFzigJN8YW8/fFxcXFxzKVxcXFxzKihbMC05XXsxLDJ9KSg/OsK6fMKqfMKwKT8pP1xcXFxzKig/OmRlKT9cXFxccypcIiArXG4gICAgYCg/Oi18L3xcXFxccyooPzpkZXwsKT9cXFxccyopYCArXG4gICAgYCgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWSl9KWAgK1xuICAgIGAoPzpcXFxccyooPzpkZXwsKT9cXFxccyooJHtjb25zdGFudHNfMi5ZRUFSX1BBVFRFUk59KSk/YCArXG4gICAgYCg/PVxcXFxXfCQpYCwgXCJpXCIpO1xuY29uc3QgREFURV9HUk9VUCA9IDE7XG5jb25zdCBEQVRFX1RPX0dST1VQID0gMjtcbmNvbnN0IE1PTlRIX05BTUVfR1JPVVAgPSAzO1xuY29uc3QgWUVBUl9HUk9VUCA9IDQ7XG5jbGFzcyBQVE1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nUmVzdWx0KG1hdGNoLmluZGV4LCBtYXRjaFswXSk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWVttYXRjaFtNT05USF9OQU1FX0dST1VQXS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgY29uc3QgZGF5ID0gcGFyc2VJbnQobWF0Y2hbREFURV9HUk9VUF0pO1xuICAgICAgICBpZiAoZGF5ID4gMzEpIHtcbiAgICAgICAgICAgIG1hdGNoLmluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFtEQVRFX0dST1VQXS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwibW9udGhcIiwgbW9udGgpO1xuICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwiZGF5XCIsIGRheSk7XG4gICAgICAgIGlmIChtYXRjaFtZRUFSX0dST1VQXSkge1xuICAgICAgICAgICAgY29uc3QgeWVhck51bWJlciA9IGNvbnN0YW50c18yLnBhcnNlWWVhcihtYXRjaFtZRUFSX0dST1VQXSk7XG4gICAgICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwieWVhclwiLCB5ZWFyTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSB5ZWFyc18xLmZpbmRZZWFyQ2xvc2VzdFRvUmVmKGNvbnRleHQucmVmRGF0ZSwgZGF5LCBtb250aCk7XG4gICAgICAgICAgICByZXN1bHQuc3RhcnQuaW1wbHkoXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtEQVRFX1RPX0dST1VQXSkge1xuICAgICAgICAgICAgY29uc3QgZW5kRGF0ZSA9IHBhcnNlSW50KG1hdGNoW0RBVEVfVE9fR1JPVVBdKTtcbiAgICAgICAgICAgIHJlc3VsdC5lbmQgPSByZXN1bHQuc3RhcnQuY2xvbmUoKTtcbiAgICAgICAgICAgIHJlc3VsdC5lbmQuYXNzaWduKFwiZGF5XCIsIGVuZERhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUFRNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgcmVmZXJlbmNlcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2Nhc3VhbFJlZmVyZW5jZXNcIikpO1xuY2xhc3MgUFRDYXN1YWxEYXRlUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybihjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiAvKGFnb3JhfGhvamV8YW1hbmhhfGFtYW5ow6N8b250ZW0pKD89XFxXfCQpL2k7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBsb3dlclRleHQgPSBtYXRjaFswXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIHN3aXRjaCAobG93ZXJUZXh0KSB7XG4gICAgICAgICAgICBjYXNlIFwiYWdvcmFcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy5ub3coY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCJob2plXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMudG9kYXkoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCJhbWFuaGFcIjpcbiAgICAgICAgICAgIGNhc2UgXCJhbWFuaMOjXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMudG9tb3Jyb3coY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCJvbnRlbVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnllc3RlcmRheShjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUFRDYXN1YWxEYXRlUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgZGF5anNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9kYXlqc1wiKTtcbmNvbnN0IGRheWpzXzIgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmNsYXNzIFBUQ2FzdWFsVGltZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiAvKD86ZXN0YVxccyopPyhtYW5oYXxtYW5ow6N8dGFyZGV8bWVpYS1ub2l0ZXxtZWlvLWRpYXxub2l0ZSkoPz1cXFd8JCkvaTtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldERhdGUgPSBkYXlqc18yLmRlZmF1bHQoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBzd2l0Y2ggKG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0YXJkZVwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm5vaXRlXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAyMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWFuaGFcIjpcbiAgICAgICAgICAgIGNhc2UgXCJtYW5ow6NcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1laWEtbm9pdGVcIjpcbiAgICAgICAgICAgICAgICBkYXlqc18xLmFzc2lnblRoZU5leHREYXkoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJzZWNvbmRcIiwgMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWVpby1kaWFcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDEyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBUQ2FzdWFsVGltZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gZXhwb3J0cy5wYXJzZURhdGUgPSBleHBvcnRzLnBhcnNlID0gZXhwb3J0cy5zdHJpY3QgPSBleHBvcnRzLmNhc3VhbCA9IHZvaWQgMDtcbmNvbnN0IGNvbmZpZ3VyYXRpb25zXzEgPSByZXF1aXJlKFwiLi4vLi4vY29uZmlndXJhdGlvbnNcIik7XG5jb25zdCBjaHJvbm9fMSA9IHJlcXVpcmUoXCIuLi8uLi9jaHJvbm9cIik7XG5jb25zdCBTbGFzaERhdGVGb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vY29tbW9uL3BhcnNlcnMvU2xhc2hEYXRlRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IFBUV2Vla2RheVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvUFRXZWVrZGF5UGFyc2VyXCIpKTtcbmNvbnN0IFBUVGltZUV4cHJlc3Npb25QYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL1BUVGltZUV4cHJlc3Npb25QYXJzZXJcIikpO1xuY29uc3QgUFRNZXJnZURhdGVUaW1lUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JlZmluZXJzL1BUTWVyZ2VEYXRlVGltZVJlZmluZXJcIikpO1xuY29uc3QgUFRNZXJnZURhdGVSYW5nZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWZpbmVycy9QVE1lcmdlRGF0ZVJhbmdlUmVmaW5lclwiKSk7XG5jb25zdCBQVE1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvUFRNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJcIikpO1xuY29uc3QgUFRDYXN1YWxEYXRlUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9QVENhc3VhbERhdGVQYXJzZXJcIikpO1xuY29uc3QgUFRDYXN1YWxUaW1lUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9QVENhc3VhbFRpbWVQYXJzZXJcIikpO1xuZXhwb3J0cy5jYXN1YWwgPSBuZXcgY2hyb25vXzEuQ2hyb25vKGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24oKSk7XG5leHBvcnRzLnN0cmljdCA9IG5ldyBjaHJvbm9fMS5DaHJvbm8oY3JlYXRlQ29uZmlndXJhdGlvbih0cnVlKSk7XG5mdW5jdGlvbiBwYXJzZSh0ZXh0LCByZWYsIG9wdGlvbikge1xuICAgIHJldHVybiBleHBvcnRzLmNhc3VhbC5wYXJzZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5mdW5jdGlvbiBwYXJzZURhdGUodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKTtcbn1cbmV4cG9ydHMucGFyc2VEYXRlID0gcGFyc2VEYXRlO1xuZnVuY3Rpb24gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbihsaXR0bGVFbmRpYW4gPSB0cnVlKSB7XG4gICAgY29uc3Qgb3B0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbihmYWxzZSwgbGl0dGxlRW5kaWFuKTtcbiAgICBvcHRpb24ucGFyc2Vycy5wdXNoKG5ldyBQVENhc3VhbERhdGVQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIG9wdGlvbi5wYXJzZXJzLnB1c2gobmV3IFBUQ2FzdWFsVGltZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgcmV0dXJuIG9wdGlvbjtcbn1cbmV4cG9ydHMuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbiA9IGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb247XG5mdW5jdGlvbiBjcmVhdGVDb25maWd1cmF0aW9uKHN0cmljdE1vZGUgPSB0cnVlLCBsaXR0bGVFbmRpYW4gPSB0cnVlKSB7XG4gICAgcmV0dXJuIGNvbmZpZ3VyYXRpb25zXzEuaW5jbHVkZUNvbW1vbkNvbmZpZ3VyYXRpb24oe1xuICAgICAgICBwYXJzZXJzOiBbXG4gICAgICAgICAgICBuZXcgU2xhc2hEYXRlRm9ybWF0UGFyc2VyXzEuZGVmYXVsdChsaXR0bGVFbmRpYW4pLFxuICAgICAgICAgICAgbmV3IFBUV2Vla2RheVBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBQVFRpbWVFeHByZXNzaW9uUGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IFBUTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICBdLFxuICAgICAgICByZWZpbmVyczogW25ldyBQVE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEuZGVmYXVsdCgpLCBuZXcgUFRNZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0KCldLFxuICAgIH0sIHN0cmljdE1vZGUpO1xufVxuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3JlZmluZXJzL0Fic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXCIpKTtcbmNsYXNzIE5MTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyIGV4dGVuZHMgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0IHtcbiAgICBwYXR0ZXJuQmV0d2VlbigpIHtcbiAgICAgICAgcmV0dXJuIC9eXFxzKih0b3R8LSlcXHMqJC9pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9yZWZpbmVycy9BYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXCIpKTtcbmNsYXNzIE5MTWVyZ2VEYXRlVGltZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEuZGVmYXVsdCB7XG4gICAgcGF0dGVybkJldHdlZW4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXlxcXFxzKihvbXxuYXx2b29yfGluIGRlfCx8LSk/XFxcXHMqJFwiKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBOTE1lcmdlRGF0ZVRpbWVSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHJlZmVyZW5jZXMgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9jYXN1YWxSZWZlcmVuY2VzXCIpKTtcbmNsYXNzIE5MQ2FzdWFsRGF0ZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gLyhudXx2YW5kYWFnfG1vcmdlbnxtb3JnZW5kfGdpc3RlcmVuKSg/PVxcV3wkKS9pO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbG93ZXJUZXh0ID0gbWF0Y2hbMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBzd2l0Y2ggKGxvd2VyVGV4dCkge1xuICAgICAgICAgICAgY2FzZSBcIm51XCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMubm93KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwidmFuZGFhZ1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwibW9yZ2VuXCI6XG4gICAgICAgICAgICBjYXNlIFwibW9yZ2VuZFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvbW9ycm93KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwiZ2lzdGVyZW5cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy55ZXN0ZXJkYXkoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MQ2FzdWFsRGF0ZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9pbmRleFwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IGRheWpzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmNvbnN0IGRheWpzXzIgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvZGF5anNcIik7XG5jb25zdCBEQVlfR1JPVVAgPSAxO1xuY29uc3QgTU9NRU5UX0dST1VQID0gMjtcbmNsYXNzIE5MQ2FzdWFsVGltZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiAvKGRlemUpP1xccyoobmFtaWRkYWd8YXZvbmR8bWlkZGVybmFjaHR8b2NodGVuZHxtaWRkYWd8J3MgbWlkZGFnc3wncyBhdm9uZHN8J3Mgb2NodGVuZHMpKD89XFxXfCQpL2k7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB0YXJnZXREYXRlID0gZGF5anNfMS5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKTtcbiAgICAgICAgaWYgKG1hdGNoW0RBWV9HUk9VUF0gPT09IFwiZGV6ZVwiKSB7XG4gICAgICAgICAgICBjb21wb25lbnQuYXNzaWduKFwiZGF5XCIsIGNvbnRleHQucmVmRGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICAgICAgY29tcG9uZW50LmFzc2lnbihcIm1vbnRoXCIsIGNvbnRleHQucmVmRGF0ZS5nZXRNb250aCgpICsgMSk7XG4gICAgICAgICAgICBjb21wb25lbnQuYXNzaWduKFwieWVhclwiLCBjb250ZXh0LnJlZkRhdGUuZ2V0RnVsbFllYXIoKSk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChtYXRjaFtNT01FTlRfR1JPVVBdLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJuYW1pZGRhZ1wiOlxuICAgICAgICAgICAgY2FzZSBcIidzIG5hbWlkZGFnc1wiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImF2b25kXCI6XG4gICAgICAgICAgICBjYXNlIFwiJ3MgYXZvbmRzJ1wiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMjApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1pZGRlcm5hY2h0XCI6XG4gICAgICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25UaGVOZXh0RGF5KGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm9jaHRlbmRcIjpcbiAgICAgICAgICAgIGNhc2UgXCIncyBvY2h0ZW5kc1wiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgNik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWlkZGFnXCI6XG4gICAgICAgICAgICBjYXNlIFwiJ3MgbWlkZGFnc1wiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gTkxDYXN1YWxUaW1lUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlVGltZVVuaXRzID0gZXhwb3J0cy5USU1FX1VOSVRTX1BBVFRFUk4gPSBleHBvcnRzLnBhcnNlWWVhciA9IGV4cG9ydHMuWUVBUl9QQVRURVJOID0gZXhwb3J0cy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuID0gZXhwb3J0cy5PUkRJTkFMX05VTUJFUl9QQVRURVJOID0gZXhwb3J0cy5wYXJzZU51bWJlclBhdHRlcm4gPSBleHBvcnRzLk5VTUJFUl9QQVRURVJOID0gZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWSA9IGV4cG9ydHMuT1JESU5BTF9XT1JEX0RJQ1RJT05BUlkgPSBleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZID0gZXhwb3J0cy5NT05USF9ESUNUSU9OQVJZID0gZXhwb3J0cy5XRUVLREFZX0RJQ1RJT05BUlkgPSB2b2lkIDA7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5leHBvcnRzLldFRUtEQVlfRElDVElPTkFSWSA9IHtcbiAgICB6b25kYWc6IDAsXG4gICAgem9uOiAwLFxuICAgIFwiem9uLlwiOiAwLFxuICAgIHpvOiAwLFxuICAgIFwiem8uXCI6IDAsXG4gICAgbWFhbmRhZzogMSxcbiAgICBtYTogMSxcbiAgICBcIm1hLlwiOiAxLFxuICAgIGRpbnNkYWc6IDIsXG4gICAgZGluOiAyLFxuICAgIFwiZGluLlwiOiAyLFxuICAgIGRpOiAyLFxuICAgIFwiZGkuXCI6IDIsXG4gICAgd29lbnNkYWc6IDMsXG4gICAgd29lOiAzLFxuICAgIFwid29lLlwiOiAzLFxuICAgIHdvOiAzLFxuICAgIFwid28uXCI6IDMsXG4gICAgZG9uZGVyZGFnOiA0LFxuICAgIGRvbmQ6IDQsXG4gICAgXCJkb25kLlwiOiA0LFxuICAgIGRvOiA0LFxuICAgIFwiZG8uXCI6IDQsXG4gICAgdnJpamRhZzogNSxcbiAgICB2cmlqOiA1LFxuICAgIFwidnJpai5cIjogNSxcbiAgICB2cjogNSxcbiAgICBcInZyLlwiOiA1LFxuICAgIHphdGVyZGFnOiA2LFxuICAgIHphdDogNixcbiAgICBcInphdC5cIjogNixcbiAgICBcInphXCI6IDYsXG4gICAgXCJ6YS5cIjogNixcbn07XG5leHBvcnRzLk1PTlRIX0RJQ1RJT05BUlkgPSB7XG4gICAgamFudWFyaTogMSxcbiAgICBqYW46IDEsXG4gICAgXCJqYW4uXCI6IDEsXG4gICAgZmVicnVhcmk6IDIsXG4gICAgZmViOiAyLFxuICAgIFwiZmViLlwiOiAyLFxuICAgIG1hYXJ0OiAzLFxuICAgIG1hcjogMyxcbiAgICBcIm1hci5cIjogMyxcbiAgICBhcHJpbDogNCxcbiAgICBhcHI6IDQsXG4gICAgXCJhcHIuXCI6IDQsXG4gICAgbWVpOiA1LFxuICAgIGp1bmk6IDYsXG4gICAganVuOiA2LFxuICAgIFwianVuLlwiOiA2LFxuICAgIGp1bGk6IDcsXG4gICAganVsOiA3LFxuICAgIFwianVsLlwiOiA3LFxuICAgIGF1Z3VzdHVzOiA4LFxuICAgIGF1ZzogOCxcbiAgICBcImF1Zy5cIjogOCxcbiAgICBzZXB0ZW1iZXI6IDksXG4gICAgc2VwOiA5LFxuICAgIFwic2VwLlwiOiA5LFxuICAgIHNlcHQ6IDksXG4gICAgXCJzZXB0LlwiOiA5LFxuICAgIG9rdG9iZXI6IDEwLFxuICAgIG9rdDogMTAsXG4gICAgXCJva3QuXCI6IDEwLFxuICAgIG5vdmVtYmVyOiAxMSxcbiAgICBub3Y6IDExLFxuICAgIFwibm92LlwiOiAxMSxcbiAgICBkZWNlbWJlcjogMTIsXG4gICAgZGVjOiAxMixcbiAgICBcImRlYy5cIjogMTIsXG59O1xuZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWSA9IHtcbiAgICBlZW46IDEsXG4gICAgdHdlZTogMixcbiAgICBkcmllOiAzLFxuICAgIHZpZXI6IDQsXG4gICAgdmlqZjogNSxcbiAgICB6ZXM6IDYsXG4gICAgemV2ZW46IDcsXG4gICAgYWNodDogOCxcbiAgICBuZWdlbjogOSxcbiAgICB0aWVuOiAxMCxcbiAgICBlbGY6IDExLFxuICAgIHR3YWFsZjogMTIsXG59O1xuZXhwb3J0cy5PUkRJTkFMX1dPUkRfRElDVElPTkFSWSA9IHtcbiAgICBlZXJzdGU6IDEsXG4gICAgdHdlZWRlOiAyLFxuICAgIGRlcmRlOiAzLFxuICAgIHZpZXJkZTogNCxcbiAgICB2aWpmZGU6IDUsXG4gICAgemVzZGU6IDYsXG4gICAgemV2ZW5kZTogNyxcbiAgICBhY2h0c3RlOiA4LFxuICAgIG5lZ2VuZGU6IDksXG4gICAgdGllbmRlOiAxMCxcbiAgICBlbGZkZTogMTEsXG4gICAgdHdhYWxmZGU6IDEyLFxuICAgIGRlcnRpZW5kZTogMTMsXG4gICAgdmVlcnRpZW5kZTogMTQsXG4gICAgdmlqZnRpZW5kZTogMTUsXG4gICAgemVzdGllbmRlOiAxNixcbiAgICB6ZXZlbnRpZW5kZTogMTcsXG4gICAgYWNodHRpZW5kZTogMTgsXG4gICAgbmVnZW50aWVuZGU6IDE5LFxuICAgIHR3aW50aWdzdGU6IDIwLFxuICAgIFwiZWVuZW50d2ludGlnc3RlXCI6IDIxLFxuICAgIFwidHdlZcOrbnR3aW50aWdzdGVcIjogMjIsXG4gICAgXCJkcmllZW50d2ludGlnc3RlXCI6IDIzLFxuICAgIFwidmllcmVudHdpbnRpZ3N0ZVwiOiAyNCxcbiAgICBcInZpamZlbnR3aW50aWdzdGVcIjogMjUsXG4gICAgXCJ6ZXNlbnR3aW50aWdzdGVcIjogMjYsXG4gICAgXCJ6ZXZlbmVudHdpbnRpZ3N0ZVwiOiAyNyxcbiAgICBcImFjaHRlbnR3aW50aWdcIjogMjgsXG4gICAgXCJuZWdlbmVudHdpbnRpZ1wiOiAyOSxcbiAgICBcImRlcnRpZ3N0ZVwiOiAzMCxcbiAgICBcImVlbmVuZGVydGlnc3RlXCI6IDMxLFxufTtcbmV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUlkgPSB7XG4gICAgc2VjOiBcInNlY29uZFwiLFxuICAgIHNlY29uZDogXCJzZWNvbmRcIixcbiAgICBzZWNvbmRlbjogXCJzZWNvbmRcIixcbiAgICBtaW46IFwibWludXRlXCIsXG4gICAgbWluczogXCJtaW51dGVcIixcbiAgICBtaW51dGU6IFwibWludXRlXCIsXG4gICAgbWludXRlbjogXCJtaW51dGVcIixcbiAgICBoOiBcImhvdXJcIixcbiAgICBocjogXCJob3VyXCIsXG4gICAgaHJzOiBcImhvdXJcIixcbiAgICB1dXI6IFwiaG91clwiLFxuICAgIHVyZW46IFwiaG91clwiLFxuICAgIGRhZzogXCJkXCIsXG4gICAgZGFnZW46IFwiZFwiLFxuICAgIHdlZWs6IFwid2Vla1wiLFxuICAgIHdla2VuOiBcIndlZWtcIixcbiAgICBtYWFuZDogXCJtb250aFwiLFxuICAgIG1hYW5kZW46IFwibW9udGhcIixcbiAgICBqYWFyOiBcInllYXJcIixcbiAgICBqcjogXCJ5ZWFyXCIsXG4gICAgamFyZW46IFwieWVhclwiLFxufTtcbmV4cG9ydHMuTlVNQkVSX1BBVFRFUk4gPSBgKD86JHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkpfXxbMC05XSt8WzAtOV0rXFxcXC5bMC05XSt8ZWVuP3xoYWx2ZT8pYDtcbmZ1bmN0aW9uIHBhcnNlTnVtYmVyUGF0dGVybihtYXRjaCkge1xuICAgIGNvbnN0IG51bSA9IG1hdGNoLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUllbbnVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZW251bV07XG4gICAgfVxuICAgIGVsc2UgaWYgKG51bSA9PT0gXCJlZW5cIikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9oYWx2ZT8vKSkge1xuICAgICAgICByZXR1cm4gMC41O1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VGbG9hdChudW0pO1xufVxuZXhwb3J0cy5wYXJzZU51bWJlclBhdHRlcm4gPSBwYXJzZU51bWJlclBhdHRlcm47XG5leHBvcnRzLk9SRElOQUxfTlVNQkVSX1BBVFRFUk4gPSBgKD86JHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGV4cG9ydHMuT1JESU5BTF9XT1JEX0RJQ1RJT05BUlkpfXxbMC05XXsxLDJ9KD86c3RlfGRlKT8pYDtcbmZ1bmN0aW9uIHBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm4obWF0Y2gpIHtcbiAgICBsZXQgbnVtID0gbWF0Y2gudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoZXhwb3J0cy5PUkRJTkFMX1dPUkRfRElDVElPTkFSWVtudW1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuT1JESU5BTF9XT1JEX0RJQ1RJT05BUllbbnVtXTtcbiAgICB9XG4gICAgbnVtID0gbnVtLnJlcGxhY2UoLyg/OnN0ZXxkZSkkL2ksIFwiXCIpO1xuICAgIHJldHVybiBwYXJzZUludChudW0pO1xufVxuZXhwb3J0cy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuID0gcGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybjtcbmV4cG9ydHMuWUVBUl9QQVRURVJOID0gYCg/OlsxLTldWzAtOV17MCwzfVxcXFxzKig/OnZvb3IgQ2hyaXN0dXN8bmEgQ2hyaXN0dXMpfFsxLTJdWzAtOV17M318WzUtOV1bMC05XSlgO1xuZnVuY3Rpb24gcGFyc2VZZWFyKG1hdGNoKSB7XG4gICAgaWYgKC92b29yIENocmlzdHVzL2kudGVzdChtYXRjaCkpIHtcbiAgICAgICAgbWF0Y2ggPSBtYXRjaC5yZXBsYWNlKC92b29yIENocmlzdHVzL2ksIFwiXCIpO1xuICAgICAgICByZXR1cm4gLXBhcnNlSW50KG1hdGNoKTtcbiAgICB9XG4gICAgaWYgKC9uYSBDaHJpc3R1cy9pLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIG1hdGNoID0gbWF0Y2gucmVwbGFjZSgvbmEgQ2hyaXN0dXMvaSwgXCJcIik7XG4gICAgICAgIHJldHVybiBwYXJzZUludChtYXRjaCk7XG4gICAgfVxuICAgIGNvbnN0IHJhd1llYXJOdW1iZXIgPSBwYXJzZUludChtYXRjaCk7XG4gICAgcmV0dXJuIHllYXJzXzEuZmluZE1vc3RMaWtlbHlBRFllYXIocmF3WWVhck51bWJlcik7XG59XG5leHBvcnRzLnBhcnNlWWVhciA9IHBhcnNlWWVhcjtcbmNvbnN0IFNJTkdMRV9USU1FX1VOSVRfUEFUVEVSTiA9IGAoJHtleHBvcnRzLk5VTUJFUl9QQVRURVJOfSlcXFxcc3swLDV9KCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihleHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZKX0pXFxcXHN7MCw1fWA7XG5jb25zdCBTSU5HTEVfVElNRV9VTklUX1JFR0VYID0gbmV3IFJlZ0V4cChTSU5HTEVfVElNRV9VTklUX1BBVFRFUk4sIFwiaVwiKTtcbmV4cG9ydHMuVElNRV9VTklUU19QQVRURVJOID0gcGF0dGVybl8xLnJlcGVhdGVkVGltZXVuaXRQYXR0ZXJuKGAoPzooPzpiaW5uZW58aW4pXFxcXHMqKT9gLCBTSU5HTEVfVElNRV9VTklUX1BBVFRFUk4pO1xuZnVuY3Rpb24gcGFyc2VUaW1lVW5pdHModGltZXVuaXRUZXh0KSB7XG4gICAgY29uc3QgZnJhZ21lbnRzID0ge307XG4gICAgbGV0IHJlbWFpbmluZ1RleHQgPSB0aW1ldW5pdFRleHQ7XG4gICAgbGV0IG1hdGNoID0gU0lOR0xFX1RJTUVfVU5JVF9SRUdFWC5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICBjb2xsZWN0RGF0ZVRpbWVGcmFnbWVudChmcmFnbWVudHMsIG1hdGNoKTtcbiAgICAgICAgcmVtYWluaW5nVGV4dCA9IHJlbWFpbmluZ1RleHQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgIG1hdGNoID0gU0lOR0xFX1RJTUVfVU5JVF9SRUdFWC5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZ21lbnRzO1xufVxuZXhwb3J0cy5wYXJzZVRpbWVVbml0cyA9IHBhcnNlVGltZVVuaXRzO1xuZnVuY3Rpb24gY29sbGVjdERhdGVUaW1lRnJhZ21lbnQoZnJhZ21lbnRzLCBtYXRjaCkge1xuICAgIGNvbnN0IG51bSA9IHBhcnNlTnVtYmVyUGF0dGVybihtYXRjaFsxXSk7XG4gICAgY29uc3QgdW5pdCA9IGV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUllbbWF0Y2hbMl0udG9Mb3dlckNhc2UoKV07XG4gICAgZnJhZ21lbnRzW3VuaXRdID0gbnVtO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCByZXN1bHRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcmVzdWx0c1wiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNsYXNzIE5MVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChgKD86YmlubmVufGlufGJpbm5lbiBkZXx2b29yKVxcXFxzKmAgKyBcIihcIiArIGNvbnN0YW50c18xLlRJTUVfVU5JVFNfUEFUVEVSTiArIFwiKVwiICsgYCg/PVxcXFxXfCQpYCwgXCJpXCIpO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgdGltZVVuaXRzID0gY29uc3RhbnRzXzEucGFyc2VUaW1lVW5pdHMobWF0Y2hbMV0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzLmNyZWF0ZVJlbGF0aXZlRnJvbVJlZkRhdGUoY29udGV4dC5yZWZEYXRlLCB0aW1lVW5pdHMpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uLy4uL25sL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3Qgd2Vla3NfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi93ZWVrc1wiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiKD86KD86XFxcXCx8XFxcXCh8XFxcXO+8iClcXFxccyopP1wiICtcbiAgICBcIig/Om9wXFxcXHMqPyk/XCIgK1xuICAgIFwiKD86KGRlemV8dm9yaWdlfHZvbGdlbmRlKVxcXFxzKig/OndlZWtcXFxccyopPyk/XCIgK1xuICAgIGAoJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWSl9KWAgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgUFJFRklYX0dST1VQID0gMTtcbmNvbnN0IFdFRUtEQVlfR1JPVVAgPSAyO1xuY29uc3QgUE9TVEZJWF9HUk9VUCA9IDM7XG5jbGFzcyBOTFdlZWtkYXlQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGRheU9mV2VlayA9IG1hdGNoW1dFRUtEQVlfR1JPVVBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWVtkYXlPZldlZWtdO1xuICAgICAgICBjb25zdCBwcmVmaXggPSBtYXRjaFtQUkVGSVhfR1JPVVBdO1xuICAgICAgICBjb25zdCBwb3N0Zml4ID0gbWF0Y2hbUE9TVEZJWF9HUk9VUF07XG4gICAgICAgIGxldCBtb2RpZmllcldvcmQgPSBwcmVmaXggfHwgcG9zdGZpeDtcbiAgICAgICAgbW9kaWZpZXJXb3JkID0gbW9kaWZpZXJXb3JkIHx8IFwiXCI7XG4gICAgICAgIG1vZGlmaWVyV29yZCA9IG1vZGlmaWVyV29yZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgbW9kaWZpZXIgPSBudWxsO1xuICAgICAgICBpZiAobW9kaWZpZXJXb3JkID09IFwidm9yaWdlXCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJsYXN0XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW9kaWZpZXJXb3JkID09IFwidm9sZ2VuZGVcIikge1xuICAgICAgICAgICAgbW9kaWZpZXIgPSBcIm5leHRcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtb2RpZmllcldvcmQgPT0gXCJkZXplXCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJ0aGlzXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0ZSA9IHdlZWtzXzEudG9EYXlKU1dlZWtkYXkoY29udGV4dC5yZWZEYXRlLCBvZmZzZXQsIG1vZGlmaWVyKTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHRcbiAgICAgICAgICAgIC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpXG4gICAgICAgICAgICAuYXNzaWduKFwid2Vla2RheVwiLCBvZmZzZXQpXG4gICAgICAgICAgICAuaW1wbHkoXCJkYXlcIiwgZGF0ZS5kYXRlKCkpXG4gICAgICAgICAgICAuaW1wbHkoXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKVxuICAgICAgICAgICAgLmltcGx5KFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gTkxXZWVrZGF5UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgY29uc3RhbnRzXzIgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgY29uc3RhbnRzXzMgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIig/Om9uXFxcXHMqPyk/XCIgK1xuICAgIGAoJHtjb25zdGFudHNfMi5PUkRJTkFMX05VTUJFUl9QQVRURVJOfSlgICtcbiAgICBcIig/OlxcXFxzKlwiICtcbiAgICBcIig/OnRvdHxcXFxcLXxcXFxc4oCTfHVudGlsfHRocm91Z2h8dGlsbHxcXFxccylcXFxccypcIiArXG4gICAgYCgke2NvbnN0YW50c18yLk9SRElOQUxfTlVNQkVSX1BBVFRFUk59KWAgK1xuICAgIFwiKT9cIiArXG4gICAgXCIoPzotfC98XFxcXHMqKD86b2YpP1xcXFxzKilcIiArXG4gICAgXCIoXCIgK1xuICAgIHBhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWSkgK1xuICAgIFwiKVwiICtcbiAgICBcIig/OlwiICtcbiAgICBcIig/Oi18L3wsP1xcXFxzKilcIiArXG4gICAgYCgke2NvbnN0YW50c18zLllFQVJfUEFUVEVSTn0oPyFbXlxcXFxzXVxcXFxkKSlgICtcbiAgICBcIik/XCIgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDM7XG5jb25zdCBEQVRFX0dST1VQID0gMTtcbmNvbnN0IERBVEVfVE9fR1JPVVAgPSAyO1xuY29uc3QgWUVBUl9HUk9VUCA9IDQ7XG5jbGFzcyBOTE1vbnRoTmFtZU1pZGRsZUVuZGlhblBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbW9udGggPSBjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZW21hdGNoW01PTlRIX05BTUVfR1JPVVBdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBjb25zdCBkYXkgPSBjb25zdGFudHNfMi5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoW0RBVEVfR1JPVVBdKTtcbiAgICAgICAgaWYgKGRheSA+IDMxKSB7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbREFURV9HUk9VUF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoe1xuICAgICAgICAgICAgZGF5OiBkYXksXG4gICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobWF0Y2hbWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSBjb25zdGFudHNfMy5wYXJzZVllYXIobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IHllYXJzXzEuZmluZFllYXJDbG9zZXN0VG9SZWYoY29udGV4dC5yZWZEYXRlLCBkYXksIG1vbnRoKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbWF0Y2hbREFURV9UT19HUk9VUF0pIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVuZERhdGUgPSBjb25zdGFudHNfMi5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoW0RBVEVfVE9fR1JPVVBdKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nUmVzdWx0KG1hdGNoLmluZGV4LCBtYXRjaFswXSk7XG4gICAgICAgIHJlc3VsdC5zdGFydCA9IGNvbXBvbmVudHM7XG4gICAgICAgIHJlc3VsdC5lbmQgPSBjb21wb25lbnRzLmNsb25lKCk7XG4gICAgICAgIHJlc3VsdC5lbmQuYXNzaWduKFwiZGF5XCIsIGVuZERhdGUpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MTW9udGhOYW1lTWlkZGxlRW5kaWFuUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBjb25zdGFudHNfMiA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChgKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZKX0pYCArXG4gICAgYFxcXFxzKmAgK1xuICAgIGAoPzpgICtcbiAgICBgWywtXT9cXFxccyooJHtjb25zdGFudHNfMi5ZRUFSX1BBVFRFUk59KT9gICtcbiAgICBcIik/XCIgK1xuICAgIFwiKD89W15cXFxcc1xcXFx3XXxcXFxccytbXjAtOV18XFxcXHMrJHwkKVwiLCBcImlcIik7XG5jb25zdCBNT05USF9OQU1FX0dST1VQID0gMTtcbmNvbnN0IFlFQVJfR1JPVVAgPSAyO1xuY2xhc3MgTkxNb250aE5hbWVQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJkYXlcIiwgMSk7XG4gICAgICAgIGNvbnN0IG1vbnRoTmFtZSA9IG1hdGNoW01PTlRIX05BTUVfR1JPVVBdO1xuICAgICAgICBjb25zdCBtb250aCA9IGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUllbbW9udGhOYW1lLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1vbnRoXCIsIG1vbnRoKTtcbiAgICAgICAgaWYgKG1hdGNoW1lFQVJfR1JPVVBdKSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0gY29uc3RhbnRzXzIucGFyc2VZZWFyKG1hdGNoW1lFQVJfR1JPVVBdKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSB5ZWFyc18xLmZpbmRZZWFyQ2xvc2VzdFRvUmVmKGNvbnRleHQucmVmRGF0ZSwgMSwgbW9udGgpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gTkxNb250aE5hbWVQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiKFswLTldfDBbMS05XXwxWzAxMl0pLyhbMC05XXs0fSlcIiArIFwiXCIsIFwiaVwiKTtcbmNvbnN0IE1PTlRIX0dST1VQID0gMTtcbmNvbnN0IFlFQVJfR1JPVVAgPSAyO1xuY2xhc3MgTkxTbGFzaE1vbnRoRm9ybWF0UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB5ZWFyID0gcGFyc2VJbnQobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICBjb25zdCBtb250aCA9IHBhcnNlSW50KG1hdGNoW01PTlRIX0dST1VQXSk7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCkuaW1wbHkoXCJkYXlcIiwgMSkuYXNzaWduKFwibW9udGhcIiwgbW9udGgpLmFzc2lnbihcInllYXJcIiwgeWVhcik7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gTkxTbGFzaE1vbnRoRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlclwiKTtcbmNsYXNzIE5MVGltZUV4cHJlc3Npb25QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXzEuQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlciB7XG4gICAgcHJpbWFyeVByZWZpeCgpIHtcbiAgICAgICAgcmV0dXJuIFwiKD86KD86b20pXFxcXHMqKT9cIjtcbiAgICB9XG4gICAgZm9sbG93aW5nUGhhc2UoKSB7XG4gICAgICAgIHJldHVybiBcIlxcXFxzKig/OlxcXFwtfFxcXFzigJN8XFxcXH58XFxcXOOAnHxvbXxcXFxcPylcXFxccypcIjtcbiAgICB9XG4gICAgZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBpZiAobWF0Y2hbMF0ubWF0Y2goL15cXHMqXFxkezR9XFxzKiQvKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLmV4dHJhY3RQcmltYXJ5VGltZUNvbXBvbmVudHMoY29udGV4dCwgbWF0Y2gpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MVGltZUV4cHJlc3Npb25QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoYChbMC05XXs0fSlbXFxcXC5cXFxcL1xcXFxzXWAgK1xuICAgIGAoPzooJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUlkpfSl8KFswLTldezEsMn0pKVtcXFxcLlxcXFwvXFxcXHNdYCArXG4gICAgYChbMC05XXsxLDJ9KWAgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgWUVBUl9OVU1CRVJfR1JPVVAgPSAxO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDI7XG5jb25zdCBNT05USF9OVU1CRVJfR1JPVVAgPSAzO1xuY29uc3QgREFURV9OVU1CRVJfR1JPVVAgPSA0O1xuY2xhc3MgTkxDYXN1YWxZZWFyTW9udGhEYXlQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gbWF0Y2hbTU9OVEhfTlVNQkVSX0dST1VQXVxuICAgICAgICAgICAgPyBwYXJzZUludChtYXRjaFtNT05USF9OVU1CRVJfR1JPVVBdKVxuICAgICAgICAgICAgOiBjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZW21hdGNoW01PTlRIX05BTUVfR1JPVVBdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBpZiAobW9udGggPCAxIHx8IG1vbnRoID4gMTIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHllYXIgPSBwYXJzZUludChtYXRjaFtZRUFSX05VTUJFUl9HUk9VUF0pO1xuICAgICAgICBjb25zdCBkYXkgPSBwYXJzZUludChtYXRjaFtEQVRFX05VTUJFUl9HUk9VUF0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF5OiBkYXksXG4gICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY29uc3QgZGF5anNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9kYXlqc1wiKTtcbmNvbnN0IGRheWpzXzIgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRheWpzXCIpKTtcbmNvbnN0IERBVEVfR1JPVVAgPSAxO1xuY29uc3QgVElNRV9PRl9EQVlfR1JPVVAgPSAyO1xuY2xhc3MgTkxDYXN1YWxEYXRlVGltZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gLyhnaXN0ZXJlbnxtb3JnZW58dmFuKShvY2h0ZW5kfG1pZGRhZ3xuYW1pZGRhZ3xhdm9uZHxuYWNodCkoPz1cXFd8JCkvaTtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGRhdGVUZXh0ID0gbWF0Y2hbREFURV9HUk9VUF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgdGltZVRleHQgPSBtYXRjaFtUSU1FX09GX0RBWV9HUk9VUF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBjb25zdCB0YXJnZXREYXRlID0gZGF5anNfMi5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIHN3aXRjaCAoZGF0ZVRleHQpIHtcbiAgICAgICAgICAgIGNhc2UgXCJnaXN0ZXJlblwiOlxuICAgICAgICAgICAgICAgIGRheWpzXzEuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlLmFkZCgtMSwgXCJkYXlcIikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInZhblwiOlxuICAgICAgICAgICAgICAgIGRheWpzXzEuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtb3JnZW5cIjpcbiAgICAgICAgICAgICAgICBkYXlqc18xLmFzc2lnblRoZU5leHREYXkoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRpbWVUZXh0KSB7XG4gICAgICAgICAgICBjYXNlIFwib2NodGVuZFwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgNik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWlkZGFnXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAxMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibmFtaWRkYWdcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDE1KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJhdm9uZFwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMjApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gTkxDYXN1YWxEYXRlVGltZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gZXhwb3J0cy5wYXJzZURhdGUgPSBleHBvcnRzLnBhcnNlID0gZXhwb3J0cy5zdHJpY3QgPSBleHBvcnRzLmNhc3VhbCA9IHZvaWQgMDtcbmNvbnN0IGNvbmZpZ3VyYXRpb25zXzEgPSByZXF1aXJlKFwiLi4vLi4vY29uZmlndXJhdGlvbnNcIik7XG5jb25zdCBjaHJvbm9fMSA9IHJlcXVpcmUoXCIuLi8uLi9jaHJvbm9cIik7XG5jb25zdCBOTE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JlZmluZXJzL05MTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXCIpKTtcbmNvbnN0IE5MTWVyZ2VEYXRlVGltZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWZpbmVycy9OTE1lcmdlRGF0ZVRpbWVSZWZpbmVyXCIpKTtcbmNvbnN0IE5MQ2FzdWFsRGF0ZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvTkxDYXN1YWxEYXRlUGFyc2VyXCIpKTtcbmNvbnN0IE5MQ2FzdWFsVGltZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvTkxDYXN1YWxUaW1lUGFyc2VyXCIpKTtcbmNvbnN0IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9jb21tb24vcGFyc2Vycy9TbGFzaERhdGVGb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgTkxUaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvTkxUaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBOTFdlZWtkYXlQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MV2Vla2RheVBhcnNlclwiKSk7XG5jb25zdCBOTE1vbnRoTmFtZU1pZGRsZUVuZGlhblBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvTkxNb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXJcIikpO1xuY29uc3QgTkxNb250aE5hbWVQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MTW9udGhOYW1lUGFyc2VyXCIpKTtcbmNvbnN0IE5MU2xhc2hNb250aEZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvTkxTbGFzaE1vbnRoRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IE5MVGltZUV4cHJlc3Npb25QYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MVGltZUV4cHJlc3Npb25QYXJzZXJcIikpO1xuY29uc3QgTkxDYXN1YWxZZWFyTW9udGhEYXlQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyXCIpKTtcbmNvbnN0IE5MQ2FzdWFsRGF0ZVRpbWVQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MQ2FzdWFsRGF0ZVRpbWVQYXJzZXJcIikpO1xuZXhwb3J0cy5jYXN1YWwgPSBuZXcgY2hyb25vXzEuQ2hyb25vKGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24oKSk7XG5leHBvcnRzLnN0cmljdCA9IG5ldyBjaHJvbm9fMS5DaHJvbm8oY3JlYXRlQ29uZmlndXJhdGlvbih0cnVlKSk7XG5mdW5jdGlvbiBwYXJzZSh0ZXh0LCByZWYsIG9wdGlvbikge1xuICAgIHJldHVybiBleHBvcnRzLmNhc3VhbC5wYXJzZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5mdW5jdGlvbiBwYXJzZURhdGUodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKTtcbn1cbmV4cG9ydHMucGFyc2VEYXRlID0gcGFyc2VEYXRlO1xuZnVuY3Rpb24gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbihsaXR0bGVFbmRpYW4gPSB0cnVlKSB7XG4gICAgY29uc3Qgb3B0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbihmYWxzZSwgbGl0dGxlRW5kaWFuKTtcbiAgICBvcHRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBOTENhc3VhbERhdGVQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IE5MQ2FzdWFsVGltZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgTkxDYXN1YWxEYXRlVGltZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgcmV0dXJuIG9wdGlvbjtcbn1cbmV4cG9ydHMuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbiA9IGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb247XG5mdW5jdGlvbiBjcmVhdGVDb25maWd1cmF0aW9uKHN0cmljdE1vZGUgPSB0cnVlLCBsaXR0bGVFbmRpYW4gPSB0cnVlKSB7XG4gICAgcmV0dXJuIGNvbmZpZ3VyYXRpb25zXzEuaW5jbHVkZUNvbW1vbkNvbmZpZ3VyYXRpb24oe1xuICAgICAgICBwYXJzZXJzOiBbXG4gICAgICAgICAgICBuZXcgU2xhc2hEYXRlRm9ybWF0UGFyc2VyXzEuZGVmYXVsdChsaXR0bGVFbmRpYW4pLFxuICAgICAgICAgICAgbmV3IE5MTW9udGhOYW1lTWlkZGxlRW5kaWFuUGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IE5MTW9udGhOYW1lUGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IE5MVGltZUV4cHJlc3Npb25QYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgTkxUaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBOTFNsYXNoTW9udGhGb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgTkxXZWVrZGF5UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IE5MQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICBdLFxuICAgICAgICByZWZpbmVyczogW25ldyBOTE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEuZGVmYXVsdCgpLCBuZXcgTkxNZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0KCldLFxuICAgIH0sIHN0cmljdE1vZGUpO1xufVxuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlRGF0ZSA9IGV4cG9ydHMucGFyc2UgPSBleHBvcnRzLmNhc3VhbCA9IGV4cG9ydHMuc3RyaWN0ID0gZXhwb3J0cy5ubCA9IGV4cG9ydHMucHQgPSBleHBvcnRzLmphID0gZXhwb3J0cy5mciA9IGV4cG9ydHMuZGUgPSBleHBvcnRzLk1lcmlkaWVtID0gZXhwb3J0cy5DaHJvbm8gPSBleHBvcnRzLmVuID0gdm9pZCAwO1xuY29uc3QgZW4gPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vbG9jYWxlcy9lblwiKSk7XG5leHBvcnRzLmVuID0gZW47XG5jb25zdCBjaHJvbm9fMSA9IHJlcXVpcmUoXCIuL2Nocm9ub1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkNocm9ub1wiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY2hyb25vXzEuQ2hyb25vOyB9IH0pO1xudmFyIE1lcmlkaWVtO1xuKGZ1bmN0aW9uIChNZXJpZGllbSkge1xuICAgIE1lcmlkaWVtW01lcmlkaWVtW1wiQU1cIl0gPSAwXSA9IFwiQU1cIjtcbiAgICBNZXJpZGllbVtNZXJpZGllbVtcIlBNXCJdID0gMV0gPSBcIlBNXCI7XG59KShNZXJpZGllbSA9IGV4cG9ydHMuTWVyaWRpZW0gfHwgKGV4cG9ydHMuTWVyaWRpZW0gPSB7fSkpO1xuY29uc3QgZGUgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vbG9jYWxlcy9kZVwiKSk7XG5leHBvcnRzLmRlID0gZGU7XG5jb25zdCBmciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9sb2NhbGVzL2ZyXCIpKTtcbmV4cG9ydHMuZnIgPSBmcjtcbmNvbnN0IGphID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2xvY2FsZXMvamFcIikpO1xuZXhwb3J0cy5qYSA9IGphO1xuY29uc3QgcHQgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vbG9jYWxlcy9wdFwiKSk7XG5leHBvcnRzLnB0ID0gcHQ7XG5jb25zdCBubCA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9sb2NhbGVzL25sXCIpKTtcbmV4cG9ydHMubmwgPSBubDtcbmV4cG9ydHMuc3RyaWN0ID0gZW4uc3RyaWN0O1xuZXhwb3J0cy5jYXN1YWwgPSBlbi5jYXN1YWw7XG5mdW5jdGlvbiBwYXJzZSh0ZXh0LCByZWYsIG9wdGlvbikge1xuICAgIHJldHVybiBleHBvcnRzLmNhc3VhbC5wYXJzZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5mdW5jdGlvbiBwYXJzZURhdGUodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKTtcbn1cbmV4cG9ydHMucGFyc2VEYXRlID0gcGFyc2VEYXRlO1xuIiwiaW1wb3J0IHtcclxuICBBcHAsXHJcbiAgTW9kYWwsXHJcbiAgTW9tZW50Rm9ybWF0Q29tcG9uZW50LFxyXG4gIFBsdWdpbixcclxuICBQbHVnaW5TZXR0aW5nVGFiLFxyXG4gIFNldHRpbmcsXHJcbiAgVGV4dENvbXBvbmVudCxcclxuICBCdXR0b25Db21wb25lbnQsXHJcbiAgTWFya2Rvd25WaWV3LFxyXG4gIFRvZ2dsZUNvbXBvbmVudCxcclxufSBmcm9tIFwib2JzaWRpYW5cIjtcclxuXHJcbmltcG9ydCB7XHJcbiAgY3JlYXRlRGFpbHlOb3RlLFxyXG4gIGdldEFsbERhaWx5Tm90ZXMsXHJcbiAgZ2V0RGFpbHlOb3RlLFxyXG59IGZyb20gXCJvYnNpZGlhbi1kYWlseS1ub3Rlcy1pbnRlcmZhY2VcIjtcclxuXHJcbmltcG9ydCBjaHJvbm8gZnJvbSBcImNocm9uby1ub2RlXCI7XHJcblxyXG52YXIgZ2V0TGFzdERheU9mTW9udGggPSBmdW5jdGlvbiAoeTogYW55LCBtOiBhbnkpIHtcclxuICByZXR1cm4gbmV3IERhdGUoeSwgbSwgMCkuZ2V0RGF0ZSgpO1xyXG59O1xyXG5cclxuY29uc3QgY3VzdG9tID0gY2hyb25vLmNhc3VhbC5jbG9uZSgpO1xyXG5cclxuY3VzdG9tLnBhcnNlcnMucHVzaCh7XHJcbiAgcGF0dGVybjogKCkgPT4ge1xyXG4gICAgcmV0dXJuIC9cXGJDaHJpc3RtYXNcXGIvaTtcclxuICB9LFxyXG4gIGV4dHJhY3Q6IChjb250ZXh0OiBhbnksIG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkYXk6IDI1LFxyXG4gICAgICBtb250aDogMTIsXHJcbiAgICB9O1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuaW50ZXJmYWNlIE5MRFJlc3VsdCB7XHJcbiAgZm9ybWF0dGVkU3RyaW5nOiBzdHJpbmc7XHJcbiAgZGF0ZTogRGF0ZTtcclxuICBtb21lbnQ6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF0dXJhbExhbmd1YWdlRGF0ZXMgZXh0ZW5kcyBQbHVnaW4ge1xyXG4gIHNldHRpbmdzOiBOTERTZXR0aW5ncztcclxuXHJcbiAgb25Jbml0KCkge31cclxuXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJMb2FkaW5nIG5hdHVyYWwgbGFuZ3VhZ2UgZGF0ZSBwYXJzZXIgcGx1Z2luXCIpO1xyXG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogXCJubHAtZGF0ZXNcIixcclxuICAgICAgbmFtZTogXCJQYXJzZSBuYXR1cmFsIGxhbmd1YWdlIGRhdGVcIixcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMub25UcmlnZ2VyKFwicmVwbGFjZVwiKSxcclxuICAgICAgaG90a2V5czogW10sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogXCJubHAtZGF0ZXMtbGlua1wiLFxyXG4gICAgICBuYW1lOiBcIlBhcnNlIG5hdHVyYWwgbGFuZ3VhZ2UgZGF0ZSAoYXMgbGluaylcIixcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMub25UcmlnZ2VyKFwibGlua1wiKSxcclxuICAgICAgaG90a2V5czogW10sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogXCJubHAtZGF0ZS1jbGVhblwiLFxyXG4gICAgICBuYW1lOiBcIlBhcnNlIG5hdHVyYWwgbGFuZ3VhZ2UgZGF0ZSAoYXMgcGxhaW4gdGV4dClcIixcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMub25UcmlnZ2VyKFwiY2xlYW5cIiksXHJcbiAgICAgIGhvdGtleXM6IFtdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6IFwibmxwLXBhcnNlLXRpbWVcIixcclxuICAgICAgbmFtZTogXCJQYXJzZSBuYXR1cmFsIGxhbmd1YWdlIHRpbWVcIixcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMub25UcmlnZ2VyKFwidGltZVwiKSxcclxuICAgICAgaG90a2V5czogW10sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogXCJubHAtbm93XCIsXHJcbiAgICAgIG5hbWU6IFwiSW5zZXJ0IHRoZSBjdXJyZW50IGRhdGUgYW5kIHRpbWVcIixcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuZ2V0Tm93Q29tbWFuZCgpLFxyXG4gICAgICBob3RrZXlzOiBbXSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiBcIm5scC10b2RheVwiLFxyXG4gICAgICBuYW1lOiBcIkluc2VydCB0aGUgY3VycmVudCBkYXRlXCIsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLmdldERhdGVDb21tYW5kKCksXHJcbiAgICAgIGhvdGtleXM6IFtdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6IFwibmxwLXRpbWVcIixcclxuICAgICAgbmFtZTogXCJJbnNlcnQgdGhlIGN1cnJlbnQgdGltZVwiLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5nZXRUaW1lQ29tbWFuZCgpLFxyXG4gICAgICBob3RrZXlzOiBbXSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiBcIm5scC1waWNrZXJcIixcclxuICAgICAgbmFtZTogXCJEYXRlIHBpY2tlclwiLFxyXG4gICAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICBsZXQgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG4gICAgICAgIGlmIChsZWFmKSB7XHJcbiAgICAgICAgICBpZiAoIWNoZWNraW5nKSB7XHJcbiAgICAgICAgICAgIG5ldyBQYXJzZU1vbWVudE1vZGFsKHRoaXMuYXBwLCB0aGlzKS5vcGVuKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9LFxyXG4gICAgICBob3RrZXlzOiBbXSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgTkxEU2V0dGluZ3NUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnJlZ2lzdGVyT2JzaWRpYW5Qcm90b2NvbEhhbmRsZXIoXCJubGRhdGVzXCIsIHRoaXMuYWN0aW9uSGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIG9udW5sb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJVbmxvYWRpbmcgbmF0dXJhbCBsYW5ndWFnZSBkYXRlIHBhcnNlciBwbHVnaW5cIik7XHJcbiAgfVxyXG5cclxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKVxyXG4gIH1cclxuXHJcbiAgZ2V0UGFyc2VkRGF0ZShzZWxlY3RlZFRleHQ6IHN0cmluZyk6IERhdGUge1xyXG4gICAgdmFyIG5leHREYXRlTWF0Y2ggPSBzZWxlY3RlZFRleHQubWF0Y2goL25leHRcXHMoW1xcd10rKS9pKTtcclxuICAgIHZhciBsYXN0RGF5T2ZNYXRjaCA9IHNlbGVjdGVkVGV4dC5tYXRjaChcclxuICAgICAgLyhsYXN0IGRheSBvZnxlbmQgb2YpXFxzKihbXlxcblxccl0qKS9pXHJcbiAgICApO1xyXG4gICAgdmFyIG1pZE9mID0gc2VsZWN0ZWRUZXh0Lm1hdGNoKC9taWRcXHMoW1xcd10rKS9pKTtcclxuXHJcbiAgICBpZiAobmV4dERhdGVNYXRjaCAmJiBuZXh0RGF0ZU1hdGNoWzFdID09PSBcIndlZWtcIikge1xyXG4gICAgICByZXR1cm4gY3VzdG9tLnBhcnNlRGF0ZShgbmV4dCAke3RoaXMuc2V0dGluZ3Mud2Vla1N0YXJ0fWAsIG5ldyBEYXRlKCksIHtcclxuICAgICAgICBmb3J3YXJkRGF0ZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKG5leHREYXRlTWF0Y2ggJiYgbmV4dERhdGVNYXRjaFsxXSA9PT0gXCJtb250aFwiKSB7XHJcbiAgICAgIHZhciB0aGlzTW9udGggPSBjdXN0b20ucGFyc2VEYXRlKFwidGhpcyBtb250aFwiLCBuZXcgRGF0ZSgpLCB7XHJcbiAgICAgICAgZm9yd2FyZERhdGU6IHRydWUsXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gY3VzdG9tLnBhcnNlRGF0ZShzZWxlY3RlZFRleHQsIHRoaXNNb250aCwge1xyXG4gICAgICAgIGZvcndhcmREYXRlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAobmV4dERhdGVNYXRjaCAmJiBuZXh0RGF0ZU1hdGNoWzFdID09PSBcInllYXJcIikge1xyXG4gICAgICB2YXIgdGhpc1llYXIgPSBjdXN0b20ucGFyc2VEYXRlKFwidGhpcyB5ZWFyXCIsIG5ldyBEYXRlKCksIHtcclxuICAgICAgICBmb3J3YXJkRGF0ZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBjdXN0b20ucGFyc2VEYXRlKHNlbGVjdGVkVGV4dCwgdGhpc1llYXIsIHtcclxuICAgICAgICBmb3J3YXJkRGF0ZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGxhc3REYXlPZk1hdGNoKSB7XHJcbiAgICAgIHZhciB0ZW1wRGF0ZSA9IGN1c3RvbS5wYXJzZShsYXN0RGF5T2ZNYXRjaFsyXSk7XHJcbiAgICAgIHZhciB5ZWFyID0gdGVtcERhdGVbMF0uc3RhcnQuZ2V0KFwieWVhclwiKSxcclxuICAgICAgICBtb250aCA9IHRlbXBEYXRlWzBdLnN0YXJ0LmdldChcIm1vbnRoXCIpO1xyXG4gICAgICB2YXIgbGFzdERheSA9IGdldExhc3REYXlPZk1vbnRoKHllYXIsIG1vbnRoKTtcclxuICAgICAgcmV0dXJuIGN1c3RvbS5wYXJzZURhdGUoYCR7eWVhcn0tJHttb250aH0tJHtsYXN0RGF5fWAsIG5ldyBEYXRlKCksIHtcclxuICAgICAgICBmb3J3YXJkRGF0ZTogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKG1pZE9mKSB7XHJcbiAgICAgIHJldHVybiBjdXN0b20ucGFyc2VEYXRlKGAke21pZE9mWzFdfSAxNXRoYCwgbmV3IERhdGUoKSwge1xyXG4gICAgICAgIGZvcndhcmREYXRlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBjdXN0b20ucGFyc2VEYXRlKHNlbGVjdGVkVGV4dCwgbmV3IERhdGUoKSwge30pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U2VsZWN0ZWRUZXh0KGVkaXRvcjogYW55KSB7XHJcbiAgICBpZiAoZWRpdG9yLnNvbWV0aGluZ1NlbGVjdGVkKCkpIHtcclxuICAgICAgcmV0dXJuIGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciB3b3JkQm91bmRhcmllcyA9IHRoaXMuZ2V0V29yZEJvdW5kYXJpZXMoZWRpdG9yKTtcclxuICAgICAgZWRpdG9yLmdldERvYygpLnNldFNlbGVjdGlvbih3b3JkQm91bmRhcmllcy5zdGFydCwgd29yZEJvdW5kYXJpZXMuZW5kKTtcclxuICAgICAgcmV0dXJuIGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFdvcmRCb3VuZGFyaWVzKGVkaXRvcjogYW55KSB7XHJcbiAgICB2YXIgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xyXG4gICAgdmFyIGxpbmUgPSBjdXJzb3IubGluZTtcclxuICAgIHZhciB3b3JkID0gZWRpdG9yLmZpbmRXb3JkQXQoe1xyXG4gICAgICBsaW5lOiBsaW5lLFxyXG4gICAgICBjaDogY3Vyc29yLmNoXHJcbiAgICB9KTtcclxuICAgIHZhciB3b3JkU3RhcnQgPSB3b3JkLmFuY2hvci5jaDtcclxuICAgIHZhciB3b3JkRW5kID0gd29yZC5oZWFkLmNoO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICBjaDogd29yZFN0YXJ0XHJcbiAgICAgIH0sXHJcbiAgICAgIGVuZDoge1xyXG4gICAgICAgIGxpbmU6IGxpbmUsXHJcbiAgICAgICAgY2g6IHdvcmRFbmRcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRNb21lbnQoZGF0ZTogRGF0ZSk6IGFueSB7XHJcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLm1vbWVudChkYXRlKTtcclxuICB9XHJcblxyXG4gIGdldEZvcm1hdHRlZERhdGUoZGF0ZTogRGF0ZSk6IHN0cmluZyB7XHJcbiAgICB2YXIgZm9ybWF0dGVkRGF0ZSA9IHRoaXMuZ2V0TW9tZW50KGRhdGUpLmZvcm1hdCh0aGlzLnNldHRpbmdzLmZvcm1hdCk7XHJcbiAgICByZXR1cm4gZm9ybWF0dGVkRGF0ZTtcclxuICB9XHJcblxyXG4gIGdldEZvcm1hdHRlZFRpbWUoZGF0ZTogRGF0ZSk6IHN0cmluZyB7XHJcbiAgICB2YXIgZm9ybWF0dGVkVGltZSA9IHRoaXMuZ2V0TW9tZW50KGRhdGUpLmZvcm1hdCh0aGlzLnNldHRpbmdzLnRpbWVGb3JtYXQpO1xyXG4gICAgcmV0dXJuIGZvcm1hdHRlZFRpbWU7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIEBwYXJhbSBkYXRlU3RyaW5nOiBBIHN0cmluZyB0aGF0IGNvbnRhaW5zIGEgZGF0ZSBpbiBuYXR1cmFsIGxhbmd1YWdlLCBlLmcuIHRvZGF5LCB0b21vcnJvdywgbmV4dCB3ZWVrXHJcbiAgQHJldHVybnMgTkxEUmVzdWx0OiBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgZGF0ZSwgYSBjbG9uZWQgTW9tZW50IGFuZCB0aGUgZm9ybWF0dGVkIHN0cmluZy5cclxuXHJcbiAgKi9cclxuICBwYXJzZURhdGUoZGF0ZVN0cmluZzogc3RyaW5nKTogTkxEUmVzdWx0IHtcclxuICAgIGxldCBkYXRlID0gdGhpcy5nZXRQYXJzZWREYXRlKGRhdGVTdHJpbmcpO1xyXG4gICAgbGV0IGZvcm1hdHRlZERhdGUgPSB0aGlzLmdldEZvcm1hdHRlZERhdGUoZGF0ZSk7XHJcbiAgICBpZiAoZm9ybWF0dGVkRGF0ZSA9PT0gXCJJbnZhbGlkIGRhdGVcIikge1xyXG4gICAgICBjb25zb2xlLmRlYnVnKFwiSW5wdXQgZGF0ZSBcIiArIGRhdGVTdHJpbmcgKyBcIiBjYW4ndCBiZSBwYXJzZWQgYnkgbmxkYXRlc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0ID0ge1xyXG4gICAgICBmb3JtYXR0ZWRTdHJpbmc6IGZvcm1hdHRlZERhdGUsXHJcbiAgICAgIGRhdGU6IGRhdGUsXHJcbiAgICAgIG1vbWVudDogdGhpcy5nZXRNb21lbnQoZGF0ZSksXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHBhcnNlVGltZShkYXRlU3RyaW5nOiBzdHJpbmcpOiBOTERSZXN1bHQge1xyXG4gICAgbGV0IGRhdGUgPSB0aGlzLmdldFBhcnNlZERhdGUoZGF0ZVN0cmluZyk7XHJcbiAgICBsZXQgZm9ybWF0dGVkVGltZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkVGltZShkYXRlKTtcclxuICAgIGlmIChmb3JtYXR0ZWRUaW1lID09PSBcIkludmFsaWQgZGF0ZVwiKSB7XHJcbiAgICAgIGNvbnNvbGUuZGVidWcoXCJJbnB1dCBkYXRlIFwiICsgZGF0ZVN0cmluZyArIFwiIGNhbid0IGJlIHBhcnNlZCBieSBubGRhdGVzXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXN1bHQgPSB7XHJcbiAgICAgIGZvcm1hdHRlZFN0cmluZzogZm9ybWF0dGVkVGltZSxcclxuICAgICAgZGF0ZTogZGF0ZSxcclxuICAgICAgbW9tZW50OiB0aGlzLmdldE1vbWVudChkYXRlKSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcGFyc2VUcnV0aHkoZmxhZzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gW1wieVwiLCBcInllc1wiLCBcIjFcIiwgXCJ0XCIsIFwidHJ1ZVwiXS5pbmRleE9mKGZsYWcudG9Mb3dlckNhc2UoKSkgPj0gMDtcclxuICB9XHJcblxyXG4gIG9uVHJpZ2dlcihtb2RlOiBzdHJpbmcpIHtcclxuICAgIGxldCBhY3RpdmVMZWFmOiBhbnkgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcclxuICAgIGxldCBlZGl0b3IgPSBhY3RpdmVMZWFmLnZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcclxuICAgIHZhciBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XHJcbiAgICB2YXIgc2VsZWN0ZWRUZXh0ID0gdGhpcy5nZXRTZWxlY3RlZFRleHQoZWRpdG9yKTtcclxuXHJcbiAgICBsZXQgZGF0ZSA9IHRoaXMucGFyc2VEYXRlKHNlbGVjdGVkVGV4dCk7XHJcblxyXG4gICAgaWYgKCFkYXRlLm1vbWVudC5pc1ZhbGlkKCkpIHtcclxuICAgICAgZWRpdG9yLnNldEN1cnNvcih7XHJcbiAgICAgICAgbGluZTogY3Vyc29yLmxpbmUsXHJcbiAgICAgICAgY2g6IGN1cnNvci5jaFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vbW9kZSA9PSBcInJlcGxhY2VcIlxyXG4gICAgICB2YXIgbmV3U3RyID0gYFtbJHtkYXRlLmZvcm1hdHRlZFN0cmluZ31dXWA7XHJcblxyXG4gICAgICBpZiAobW9kZSA9PSBcImxpbmtcIikge1xyXG4gICAgICAgIG5ld1N0ciA9IGBbJHtzZWxlY3RlZFRleHR9XSgke2RhdGUuZm9ybWF0dGVkU3RyaW5nfSlgO1xyXG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT0gXCJjbGVhblwiKSB7XHJcbiAgICAgICAgbmV3U3RyID0gYCR7ZGF0ZS5mb3JtYXR0ZWRTdHJpbmd9YDtcclxuICAgICAgfSBlbHNlIGlmIChtb2RlID09IFwidGltZVwiKSB7XHJcbiAgICAgICAgbGV0IHRpbWUgPSB0aGlzLnBhcnNlVGltZShzZWxlY3RlZFRleHQpO1xyXG5cclxuICAgICAgICBuZXdTdHIgPSBgJHt0aW1lLmZvcm1hdHRlZFN0cmluZ31gO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihuZXdTdHIpO1xyXG4gICAgICB0aGlzLmFkanVzdEN1cnNvcihlZGl0b3IsIGN1cnNvciwgbmV3U3RyLCBzZWxlY3RlZFRleHQpO1xyXG4gICAgICBlZGl0b3IuZm9jdXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkanVzdEN1cnNvcihlZGl0b3I6IGFueSwgY3Vyc29yOiBhbnksIG5ld1N0cjogc3RyaW5nLCBvbGRTdHI6IHN0cmluZykge1xyXG4gICAgdmFyIGN1cnNvck9mZnNldCA9IG5ld1N0ci5sZW5ndGggLSBvbGRTdHIubGVuZ3RoO1xyXG4gICAgZWRpdG9yLnNldEN1cnNvcih7XHJcbiAgICAgIGxpbmU6IGN1cnNvci5saW5lLFxyXG4gICAgICBjaDogY3Vyc29yLmNoICsgY3Vyc29yT2Zmc2V0XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldE5vd0NvbW1hbmQoKSB7XHJcbiAgICBsZXQgYWN0aXZlTGVhZjogYW55ID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcbiAgICBsZXQgZWRpdG9yID0gYWN0aXZlTGVhZi52aWV3LnNvdXJjZU1vZGUuY21FZGl0b3I7XHJcbiAgICBlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihcclxuICAgICAgdGhpcy5nZXRNb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KFxyXG4gICAgICAgIGAke3RoaXMuc2V0dGluZ3MuZm9ybWF0fSR7dGhpcy5zZXR0aW5ncy5zZXBhcmF0b3J9JHt0aGlzLnNldHRpbmdzLnRpbWVGb3JtYXR9YFxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGF0ZUNvbW1hbmQoKSB7XHJcbiAgICBsZXQgYWN0aXZlTGVhZjogYW55ID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcbiAgICBsZXQgZWRpdG9yID0gYWN0aXZlTGVhZi52aWV3LnNvdXJjZU1vZGUuY21FZGl0b3I7XHJcbiAgICBlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihcclxuICAgICAgdGhpcy5nZXRNb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KHRoaXMuc2V0dGluZ3MuZm9ybWF0KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldFRpbWVDb21tYW5kKCkge1xyXG4gICAgbGV0IGFjdGl2ZUxlYWY6IGFueSA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG4gICAgbGV0IGVkaXRvciA9IGFjdGl2ZUxlYWYudmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG4gICAgZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oXHJcbiAgICAgIHRoaXMuZ2V0TW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCh0aGlzLnNldHRpbmdzLnRpbWVGb3JtYXQpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0RGF0ZVN0cmluZyhkYXRlU3RyaW5nOiBzdHJpbmcsIGVkaXRvcjogYW55LCBjdXJzb3I6IGFueSkge1xyXG4gICAgZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oZGF0ZVN0cmluZyk7XHJcbiAgfVxyXG5cclxuICBnZXREYXRlUmFuZ2UoKSB7fVxyXG5cclxuICBhc3luYyBhY3Rpb25IYW5kbGVyKHBhcmFtczogYW55KSB7XHJcblxyXG4gICAgbGV0IGRhdGUgPSB0aGlzLnBhcnNlRGF0ZShwYXJhbXMuZGF5KTtcclxuICAgIGxldCBuZXdQYW5lID0gdGhpcy5wYXJzZVRydXRoeShwYXJhbXMubmV3UGFuZSB8fCBcInllc1wiKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhkYXRlKTtcclxuICAgIGNvbnN0IHtcclxuICAgICAgd29ya3NwYWNlXHJcbiAgICB9ID0gdGhpcy5hcHA7XHJcblxyXG4gICAgaWYgKGRhdGUubW9tZW50LmlzVmFsaWQoKSkge1xyXG4gICAgICBsZXQgZGFpbHlOb3RlID0gYXdhaXQgdGhpcy5nZXREYWlseU5vdGUoZGF0ZS5tb21lbnQpO1xyXG5cclxuICAgICAgbGV0IGxlYWYgPSB3b3Jrc3BhY2UuYWN0aXZlTGVhZjtcclxuICAgICAgaWYgKG5ld1BhbmUpIHtcclxuICAgICAgICBsZWFmID0gd29ya3NwYWNlLnNwbGl0QWN0aXZlTGVhZigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGRhaWx5Tm90ZSk7XHJcblxyXG4gICAgICB3b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldERhaWx5Tm90ZShkYXRlOiBhbnkpIHtcclxuICAgIC8vIEJvcnJvd2VkIGZyb20gdGhlIFNsYXRlZCBwbHVnaW46XHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGdyb3Npbmdlci9zbGF0ZWQtb2JzaWRpYW4vYmxvYi9tYWluL3NyYy92YXVsdC50cyNMMTdcclxuICAgIGNvbnN0IGRlc2lyZWROb3RlID0gZ2V0RGFpbHlOb3RlKGRhdGUsIGdldEFsbERhaWx5Tm90ZXMoKSk7XHJcbiAgICBpZiAoZGVzaXJlZE5vdGUpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJOb3RlIGV4aXN0c1wiKVxyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRlc2lyZWROb3RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgZGFpbHkgbm90ZVwiKVxyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNyZWF0ZURhaWx5Tm90ZShkYXRlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuaW50ZXJmYWNlIE5MRFNldHRpbmdzIHtcclxuICBmb3JtYXQ6IHN0cmluZztcclxuICB0aW1lRm9ybWF0OiBzdHJpbmc7XHJcbiAgc2VwYXJhdG9yOiBzdHJpbmc7XHJcbiAgd2Vla1N0YXJ0OiBzdHJpbmc7XHJcbiAgbW9kYWxUb2dnbGVUaW1lOiBib29sZWFuO1xyXG4gIG1vZGFsVG9nZ2xlTGluazogYm9vbGVhbjtcclxuICBtb2RhbE1vbWVudEZvcm1hdDogc3RyaW5nO1xyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBOTERTZXR0aW5ncyA9IHtcclxuICBmb3JtYXQ6IFwiWVlZWS1NTS1ERFwiLFxyXG4gIHRpbWVGb3JtYXQ6IFwiSEg6bW1cIixcclxuICBzZXBhcmF0b3I6IFwiIFwiLFxyXG4gIHdlZWtTdGFydDogXCJNb25kYXlcIixcclxuICBtb2RhbFRvZ2dsZVRpbWU6IGZhbHNlLFxyXG4gIG1vZGFsVG9nZ2xlTGluazogZmFsc2UsXHJcbiAgbW9kYWxNb21lbnRGb3JtYXQ6IFwiWVlZWS1NTS1ERCBISDptbVwiLFxyXG59XHJcblxyXG5jbGFzcyBOTERTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG4gIHBsdWdpbjogTmF0dXJhbExhbmd1YWdlRGF0ZXM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IE5hdHVyYWxMYW5ndWFnZURhdGVzKSB7XHJcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XHJcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICB9XHJcblxyXG5cclxuICBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgbGV0IHtcclxuICAgICAgY29udGFpbmVyRWxcclxuICAgIH0gPSB0aGlzO1xyXG5cclxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRGF0ZSBmb3JtYXRcIilcclxuICAgICAgLnNldERlc2MoXCJPdXRwdXQgZm9ybWF0IGZvciBwYXJzZWQgZGF0ZXNcIilcclxuICAgICAgLmFkZE1vbWVudEZvcm1hdCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgLnNldERlZmF1bHRGb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmZvcm1hdClcclxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9ybWF0ID0gXCJZWVlZLU1NLUREXCI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb3JtYXQgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIldlZWsgc3RhcnRzIG9uXCIpXHJcbiAgICAgIC5zZXREZXNjKFwiV2hpY2ggZGF5IHRvIGNvbnNpZGVyIGFzIHRoZSBzdGFydCBvZiB0aGUgd2Vla1wiKVxyXG4gICAgICAuYWRkRHJvcGRvd24oKGRheSkgPT5cclxuICAgICAgICBkYXlcclxuICAgICAgICAuYWRkT3B0aW9uKFwiTW9uZGF5XCIsIFwiTW9uZGF5XCIpXHJcbiAgICAgICAgLmFkZE9wdGlvbihcIlN1bmRheVwiLCBcIlN1bmRheVwiKVxyXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy53ZWVrU3RhcnQpXHJcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Mud2Vla1N0YXJ0ID0gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHtcclxuICAgICAgdGV4dDogXCJIb3RrZXkgZm9ybWF0dGluZyBzZXR0aW5nc1wiXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJUaW1lIGZvcm1hdFwiKVxyXG4gICAgICAuc2V0RGVzYyhcIkZvcm1hdCBmb3IgdGhlIGhvdGtleXMgdGhhdCBpbmNsdWRlIHRoZSBjdXJyZW50IHRpbWVcIilcclxuICAgICAgLmFkZE1vbWVudEZvcm1hdCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgLnNldERlZmF1bHRGb3JtYXQoXCJISDptbVwiKVxyXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50aW1lRm9ybWF0KVxyXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50aW1lRm9ybWF0ID0gXCJISDptbVwiO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGltZUZvcm1hdCA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiU2VwYXJhdG9yXCIpXHJcbiAgICAgIC5zZXREZXNjKFwiU2VwYXJhdG9yIGJldHdlZW4gZGF0ZSBhbmQgdGltZSBmb3IgZW50cmllcyB0aGF0IGhhdmUgYm90aFwiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiU2VwYXJhdG9yIGlzIGVtcHR5XCIpXHJcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNlcGFyYXRvcilcclxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zZXBhcmF0b3IgPSB2YWx1ZTtcclxuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBQYXJzZU1vbWVudE1vZGFsIGV4dGVuZHMgTW9kYWwge1xyXG4gIHBhcnNlZERhdGVTdHJpbmcgPSBcIlwiO1xyXG4gIGFjdGl2ZVZpZXc6IE1hcmtkb3duVmlldztcclxuICBhY3RpdmVFZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yO1xyXG4gIGFjdGl2ZUN1cnNvcjogQ29kZU1pcnJvci5Qb3NpdGlvbjtcclxuICBwbHVnaW46IE5hdHVyYWxMYW5ndWFnZURhdGVzO1xyXG5cclxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBOYXR1cmFsTGFuZ3VhZ2VEYXRlcykge1xyXG4gICAgc3VwZXIoYXBwKTtcclxuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG4gICAgdGhpcy5hY3RpdmVWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuICAgIGlmICghdGhpcy5hY3RpdmVWaWV3KSByZXR1cm47XHJcbiAgICB0aGlzLmFjdGl2ZUVkaXRvciA9IHRoaXMuYWN0aXZlVmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG4gICAgdGhpcy5hY3RpdmVDdXJzb3IgPSB0aGlzLmFjdGl2ZUVkaXRvci5nZXRDdXJzb3IoKTtcclxuICB9XHJcblxyXG4gIG9uT3BlbigpIHtcclxuICAgIGxldCB7XHJcbiAgICAgIGNvbnRlbnRFbFxyXG4gICAgfSA9IHRoaXM7XHJcblxyXG4gICAgY29udGVudEVsLmFwcGVuZFRleHQoXCJEYXRlOiBcIik7XHJcblxyXG4gICAgbGV0IGlucHV0RGF0ZUZpZWxkID0gbmV3IFRleHRDb21wb25lbnQoY29udGVudEVsKS5zZXRQbGFjZWhvbGRlcihcIkRhdGVcIik7XHJcbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJiclwiKTtcclxuICAgIGNvbnRlbnRFbC5hcHBlbmRUZXh0KFwiRm9ybWF0OiBcIik7XHJcblxyXG4gICAgbGV0IG1vbWVudEZvcm1hdEZpZWxkID0gbmV3IE1vbWVudEZvcm1hdENvbXBvbmVudChjb250ZW50RWwpXHJcbiAgICAgIC5zZXREZWZhdWx0Rm9ybWF0KFwiWVlZWS1NTS1ERCBISDptbVwiKVxyXG4gICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kYWxNb21lbnRGb3JtYXQpXHJcbiAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb2RhbE1vbWVudEZvcm1hdCA9IHZhbHVlID8gdmFsdWUgOiBcIllZWVktTU0tREQgSEg6bW1cIjtcclxuICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwiYnJcIik7XHJcblxyXG4gICAgY29udGVudEVsLmFwcGVuZFRleHQoXCJBZGQgYXMgbGluaz9cIik7XHJcbiAgICBsZXQgdG9nZ2xlTGluayA9IG5ldyBUb2dnbGVDb21wb25lbnQoY29udGVudEVsKVxyXG4gICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kYWxUb2dnbGVMaW5rKVxyXG4gICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kYWxUb2dnbGVMaW5rID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwiYnJcIik7XHJcblxyXG4gICAgbGV0IGlucHV0QnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChjb250ZW50RWwpXHJcbiAgICAgIC5zZXRCdXR0b25UZXh0KFwiSW5zZXJ0IGRhdGVcIilcclxuICAgICAgLm9uQ2xpY2soKCkgPT4ge1xyXG4gICAgICAgIGxldCBwYXJzZWREYXRlID0gdGhpcy5wbHVnaW4ucGFyc2VEYXRlKGlucHV0RGF0ZUZpZWxkLmdldFZhbHVlKCkpO1xyXG4gICAgICAgIHRoaXMucGFyc2VkRGF0ZVN0cmluZyA9IHBhcnNlZERhdGUubW9tZW50LmZvcm1hdChcclxuICAgICAgICAgIG1vbWVudEZvcm1hdEZpZWxkLmdldFZhbHVlKClcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmICghcGFyc2VkRGF0ZS5tb21lbnQuaXNWYWxpZCgpKSB0aGlzLnBhcnNlZERhdGVTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGlmICh0b2dnbGVMaW5rLmdldFZhbHVlKCkgJiYgdGhpcy5wYXJzZWREYXRlU3RyaW5nICE9PSBcIlwiKVxyXG4gICAgICAgICAgdGhpcy5wYXJzZWREYXRlU3RyaW5nID0gYFtbJHt0aGlzLnBhcnNlZERhdGVTdHJpbmd9XV1gO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlRWRpdG9yLmZvY3VzKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVFZGl0b3Iuc2V0Q3Vyc29yKHRoaXMuYWN0aXZlQ3Vyc29yKTtcclxuICAgICAgICB0aGlzLnBsdWdpbi5pbnNlcnREYXRlU3RyaW5nKFxyXG4gICAgICAgICAgdGhpcy5wYXJzZWREYXRlU3RyaW5nLFxyXG4gICAgICAgICAgdGhpcy5hY3RpdmVFZGl0b3IsXHJcbiAgICAgICAgICB0aGlzLmFjdGl2ZUN1cnNvclxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICB9KTtcclxuICAgIGlucHV0RGF0ZUZpZWxkLmlucHV0RWwuZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIG9uQ2xvc2UoKSB7XHJcbiAgICBsZXQge1xyXG4gICAgICBjb250ZW50RWxcclxuICAgIH0gPSB0aGlzO1xyXG4gICAgY29udGVudEVsLmVtcHR5KCk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJvYnNpZGlhbiIsInRoaXMiLCJyZXF1aXJlJCQwIiwicGF0dGVybl8xIiwieWVhcnNfMSIsInJlcXVpcmUkJDEiLCJkYXlqc18yIiwiY29uc3RhbnRzXzEiLCJBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSIsInJlc3VsdHNfMSIsImluZGV4XzEiLCJ0aW1ldW5pdHNfMSIsImFic3RyYWN0UmVmaW5lcnNfMSIsIkFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEiLCJtZXJnaW5nQ2FsY3VsYXRpb25fMSIsIkV4dHJhY3RUaW1lem9uZUFiYnJSZWZpbmVyXzEiLCJFeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyXzEiLCJPdmVybGFwUmVtb3ZhbFJlZmluZXJfMSIsInJlcXVpcmUkJDIiLCJGb3J3YXJkRGF0ZVJlZmluZXJfMSIsInJlcXVpcmUkJDMiLCJVbmxpa2VseUZvcm1hdEZpbHRlcl8xIiwicmVxdWlyZSQkNCIsIklTT0Zvcm1hdFBhcnNlcl8xIiwicmVxdWlyZSQkNSIsIk1lcmdlV2Vla2RheUNvbXBvbmVudFJlZmluZXJfMSIsInJlcXVpcmUkJDYiLCJ3ZWVrc18xIiwiZW5fMSIsInJlc3VsdHMiLCJFTlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyXzEiLCJFTk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcl8xIiwiRU5Nb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXJfMSIsIkVOTW9udGhOYW1lUGFyc2VyXzEiLCJFTkNhc3VhbFllYXJNb250aERheVBhcnNlcl8xIiwiRU5TbGFzaE1vbnRoRm9ybWF0UGFyc2VyXzEiLCJFTlRpbWVFeHByZXNzaW9uUGFyc2VyXzEiLCJFTlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyXzEiLCJyZXF1aXJlJCQ3IiwiRU5UaW1lVW5pdExhdGVyRm9ybWF0UGFyc2VyXzEiLCJyZXF1aXJlJCQ4IiwiRU5NZXJnZURhdGVSYW5nZVJlZmluZXJfMSIsInJlcXVpcmUkJDkiLCJFTk1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEiLCJyZXF1aXJlJCQxMCIsIkVOQ2FzdWFsRGF0ZVBhcnNlcl8xIiwicmVxdWlyZSQkMTEiLCJFTkNhc3VhbFRpbWVQYXJzZXJfMSIsInJlcXVpcmUkJDEyIiwiRU5XZWVrZGF5UGFyc2VyXzEiLCJyZXF1aXJlJCQxMyIsIkVOUmVsYXRpdmVEYXRlRm9ybWF0UGFyc2VyXzEiLCJyZXF1aXJlJCQxNCIsIlNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xIiwicmVxdWlyZSQkMTUiLCJFTlRpbWVVbml0Q2FzdWFsUmVsYXRpdmVGb3JtYXRQYXJzZXJfMSIsInJlcXVpcmUkJDE2IiwiY2hyb25vXzEiLCJjb25maWd1cmF0aW9uc18xIiwiREVDYXN1YWxUaW1lUGFyc2VyXzEiLCJERVRpbWVFeHByZXNzaW9uUGFyc2VyXzEiLCJERVdlZWtkYXlQYXJzZXJfMSIsIkRFTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEiLCJERU1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEiLCJERUNhc3VhbERhdGVQYXJzZXJfMSIsIkRFTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEiLCJGUkNhc3VhbERhdGVQYXJzZXJfMSIsIkZSQ2FzdWFsVGltZVBhcnNlcl8xIiwiRlJUaW1lRXhwcmVzc2lvblBhcnNlcl8xIiwiRlJNZXJnZURhdGVUaW1lUmVmaW5lcl8xIiwiRlJNZXJnZURhdGVSYW5nZVJlZmluZXJfMSIsIkZSV2Vla2RheVBhcnNlcl8xIiwiRlJTcGVjaWZpY1RpbWVFeHByZXNzaW9uUGFyc2VyXzEiLCJGUk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcl8xIiwiRlJUaW1lVW5pdEFnb0Zvcm1hdFBhcnNlcl8xIiwiRlJUaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlcl8xIiwiSlBTdGFuZGFyZFBhcnNlcl8xIiwiSlBNZXJnZURhdGVSYW5nZVJlZmluZXJfMSIsIkpQQ2FzdWFsRGF0ZVBhcnNlcl8xIiwiZGF5anNfMSIsIlBUV2Vla2RheVBhcnNlcl8xIiwiUFRUaW1lRXhwcmVzc2lvblBhcnNlcl8xIiwiUFRNZXJnZURhdGVUaW1lUmVmaW5lcl8xIiwiUFRNZXJnZURhdGVSYW5nZVJlZmluZXJfMSIsIlBUTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEiLCJQVENhc3VhbERhdGVQYXJzZXJfMSIsIlBUQ2FzdWFsVGltZVBhcnNlcl8xIiwiTkxNZXJnZURhdGVSYW5nZVJlZmluZXJfMSIsIk5MTWVyZ2VEYXRlVGltZVJlZmluZXJfMSIsIk5MQ2FzdWFsRGF0ZVBhcnNlcl8xIiwiTkxDYXN1YWxUaW1lUGFyc2VyXzEiLCJOTFRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyXzEiLCJOTFdlZWtkYXlQYXJzZXJfMSIsIk5MTW9udGhOYW1lTWlkZGxlRW5kaWFuUGFyc2VyXzEiLCJOTE1vbnRoTmFtZVBhcnNlcl8xIiwiTkxTbGFzaE1vbnRoRm9ybWF0UGFyc2VyXzEiLCJOTFRpbWVFeHByZXNzaW9uUGFyc2VyXzEiLCJOTENhc3VhbFllYXJNb250aERheVBhcnNlcl8xIiwiTkxDYXN1YWxEYXRlVGltZVBhcnNlcl8xIiwiZW4iLCJkZSIsImZyIiwiamEiLCJwdCIsIm5sIiwiZ2V0RGFpbHlOb3RlIiwiZ2V0QWxsRGFpbHlOb3RlcyIsImNyZWF0ZURhaWx5Tm90ZSIsIlBsdWdpbiIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIiwiTWFya2Rvd25WaWV3IiwiVGV4dENvbXBvbmVudCIsIk1vbWVudEZvcm1hdENvbXBvbmVudCIsIlRvZ2dsZUNvbXBvbmVudCIsIkJ1dHRvbkNvbXBvbmVudCIsIk1vZGFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEtBQUssSUFBSTtBQUM3QyxRQUFRLE1BQU0sSUFBSSxTQUFTLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLCtCQUErQixDQUFDLENBQUM7QUFDbEcsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFR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QyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDLENBQUMscUZBQXFGLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsMERBQTBELENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyx1RkFBdUYsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU0sRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU0sY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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QUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElB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QUMsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDWCxJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDWCxJQUFJLEtBQUssRUFBRSxHQUFHO0FBQ2QsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRTtBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksS0FBSyxFQUFFLENBQUMsR0FBRztBQUNmLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNWLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEtBQUssRUFBRSxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEtBQUssRUFBRSxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDWCxJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRTtBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEtBQUssRUFBRSxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksS0FBSyxFQUFFLEdBQUc7QUFDZCxJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNWLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEtBQUssRUFBRSxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUNYLElBQUksSUFBSSxFQUFFLEVBQUU7QUFDWixJQUFJLElBQUksRUFBRSxFQUFFO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNWLElBQUksR0FBRyxFQUFFLENBQUM7QUFDVixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ2QsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksRUFBRSxFQUFFLENBQUM7QUFDVCxJQUFJLEtBQUssRUFBRSxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEtBQUssRUFBRSxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLENB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
