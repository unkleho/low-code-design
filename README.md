# Low Code Design in Next JS

Designer developer handoff in 2020 is still slow and cumbersome. This proof of concept brings low-code design to Next JS. Imagine a UI that allows designers to edit production code, saying goodbye to the handoff process.

![Low Code Demo 1](https://github.com/unkleho/low-code-design/raw/master/public/gifs/low-code-demo-1-480px.gif "Low Code Demo 1")

Presented at [Next JS Conf 2020](https://nextjs.org/conf):

- https://nextjs.org/conf/speakers/unkleho
- Slides: https://low-code-design-nextjsconf.vercel.app/#/

> **Warning**: Highly experimental! Proof of concept at this stage. Check it out and have a play.

## Installation

```bash
$ npm install
$ npm run dev
# Navigate to http://localhost:4020
```
## Dependencies

### Tailwind CSS
Style changes are made by adding and removing Tailwind's utility classes. This project would have been much harder without it.

### React Fiber Traverse
Very cool project that helps build the **Layers** panel with the element tree. https://github.com/bendtherules/react-fiber-traverse.
