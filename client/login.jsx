const helper = require('./helper.js');

const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass) {
        //console.log('username or password is empty');
        document.getElementById('loginErrorText').innerText = 'username or password is empty';
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, _csrf}, document.getElementById('loginErrorText'));

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass || !pass2) {
        //console.log('all fields are required');
        document.getElementById('signupErrorText').innerText = 'all fields are required';
        return false;
    }

    if(pass !== pass2) {
        //console.log('passwords do not match');
        document.getElementById('signupErrorText').innerText = 'passwords do not match';
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, _csrf}, document.getElementById('signupErrorText'));

    return false;
};

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <div className='loginUser'>
                <label htmlFor="username">username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
            </div>
            <div className='loginpass'>
                <label htmlFor="pass">password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
            </div>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="sign in" />
            <p id="loginErrorText"></p>
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <div className='signupuser'>
                <label htmlFor="username">username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
            </div>
            <div className='signupPass'>
                <label htmlFor="pass">password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
            </div>
            <div className='signupPass2'>
                <label htmlFor="pass2">password part 2: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            </div>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="sign up" />
            <p id="signupErrorText"></p>
        </form>
    );
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    loginButton.classList.toggle('hidden');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow csrf={data.csrfToken} />, document.getElementById('login'));
        loginButton.classList.toggle('hidden');
        signupButton.classList.toggle('hidden');
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />, document.getElementById('login'));
        loginButton.classList.toggle('hidden');
        signupButton.classList.toggle('hidden');
        return false;
    });

    ReactDOM.render(<LoginWindow csrf={data.csrfToken}/>, document.getElementById('login'));
};

window.onload = init;