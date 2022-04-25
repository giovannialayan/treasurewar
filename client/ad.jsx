const images = ['incaseoffire', 'findanyintsol', 'kirbycar', 'debuggingcss'];

const Advertisement = (props) => {
    const img1 = Math.floor(Math.random() * images.length);
    let img2 = Math.floor(Math.random() * images.length);
    if(img2 === img1) {
        img2 = img2 + 1 >= images.length ? 0 : img2 + 1;
    }

    return (
        <div className="ad">
            <img src={`/assets/img/ads/${images[img1]}.png`} className="adImgRight"></img>
            <img src={`/assets/img/ads/${images[img2]}.png`} className="adImgLeft"></img>
        </div>
    );
};

const renderAd = () => {
    ReactDOM.render(<Advertisement/>, document.getElementById('adContainer'));
};

module.exports = {
    renderAd,
}