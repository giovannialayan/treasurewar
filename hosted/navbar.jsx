const Navbar = (props) => {
    return (
        <nav class="navbar">
            <a href="/" className="navHome">home</a>
            <a href="/game" className="navGame">game</a>
            <a href="/leaderboard" className="navBoard">leaderboard</a>
            <a href="/shop" className="navShop">shop</a>
            <a href="/account" className="navAccount">account</a>
        </nav>
    );
};

const init = () => {
    ReactDOM.render(
        <Navbar />,
        document.getElementById('navbar')
    );

    
};

window.onload = init;