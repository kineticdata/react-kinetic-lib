(window.webpackJsonp=window.webpackJsonp||[]).push([[155],{212:function(e,n,t){"use strict";t.r(n),t.d(n,"_frontmatter",function(){return a}),t.d(n,"default",function(){return u});var s=t(101),i=t(242),o=(t(3),t(0),t(77)),r=t(244),a={};void 0!==a&&a&&a===Object(a)&&Object.isExtensible(a)&&Object.defineProperty(a,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/components/discussions/DiscussionForm.md"}});var c={_frontmatter:a},m=r.a;function u(e){var n=e.components,t=Object(i.a)(e,["components"]);return Object(o.b)(m,Object(s.a)({},c,t,{components:n,mdxType:"MDXLayout"}),Object(o.b)("h3",{id:"usage"},"Usage"),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"DiscussionForm")," component is used to render a form for editing discussions. It takes a few render props that allow you to\ncustomize the behavior of certain fields. Understanding how to use these is important."),Object(o.b)("h4",{id:"owning-usera-and-teams-input"},"Owning Usera and Teams Input"),Object(o.b)("p",null,"The owning users and teams render functions are used to provide a input for these fields. Both render props take the same function signature.\nThe function receives three props:"),Object(o.b)("pre",null,Object(o.b)("code",Object(s.a)({parentName:"pre"},{className:"language-js",metastring:"static",static:!0}),"function({ id, onChange, value })\n")),Object(o.b)("h3",{id:"example"},"Example"),Object(o.b)("pre",null,Object(o.b)("code",Object(s.a)({parentName:"pre"},{className:"language-js",metastring:"static",static:!0}),"import { DiscussionForm } from 'react-kinetic-lib';\n\nconst PeopleSelect = props => <select />;\n\nconst handleSubmit = () => alert('Form submitted.');\n\n<DiscussionForm\n  onSubmit={handleSubmit}\n  renderOwningUsersInput={props => <PeopleSelect {...props} />}\n  renderOwningTeamsInput={props => <PeopleSelect {...props} />}\n  render={({ formElement, dirty, invalid, submit }) => (\n    <div>\n      {formElement}\n      <button\n        className=\"btn btn-primary\"\n        type=\"submit\"\n        disabled={!dirty || invalid}\n        onClick={submit}\n      >\n        Save\n      </button>\n    </div>\n  )}\n/>;\n")))}u&&u===Object(u)&&Object.isExtensible(u)&&Object.defineProperty(u,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/components/discussions/DiscussionForm.md"}}),u.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-components-discussions-discussion-form-md-2916d819dfab1de67523.js.map