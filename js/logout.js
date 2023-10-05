let request = new XMLHttpRequest();
request.open('POST', '/', true);

request.setRequestHeader( 'Content-Type', 'application/json');

request.addEventListener('load', function () {
    let receivedUser = JSON.parse(request.response);

    if (receivedUser.ans == "YESlogin")
        window.location.href = '/login';
    else {
        let ava = document.getElementById('avatar');
        ava.outerHTML = `<img src="./assets/avatars/ava.jpeg" alt="avatar" id="avatar">`;
    }
});

request.send();
let logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', function (evt) {

    evt.preventDefault();
    let request = new XMLHttpRequest()

    request.open('POST', '/logout', true);
    request.setRequestHeader( 'Content-Type', 'application/json');
    request.addEventListener('load', function () {
        let receivedUser = JSON.parse(request.response); 
        
        if(receivedUser.ans = "logout") {
            window.location.href = '/login';
        }
    });
    request.send();
});
