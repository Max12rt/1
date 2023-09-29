const UserReg = require('../models/userReg');
const path = require("path");
const em = require("email-validator");

let sen = path.resolve(__dirname, '../');
const registrationGet = (request, response) => {
    response.sendFile(sen + '/views/registration.html');
}

const registrationGetStyle = (request, response) => {
    response.sendFile(sen + '/public/style.css');
}

const registrationPost = (request, response) => {
    if (request.body.login == '' || request.body.pass == '' || request.body.fullName == '' || request.body.email == '')
        response.json({ans: 'Fill in all the fields'});
    else if(!em.validate(request.body.email))
        response.json({ans: 'Not valid email'});
    else {
        let user = new UserReg(request.body.login, request.body.pass, request.body.fullName, request.body.email);
        user.saveToDb(response);
    }
}
module.exports = {
    registrationGet,
    registrationPost,
    registrationGetStyle
};
