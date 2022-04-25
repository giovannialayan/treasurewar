const navbar = require('./navbar.jsx');
const ad = require('./ad.jsx');

const Leaderboard = (props) => {
    let userNodes;
    let rank = 1;
    if(props.sortByWins) {
        userNodes = props.winsBoard.map(user => {
            return (
               <tr key={user._id} className="user">
                    <td className="rank">{rank++}</td>
                    <td className="username">{user.username}</td>
                    <td className="wins">{user.wins}</td>
                    <td className="topThrees">{user.topThrees}</td>
                </tr>
            );
        });
    }
    else {
        userNodes = props.topThreesBoard.map(user => {
            return (
               <tr key={user._id} className="user">
                    <td className="rank">{rank++}</td>
                    <td className="username">{user.username}</td>
                    <td className="topThrees">{user.topThrees}</td>
                    <td className="wins">{user.wins}</td>
                </tr>
            );
        });
    }
    return (
        <div className="leaderboard">
            <div className="boardButtons">
                <button className="refreshBoardButton" onClick={() => {loadLeaderboardFromServer(props.sortByWins)}}>refresh leaderboard</button>
                <button className="sortByButton" onClick={() => toggleSortBy(props.winsBoard, props.topThreesBoard)}>sort by top three finishes</button>
            </div>
            <table className="roomList">
                <tbody>
                    <tr>
                        <th>rank</th>
                        <th>name</th>
                        <th>{props.sortByWins ? 'wins' : 'top three finishes'}</th>
                        <th>{props.sortByWins ? 'top three finishes' : 'wins'}</th>
                    </tr>
                    {userNodes}
                </tbody>
            </table>
        </div>
    );
};

const loadLeaderboardFromServer = async (sortByWins) => {
    const response = await fetch('/getLeaderboard');
    const data = await response.json();

    ReactDOM.render(
        <Leaderboard sortByWins={sortByWins} winsBoard={data.winsBoard} topThreesBoard={data.topThreesBoard} />,
        document.getElementById('leaderboard')
    );
};

const toggleSortBy = (winsBoard, topThreesBoard) => {
    const sortByButton = document.querySelector('.sortByButton');
    let sortByWins = sortByButton.classList.contains('wins');
    sortByButton.innerText = sortByButton.classList.contains('wins') ? 'sort by top three finishes' : 'sort by wins';

    ReactDOM.render(
        <Leaderboard sortByWins={sortByWins} winsBoard={winsBoard} topThreesBoard={topThreesBoard} />,
        document.getElementById('leaderboard')
    );

    sortByButton.classList.toggle('wins');
};

const init = () => {
    ReactDOM.render(
        <Leaderboard sortByWins={true} winsBoard={[]} topThreesBoard={[]} />,
        document.getElementById('leaderboard')
    );

    loadLeaderboardFromServer(true);

    navbar.renderNavbar();
    ad.renderAd();
};

window.onload = init;