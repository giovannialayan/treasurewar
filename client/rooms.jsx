import * as game from './game.js';
import * as helper from './helper.js';

const handleRoomSetup = () => {
    e.preventDefault();

    const name = e.target.querySelector('#roomName').value;
    const maxPlayers = e.target.querySelector('#maxPlayers').value;
    const minPlayers = e.target.querySelector('#minPlayers').value;
    const time = e.target.querySelector('#time').value;
    const hardOn = e.target.querySelector('#difficulty').checked;

    if(!name || !maxPlayers || !minPlayers || !time || !hardOn) {
        console.log('all fields required');
        return false;
    }

    helper.sendPost(e.target.action, {name, maxPlayers, minPlayers, time, hardOn}, getRoomList);

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
            <label htmlFor="name">room name: </label>
            <input id="roomName" type="text" name="name" placeholder="new room" />
            <label htmlFor="maxPlayers">max players: </label>
            <input id="maxPlayers" type="number" min="1" name="maxPlayers" />
            <label htmlFor="minPlayers">min players to start: </label>
            <input id="minPlayers" type="number" min="1" name="minPlayers" />
            <label htmlFor="time">time(min): </label>
            <input id="time" type="number" min="1" name="time" />
            <label htmlFor="difficulty">hard mode on: </label>
            <input id="difficulty" type="checkbox" name="difficulty" />
            <input className="roomSetupSubmit" type="submit" value="create room" />
        </form>
    );
};

const RoomList = (props) => {
    if(props.rooms.length === 0) {
        return (
            <div className="roomList">
                <h3 className="emptyRoomList"> no rooms yet</h3>
            </div>
        );
    }

    const roomNodes = props.rooms.map(room => {
        return (
            <div key={domo._id} className="room">
                <h3 className="roomName"> name: {room.name} </h3>
                <h3 className="roomMax"> max players: {room.maxPlayers} </h3>
                <h3 className="roomMin"> min players to start: {room.minPlayers} </h3>
                <h3 className="roomTime"> time: {room.time} </h3>
                <h3 className="roomDifficulty"> hard mode on: {room.hardOn} </h3>
                <button id="joinRoom" className="joinRoomButton" type="button" onClick={() => joinRoom(room._id)}>
                    join
                </button>
            </div>
        );
    });

    const joinRoom = (roomId) => {
        const formData = `roomId=${roomId}`;
        const response = await fetch('/joinRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-ww-form-urlencoded',
                'Accept': 'application/json',
            },
            body: formData,
        });

        start();
    };

    return (
        <div className="roomList">
            {roomNodes}
        </div>
    );
};

const start = () => {
    document.getElementById('gameSetup').classList.add('hidden');
    document.getElementById('roomList').classList.add('hidden');

    game.startGame();
};

const getRoomList = () => {
    const response  = await fetch('/getRooms');
    const data = await response.json();

};

const init = async () => {
    ReactDOM.render(
        <RoomForm/>,
        document.getElementById('gameSetup')
    );
};

window.onload = init;