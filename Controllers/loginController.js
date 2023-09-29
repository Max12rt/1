const UserLog = require('../models/userLog');
const mysql = require('../db.js');
const path = require("path");

let sen = path.resolve(__dirname, '../');
let new_session;

const mainGet = (request, response) => {
    new_session = request.session;
    if (new_session.content == true)
        response.sendFile(sen + '/views/lobby.html');
    else
        response.redirect('/login');
}

const loginGet = (request, response) => {
    response.sendFile(sen + '/views/login.html');
}

const lobbyGetStyle = (request, response) => {
    response.sendFile(sen + '/public/lobby.css');
}

const loginGetStyle = (request, response) => {
    response.sendFile(sen + '/public/style.css');
}

const loginPost = (request, response) => {
    new_session = request.session;

    if (request.body.login == '' || request.body.pass == '')
        response.json({ans: 'Fill in all the fields!'});
    else {
        let user = new UserLog(request.body.login, request.body.pass);
        user.findInDb(response, new_session);
    }
}

const mainPost = (request, response) => {
    new_session = request.session;
    if(new_session.content != true)
        response.json({ans: "YESlogin"});
    else {
        const sql = 'SELECT * FROM users WHERE login=?';
        mysql.query(sql, new_session.login, function (err, rows) {
            if (err)
                return console.log(err.message);
            new_session.login = rows[0].login;
            new_session.fullName = rows[0].fullName;
            new_session.email = rows[0].email;
            new_session.ava = rows[0].ava;

            response.json({ ans: "NOlogin", 
                    login: rows[0].login,
                    fullName: rows[0].fullName,
                    email: rows[0].email,
                    ava: rows[0].ava});
            return;
        });
        
    }
}

const checkPost = (request, response) => {
    new_session = request.session;
    if(new_session.content == true)
        response.json({ans: "NOlogin"});
    else
        response.json({ans: "YESlogin"});

}

const logoutPost = (request, response) => {
    new_session = request.session;
    new_session.content = false;
    response.json({ans: "logout"});
}

module.exports = {
    loginGet,
    loginPost,
    loginGetStyle,
    mainGet,
    mainPost,
    checkPost,
    logoutPost,
    lobbyGetStyle,
};
