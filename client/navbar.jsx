const Navbar = (props) => {
    return (
        <nav className="navbar">
            <a href="/home" className="navHome">home</a>
            <a href="/game" className="navGame">game</a>
            <a href="/leaderboard" className="navBoard">leaderboard</a>
            <a href="/shop" className="navShop">shop</a>
            <a href="/account" className="navAccount">account</a>
            <a href="/logout" className="navLogout">logout</a>
        </nav>
    );
};

const renderNavbar = () => {
    ReactDOM.render(
        <Navbar/>,
        document.getElementById('navbar')
    );
};

module.exports = {
    renderNavbar,
}