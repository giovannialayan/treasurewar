(()=>{var e={762:(e,t,a)=>{"use strict";a.d(t,{t:()=>x});let r={type:Phaser.AUTO,parent:"gameContainer",width:800,height:600,physics:{default:"arcade",arcade:{gravity:{y:0},debug:!1}},scene:{preload:function(){this.load.setBaseURL(""),this.load.image("background","/assets/img/background.png"),this.load.image("treasure","/assets/img/treasure-mound.png"),this.load.image("J1m","/assets/img/robot.png"),this.load.image("K3vin","/assets/img/robot2.png"),this.load.image("C4rla","/assets/img/robot3.png"),this.load.image("B3th","/assets/img/robot4.png"),this.load.image("S0nny","/assets/img/robot5.png"),this.load.image("5u5bot","/assets/img/susbot.png"),this.load.image("Pr1ck","/assets/img/cactus.png"),this.load.image("P3nny","/assets/img/penguin.png")},create:function(){const e=this;this.socket=io(`/?room=${g}&skin=${f}&name=${E}`,{autoConnect:!1}),this.socket.open(),K.addEventListener("click",(()=>{N(e)})),K.classList.remove("hidden"),this.otherPlayers=this.physics.add.group(),this.socket.on("currentPlayers",(t=>{Object.keys(t).forEach((a=>{t[a].playerId===e.socket.id?function(e,t){e.player=e.physics.add.sprite(t.x,t.y,t.skin),e.player.setBounce(0),e.player.setCollideWorldBounds(!0),e.cameras.main.startFollow(e.player)}(e,t[a]):v(e,t[a])}))})),this.socket.on("newPlayer",(t=>{v(e,t)})),this.socket.on("playerDisconnected",(t=>{e.otherPlayers.getChildren().forEach((e=>{t===e.playerId&&e.destroy()}))})),n=this.input.keyboard.createCursorKeys(),this.socket.on("playerMoved",(t=>{e.otherPlayers.getChildren().forEach((e=>{t.playerId===e.playerId&&(e.setPosition(t.x,t.y),e.flipX=t.flip)}))})),this.gameTimer=0,this.socket.on("timerTicked",(t=>{e.gameTimer=t,c.setText(k(e.gameTimer))})),this.treasures=this.physics.add.group(),this.socket.on("placeTreasures",(t=>{t.forEach((t=>{!function(e,t){const a=e.physics.add.sprite(t.x,t.y,"treasure");a._id=t._id,a.challenge=t.challenge,e.treasures.add(a)}(e,t)}))})),this.socket.on("treasureRemoved",(t=>{const a=e.treasures.getChildren().find((e=>e._id===t._id));y&&h===a&&(y=!1,p.setText("")),a.destroy()})),this.playerWinText=this.add.text(0,0,"",{fontSize:"32px",fill:"#000",align:"center"}),this.playerWinText.setDepth(1),this.gameOver=!1,this.socket.on("playerWon",(t=>{console.log(t);let a="";t.forEach((e=>{a+=`${e.name}: ${e.score}\n`})),e.playerWinText.setText(a),e.playerWinText.x=this.player.body.position.x-e.playerWinText.width/2,e.playerWinText.y=this.player.body.position.y-200,e.gameOver=!0})),this.gameStarted=!1,this.socket.on("startGame",(e=>{this.gameStarted=e})),this.add.image(500,500,"background"),this.cameras.main.setBackgroundColor("#863b00"),this.physics.world.setBounds(0,0,1e3,1e3),l=0,d=this.add.text(150,245,l,{fontSize:"32px",fill:"#000"}),d.setDepth(1),c=this.add.text(500,245,k(this.gameTimer),{fontSize:"32px",fill:"#000"}),c.setDepth(1),p=this.add.text(532,600,"",{fontSize:"40px",fill:"#000",align:"center"}),p.setDepth(1),i=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),y=!1,m=[],m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N)),m.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M))},update:function(){if(this.player&&!this.gameOver&&this.gameStarted){if(n.left.isDown&&!y?(this.player.setVelocityX(-300),this.player.flipX=!0):n.right.isDown&&!y?(this.player.setVelocityX(o),this.player.flipX=!1):this.player.setVelocityX(0),n.up.isDown&&!y?this.player.setVelocityY(-300):n.down.isDown&&!y?this.player.setVelocityY(o):this.player.setVelocityY(0),Phaser.Input.Keyboard.JustDown(i)&&(y?(y=!1,p.setText("")):this.treasures.children.iterate((e=>{this.physics.world.overlap(this.player,e,P)}))),y)if(Phaser.Input.Keyboard.JustDown(m[h.challenge[u]]))u++,p.setText(p.text+" "+s[h.challenge[u]]),u>=h.challenge.length&&(this,e=h,l++,d.setText(l),y=!1,p.setText(""),this.socket.emit("treasureCollected",{x:e.x,y:e.y,challenge:e.challenge,_id:e._id}),e.destroy());else if(R){let e=!1;for(let t=0;t<m.length;t++)e=e||Phaser.Input.Keyboard.JustDown(m[t]);e&&(y=!1,p.setText(""))}var e;d.x=this.player.body.position.x-350,d.y=this.player.body.position.y-255,c.x=this.player.body.position.x,c.y=this.player.body.position.y-255,p.x=this.player.body.position.x+this.player.body.width/2-p.displayWidth/2,p.y=this.player.body.position.y+100,!this.player.oldPosition||this.player.body.position.x===this.player.oldPosition.x&&this.player.body.position.y===this.player.oldPosition.y||this.socket.emit("playerMovement",{x:this.player.body.position.x,y:this.player.body.position.y}),this.player.oldPosition={x:this.player.body.position.x,y:this.player.body.position.y}}}}};const o=300,s=["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];let n,i,l,d,c,m,y,h,u,p,b,g,K,f,E,R=!1;const x=(e,t,a,o)=>{g=e,R=t,f=a,E=o,b=new Phaser.Game(r),K=document.querySelector("#leaveRoomButton")};function P(e,t){h=t,y=!0,u=0,p.setText(s[h.challenge[u]])}function k(e){let t=Math.floor(e/60),a=Math.floor(e%60);return`${t}:${a<10?"0"+a:a}`}function v(e,t){const a=e.physics.add.sprite(t.x,t.y,t.skin).setOrigin(.25);a.playerId=t.playerId,a.setPosition(t.x,t.y),e.otherPlayers.add(a)}const N=e=>{e.socket.disconnect(),K.classList.add("hidden"),b.destroy(!0,!1),document.querySelector("#gameSetup").classList.remove("hidden"),document.querySelector("#roomList").classList.remove("hidden")}},603:e=>{e.exports={sendPost:async(e,t,a,r)=>{const o=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),s=await o.json();s.redirect&&(window.location=s.redirect),s.error&&(a.innerText=s.error),r&&r(s)}}},856:e=>{const t=e=>React.createElement("nav",{className:"navbar"},React.createElement("a",{href:"/home",className:"navHome"},"home"),React.createElement("a",{href:"/game",className:"navGame"},"game"),React.createElement("a",{href:"/leaderboard",className:"navBoard"},"leaderboard"),React.createElement("a",{href:"/shop",className:"navShop"},"shop"),React.createElement("a",{href:"/account",className:"navAccount"},"account"),React.createElement("a",{href:"/logout",className:"navLogout"},"logout"));e.exports={renderNavbar:()=>{ReactDOM.render(React.createElement(t,null),document.getElementById("navbar"))}}},977:(e,t,a)=>{"use strict";var r=a(762),o=a(603);const s=a(856),n=e=>{e.preventDefault();const t=e.target.querySelector("#roomName").value,a=e.target.querySelector("#maxPlayers").value,r=e.target.querySelector("#minPlayers").value,s=e.target.querySelector("#time").value,n=e.target.querySelector("#treasure").value,i=e.target.querySelector("#difficulty").checked,l=document.querySelector("#_csrf").value;return t&&a&&r&&s&&n?(o.sendPost(e.target.action,{name:t,maxPlayers:a,minPlayers:r,time:s,numTreasures:n,hardOn:i,_csrf:l},document.getElementById("roomErrorText"),c),!1):(document.getElementById("roomErrorText").innerText="all fields required",!1)},i=e=>React.createElement("form",{id:"roomForm",onSubmit:n,name:"roomForm",action:"/makeRoom",method:"POST",className:"roomForm"},React.createElement("h2",{className:"roomFormTitle"},"create a room"),React.createElement("div",{className:"roomFormName"},React.createElement("label",{htmlFor:"name",className:"roomFormNameLabel"},"room name: "),React.createElement("input",{id:"roomName",type:"text",name:"name",placeholder:"new room",className:"roomFormNameInput"})),React.createElement("div",{className:"roomFormMax"},React.createElement("label",{htmlFor:"maxPlayers",className:"roomFormMaxLabel"},"max players: "),React.createElement("input",{id:"maxPlayers",type:"number",min:"1",name:"maxPlayers",placeholder:"10",className:"roomFormMaxInput"})),React.createElement("div",{className:"roomFormMin"},React.createElement("label",{htmlFor:"minPlayers",className:"roomFormMinLabel"},"min players to start: "),React.createElement("input",{id:"minPlayers",type:"number",min:"1",name:"minPlayers",placeholder:"2",className:"roomFormMinInput"})),React.createElement("div",{className:"roomFormTime"},React.createElement("label",{htmlFor:"time",className:"roomFormTimeLabel"},"time(min): "),React.createElement("input",{id:"time",type:"number",min:"1",name:"time",placeholder:"4",className:"roomFormTimeInput"})),React.createElement("div",{className:"roomFormTreasure"},React.createElement("label",{htmlFor:"treasure",className:"roomFormTreasureLabel"},"amount of treasure: "),React.createElement("input",{id:"treasure",type:"number",min:"1",name:"treasure",placeholder:"10",className:"roomFormTreasureInput"})),React.createElement("div",{className:"roomFormHard"},React.createElement("label",{htmlFor:"difficulty",className:"roomFormHardLabel"},"hard mode on: "),React.createElement("input",{id:"difficulty",type:"checkbox",name:"difficulty",className:"roomFormHardInput"})),React.createElement("input",{className:"roomFormSubmit",type:"submit",value:"create room"}),React.createElement("input",{id:"_csrf",type:"hidden",name:"_csrf",value:e.csrf}),React.createElement("p",{id:"roomErrorText"})),l=e=>{if(0===Object.keys(e.rooms).length||0===Object.values(e.rooms).filter((e=>!e.ended)).length)return React.createElement("div",{className:"roomListContainer"},React.createElement("button",{id:"refreshRooms",className:"refreshRoomsButton",type:"button",onClick:c},"refresh rooms"),React.createElement("h3",{className:"emptyRoomList"}," no rooms yet"));const t=Object.values(e.rooms).map((e=>React.createElement("tr",{key:e._id,className:"room"},React.createElement("td",{className:"roomName"},e.name),React.createElement("td",{className:"roomMax"},e.maxPlayers),React.createElement("td",{className:"roomMin"},e.minPlayers),React.createElement("td",{className:"roomTime"},e.time+":00"),React.createElement("td",{className:"roomTreasures"},e.numTreasures),React.createElement("td",{className:"roomDifficulty"},e.hard?"yes":"no"),React.createElement("td",{className:"roomPlayers"},e.currentPlayers),React.createElement("td",null,React.createElement("button",{id:"joinRoom",className:"joinRoomButton",type:"button",onClick:()=>d(e._id,e.hard)},"join")))));return React.createElement("div",{className:"roomListContainer"},React.createElement("button",{id:"refreshRooms",className:"refreshRoomsButton",type:"button",onClick:c},"refresh rooms"),React.createElement("table",{className:"roomList"},React.createElement("tbody",null,React.createElement("tr",null,React.createElement("th",null,"name"),React.createElement("th",null,"max players"),React.createElement("th",null,"min players to start"),React.createElement("th",null,"time"),React.createElement("th",null,"amount of treasure"),React.createElement("th",null,"hard mode on"),React.createElement("th",null,"players in the room"),React.createElement("th",null)),t)))},d=async(e,t)=>{const a=await fetch("/getRooms"),o=await a.json();if(!o.roomObject[e].ended&&o.roomObject[e].currentPlayers<o.roomObject[e].maxPlayers&&!o.roomObject[e].ended){document.getElementById("gameSetup").classList.add("hidden"),document.getElementById("roomList").classList.add("hidden");const a=await fetch("/getAccount"),o=await a.json();r.t(e,t,o.account.equippedSkin,o.account.username)}else c()},c=async()=>{const e=await fetch("/getRooms"),t=await e.json();ReactDOM.render(React.createElement(l,{rooms:t.roomObject}),document.getElementById("roomList"))};window.onload=async()=>{const e=await fetch("/getToken"),t=await e.json();ReactDOM.render(React.createElement(i,{csrf:t.csrfToken}),document.getElementById("gameSetup")),ReactDOM.render(React.createElement(l,{rooms:{}}),document.getElementById("roomList")),c(),document.querySelector("#leaveRoomButton").addEventListener("click",c),s.renderNavbar()}}},t={};function a(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={exports:{}};return e[r](s,s.exports,a),s.exports}a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a(977),a(762)})();