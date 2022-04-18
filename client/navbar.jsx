const Navbar = (props) => {
    return (
        <div className="navbar">
            <a href="/" className="navHome">home</a>
            <a href="/" className="navGame">game</a>
            <a href="/" className="navBoard">leaderboard</a>
            <a href="/shop" className="navShop">shop</a>
            <a href="/" className="navAccount">account</a>
        </div>
    );
};

const init = () => {
    ReactDOM.render(
        <Navbar/>,
        document.getElementById('navbar')
    );
};

window.onload = init;