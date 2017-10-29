import * as React from 'react';
//import { Cell, Stream, Operational } from "sodiumjs"
import { LiftedComponent, LiftedProps, LiftedComponentClass, lift } from "./lift"

/*
export class LiftedInstristic<P> extends LiftedComponent<P> {
    render(): JSX.Element {
        const state: any = this.state;
        const props: any = this.props;
        const type: string = props.__type__;
        return React.createElement(type, state, state && state.children);
    }
} 

function instristic<K extends keyof JSX.IntrinsicElements>(type: K): (props: LiftedProps<JSX.IntrinsicElements[K]>) => LiftedInstristic<K> {
    return props => {
        // HACK: Because Typescript generates a huge declaration file 
        // when creating a new higher order class for each intristic,
        // we stuff the intristic type into the props.
        const newProps: any = {props, __type__: type};
        return new LiftedInstristic<K>(newProps);
    }
 } 
*/

function instristic<K extends keyof JSX.IntrinsicElements>(type: K) {
    return lift<JSX.IntrinsicElements[K]>((p) => React.createElement(type, p));
} 

export const a = instristic("a");
export const abbr = instristic("abbr");
export const address = instristic("address");
export const area = instristic("area");
export const article = instristic("article");
export const aside = instristic("aside");
export const audio = instristic("audio");
export const b = instristic("b");
export const base = instristic("base");
export const bdi = instristic("bdi");
export const bdo = instristic("bdo");
export const big = instristic("big");
export const blockquote = instristic("blockquote");
export const body = instristic("body");
export const br = instristic("br");
export const button = instristic("button");
export const canvas = instristic("canvas");
export const caption = instristic("caption");
export const cite = instristic("cite");
export const code = instristic("code");
export const col = instristic("col");
export const colgroup = instristic("colgroup");
export const data = instristic("data");
export const datalist = instristic("datalist");
export const dd = instristic("dd");
export const del = instristic("del");
export const details = instristic("details");
export const dfn = instristic("dfn");
export const dialog = instristic("dialog");
export const div = instristic("div");
export const dl = instristic("dl");
export const dt = instristic("dt");
export const em = instristic("em");
export const embed = instristic("embed");
export const fieldset = instristic("fieldset");
export const figcaption = instristic("figcaption");
export const figure = instristic("figure");
export const footer = instristic("footer");
export const form = instristic("form");
export const h1 = instristic("h1");
export const h2 = instristic("h2");
export const h3 = instristic("h3");
export const h4 = instristic("h4");
export const h5 = instristic("h5");
export const h6 = instristic("h6");
export const head = instristic("head");
export const header = instristic("header");
export const hgroup = instristic("hgroup");
export const hr = instristic("hr");
export const html = instristic("html");
export const i = instristic("i");
export const iframe = instristic("iframe");
export const img = instristic("img");
export const input = instristic("input");
export const ins = instristic("ins");
export const kbd = instristic("kbd");
export const keygen = instristic("keygen");
export const label = instristic("label");
export const legend = instristic("legend");
export const li = instristic("li");
export const link = instristic("link");
export const main = instristic("main");
export const map = instristic("map");
export const mark = instristic("mark");
export const menu = instristic("menu");
export const menuitem = instristic("menuitem");
export const meta = instristic("meta");
export const meter = instristic("meter");
export const nav = instristic("nav");
export const noindex = instristic("noindex");
export const noscript = instristic("noscript");
export const object = instristic("object");
export const ol = instristic("ol");
export const optgroup = instristic("optgroup");
export const option = instristic("option");
export const output = instristic("output");
export const p = instristic("p");
export const param = instristic("param");
export const picture = instristic("picture");
export const pre = instristic("pre");
export const progress = instristic("progress");
export const q = instristic("q");
export const rp = instristic("rp");
export const rt = instristic("rt");
export const ruby = instristic("ruby");
export const s = instristic("s");
export const samp = instristic("samp");
export const script = instristic("script");
export const section = instristic("section");
export const select = instristic("select");
export const small = instristic("small");
export const source = instristic("source");
export const span = instristic("span");
export const strong = instristic("strong");
export const style = instristic("style");
export const sub = instristic("sub");
export const summary = instristic("summary");
export const sup = instristic("sup");
export const table = instristic("table");
export const tbody = instristic("tbody");
export const td = instristic("td");
export const textarea = instristic("textarea");
export const tfoot = instristic("tfoot");
export const th = instristic("th");
export const thead = instristic("thead");
export const time = instristic("time");
export const title = instristic("title");
export const tr = instristic("tr");
export const track = instristic("track");
export const u = instristic("u");
export const ul = instristic("ul");
export const video = instristic("video");
export const wbr = instristic("wbr");
export const svg = instristic("svg");
export const animate = instristic("animate"); // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
export const animateTransform = instristic("animateTransform"); // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
export const circle = instristic("circle");
export const clipPath = instristic("clipPath");
export const defs = instristic("defs");
export const desc = instristic("desc");
export const ellipse = instristic("ellipse");
export const feBlend = instristic("feBlend");
export const feColorMatrix = instristic("feColorMatrix");
export const feComponentTransfer = instristic("feComponentTransfer");
export const feComposite = instristic("feComposite");
export const feConvolveMatrix = instristic("feConvolveMatrix");
export const feDiffuseLighting = instristic("feDiffuseLighting");
export const feDisplacementMap = instristic("feDisplacementMap");
export const feDistantLight = instristic("feDistantLight");
export const feFlood = instristic("feFlood");
export const feFuncA = instristic("feFuncA");
export const feFuncB = instristic("feFuncB");
export const feFuncG = instristic("feFuncG");
export const feFuncR = instristic("feFuncR");
export const feGaussianBlur = instristic("feGaussianBlur");
export const feImage = instristic("feImage");
export const feMerge = instristic("feMerge");
export const feMergeNode = instristic("feMergeNode");
export const feMorphology = instristic("feMorphology");
export const feOffset = instristic("feOffset");
export const fePointLight = instristic("fePointLight");
export const feSpecularLighting = instristic("feSpecularLighting");
export const feSpotLight = instristic("feSpotLight");
export const feTile = instristic("feTile");
export const feTurbulence = instristic("feTurbulence");
export const filter = instristic("filter");
export const foreignObject = instristic("foreignObject");
export const g = instristic("g");
export const image = instristic("image");
export const line = instristic("line");
export const linearGradient = instristic("linearGradient");
export const marker = instristic("marker");
export const mask = instristic("mask");
export const metadata = instristic("metadata");
export const path = instristic("path");
export const pattern = instristic("pattern");
export const polygon = instristic("polygon");
export const polyline = instristic("polyline");
export const radialGradient = instristic("radialGradient");
export const rect = instristic("rect");
export const stop = instristic("stop");
export const symbol = instristic("symbol");
export const text = instristic("text");
export const textPath = instristic("textPath");
export const tspan = instristic("tspan");
export const use = instristic("use");
export const view = instristic("view");
