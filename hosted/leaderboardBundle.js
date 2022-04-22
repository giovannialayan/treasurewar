(()=>{var e={856:e=>{const t=e=>React.createElement("nav",{className:"navbar"},React.createElement("a",{href:"/",className:"navHome"},"home"),React.createElement("a",{href:"/game",className:"navGame"},"game"),React.createElement("a",{href:"/leaderboard",className:"navBoard"},"leaderboard"),React.createElement("a",{href:"/shop",className:"navShop"},"shop"),React.createElement("a",{href:"/account",className:"navAccount"},"account"),React.createElement("a",{href:"/logout",className:"navLogout"},"logout"));e.exports={renderNavbar:()=>{ReactDOM.render(React.createElement(t,null),document.getElementById("navbar"))}}}},t={};function a(r){var s=t[r];if(void 0!==s)return s.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,a),n.exports}(()=>{const e=a(856),t=e=>{let t;return t=e.sortByWins?e.winsBoard.map((e=>React.createElement("tr",{key:e._id,className:"user"},React.createElement("td",{className:"username"},e.username),React.createElement("td",{className:"wins"},e.wins),React.createElement("td",{className:"topThrees"},e.topThrees)))):e.topThreesBoard.map((e=>React.createElement("tr",{key:e._id,className:"user"},React.createElement("td",{className:"username"},e.username),React.createElement("td",{className:"topThrees"},e.topThrees),React.createElement("td",{className:"wins"},e.wins)))),React.createElement("div",{className:"leaderboard"},React.createElement("button",{className:"refreshBoardButton",onClick:()=>{r(e.sortByWins)}},"refresh leaderboard"),React.createElement("button",{className:"sortByButton",onClick:()=>s(e.winsBoard,e.topThreesBoard)},"sort by top three finishes"),React.createElement("table",{className:"roomList"},React.createElement("tbody",null,React.createElement("tr",null,React.createElement("th",null,"name"),React.createElement("th",null,e.sortByWins?"wins":"top three finishes"),React.createElement("th",null,e.sortByWins?"top three finishes":"wins")),t)))},r=async e=>{const a=await fetch("/getLeaderboard"),r=await a.json();ReactDOM.render(React.createElement(t,{sortByWins:e,winsBoard:r.winsBoard,topThreesBoard:r.topThreesBoard}),document.getElementById("leaderboard"))},s=(e,a)=>{const r=document.querySelector(".sortByButton");let s=r.classList.contains("wins");r.innerText=r.classList.contains("wins")?"sort by top three finishes":"sort by wins",ReactDOM.render(React.createElement(t,{sortByWins:s,winsBoard:e,topThreesBoard:a}),document.getElementById("leaderboard")),r.classList.toggle("wins")};window.onload=()=>{ReactDOM.render(React.createElement(t,{sortByWins:!0,winsBoard:[],topThreesBoard:[]}),document.getElementById("leaderboard")),r(!0),e.renderNavbar()}})()})();