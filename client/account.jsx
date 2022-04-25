const helper = require('./helper.js');
const navbar = require('./navbar.jsx');
// const ad = require('./ad.jsx');

const AccountInfo = (props) => {
    let skinNodes;
    if(props.account.skins) {
        skinNodes = props.account.skins.map(skin => {
            return (
                <div key={skin._id} className="skin">
                    <img src={skin.img} className="skinImg"/>
                    <p className="skinName">{skin.name}</p>
                    <p className="skinDesc">{skin.desc}</p>
                    <button 
                        className={skin.name !== props.account.equippedSkin ? 'equipSkinButton' : 'equippedSkinButton'}
                        onClick={() => {
                            if(skin.name !== props.account.equippedSkin) {
                                equipSkin(skin.name);
                            }
                        }}
                    >
                        {skin.name === props.account.equippedSkin ? 'equipped' : 'equip'}
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

    ReactDOM.render(<AccountInfo account={{skins:[]}} csrf={data.csrfToken}/>, document.getElementById('account'));

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