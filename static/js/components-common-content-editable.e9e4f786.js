(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"./src/components/common/ContentEditable.mdx":function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return i});var a=n("./node_modules/docz-core/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),o=(n("./node_modules/react/index.js"),n("./node_modules/@mdx-js/react/dist/index.es.js")),s={},l="wrapper";function i(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)(l,Object.assign({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("pre",null,Object(o.b)("code",Object.assign({parentName:"pre"},{className:"language-js",metastring:"static",static:!0}),"import { ContentEditable } from 'react-kinetic-lib';\n\ninitialState = {\n  htmlValue: 'default value',\n};\n\nconst updateOutput = (_e, value) => {\n  setState({ htmlValue: value });\n};\nconst handleHotKeys = e => {\n  if (e.nativeEvent.keyCode === 13 && !e.nativeEvent.shiftKey) {\n    alert(`Checking output: ${state.htmlValue}`);\n    e.preventDefault();\n    setState({ htmlValue: 'default value' });\n  }\n};\n\n<div>\n  <p>Output: {state.htmlValue}</p>\n  <div style={{ border: '1px solid' }}>\n    <ContentEditable\n      contentEditable=\"plaintext-only\"\n      html={state.htmlValue}\n      onChange={updateOutput}\n      onKeyPress={handleHotKeys}\n    />\n  </div>\n</div>;\n")))}i&&i===Object(i)&&Object.isExtensible(i)&&Object.defineProperty(i,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src/components/common/ContentEditable.mdx"}}),i.isMDXComponent=!0}}]);
//# sourceMappingURL=components-common-content-editable.2c91375bb467e12b7d5f.js.map