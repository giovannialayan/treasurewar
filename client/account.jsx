const helper = require('./helper.js');
const navbar = require('./navbar.jsx');
// const ad = require('./ad.jsx');

const chromaImages = {
    'J1mwhite':  '/assets/img/robot/robot_96px.png',
    'J1mred':    '/assets/img/robot/robot_red_96px.png',
    'J1mblue':   '/assets/img/robot/robot_blue_96px.png',
    'J1mgreen':  '/assets/img/robot/robot_green_96px.png',
    'J1morange': '/assets/img/robot/robot_orange_96px.png',
    'J1mpink':   '/assets/img/robot/robot_pink_96px.png',
    'J1mpurple': '/assets/img/robot/robot_purple_96px.png',
    'J1myellow': '/assets/img/robot/robot_yellow_96px.png',
    'K3vinwhite':  '/assets/img/robot2/robot2_96px.png',
    'K3vinred':    '/assets/img/robot2/robot2_red_96px.png',
    'K3vinblue':   '/assets/img/robot2/robot2_blue_96px.png',
    'K3vingreen':  '/assets/img/robot2/robot2_green_96px.png',
    'K3vinorange': '/assets/img/robot2/robot2_orange_96px.png',
    'K3vinpink':   '/assets/img/robot2/robot2_pink_96px.png',
    'K3vinpurple': '/assets/img/robot2/robot2_purple_96px.png',
    'K3vinyellow': '/assets/img/robot2/robot2_yellow_96px.png',
    'C4rlawhite':  '/assets/img/robot3/robot3_96px.png',
    'C4rlared':    '/assets/img/robot3/robot3_red_96px.png',
    'C4rlablue':   '/assets/img/robot3/robot3_blue_96px.png',
    'C4rlagreen':  '/assets/img/robot3/robot3_green_96px.png',
    'C4rlaorange': '/assets/img/robot3/robot3_orange_96px.png',
    'C4rlapink':   '/assets/img/robot3/robot3_pink_96px.png',
    'C4rlapurple': '/assets/img/robot3/robot3_purple_96px.png',
    'C4rlayellow': '/assets/img/robot3/robot3_yellow_96px.png',
    'B3thwhite':  '/assets/img/robot4/robot4_96px.png',
    'B3thred':    '/assets/img/robot4/robot4_red_96px.png',
    'B3thblue':   '/assets/img/robot4/robot4_blue_96px.png',
    'B3thgreen':  '/assets/img/robot4/robot4_green_96px.png',
    'B3thorange': '/assets/img/robot4/robot4_orange_96px.png',
    'B3thpink':   '/assets/img/robot4/robot4_pink_96px.png',
    'B3thpurple': '/assets/img/robot4/robot4_purple_96px.png',
    'B3thyellow': '/assets/img/robot4/robot4_yellow_96px.png',
    'S0nnywhite':  '/assets/img/robot5/robot5_96px.png',
    'S0nnyred':    '/assets/img/robot5/robot5_red_96px.png',
    'S0nnyblue':   '/assets/img/robot5/robot5_blue_96px.png',
    'S0nnygreen':  '/assets/img/robot5/robot5_green_96px.png',
    'S0nnyorange': '/assets/img/robot5/robot5_orange_96px.png',
    'S0nnypink':   '/assets/img/robot5/robot5_pink_96px.png',
    'S0nnypurple': '/assets/img/robot5/robot5_purple_96px.png',
    'S0nnyyellow': '/assets/img/robot5/robot5_yellow_96px.png',
    '5u5botwhite':  '/assets/img/susbot/susbot_96px.png',
    '5u5botred':    '/assets/img/susbot/susbot_red_96px.png',
    '5u5botblue':   '/assets/img/susbot/susbot_blue_96px.png',
    '5u5botgreen':  '/assets/img/susbot/susbot_green_96px.png',
    '5u5botorange': '/assets/img/susbot/susbot_orange_96px.png',
    '5u5botpink':   '/assets/img/susbot/susbot_pink_96px.png',
    '5u5botpurple': '/assets/img/susbot/susbot_purple_96px.png',
    '5u5botyellow': '/assets/img/susbot/susbot_yellow_96px.png',
    'Pr1ckwhite':  '/assets/img/cactus/cactus_96px.png',
    'Pr1ckred':    '/assets/img/cactus/cactus_red_96px.png',
    'Pr1ckblue':   '/assets/img/cactus/cactus_blue_96px.png',
    'Pr1ckgreen':  '/assets/img/cactus/cactus_green_96px.png',
    'Pr1ckorange': '/assets/img/cactus/cactus_orange_96px.png',
    'Pr1ckpink':   '/assets/img/cactus/cactus_pink_96px.png',
    'Pr1ckpurple': '/assets/img/cactus/cactus_purple_96px.png',
    'Pr1ckyellow': '/assets/img/cactus/cactus_yellow_96px.png',
    'P3nnywhite':  '/assets/img/penguin/penguin_96px.png',
    'P3nnyred':    '/assets/img/penguin/penguin_red_96px.png',
    'P3nnyblue':   '/assets/img/penguin/penguin_blue_96px.png',
    'P3nnygreen':  '/assets/img/penguin/penguin_green_96px.png',
    'P3nnyorange': '/assets/img/penguin/penguin_orange_96px.png',
    'P3nnypink':   '/assets/img/penguin/penguin_pink_96px.png',
    'P3nnypurple': '/assets/img/penguin/penguin_purple_96px.png',
    'P3nnyyellow': '/assets/img/penguin/penguin_yellow_96px.png',
};

const AccountInfo = (props) => {
    const checkSkinEquipped = (skinName, equippedSkin) => {
        return skinName === equippedSkin.substring(0, equippedSkin.indexOf('_'));
    };

    const getChromaEquipped = (equippedSkin) => {
        return equippedSkin.substring(equippedSkin.indexOf('_') + 1);
    };

    const changeImgChroma = (skinName, chroma) => {
        document.getElementById('img' + skinName).src = chromaImages[skinName + chroma];
    };

    let skinNodes;
    if(props.account.skins) {
        skinNodes = props.account.skins.map(skin => {
            return (
                <div key={skin._id} id={skin._id} className="skin">
                    <img src={
                        checkSkinEquipped(skin.name, props.account.equippedSkin) ? 
                        chromaImages[skin.name + getChromaEquipped(props.account.equippedSkin)] : 
                        skin.img
                    } id={'img' + skin.name} className="skinImg"/>
                    <p className="skinName">{skin.name}</p>
                    <p className="skinDesc">{skin.desc}</p>
                    <div>
                        <label htmlFor="chroma" className="skinChromaLabel"></label>
                        <select 
                            id={'chroma' + skin.name} 
                            name="chroma" className="skinChromaInput" 
                            defaultValue={
                                checkSkinEquipped(skin.name, props.account.equippedSkin) ? 
                                getChromaEquipped(props.account.equippedSkin) : 
                                'white'} 
                            onChange={(e) => {
                                changeImgChroma(skin.name, e.target.value);

                                if(checkSkinEquipped(skin.name, props.account.equippedSkin)) {
                                    equipSkin(`${skin.name}_${e.target.value}`);
                                }
                            }}
                        >
                            <option value="white">basic</option>
                            <option value="red" className={props.account.chromas.includes('Red_' + skin.name) ? '' : 'hidden'}>red</option>
                            <option value="blue" className={props.account.chromas.includes('Blue_' + skin.name) ? '' : 'hidden'}>blue</option>
                            <option value="orange" className={props.account.chromas.includes('Orange_' + skin.name) ? '' : 'hidden'}>orange</option>
                            <option value="green" className={props.account.chromas.includes('Green_' + skin.name) ? '' : 'hidden'}>green</option>
                            <option value="yellow" className={props.account.chromas.includes('Yellow_' + skin.name) ? '' : 'hidden'}>yellow</option>
                            <option value="pink" className={props.account.chromas.includes('Pink_' + skin.name) ? '' : 'hidden'}>pink</option>
                            <option value="purple" className={props.account.chromas.includes('Purple_' + skin.name) ? '' : 'hidden'}>purple</option>
                        </select>
                    </div>
                    <button 
                        className={!checkSkinEquipped(skin.name, props.account.equippedSkin) ? 'equipSkinButton' : 'equippedSkinButton'}
                        onClick={() => {
                            if(!checkSkinEquipped(skin.name, props.account.equippedSkin)) {
                                document.getElementById('chroma' + props.account.equippedSkin.substring(0, props.account.equippedSkin.indexOf('_'))).value = 'white';
                                equipSkin(`${skin.name}_${document.getElementById('chroma' + skin.name).value}`);
                            }
                        }}
                    >
                        {checkSkinEquipped(skin.name, props.account.equippedSkin) ? 'equipped' : 'equip'}
                    </button>
                </div>
            );
        });
    }
    else {
        skinNodes = '';
    }

    return (
        <div className="account">
            <div className="accountInfo">
                <p className="username">{props.account.username}</p>
                <p className="wins">wins: {props.account.wins}</p>
                <p className="topThrees">top three finishes: {props.account.topThrees}</p>
                <p className="gamesPlayed">games played: {props.account.gamesPlayed}</p>
                {/* <p className="winWarning">note: wins and top three finishes are only counted in games where at least 10 players are present when the game ends.</p> */}
            </div>
            <p className="skinsTitle">your skins</p>
            <p id="skinsErrorText"></p>
            <div className="skins">
                {skinNodes}
            </div>
            <button id="changePassButton" className="changePassButton">change your password</button>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
        </div>
    );
};

const PasswordChange = (props) => {
    return (
        <form id="passChangeForm"
            name="passChangeForm"
            onSubmit={handlePassChange}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <div className='passChangeCurrPass'>
                <label htmlFor="currPass">current password: </label>
                <input id="currPass" type="password" name="currPass" placeholder="current password" />
            </div>
            <div className='passChangeNewPass'>
                <label htmlFor="newPass">password: </label>
                <input id="newPass" type="password" name="newPass" placeholder="new password" />
            </div>
            <div className='passChangeNewPass2'>
                <label htmlFor="newPass2">password: </label>
                <input id="newPass2" type="password" name="newPass2" placeholder="retype new password" />
            </div>
            <input className="formSubmit" type="submit" value="change password" />
            <p id="passChangeErrorText"></p>
        </form>
    );
};

const handlePassChange = (e) => {
    e.preventDefault();

    const currPass = e.target.querySelector('#currPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;
    const _csrf = document.querySelector('#_csrf').value;

    if(!currPass || !newPass || !newPass2) {
        //console.log('one or more fields are empty');
        document.getElementById('passChangeErrorText').innerText = 'one or more fields are empty';
        return false;
    }

    helper.sendPost(e.target.action, {currPass, newPass, newPass2, _csrf}, document.getElementById('passChangeErrorText'));

    return false;
};

const equipSkin = async (skinName) => {
    const _csrf = document.getElementById('_csrf').value;
    helper.sendPost('/equipSkin', {name: skinName, _csrf}, document.getElementById('skinsErrorText'), loadAccountFromServer);
};

const loadAccountFromServer = async () => {
    const response = await fetch('/getAccount');
    const data = await response.json();

    const csrfResponse = await fetch('/getToken');
    const csrfData = await csrfResponse.json();

    ReactDOM.render(<AccountInfo account={data.account} csrf={csrfData.csrfToken}/>, document.getElementById('account'));
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(<AccountInfo account={{skins:[], chromas:[]}} csrf={data.csrfToken}/>, document.getElementById('account'));

    loadAccountFromServer();

    const passChangeDiv = document.getElementById('passwordChange');
    ReactDOM.render(<PasswordChange/>, passChangeDiv);

    passChangeDiv.classList.add('hidden');
    const changePassButton = document.getElementById('changePassButton');
    changePassButton.addEventListener('click', (e) => {
        passChangeDiv.classList.toggle('hidden');
        window.scrollBy(0, document.body.scrollHeight);
    });

    navbar.renderNavbar();
    // ad.renderAd();
};

window.onload = init;