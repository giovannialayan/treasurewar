const sendPost = async (url, data, handler) => {
    console.log(data);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
  
    const result = await response.json();
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      console.log(result.error);
    }

    if(handler) {
        handler(result);
    }
};

module.exports = {
    sendPost,
};