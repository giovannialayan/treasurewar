import * as game from './game.js';
import * as helper from './helper.js';
const navbar = require('./navbar.jsx');

const handleRoomSetup = (e) => {
    e.preventDefault();

    const name = e.target.querySelector('#roomName').value;
    const maxPlayers = e.target.querySelector('#maxPlayers').value;
    const minPlayers = e.target.querySelector('#minPlayers').value;
    const time = e.target.querySelector('#time').value;
    const numTreasures = e.target.querySelector('#treasure').value;
    const hardOn = e.target.querySelector('#difficulty').checked;
    const _csrf = document.querySelector('#_csrf').value;

    if(!name || !maxPlayers || !minPlayers || !time || !numTreasures) {
        console.log('all fields required');
        return false;
    }

    helper.sendPost(e.target.action, {name, maxPlayers, minPlayers, time, numTreasures, hardOn, _csrf}, getRoomList);

    return false;
};

const RoomForm = (props) => {
    return (
        <form id="roomForm"
            onSubmit={handleRoomSetup}
            name="roomForm"
            action="/makeRoom"
            method="POST"
            className="roomForm"
        >
            <h2 className="roomFormTitle">create a room</h2>
            <div className="roomFormName">
                <label htmlFor="name" className="roomFormNameLabel">room name: </label>
                <input id="roomName" type="text" name="name" placeholder="new room" className="roomFormNameInput"/>
            </div>
            <div className="roomFormMax">
                <label htmlFor="maxPlayers" className="roomFormMaxLabel">max players: </label>
                <input id="maxPlayers" type="number" min="1" name="maxPlayers" placeholder="10" className="roomFormMaxInput"/>
            </div>
            <div className="roomFormMin">
                <label htmlFor="minPlayers" className="roomFormMinLabel">min players to start: </label>
                <input id="minPlayers" type="number" min="1" name="minPlayers" placeholder="2" className="roomFormMinInput"/>
            </div>
            <div className="roomFormTime">
                <label htmlFor="time" className="roomFormTimeLabel">time(min): </label>
                <input id="time" type="number" min="1" name="time" placeholder="4" className="roomFormTimeInput"/>
            </div>
            <div className="roomFormTreasure">
                <label htmlFor="treasure" className="roomFormTreasureLabel">amount of treasure: </label>
                <input id="treasure" type="number" min="1" name="treasure" placeholder="10" className="roomFormTreasureInput"/>
            </div>
            <div className="roomFormHard">
                <label htmlFor="difficulty" className="roomFormHardLabel">hard mode on: </label>
                <input id="difficulty" type="checkbox" name="difficulty" className="roomFormHardInput"/>
            </div>
            <input className="roomFormSubmit" type="submit" value="create room" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
        </form>
    );
};

const RoomList = (props) => {
    if(Object.keys(props.rooms).length === 0) {
        return (
            <div className="roomListContainer">
                <button id="refreshRooms" className="refreshRoomsButton" type="button" onClick={getRoomList}>refresh rooms</button>
                <h3 className="emptyRoomList"> no rooms yet</h3>
                {/* <table className="roomList">
                    <tbody>
                    <tr>
                        <th>name</th>
                        <th>max players</th>
                        <th>min players to start</th>
                        <th>time</th>
                        <th>amount of treasure</th>
                        <th>hard mode on</th>
                        <th>players in the room</th>
                        <th></th>
                    </tr>
                    <tr key={0} className="room">
                        <td className="roomName">example room for styling</td>
                        <td className="roomMax">10</td>
                        <td className="roomMin">2</td>
                        <td className="roomTime">4:00</td>
                        <td className="roomTreasures">10</td>
                        <td className="roomDifficulty">no</td>
                        <td className="roomPlayers">0</td>
                        <td><button id="joinRoom" className="joinRoomButton" type="button">join</button></td>
                    </tr>
                    </tbody>
                </table> */}
            </div>
        );
    }

    const roomNodes = Object.values(props.rooms).map(room => {
        if(room.ended) {
            return;
        }

        return (
            <tr key={room._id} className="room">
                <td className="roomName">{room.name}</td>
                <td className="roomMax">{room.maxPlayers}</td>
                <td className="roomMin">{room.minPlayers}</td>
                <td className="roomTime">{room.time + ':00'}</td>
                <td className="roomTreasures">{room.numTreasures}</td>
                <td className="roomDifficulty">{room.hard ? 'yes' : 'no'}</td>
                <td className="roomPlayers">{room.currentPlayers}</td>
                <td><button id="joinRoom" className="joinRoomButton" type="button" onClick={() => start(room._id, room.hard)}>join</button></td>
            </tr>
        );
    });

    return (
        <div className="roomListContainer">
            <button id="refreshRooms" className="refreshRoomsButton" type="button" onClick={getRoomList}>refresh rooms</button>
            <table className="roomList">
                <tbody>
                    <tr>
                        <th>name</th>
                        <th>max players</th>
                        <th>min players to start</th>
                        <th>time</th>
                        <th>amount of treasure</th>
                        <th>hard mode on</th>
                        <th>players in the room</th>
                        <th></th>
                    </tr>
                    {roomNodes}
                </tbody>
            </table>
        </div>
    );
};

const start = async (roomId, hard) => {
    const response  = await fetch('/getRooms'); //change this so the roomid is passed as a param so only the room i want is getted
    const data = await response.json();

    if(data.roomObject[roomId] && data.roomObject[roomId].currentPlayers < data.roomObject[roomId].maxPlayers && !data.roomObject[roomId].ended) {
        document.getElementById('gameSetup').classList.add('hidden');
        document.getElementById('roomList').classList.add('hidden');

        const accResponse = await fetch('/getAccount');
        const accData = await accResponse.json();
    
        game.startGame(roomId, hard, accData.account.equippedSkin, accData.account.username);
    }
    else {
        getRoomList();
    }
};

const getRoomList = async () => {
    const response  = await fetch('/getRooms');
    const data = await response.json();

    ReactDOM.render(
        <RoomList rooms={data.roomObject}/>,
        document.getElementById('roomList')
    );
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <RoomForm csrf={data.csrfToken}/>,
        document.getElementById('gameSetup')
    );

    ReactDOM.render(
        <RoomList rooms={{}}/>,
        document.getElementById('roomList')
    );

    getRoomList();

    document.querySelector('#leaveRoomButton').addEventListener('click', getRoomList);

    navbar.renderNavbar();
};

window.onload = init;