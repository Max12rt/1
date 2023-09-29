const UserAva = require('../models/userAva');
const path = require("path");
let sen = path.resolve(__dirname, '../');

const storeGet = (request, response) => {
    new_session = request.session;
    if (new_session.content == true)
        response.sendFile(sen + '/views/store.html');   
    else
        response.redirect('/login');
}

const profileGet = (request, response) => {
    new_session = request.session;
    if (new_session.content == true)
        response.sendFile(sen + '/views/profile.html');
    else
        response.redirect('/login');
}

const changeAva = (request, response) => {
    new_session = request.session;
    console.log('pc'+request.body.ava);
    
    new_session.ava = request.body.ava;
    let user = new UserAva(new_session.login);

    user.findAndChange(response, new_session.ava);
}

const rulesGet = (request, response) => {
    new_session = request.session;
    if (new_session.content == true)
        response.sendFile(sen + '/views/rules.html');
    else
        response.redirect('/login');
}

const clientGet = (request, response) => {
    response.sendFile(sen + '/js/client.js');
}

const youLoseGet = (request, response) => {
    new_session = request.session;
    if (new_session.content == true)
        response.sendFile(sen + '/views/you_lose.html');
    else
        response.redirect('/login');
}

const youWinGet = (request, response) => {
    new_session = request.session;
    if (new_session.content == true)
        response.sendFile(sen + '/views/you_win.html');
    else
        response.redirect('/login');
}

const leaveGet = (request, response) => {
    new_session = request.session;
    if (new_session.content == true)
        response.sendFile(sen + '/views/leave.html');
    else
        response.redirect('/login');  
}

const gameGetJs = (request, response) => {
    response.sendFile(sen + '/js/loop.js');
}

const gameGetCss = (request, response) => {
    response.sendFile(sen + '/public/InGameCards.css');
}

const profileGetJs = (request, response) => {
    response.sendFile(sen + '/js/profile.js');
}
module.exports = {
    storeGet,
    profileGet,
    rulesGet,
    clientGet,
    gameGetJs,
    profileGetJs,
    gameGetCss, 
    changeAva,
    youLoseGet,
    youWinGet,
    leaveGet
};
