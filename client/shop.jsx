const helper = require('./helper.js');

const Shop = (props) => {
    const itemNodes = props.items.map(item => {
        const itemOwned = checkItemOwned(props.account.skins, item);
        return (
            <div key={item._id} className="item">
                <img src={item.img} className="itemImg"/>
                <p className="itemName">{item.name}</p>
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

    return (
        <div className="itemsContainer">
            {itemNodes}
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
        </div>
    );
};

const checkItemOwned = (itemsOwned, item) => {
    let owned = false;
    itemsOwned.forEach(itemOwned => {
        if(new Map(Object.entries(itemOwned)).get('name') === new Map(Object.entries(item)).get('name')) {
            owned = true;
        }
    });

    return owned;
}

//make post request to add item to this account's skins list
const buyItem = async (itemName) => {
    const _csrf = document.getElementById('_csrf').value;
    helper.sendPost('/buyItem', {name: itemName, _csrf}, getShopItemsFromServer);
};

const getShopItemsFromServer = async () => {
    const response = await fetch('/getShopItems');
    const data = await response.json();

    const accResponse = await fetch('/getAccount');
    const accData = await accResponse.json();

    const csrfResponse = await fetch('/getToken');
    const csrfData = await csrfResponse.json();

    ReactDOM.render(
        <Shop items={data.items} account={accData.account} csrf={csrfData.csrfToken}/>,
        document.getElementById('shop')
    );
};

const init = () => {
    ReactDOM.render(
        <Shop items={[]} csrf={''}/>,
        document.getElementById('shop')
    );

    getShopItemsFromServer();
};

window.onload = init;