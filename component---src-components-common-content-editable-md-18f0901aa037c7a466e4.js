(window.webpackJsonp=window.webpackJsonp||[]).push([[134],{217:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",function(){return c}),n.d(t,"default",function(){return s});var a=n(100),o=n(248),l=(n(3),n(0),n(77)),i=n(249),c={};void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&Object.defineProperty(c,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/components/common/ContentEditable.md"}});var u={_frontmatter:c},r=i.a;function s(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(l.b)(r,Object(a.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(l.b)("pre",null,Object(l.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js",metastring:"static",static:!0}),"import { ContentEditable } from 'react-kinetic-lib';\n\ninitialState = {\n  htmlValue: 'default value',\n};\n\nconst updateOutput = (_e, value) => {\n  setState({ htmlValue: value });\n};\nconst handleHotKeys = e => {\n  if (e.nativeEvent.keyCode === 13 && !e.nativeEvent.shiftKey) {\n    alert(`Checking output: ${state.htmlValue}`);\n    e.preventDefault();\n    setState({ htmlValue: 'default value' });\n  }\n};\n\n<div>\n  <p>Output: {state.htmlValue}</p>\n  <div style={{ border: '1px solid' }}>\n    <ContentEditable\n      contentEditable=\"plaintext-only\"\n      html={state.htmlValue}\n      onChange={updateOutput}\n      onKeyPress={handleHotKeys}\n    />\n  </div>\n</div>;\n")))}s&&s===Object(s)&&Object.isExtensible(s)&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/components/common/ContentEditable.md"}}),s.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-components-common-content-editable-md-18f0901aa037c7a466e4.js.map