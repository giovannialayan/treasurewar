(()=>{var e={603:e=>{e.exports={sendPost:async(e,t,a)=>{console.log(t);const c=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await c.json();n.redirect&&(window.location=n.redirect),n.error&&console.log(n.error),a&&a(n)}}},856:e=>{const t=e=>React.createElement("nav",{className:"navbar"},React.createElement("a",{href:"/home",className:"navHome"},"home"),React.createElement("a",{href:"/game",className:"navGame"},"game"),React.createElement("a",{href:"/leaderboard",className:"navBoard"},"leaderboard"),React.createElement("a",{href:"/shop",className:"navShop"},"shop"),React.createElement("a",{href:"/account",className:"navAccount"},"account"),React.createElement("a",{href:"/logout",className:"navLogout"},"logout"));e.exports={renderNavbar:()=>{ReactDOM.render(React.createElement(t,null),document.getElementById("navbar"))}}}},t={};function a(c){var n=t[c];if(void 0!==n)return n.exports;var r=t[c]={exports:{}};return e[c](r,r.exports,a),r.exports}(()=>{const e=a(603),t=a(856),c=e=>{const t=e.items.map((t=>{const a=n(e.account.skins,t);return React.createElement("div",{key:t._id,className:"item"},React.createElement("img",{src:t.img,className:"itemImg"}),React.createElement("p",{className:"itemName"},t.name),React.createElement("p",{className:"itemDesc"},t.desc),React.createElement("button",{className:a?"itemOwnedButton":"itemButton",onClick:()=>{a||r(t.name)}},a?"owned":"buy"))}));return React.createElement("div",{className:"itemsContainer"},t,React.createElement("input",{id:"_csrf",type:"hidden",name:"_csrf",value:e.csrf}))},n=(e,t)=>{let a=!1;return e.forEach((e=>{new Map(Object.entries(e)).get("name")===new Map(Object.entries(t)).get("name")&&(a=!0)})),a},r=async t=>{const a=document.getElementById("_csrf").value;e.sendPost("/buyItem",{name:t,_csrf:a},s)},s=async()=>{const e=await fetch("/getShopItems"),t=await e.json(),a=await fetch("/getAccount"),n=await a.json(),r=await fetch("/getToken"),s=await r.json();ReactDOM.render(React.createElement(c,{items:t.items,account:n.account,csrf:s.csrfToken}),document.getElementById("shop"))};window.onload=()=>{ReactDOM.render(React.createElement(c,{items:[],csrf:""}),document.getElementById("shop")),s(),t.renderNavbar()}})()})();