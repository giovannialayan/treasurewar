import * as game from './game.js';
import * as helper from './helper.js';

const handleRoomSetup = (e) => {
    e.preventDefault();

    const name = e.target.querySelector('#roomName').value;
    const maxPlayers = e.target.querySelector('#maxPlayers').value;
    const minPlayers = e.target.querySelector('#minPlayers').value;
    const time = e.target.querySelector('#time').value;
    const numTreasures = e.target.querySelector('#treasure').value;
    const hardOn = e.target.querySelector('#difficulty').checked;

    if(!name || !maxPlayers || !minPlayers || !time || !numTreasures) {
        console.log('all fields required');
        return false;
    }

    helper.sendPost(e.target.action, {name, maxPlayers, minPlayers, time, numTreasures, hardOn}, getRoomList);

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
        </form>
    );
};

const RoomList = (props) => {
    if(Object.keys(props.rooms).length === 0) {
        return (
            <div className="roomListContainer">
                <button id="refreshRooms" className="refreshRoomsButton" type="button" onClick={getRoomList}>refresh rooms</button>
                {/* <h3 className="emptyRoomList"> no rooms yet</h3> */}
                <div className="roomList">
                    <div key={0} className="room">
                    <p className="roomName"> name: <span>example room for styling</span> </p>
                    <p className="roomMax"> max players: <span>10</span> </p>
                    <p className="roomMin"> min players to start: <span>2</span> </p>
                    <p className="roomTime"> time: <span>4:00</span> </p>
                    <p className="roomTreasures"> amount of treasure: <span>10</span></p>
                    <p className="roomDifficulty"> hard mode on: <span>no</span> </p>
                    <p className="roomPlayers"> players in the room: <span>0</span></p>
                    <button id="joinRoom" className="joinRoomButton" type="button">
                        join
                    </button>
                    </div>
                </div>
            </div>
        );
    }

    const roomNodes = Object.values(props.rooms).map(room => {
        return (
            <div key={room._id} className="room">
                <h3 className="roomName"> name: {room.name} </h3>
                <h3 className="roomMax"> max players: {room.maxPlayers} </h3>
                <h3 className="roomMin"> min players to start: {room.minPlayers} </h3>
                <h3 className="roomTime"> time: {room.time + ':00'} </h3>
                <h3 className="roomTreasures"> amount of treasure: {room.numTreasures}</h3>
                <h3 className="roomDifficulty"> hard mode on: {room.hard ? 'yes' : 'no'} </h3>
                <h3 className="roomPlayers"> players in the room: {room.currentPlayers}</h3>
                <button id="joinRoom" className="joinRoomButton" type="button" onClick={() => start(room._id, room.hard)}>
                    join
                </button>
            </div>
        );
    });

    return (
        <div className="roomListContainer">
            <button id="refreshRooms" className="refreshRoomsButton" type="button" onClick={getRoomList}>refresh rooms</button>
            <div className="roomList">
                {roomNodes}
            </div>
        </div>
    );
};

const start = async (roomId, hard) => {
    const response  = await fetch('/getRooms');
    const data = await response.json();
    
    if(data.roomObject[roomId].currentPlayers < data.roomObject[roomId].maxPlayers) {
        document.getElementById('gameSetup').classList.add('hidden');
        document.getElementById('roomList').classList.add('hidden');
    
        game.startGame(roomId, hard);
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
    ReactDOM.render(
        <RoomForm/>,
        document.getElementById('gameSetup')
    );

    ReactDOM.render(
        <RoomList rooms={{}}/>,
        document.getElementById('roomList')
    );

    getRoomList();
};

window.onload = init;