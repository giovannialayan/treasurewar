const helper = require('./helper.js');

const Shop = (props) => {
    const itemNodes = props.items.map(item => {
        return (
            <div key={item._id} className="item">
                <img src={item.imageSrc} className="itemImg"/>
                <p className="itemName">{item.name}</p>
                <p className="itemDesc">{item.desc}</p>
                <button className="itemButton" 
                    onClick={() => {
                        if(!props.account.skins.contains(item)) {
                            buyItem(item.name);
                        }
                    }}
                >
                    {props.account.skins.contains(item) ? 'owned' : 'buy'}
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

const buyItem = async (itemName) => {
    //make post request to add item to this account's skins list
    const _csrf = document.getElementById('_csrf').value;
    helper.sendPost('/buyItem', {itemName, _csrf});
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
    items = [
        {
            _id: '0',
            imageSrc: '/assets/img/robot_96px.png',
            name: 'J1m',
            desc: 'J1m\'s a hard worker, it won\'t complain about any job you throw at it.'
        },
        {
            _id: '1',
            imageSrc: '/assets/img/robot2_96px.png',
            name: 'K3vin',
            desc: 'K3vin might not always work exactly the way you want but it\'s damn cheap, you want it or not?'
        },
        {
            _id: '2',
            imageSrc: '/assets/img/robot3_96px.png',
            name: 'C4rla',
            desc: 'C4rla won\'t stop until it\'s task is complete, it works from dawn to dusk just barely taking a break when it needs to refuel.'
        },
        {
            _id: '3',
            imageSrc: '/assets/img/robot4_96px.png',
            name: 'B3th',
            desc: 'B3th is a wild one, some days it\'ll do the job you need ten times faster than any other unit but other days it won\'t take orders from no one.'
        },
        {
            _id: '4',
            imageSrc: '/assets/img/robot5_96px.png',
            name: 'S0nny',
            desc: 'I\'m not really sure what goes on in sonny\'s internal processing, it gets the job done but there\'s always something off about it\'s work.'
        },
        {
            _id: '5',
            imageSrc: '/assets/img/sus_64px.png',
            name: 'SuS',
            desc: '👀'
        },
    ];

    ReactDOM.render(
        <Shop items={items}/>,
        document.getElementById('shop')
    );
};

window.onload = init;