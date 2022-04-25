const navbar = require('./navbar.jsx');
const ad = require('./ad.jsx');

const init = () => {
    navbar.renderNavbar();
    ad.renderAd();
};

window.onload = init;