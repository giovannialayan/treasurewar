const AccountInfo = (props) => {
    const skinNodes = props.account.account.skins.map(skin => {
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
                    {skin.name === props.account.equippedSkin ? 'equip' : 'equipped'}
                </button>
            </div>
        );
    });

    return (
        <div className="account">
            <p className="username">props.account.username</p>
            <p className="gamesPlayed">games played: props.account.gamesPlayed</p>
            <p className="wins">wins: props.account.wins</p>
            <p className="topThrees">top three finishes: props.account.topThrees</p>
            <p className="winWarning">note: wins and top three finishes are only counted in games where at least 10 players are present when the game ends.</p>
            <div className="skins">
                your skins
                {skinNodes}
            </div>
            <input id="_csrfDelete" type="hidden" name="_csrf" value={props.csrf} />
        </div>
    );
}

const loadAccountFromServer = async () => {
    const response = await fetch('/getAccount');
    const data = await response.json();

    const csrfResponse = await fetch('/getToken');
    const csrfData = await csrfResponse.json();

    ReactDOM.render(<AccountInfo account={data.account} csrf={csrfData.csrfToken}/>, document.getElementById('account'));
};

const init = () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(<AccountInfo account={{}} csrf={data.csrfToken}/>, document.getElementById('account'));

    loadAccountFromServer();
};

window.onload = init;