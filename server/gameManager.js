let timerSeconds = 0;

const startTimer = () => {
    timerSeconds--;
    if(timerSeconds > 0) {
        setInterval(()=>{timerSeconds--;}, 1000);
    }
};