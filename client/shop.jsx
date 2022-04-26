const helper = require('./helper.js');
const navbar = require('./navbar.jsx');
const ad = require('./ad.jsx');

const Shop = (props) => {
    const getNodes = (items, ownedCompare) => {
        return items.map(item => {
            const itemOwned = checkItemOwned(ownedCompare, item);
            return (
                <div key={item._id} className={item.type === 'skin' ? 'skinItem' : 'chromaItem'}>
                    <img src={item.img} className="itemImg"/>
                    <p className="itemName">{item.type === 'chroma' ? item.name.replace('_', ' ') : item.name}</p>
                    <p className="itemDesc">{item.desc}</p>
                    <button className={itemOwned ? 'itemOwnedButton' : 'itemButton'} 
                        onClick={() => {
                            if(!itemOwned) {
                                buyItem(item.name);
                            }
                        }}
                    >
                        {itemOwned ? 'owned' : 'buy'}
                    </button>
                </div>
            );
        });
    };

    const itemNodes = getNodes(props.items.skins, props.account.skins);
    console.log(props.items.chromas, props.account.chromas);
    const chromaNodes = getNodes(props.items.chromas, props.account.chromas);

    return (
        <div className="itemsContainer">
            <p>skins</p>
            <div className="skinsContainer">
                {itemNodes}
            </div>
            <p>chromas</p>
            <div className="chromasContainer">
                {chromaNodes}
            </div>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <p id="shopErrorText"></p>
        </div>
    );
};

const checkItemOwned = (itemsOwned, item) => {
    let owned = false;
    if(item.type === 'skin') {
        itemsOwned.forEach(itemOwned => {
            if(new Map(Object.entries(itemOwned)).get('name') === new Map(Object.entries(item)).get('name')) {
                owned = true;
            }
        });
    }
    else if(item.type === 'chroma') {
        owned = itemsOwned.includes(item.name);
    }

    return owned;
};

//make post request to add item to this account's skins list
const buyItem = async (itemName) => {
    const _csrf = document.getElementById('_csrf').value;
    helper.sendPost('/buyItem', {name: itemName, _csrf}, document.getElementById('shopErrorText'), getShopItemsFromServer);
};

const getShopItemsFromServer = async () => {
    const response = await fetch('/getShopItems');
    const data = await response.json();

    const accResponse = await fetch('/getAccount');
    const accData = await accResponse.json();

    const csrfResponse = await fetch('/getToken');
    const csrfData = await csrfResponse.json();

    ReactDOM.render(
        <Shop items={{skins: data.skins, chromas: data.chromas}} account={{skins: accData.account.skins, chromas: accData.account.chromas}} csrf={csrfData.csrfToken}/>,
        document.getElementById('shop')
    );
};

const init = () => {
    ReactDOM.render(
        <Shop items={{skins: [], chromas: []}} account={{skins: [], chromas: []}}  csrf={''}/>,
        document.getElementById('shop')
    );

    getShopItemsFromServer();

    navbar.renderNavbar();
    ad.renderAd();
};

window.onload = init;