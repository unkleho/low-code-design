import { parse } from "@babel/parser";
// import traverse from "@babel/traverse";
import * as t from "@babel/types";
// import generate from "@babel/generator";
import {
  getRootNode,
  getSelectedNode,
  getAncestorsIndexes,
} from "../../lib/babel-utils";

// Create mock HTML elements
const p0: HTMLElement = document.createElement("p");
const p1: HTMLElement = document.createElement("p");
const text: Text = document.createTextNode("Hello");
const div: HTMLElement = document.createElement("div");
const section0: HTMLElement = document.createElement("section");
const section1: HTMLElement = document.createElement("section");
const groupDiv: HTMLElement = document.createElement("div");
const rootDiv: HTMLElement = document.createElement("div");

// Build DOM structure
p0.appendChild(text);
div.appendChild(p0);
div.appendChild(p1);
section1.appendChild(div);
groupDiv.appendChild(section0);
groupDiv.appendChild(section1);
rootDiv.appendChild(groupDiv);

// Recreate DOM structure in code
const code = `<div>
  <section></section>
  <section>
    <div>
      <p></p>
      <p>Hello</p>
    </div>
  </section>
</div>`;

describe("Traverse element", () => {
  it("should return element", () => {
    const result = getAncestorsIndexes(p1, rootDiv);
    expect(result).toEqual([0, 1, 0, 1]);
  });

  it("should parse ast", () => {
    const ast = parse(code, {
      plugins: ["jsx"],
    });

    // Find root node
    const rootNode = getRootNode(ast);
    const ancestorIndexes = [0, 1, 0, 1];

    // Drill down and get selected node
    const selectedNode = getSelectedNode(rootNode, ancestorIndexes);

    // Test for text value
    const textNode = selectedNode.children[0] as t.JSXText;
    expect(textNode.value).toEqual("Hello");
  });
});
