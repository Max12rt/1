let socket = io();
let userId;
let login;
let img;

const countCoef = 4.499999;

let template =
` 
<div id="<%= id %>">
    <div class="cards" id="<%= counterCardsUser %>">
        <div class="cards__image" style="background-image: url(<%= imgUrl %>);">
            <div id="hp">
                <div id="value"><%= hp %></div>
            </div>
        </div>
        <div class="cards__unit-name"><%= name %></div>
        <div class="cards__unit-description"><%= superpower %></div>
        <div id="attack">
            <div id="value"><%= attack %></div>
        </div>
        <div id="price">
            <div id="value"><%= price %></div>
        </div>
    </div>
</div>
`;

socket.on("connect", () => {
    console.log(`my id = ${socket.id}`);
    userId = socket.id;
});

document.getElementById('gradient-button').addEventListener('click', () => {
    if(document.getElementById('gradient-button').value == "Пошук суперника"){
        login = document.getElementById('user').innerText;
        img = document.getElementById('avatar').src;
        socket.emit('start-search');
        document.getElementById('load').setAttribute('style', 'display: block');
        document.getElementById('gradient-button').setAttribute('value', 'Скасувати пошук');
    }
    else {
        socket.emit('close-search');
        document.getElementById('load').setAttribute('style', 'display: none');
        document.getElementById('gradient-button').setAttribute('value', 'Пошук суперника');
    }
    
});

let datas;

socket.on('start-game', (data) => {
    document.querySelector('nav').setAttribute('style', 'display:none');
    document.getElementById('container1').setAttribute('style', 'display:none');
    document.getElementById('container2').setAttribute('style', 'display:block');
    document.body.style.backgroundImage = "url('images/playground.png')";
    document.getElementById('youName').innerText = login;
    document.getElementsByClassName('main-cards__image')[1].style.backgroundImage = `url(${img})`;
    window.scrollTo(0, document.body.scrollHeight);

    
    
    console.log('game started');
    console.log(`creator - ${data.creator}, opponent - ${data.opponent}`);
    console.log(data.creator);
    if(userId == data.creator)
        checkStart(1);
    else
        checkStart(0);
    datas = data;
    if (userId == datas.creator)
        socket.emit('setName', datas.opponent, login);
    else
        socket.emit('setName', datas.creator, login);

    socket.on('getName', (log) => {
        document.getElementById('oppName').innerText = log;
    });

    if (userId == datas.creator)
        socket.emit('setAva', datas.opponent, img);
    else
        socket.emit('setAva', datas.creator, img);

    socket.on('getAva', (resImg) => {
        document.getElementsByClassName('main-cards__image')[0].style.backgroundImage = `url(${resImg})`;
    });

});

let counterCardsUser = 0;
let counterCardsOpponent = 0;
let counterOnBoardCardsUser = 0;
let counterOnBoardCardsOpponent = 0;
let counterOfClicks = false;
const nHeroes = 5;
let previousIndexOfCard = -1;
let previousCounterOnBoardCardsUser = 0;
let arrOfIndexUserCards= [];
let arrHeroes = [];

arrHeroes[0] = {
    id: 'stalker',
    attack: 5,
    defense: 6,
    price: 4,
    name: 'Сталкер',
    superpower: 'Вам додається 2 картки',
    imgUrl: 'images/stalker_01.png'
}
arrHeroes[1] = {
    id: 'blindDog',
    attack: 3,
    defense: 3,
    price: 2,
    name: 'Сліпий пес',
    superpower: 'Не має спеціальних навичок',
    imgUrl: 'images/dog_10.png'
}
arrHeroes[2] = {
    id: 'pseudocat',
    attack: 2,
    defense: 1,
    price: 1,
    name: 'Псевдокіт',
    superpower: 'Ставиться одразу 2 даних картки',
    imgUrl: 'images/pseudocat.png'
}
arrHeroes[3] = {
    id: 'bloodsucker',
    attack: 4,
    defense: 4,
    price: 3,
    name: 'Кровосос',
    superpower: "+3 до здоров'я вашого героя.",
    imgUrl: 'images/bloodsucker.png'
}
arrHeroes[4] = {
    id: 'pseudogiant',
    attack: 4,
    defense: 10,
    price: 6,
    name: 'Псевдогігант',
    superpower: 'Захист всіх карток ворога стає 2.',
    imgUrl: 'images/pseudogiant.png'
}

function getRandomArbitrary(max, min){
    return Math.round(Math.random() * (max - min) + min);
}

function checkStart(number = false){
    if(number){
        let button = document.getElementById('red-button');
        button.innerHTML = 'Ваш хід';
        button.style.background = 'linear-gradient(#83a4ff, #0059ff 48%, #002efc 52%, #0318d6)';
        button.style.border = '2px solid #0318d6';
        button.removeAttribute('disabled'); 
    }
}



function changeCourse(){
    let button = document.getElementById('red-button');
    if(button.innerHTML == 'Ваш хід'){ 
        let cur_value = Number(document.getElementById('money-opponent-value').innerHTML);
        if(cur_value < 9){
            cur_value++;
            document.getElementById('money-opponent-value').innerHTML = cur_value;
        }
        button.innerHTML = 'Хід суперника';
        button.style.border = '2px solid #9c0101';
        button.style.background = 'linear-gradient(#FB9575, #F45A38 48%, #EA1502 52%, #F02F17)';  
        button.setAttribute('disabled', true);      
        addNewOpponentCard();
        console.log(datas);
        if (userId == datas.creator)
        socket.emit('endCourse', datas.opponent);
        else
            socket.emit('endCourse', datas.creator);
    }
    else{
        button.innerHTML = 'Ваш хід';
        button.style.background = 'linear-gradient(#83a4ff, #0059ff 48%, #002efc 52%, #0318d6)';
        button.style.border = '2px solid #0318d6';
        button.removeAttribute('disabled'); 
        let cur_value = Number(document.getElementById('money-user-value2').innerHTML);
        document.getElementById('money-user-value1').innerHTML = cur_value;
        if(cur_value < 9){ cur_value++;}
        document.getElementById('money-user-value1').innerHTML = cur_value;
        document.getElementById('money-user-value2').innerHTML = cur_value;
        addNewUserCard(); 
        clickOnBoardCard(counterOnBoardCardsUser);
    }
}

socket.on('startCourse', () => {
    console.log('123123');
    changeCourse();
})

function Hide1(){ 
    document.getElementsByClassName('message')[1].style.display = "none";
}

function addNewUserCard(){

    if(counterCardsUser <= 7){
        counterCardsUser++;
        let temp = counterCardsUser;
        let index = getRandomArbitrary(countCoef, -0.499999);
        let user_cards = document.querySelector('.cards_user');
        let html = ejs.render(template, {
            id: arrHeroes[index].id,
            counterCardsUser: `cardUser${counterCardsUser}`,
            imgUrl: arrHeroes[index].imgUrl,
            hp: arrHeroes[index].defense,
            name: arrHeroes[index].name,
            superpower: arrHeroes[index].superpower,
            attack: arrHeroes[index].attack,
            price: arrHeroes[index].price
        });
        user_cards.innerHTML += html;
        addAnimation1(); 
        for(let i = 1; i < counterCardsUser + 1; i++){
            let current = document.getElementById('cardUser' + i);
            if(document.getElementById('money-user-value1').innerHTML >= current.querySelector('#price').querySelector('#value').innerHTML) {
                addHover1(i);
            }
            else{
                removeHover1(i);
            }
        }
        for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
            removeOpacity(i);
        }
        removeAnimation2(); 
        sortCards('cardUser', counterCardsUser);
        clickOnCard(counterCardsUser);
        unclickOpponentCard();
    }
    else{
        document.getElementsByClassName('message')[1].setAttribute('style', 'display:block');
        setTimeout(Hide1, 3000);
        for(let i = 1; i < counterCardsUser + 1; i++){
            let current = document.getElementById('cardUser' + i);
            if(document.getElementById('money-user-value1').innerHTML >= current.querySelector('#price').querySelector('#value').innerHTML)
                addHover1(i);
            else
                removeHover1(i);
        }
        
    }
}

function addNewUserCardModified(){

    if(counterCardsUser <= 7){
        counterCardsUser++;
        let temp = counterCardsUser;
        let index = getRandomArbitrary(countCoef, -0.499999);
        let user_cards = document.querySelector('.cards_user');
        let html = ejs.render(template, {
            id: arrHeroes[index].id,
            counterCardsUser: `cardUser${counterCardsUser}`,
            imgUrl: arrHeroes[index].imgUrl,
            hp: arrHeroes[index].defense,
            name: arrHeroes[index].name,
            superpower: arrHeroes[index].superpower,
            attack: arrHeroes[index].attack,
            price: arrHeroes[index].price
        });
        user_cards.innerHTML += html;
        addAnimation1(); 
        for(let i = 1; i < counterCardsUser + 1; i++){
            let current = document.getElementById('cardUser' + i);
            if(document.getElementById('money-user-value1').innerHTML >= current.querySelector('#price').querySelector('#value').innerHTML){
                addHover1(i);
            } 
            else{
                removeHover1(i);
            }
        }
        sortCards('cardUser', counterCardsUser);
        clickOnCard(counterCardsUser);
    }
    else{
        document.getElementsByClassName('message')[1].setAttribute('style', 'display:block');
        setTimeout(Hide1, 3000);
        for(let i = 1; i < counterCardsUser + 1; i++){
            let current = document.getElementById('cardUser' + i);
            if(document.getElementById('money-user-value1').innerHTML >= current.querySelector('#price').querySelector('#value').innerHTML){
                addHover1(i);
            } 
            else{
                removeHover1(i);
            }
        }
        
    }
}

function addNewOpponentCard(){
    counterCardsOpponent++;
    if(counterCardsOpponent <= 8){
        let user_cards = document.querySelector('.cards_opponent');
        user_cards.innerHTML += ` 
            <div id='cardOpponent${counterCardsOpponent}'>
                <img src='images/card.jpeg' id='cardOpponentImg${counterCardsOpponent}' alt='CardOpponent'>
            </div> `;
        removeAnimation2Opponent();
        addAnimationOpponent1();
        sortCards('cardOpponentImg', counterCardsOpponent);
        for(let i = 1; i < counterCardsUser + 1; i++){
            removeHover1(i);
        }
        unclickOpponentCard();
    }
    else{
        counterCardsOpponent--;
    }
}

function addNewOpponentCardModified(){
    counterCardsOpponent++;
    if(counterCardsOpponent <= 8){
        let user_cards = document.querySelector('.cards_opponent');
        user_cards.innerHTML += ` 
            <div id='cardOpponent${counterCardsOpponent}'>
                <img src='images/card.jpeg' id='cardOpponentImg${counterCardsOpponent}' alt='CardOpponent'>
            </div> `;
        addAnimationOpponent1();
        sortCards('cardOpponentImg', counterCardsOpponent);
        unclickOpponentCard();
    }
    else{
        counterCardsOpponent--;
    }
}

function sortCards(playerId, counter){
    let curUserCard = document.getElementById(playerId + 1);
    if(curUserCard === null){
        return;
    }
    if(counter % 2 == 0){
        let start = 54 - counter * 7 / 2;
        curUserCard.style.left = start + '%';
        for(let i = 2; i <= counter; i++){
            curUserCard = document.getElementById(playerId + i);
            start += 7;
            curUserCard.style.left = start + '%';
        }
    }
    else{
        let start = 50.5 - (counter - 1) * 7 / 2;
        curUserCard.style.left = start + '%';
        for(let i = 2; i <= counter; i++){
            curUserCard = document.getElementById(playerId + i);
            start += 7;
            curUserCard.style.left = start + '%';
        }
    }
}

function clickOnCard(counter){
    for(let i = 0; i < counter + 1; i++){
        let card = document.getElementById('cardUser' + i);
        if(card !== null && card !== undefined){
            card.onclick = () =>{addUserCardOnBoard(i);}
        }
    }
}


function Hide(){ 
    document.getElementsByClassName('message')[0].style.display = "none";
}


function checkSuperpower(index){
    switch(index){
        case 0:
            addNewUserCardModified();
            setTimeout( ()=>{
                removeAnimation2();
                addNewUserCardModified();
            }, 1500);
            break;
        case 1:
            break;
        case 2:
            if(counterOnBoardCardsUser <= 6){
                counterOnBoardCardsUser++;
                let user_cards = document.querySelector('.cards_user');               
                let html = ejs.render(template, {
                    id: arrHeroes[index].id,
                    counterCardsUser: `card-user-on-board${counterOnBoardCardsUser}`,
                    imgUrl: arrHeroes[2].imgUrl,
                    hp: arrHeroes[2].defense,
                    name: arrHeroes[2].name,
                    superpower: arrHeroes[2].superpower,
                    attack: arrHeroes[2].attack,
                    price: arrHeroes[2].price
                });
                user_cards.innerHTML += html;
                let divUserNumber = document.getElementById('card-user-on-board' + counterOnBoardCardsUser);
            setTimeout(() => {
                divUserNumber.style.display = 'block';
                addAnimation4(divUserNumber);
            }, 1000);
                divUserNumber.style.display = 'none';
                divUserNumber.style.top = '50%';              
                sortCardsOnBoard('card-user-on-board', counterOnBoardCardsUser);
                unclickOnBoardOneCard(counterOnBoardCardsUser);
                unclickOnBoardOneCard(counterOnBoardCardsUser - 1);
                addOpacity(counterOnBoardCardsUser);
                clickOnCard(counterCardsUser);
                unclickOpponentCard();          
            }
            for(let i = 1; i < counterOnBoardCardsUser - 1; i++){
                let card = document.getElementById('card-user-on-board' + i);
                if(card !== null && card !== undefined){
                    if(card.style.opacity == 1){
                        card.onclick = () =>{fightOpponent(i);}
                    } else {
                        unclickOnBoardOneCard(i);
                    }
                }
            }
            break;
        case 3:
            document.getElementById('you').children[2].children[0].innerHTML = Number(document.getElementById('you').children[2].children[0].innerHTML) + 3;
            addAnimation5Main(document.getElementById('you'));
            setTimeout(()=>{
                removeAnimation5Main(document.getElementById('you'));
            }, 1000);
            break;
        case 4:
            if(counterOnBoardCardsOpponent >= 1){
                for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++){
                    let cardOpponent = document.getElementById('cardOpponentOnBoard' + i);
                    addAnimation3All(cardOpponent);
                    setTimeout(() => {
                        cardOpponent.outerHTML = '';
                    }, 1500);
                }   
                counterOnBoardCardsOpponent = 0;
            }
            break;
        case 5:
            break;
        case 6:
            document.getElementById('you').children[2].children[0].innerHTML = Number(document.getElementById('you').children[2].children[0].innerHTML) + 3;
            addAnimation5Main(document.getElementById('you'));
            setTimeout(()=>{
                removeAnimation5Main(document.getElementById('you'));
            }, 1000);
            break;
        case 7:
            if(Number(document.getElementById('opponent').children[2].children[0].innerHTML) > 3) {
                document.getElementById('opponent').children[2].children[0].innerHTML = Number(document.getElementById('opponent').children[2].children[0].innerHTML) - 3;
            }
            else{
                document.getElementById('opponent').children[2].children[0].innerHTML = 1;
            }
            addAnimation5Main(document.getElementById('opponent'));
            setTimeout(()=>{
                removeAnimation5Main(document.getElementById('opponent'));
            }, 1000);
            break;
        case 8:
            clickOnBoardOneCard(counterOnBoardCardsUser);
            removeOpacity(counterOnBoardCardsUser);
            let cardUser = document.getElementById('card-user-on-board' + counterOnBoardCardsUser);
            cardUser.style.opacity = '0.6';
            setTimeout(()=>{
                cardUser.animate([
                    {
                        opacity: '0.6'
                    },
                    {
                        opacity: '1'
                    }
                ], 1000);
                cardUser.style.opacity = '1';
                cardUser.style.animation = null;
            },1000);
            break;
        case 9:
            if(counterOnBoardCardsUser <= 6){
                counterOnBoardCardsUser++;
                let user_cards = document.querySelector('.cards_user');               
                let html = ejs.render(template, {
            id: arrHeroes[index].id,
            counterCardsUser: `cardUser${counterOnBoardCardsUser}`,
            imgUrl: arrHeroes[9].imgUrl,
            hp: arrHeroes[9].defense,
            name: arrHeroes[9].name,
            superpower: arrHeroes[9].superpower,
            attack: arrHeroes[9].attack,
            price: arrHeroes[9].price
        });
                user_cards.innerHTML += html;
                let divUserNumber = document.getElementById('card-user-on-board' + counterOnBoardCardsUser);
            setTimeout(() => {
                divUserNumber.style.display = 'block';
                addAnimation4(divUserNumber);
            }, 1000);
                divUserNumber.style.display = 'none';
                divUserNumber.style.top = '50%';              
                sortCardsOnBoard('card-user-on-board', counterOnBoardCardsUser);
                unclickOnBoardOneCard(counterOnBoardCardsUser);
                unclickOnBoardOneCard(counterOnBoardCardsUser - 1);
                addOpacity(counterOnBoardCardsUser);
                clickOnCard(counterCardsUser);
                unclickOpponentCard();          
        }
        for(let i = 1; i < counterOnBoardCardsUser - 1; i++){
            let card = document.getElementById('card-user-on-board' + i);
            if(card !== null && card !== undefined){
                if(card.style.opacity == 1){
                    card.onclick = () =>{fightOpponent(i);}
                }
                else{
                    unclickOnBoardOneCard(i);
                }
            }
        }
        break;
        case 10:
            for(let i = 1; i < counterOnBoardCardsUser; i++){
                let elem = document.getElementById('card-user-on-board' + i);
                elem.querySelector('#hp').querySelector('#value').innerHTML = Number(elem.querySelector('#hp').querySelector('#value').innerHTML) + 2;
                addAnimation5(elem, 1);
                setTimeout(()=>{
                    removeAnimation5(elem, 1);
                }, 1000)
            }
            break;
        case 11:
            for(let i = 1; i < counterOnBoardCardsUser; i++){
                let elem = document.getElementById('card-user-on-board' + i);
                elem.querySelector('#attack').querySelector('#value').innerHTML = Number(elem.querySelector('#attack').querySelector('#value').innerHTML) + 2;
                addAnimation5(elem, 0);
                setTimeout(()=>{
                    removeAnimation5(elem, 0);
                }, 1000)
            }
            break;
        case 12:
            if(counterOnBoardCardsOpponent >= 1){
                for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++){
                    let cardOpponent = document.getElementById('cardOpponentOnBoard' + i);
                    addAnimation3All(cardOpponent);
                    setTimeout(() => {
                        cardOpponent.outerHTML = '';
                    }, 1500);
                }   
                counterOnBoardCardsOpponent = 0;
            }
            break;
        case 13:
            for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++){
                let cardOpponent = document.getElementById('cardOpponentOnBoard' + i);
                addAnimation3All(cardOpponent);
                setTimeout(() => {
                    cardOpponent.outerHTML = '';
                }, 1500);
            }   
            counterOnBoardCardsOpponent = 0;
            let last = document.getElementById('card-user-on-board' + counterOnBoardCardsUser);
            for(let i = 1; i < counterOnBoardCardsUser; i++){
                let cardUser = document.getElementById('card-user-on-board' + i);
                addAnimation3All(cardUser);
                setTimeout(() => {
                    cardUser.outerHTML = '';
                }, 1500);
            }   
            counterOnBoardCardsUser = 1;
            last.id = 'card-user-on-board1';
            last.style.left = '25%';
            unclickOnBoardOneCard(counterOnBoardCardsUser);
            break;
        case 14:
            for(let i = 1; i < counterCardsUser + 1; i++){
                let cardUser = document.getElementById('cardUser' + i);
                if(Number(cardUser.querySelector('#price').querySelector('#value').innerHTML) > 2) {
                    cardUser.querySelector('#price').querySelector('#value').innerHTML = Number(cardUser.querySelector('#price').querySelector('#value').innerHTML) - 2;
                }
                else{
                    cardUser.querySelector('#price').querySelector('#value').innerHTML = 1;
                }
                addAnimation5(cardUser, 2);
                setTimeout(()=>{
                    removeAnimation5(cardUser, 2);
                }, 1000);
                if(document.getElementById('money-user-value1').innerHTML >= cardUser.querySelector('#price').querySelector('#value').innerHTML){
                    addHover1(i);
                } 
                else{
                    removeHover1(i);
                }
            }
            break;
        case 15:
            for(let i = 1; i < counterOnBoardCardsUser; i++){
                let cardUser = document.getElementById('card-user-on-board' + i);
                console.log(cardUser.style.opacity);
                if(cardUser.style.opacity === '0.6'){
                    clickOnBoardOneCard(i);
                    removeOpacity(i);              
                    cardUser.style.opacity = '0.6';
                    setTimeout( () => {
                        cardUser.animate([
                            {
                                opacity: '0.6'
                            },
                            {
                                opacity: '1'
                            }
                        ], 1000);
                        cardUser.style.opacity = '1';
                        cardUser.style.animation = null;
                    },1000);
                }
            }
            break;
        case 16:
            for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++){
                let elem = document.getElementById('cardOpponentOnBoard' + i);
                if(elem){
                    elem.querySelector('#hp').querySelector('#value').innerHTML = 2;
                    addAnimation5(elem, 1);
                    setTimeout(()=>{
                        removeAnimation5(elem, 1);
                    },1000)
                }
            }
            break;
        case 17:
            for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++){
                let elem = document.getElementById('cardOpponentOnBoard' + i);
                if(elem){
                    elem.querySelector('#attack').querySelector('#value').innerHTML = 2;
                    addAnimation5(elem, 0);
                    setTimeout(()=>{
                        removeAnimation5(elem, 0);
                    },1000)
                }
            }
            break;
        case 18:
            for(let i = 1; i < counterOnBoardCardsUser; i++){
                let elem = document.getElementById('card-user-on-board' + i);
                if(elem){
                    elem.querySelector('#attack').querySelector('#value').innerHTML = 3;
                    addAnimation5(elem, 0);
                    setTimeout(()=>{
                        removeAnimation5(elem, 0);
                    },1000)
                }
            }
            break;
        case 19:
            for(let i = 1; i < counterOnBoardCardsUser; i++){
                let elem = document.getElementById('card-user-on-board' + i);
                if(elem){
                    elem.querySelector('#hp').querySelector('#value').innerHTML = 3;
                    addAnimation5(elem, 1);
                    setTimeout(()=>{
                        removeAnimation5(elem, 1);
                    },1000)
                }
            }
            break;
        case 20:
            for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++) {
                let elem = document.getElementById('cardOpponentOnBoard' + i);
                if(elem.querySelector('#attack').querySelector('#value').innerHTML > 2){
                    elem.querySelector('#attack').querySelector('#value').innerHTML = Number(elem.querySelector('#attack').querySelector('#value').innerHTML) - 2;
                }
                else{
                    elem.querySelector('#attack').querySelector('#value').innerHTML = 1;
                }
                addAnimation5(elem, 0);
                setTimeout(()=>{
                    removeAnimation5(elem, 0);
                },1000)
            }
            break;
        default:
            console.log("default: " + index);
            break;
    }
}



function addUserCardOnBoard(indexOfCard){
    let cur_value = Number(document.getElementById('money-user-value1').innerHTML);
    let isYourCourse = document.getElementById('red-button');
    let indexOfHero;
    if(isYourCourse.innerHTML != 'Хід суперника'){
        if(counterOnBoardCardsUser <= 6){
            let divUserNumber = document.getElementById('cardUser' + indexOfCard);
            cur_value -= divUserNumber.querySelector('#price').querySelector('#value').innerHTML;
            if(cur_value >= 0){
                counterOnBoardCardsUser++;
                document.getElementById('money-user-value1').innerHTML = cur_value;
                divUserNumber.id = 'card-user-on-board' + counterOnBoardCardsUser;
                for(let i = 0; i < nHeroes; i++){
                    if(divUserNumber.parentElement.id == arrHeroes[i].id){
                        indexOfHero = i;
                        break;
                    }
                }
                divUserNumber.style.top = '50%';
                document.getElementById('card-user-on-board' + counterOnBoardCardsUser).style.animation = 'null';
                sortCardsOnBoard('card-user-on-board', counterOnBoardCardsUser);
                unclickOnBoardOneCard(counterOnBoardCardsUser);
                let currentCard;
                for( let n = indexOfCard + 1; n <= counterCardsUser; n++){
                    currentCard = document.getElementById('cardUser' + n);
                    let cur = n - 1;
                    currentCard.id = 'cardUser' + cur;
                }
                counterCardsUser--;
                sortCards('cardUser', counterCardsUser);
                removeAnimation1();
                removeAnimation2(); 
                addAnimation2(indexOfCard);
                addOpacity(counterOnBoardCardsUser);  
                reviewHover1();
                clickOnCard(counterCardsUser);  
                unclickOpponentCard();  
                checkSuperpower(indexOfHero);
                if (userId == datas.creator) {
                    socket.emit('cardOnBoard', datas.opponent, indexOfHero);
                }
                else {
                    socket.emit('cardOnBoard', datas.creator, indexOfHero);
                }
            }
        }
        else{

            document.getElementsByClassName('message')[0].setAttribute('style', 'display:block');
            setTimeout(Hide, 3000);
        }
    }
}



function checkSuperpowerOpponent(index){
    switch(index){
        case 0:
            addNewOpponentCardModified();
            setTimeout( ()=>{
                addNewOpponentCardModified();
            }, 1500);
            break;
        case 1:
            break;
        case 2:
            if(counterOnBoardCardsOpponent <= 6){
                setTimeout(() => {
                    counterOnBoardCardsOpponent++;
                    let opponentCardsOnBoard = document.querySelector('.cards-opponent-on-board');
                    let html = ejs.render(template, {
                        id: arrHeroes[index].id,
                        counterCardsUser: `cardOpponentOnBoard${counterOnBoardCardsOpponent}`,
                        imgUrl: arrHeroes[2].imgUrl,
                        hp: arrHeroes[2].defense,
                        name: arrHeroes[2].name,
                        superpower: arrHeroes[2].superpower,
                        attack: arrHeroes[2].attack,
                        price: arrHeroes[2].price
                    });
                    opponentCardsOnBoard.innerHTML += html;
                    sortCardsOnBoard('cardOpponentOnBoard', counterOnBoardCardsOpponent);
                    let divUserNumber = document.getElementById('cardOpponentOnBoard' + counterOnBoardCardsOpponent);
                    setTimeout(()=>{ addAnimation4(divUserNumber);}, 1);
                    divUserNumber.style.top = '20%';              
                    removeAnimation2Opponent();
                }, 1000);
            }
            break;
       
        case 3:
            document.getElementById('opponent').children[2].children[0].innerHTML = Number(document.getElementById('opponent').children[2].children[0].innerHTML) + 3;
            addAnimation5Main(document.getElementById('opponent'));
            setTimeout(()=>{
                removeAnimation5Main(document.getElementById('opponent'));
            }, 1000);
            break;
        case 4:
            if(counterOnBoardCardsUser >= 1){
                for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
                    let cardUser = document.getElementById('card-user-on-board' + i);
                    addAnimation3All(cardUser);
                    setTimeout(() => {
                        cardUser.outerHTML = '';
                    }, 1500);
                }   
                counterOnBoardCardsUser =  0;
            }
            break;
        case 5:
            break;
        case 6:
            document.getElementById('opponent').children[2].children[0].innerHTML = Number(document.getElementById('opponent').children[2].children[0].innerHTML) + 3;
            addAnimation5Main(document.getElementById('opponent'));
            setTimeout(()=>{
                removeAnimation5Main(document.getElementById('opponent'));
            }, 1000);
            break;
        case 7:
            if(Number(document.getElementById('you').children[2].children[0].innerHTML) > 3) {
                document.getElementById('you').children[2].children[0].innerHTML = Number(document.getElementById('you').children[2].children[0].innerHTML) - 3;
            }
            else{
                document.getElementById('you').children[2].children[0].innerHTML = 1;
            }
            addAnimation5Main(document.getElementById('you'));
            setTimeout(()=>{
                removeAnimation5Main(document.getElementById('you'));
            }, 1000);
            break;
         
        case 8:
            break;
       
        case 9:
            if(counterOnBoardCardsOpponent <= 6){
                setTimeout(() => {
                    counterOnBoardCardsOpponent++;
                    let opponentCardsOnBoard = document.querySelector('.cards-opponent-on-board');
                    let html = ejs.render(template, {
                        id: arrHeroes[index].id,
                        counterCardsUser: `cardUser${counterOnBoardCardsUser}`,
                        imgUrl: arrHeroes[9].imgUrl,
                        hp: arrHeroes[9].defense,
                        name: arrHeroes[9].name,
                        superpower: arrHeroes[9].superpower,
                        attack: arrHeroes[9].attack,
                        price: arrHeroes[9].price
                    });
                    opponentCardsOnBoard.innerHTML += html;
                    sortCardsOnBoard('cardOpponentOnBoard', counterOnBoardCardsOpponent);
                    let divUserNumber = document.getElementById('cardOpponentOnBoard' + counterOnBoardCardsOpponent);
                    setTimeout(()=>{ addAnimation4(divUserNumber);}, 1);
                    divUserNumber.style.top = '20%';              
                    removeAnimation2Opponent();
                }, 1000);
            }
            break;
        case 10: 
            for(let i = 1; i < counterOnBoardCardsOpponent; i++){
                let elem = document.getElementById('cardOpponentOnBoard' + i);
                elem.querySelector('#hp').querySelector('#value').innerHTML = Number(elem.querySelector('#hp').querySelector('#value').innerHTML) + 2;
                addAnimation5(elem, 1);
                setTimeout(()=>{
                    removeAnimation5(elem, 1);
                }, 1000)
            }
            break;
        case 11:
            for(let i = 1; i < counterOnBoardCardsOpponent; i++){
                let elem = document.getElementById('cardOpponentOnBoard' + i);
                elem.querySelector('#attack').querySelector('#value').innerHTML = Number(elem.querySelector('#attack').querySelector('#value').innerHTML) + 2;
                addAnimation5(elem, 0);
                setTimeout(()=>{
                    removeAnimation5(elem, 0);
                }, 1000)
            }
            break;
        
        case 12:
            if(counterOnBoardCardsUser >= 1){
                for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
                    let cardUser = document.getElementById('card-user-on-board' + i);
                    addAnimation3All(cardUser);
                    setTimeout(() => {
                        cardUser.outerHTML = '';
                    }, 1500);
                }   
                counterOnBoardCardsUser =  0;
            }
            break;
        
        case 13:
            for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
                let cardUser = document.getElementById('card-user-on-board' + i);
                addAnimation3All(cardUser);
                setTimeout(() => {
                    cardUser.outerHTML = '';
                }, 1500);
            }   
            counterOnBoardCardsUser = 0;
            let last = document.getElementById('cardOpponentOnBoard' + counterOnBoardCardsOpponent);
            for(let i = 1; i < counterOnBoardCardsOpponent; i++){
                let cardOpponent = document.getElementById('cardOpponentOnBoard' + i);
                addAnimation3All(cardOpponent);
                setTimeout(() => {
                    cardOpponent.outerHTML = '';
                }, 1500);
            }   
            counterOnBoardCardsOpponent = 1;
            last.id = 'cardOpponentOnBoard1';
            last.style.left = '25%';
            unclickOnBoardOneCard(counterOnBoardCardsOpponent);
            break;
        case 14:
            break;
        
        case 15:
            break;
        
        case 16:
            for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
                let elem = document.getElementById('card-user-on-board' + i);
                if(elem){
                    elem.querySelector('#hp').querySelector('#value').innerHTML = 2;
                    addAnimation5(elem, 1);
                    setTimeout(()=>{
                        removeAnimation5(elem, 1);
                    },1000)
                }
            }
            break;
        
        case 17:
            for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
                let elem = document.getElementById('card-user-on-board' + i);
                if(elem){
                    elem.querySelector('#attack').querySelector('#value').innerHTML = 2;
                    addAnimation5(elem, 0);
                    setTimeout(()=>{
                        removeAnimation5(elem, 0);
                    },1000)
                }
            }
            break;
        
        case 18:
            for(let i = 1; i < counterOnBoardCardsOpponent; i++){
                let elem = document.getElementById('cardOpponentOnBoard' + i);
                if(elem){
                    elem.querySelector('#attack').querySelector('#value').innerHTML = 3;
                    addAnimation5(elem, 0);
                    setTimeout(()=>{
                        removeAnimation5(elem, 0);
                    },1000)
                }
            }
            break;
        case 19:
            for(let i = 1; i < counterOnBoardCardsOpponent; i++){
                let elem = document.getElementById('cardOpponentOnBoard' + i);
                if(elem){
                    elem.querySelector('#hp').querySelector('#value').innerHTML = 3;
                    addAnimation5(elem, 1);
                    setTimeout(()=>{
                        removeAnimation5(elem, 1);
                    },1000)
                }
            }
            break;
        
        case 20:
            for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
                let elem = document.getElementById('card-user-on-board' + i);
                if(elem.querySelector('#attack').querySelector('#value').innerHTML > 2){
                    elem.querySelector('#attack').querySelector('#value').innerHTML = Number(elem.querySelector('#attack').querySelector('#value').innerHTML) - 2;
                }
                else{
                    elem.querySelector('#attack').querySelector('#value').innerHTML = 1;
                }
                addAnimation5(elem, 0);
                setTimeout(()=>{
                    removeAnimation5(elem, 0);
                },1000)
            }
            break;
        default:
            console.log("default: " + index);
            break;
    }
}




function addOpponentCardOnBoard(index){
    //3!!!Отримали інфу з сервака, а саме індекс поставленого героя
    counterOnBoardCardsOpponent++;
    let opponentCardsOnBoard = document.querySelector('.cards-opponent-on-board');
    let html = ejs.render(template, {
            id: arrHeroes[index].id.toString(),
            counterCardsUser: `cardOpponentOnBoard${counterOnBoardCardsOpponent}`,
            imgUrl: arrHeroes[index].imgUrl,
            hp: arrHeroes[index].defense,
            name: arrHeroes[index].name,
            superpower: arrHeroes[index].superpower,
            attack: arrHeroes[index].attack,
            price: arrHeroes[index].price
        });
    opponentCardsOnBoard.innerHTML += html;
    console.log(`counterOnBoardCardsOpponent = ${counterOnBoardCardsOpponent}`);
    sortCardsOnBoard('cardOpponentOnBoard', counterOnBoardCardsOpponent);
    let cardToDelete = document.getElementById('cardOpponent' + counterCardsOpponent);
    if(cardToDelete){
        cardToDelete.outerHTML = '';
    }
    counterCardsOpponent--;
    sortCards('cardOpponentImg', counterCardsOpponent);
    addAnimation2Opponent(counterCardsOpponent);
    checkSuperpowerOpponent(index);
}


socket.on('cardOnBoardState', (index) => {
    console.log(index);
    addOpponentCardOnBoard(index);
})

function sortCardsOnBoard(playerId, counter){
    for(let i = 1; i < counter + 1; i++){
        console.log(playerId + i);
        let divUserNumber = document.getElementById(playerId + i);
        divUserNumber.style.left = (17 + i * 8) + '%';
    }
}

function clickOnBoardCard(counter){
    for(let i = 1; i < counter + 1; i++){
        let card = document.getElementById('card-user-on-board' + i);
        if(card !== null && card !==undefined){
            card.onclick = () =>{fightOpponent(i);}
        }
    }
}


function unclickOnBoardCard(counter){
    for(let i = 0; i < counter + 1; i++){
        let card = document.getElementById('card-user-on-board' + i);
        if(card !== null && card !== undefined){
            card.onclick = () =>{}
        }
    }
}

function clickOnBoardCardModified(counter){
    for(let i = 1; i < counter + 1; i++){
        let card = document.getElementById('card-user-on-board' + i);
        if(card !== null && card !== undefined){
            if(card.onclick == '() =>{unclickOpponentCard()}'){
                card.onclick == '() =>{unclickOpponentCard()}';
            }
            else{
                card.onclick = () =>{fightOpponent(i);}
            }
        }
    }
}

function unclickOnBoardOneCard(index){
    let card = document.getElementById('card-user-on-board' + index);
    if(card !== null){
        card.onclick = () =>{unclickOpponentCard()};
    }
}

function clickOnBoardOneCard(index){
    let card = document.getElementById('card-user-on-board' + index);
    if(card !== null){
        card.onclick = () =>{fightOpponent(index);};

    }
}

function fightOpponent(indexOfCard){
    let isYourCourse = document.getElementById('red-button');
    if(isYourCourse.innerHTML != 'Хід суперника'){
        if(counterOfClicks == true && previousIndexOfCard == indexOfCard) {
            previousIndexOfCard = indexOfCard;
            unclickOpponentCard();
        }
        else{
            let card = document.getElementById('card-user-on-board' + indexOfCard);
            if(previousIndexOfCard != -1){
                removeBorderAll();
                removeBorderOpponent();
            }
            previousIndexOfCard = indexOfCard;
            clickOnOpponentCard(indexOfCard); 
            counterOfClicks = true; 
        }
    }
}

function hitOpponent(indexOfCard, indexOfGoalCard = -1){
    let cardUser = document.getElementById('card-user-on-board' + indexOfCard); 
    if(indexOfGoalCard != -1){
        addAnimationFightCard(indexOfCard, indexOfGoalCard);
        setTimeout( () => {
            let cardOpponent = document.getElementById('cardOpponentOnBoard' + indexOfGoalCard);
            let difHPUser =  cardUser.querySelector('#hp').querySelector('#value').innerHTML - cardOpponent.querySelector('#attack').querySelector('#value').innerHTML;
            let difHPOpponent = cardOpponent.querySelector('#hp').querySelector('#value').innerHTML - cardUser.querySelector('#attack').querySelector('#value').innerHTML;
            let currentCard;
            if(difHPUser <= 0){
                difHPUser = 0;
                removeAnimationFight(indexOfCard);
                addAnimation3(cardUser);
                setTimeout(() => {
                    cardUser.outerHTML = '';
                    for( let n = indexOfCard + 1; n <= counterOnBoardCardsUser; n++){
                        currentCard = document.getElementById('card-user-on-board' + n);
                        let cur = n - 1;
                        currentCard.id = 'card-user-on-board' + cur;
                    }
                    counterOnBoardCardsUser--;
                    sortCardsOnBoard('card-user-on-board', counterOnBoardCardsUser);
                    clickOnBoardCardModified(counterOnBoardCardsUser);
                }, 500);
            }
            if(difHPOpponent <= 0){
                difHPOpponent = 0;
                removeAnimationFight(indexOfCard);
                addAnimation3(cardOpponent);
                setTimeout(() => {
                    cardOpponent.outerHTML = '';
                    for( let n = indexOfGoalCard + 1; n <= counterOnBoardCardsOpponent; n++){
                        currentCard = document.getElementById('cardOpponentOnBoard' + n);
                        let cur = n - 1;
                        currentCard.id = 'cardOpponentOnBoard' + cur;
                    }
                    counterOnBoardCardsOpponent--;
                    sortCardsOnBoard('cardOpponentOnBoard', counterOnBoardCardsOpponent);
                }, 500);
            }
            if(difHPUser > 0){
                unclickOnBoardOneCard(indexOfCard);
                addOpacity(indexOfCard);
                addAnimation5(cardUser, 1);
                setTimeout(()=>{
                    removeAnimation5(cardUser, 1);
                }, 1000)
            }
            if(difHPOpponent > 0){
                addAnimation5(cardOpponent, 1);
                setTimeout(()=>{
                    removeAnimation5(cardOpponent, 1);
                }, 1000)
            }
            cardUser.querySelector('#hp').querySelector('#value').innerHTML = difHPUser;
            cardOpponent.querySelector('#hp').querySelector('#value').innerHTML = difHPOpponent;
        }, 550);     
    }
    else{
        addAnimationFightMainCard(indexOfCard);
        setTimeout( () => {
            let cardOpponent = document.getElementById('opponent');
            let difHP = cardOpponent.children[2].children[0].innerHTML - cardUser.querySelector('#attack').querySelector('#value').innerHTML;
            cardOpponent.children[2].children[0].innerHTML = difHP;
            unclickOnBoardOneCard(indexOfCard);
            addOpacity(indexOfCard);
            if(difHP <= 0){
                if (userId == datas.creator) {
                    socket.emit('setHit', datas.opponent, indexOfCard, indexOfGoalCard);
                }
                else {
                    socket.emit('setHit', datas.creator, indexOfCard, indexOfGoalCard);
                }
                window.location.href = '/you_win';
            }
            addAnimation5Main(cardOpponent);
            setTimeout(()=>{
                removeAnimation5Main(cardOpponent);
            }, 1000)
        }, 550);
    }
      
    unclickOpponentCard();
    if (userId == datas.creator) {
        socket.emit('setHit', datas.opponent, indexOfCard, indexOfGoalCard);
    }
    else {
        socket.emit('setHit', datas.creator, indexOfCard, indexOfGoalCard);
    }
}



function hitByOpponent(indexOfCard, indexOfCardOpponent){
    let cardOpponent = document.getElementById('cardOpponentOnBoard' + indexOfCardOpponent);
    if(indexOfCard != -1){
        addAnimationFightCardOpponent(indexOfCard, indexOfCardOpponent);
        setTimeout( () => {
            let cardUser = document.getElementById('card-user-on-board' + indexOfCard);
            let difHPUser =  cardUser.querySelector('#hp').querySelector('#value').innerHTML - cardOpponent.querySelector('#attack').querySelector('#value').innerHTML;
            let difHPOpponent = cardOpponent.querySelector('#hp').querySelector('#value').innerHTML - cardUser.querySelector('#attack').querySelector('#value').innerHTML;
            let currentCard;
            if(difHPUser <= 0){
                difHPUser = 0;
                removeAnimationFightOpponent(indexOfCardOpponent);
                addAnimation3(cardUser);
                setTimeout(() => {
                    cardUser.outerHTML = '';
                    for( let n = indexOfCard + 1; n <= counterOnBoardCardsUser; n++){
                        currentCard = document.getElementById('card-user-on-board' + n);
                        let cur = n - 1;
                        currentCard.id = 'card-user-on-board' + cur;
                    }
                    counterOnBoardCardsUser--;
                    sortCardsOnBoard('card-user-on-board', counterOnBoardCardsUser);
                    clickOnBoardCardModified(counterOnBoardCardsUser);//перезаписуємо через видалення елемента
                }, 500);
            }
            if(difHPOpponent <= 0){
                difHPOpponent = 0;
                removeAnimationFightOpponent(indexOfCardOpponent);
                addAnimation3(cardOpponent);
                setTimeout(() => {
                    cardOpponent.outerHTML = '';
                    for( let n = indexOfCardOpponent + 1; n <= counterOnBoardCardsOpponent; n++){
                        currentCard = document.getElementById('cardOpponentOnBoard' + n);
                        let cur = n - 1;
                        currentCard.id = 'cardOpponentOnBoard' + cur;
                    }
                    counterOnBoardCardsOpponent--;
                    sortCardsOnBoard('cardOpponentOnBoard', counterOnBoardCardsOpponent);
                }, 500);
            }
            if(difHPUser > 0){
                addAnimation5(cardUser, 1);
                setTimeout(()=>{
                    removeAnimation5(cardUser, 1);
                }, 1000)
            }
            if(difHPOpponent > 0){
                addAnimation5(cardOpponent, 1);
                setTimeout(()=>{
                    removeAnimation5(cardOpponent, 1);
                }, 1000)
            }
            cardUser.querySelector('#hp').querySelector('#value').innerHTML = difHPUser;
            cardOpponent.querySelector('#hp').querySelector('#value').innerHTML = difHPOpponent;  
        }, 550);
    }
    else{
        addAnimationFightMainCardOpponent(indexOfCardOpponent);
        setTimeout( () => {
            let cardUser = document.getElementById('you');
            let difHP = cardUser.children[2].children[0].innerHTML - cardOpponent.querySelector('#attack').querySelector('#value').innerHTML;
            cardUser.children[2].children[0].innerHTML = difHP;
            if(difHP <= 0){
                window.location.href = '/you_lose';
            }
            addAnimation5Main(cardUser);
            setTimeout(()=>{
                removeAnimation5Main(cardUser);
            }, 1000)
//            console.log(cardUser.outerHTML);
        }, 550);
    }
}

socket.on('getHit', (indexOfCard, indexOfGoalCard) => {
    hitByOpponent(indexOfGoalCard, indexOfCard);
});

function clickOnOpponentCard(indexOfCard){
    addBorder1(indexOfCard);
    addBorderOpponent();
    let mainCard = document.querySelector('.cards-opponent-clickable').children[0];
    mainCard.onclick = () =>{hitOpponent(indexOfCard);}
    for(let i = 0; i < counterOnBoardCardsOpponent + 1; i++){
        let card = document.getElementById('cardOpponentOnBoard' + i);
        if(card !== null && card !==undefined){
            card.onclick = () =>{hitOpponent(indexOfCard, i);}
        }
    }
}

function unclickOpponentCard(){
    removeBorderAll();
    removeBorderOpponent();
    let mainCard = document.querySelector('.cards-opponent-clickable').children[0];
    mainCard.onclick = () =>{};
    for(let i = 0; i < counterOnBoardCardsOpponent + 1; i++){
        let card = document.getElementById('cardOpponentOnBoard' + i);
        if(card !== null && card !==undefined){
            card.onclick = () =>{};
        }
    }
    counterOfClicks = false; 
}


function addAnimation1(){
    let cardsUser = document.getElementsByClassName('cards_user')[0];
    if (cardsUser) {
        if (cardsUser.lastChild != null && cardsUser.lastChild != undefined && cardsUser.lastChild.style != undefined) {
            cardsUser.lastChild.style.animation = '5s show ease';
        }
    }
//    document.getElementsByClassName('cards_user')[0].lastChild.style.animation = '5s show ease';
    if(counterCardsUser >= 2){
        for(let i = 1; i < counterCardsUser; i++){
            document.getElementById('cardUser' + i).style.animation = 'null';
        }
    }
}

function removeAnimation1(){
    for(let i = 1; i < counterCardsUser + 1; i++){
        if( document.getElementById('cardUser' + i) != null && document.getElementById('cardUser' + i) != undefined)
            document.getElementById('cardUser' + i).style.animation = 'null';
    }
}


function addAnimation2(index){
    let currentCard = document.getElementById('card-user-on-board' + counterOnBoardCardsUser);
    let current;
    if(index == counterCardsUser + 1){
        current = document.getElementById('cardUser' + counterCardsUser);
    }else{
        current = document.getElementById('cardUser' + index);
    }
        currentCard.style.animation = '1s show2 ease';
        let left;
        if(current){
            left = current.style.left;
        }
        else{
            left = '50.5%';
        }
        currentCard.innerHTML += `<style>
        @keyframes show2 {
            from {top: 75.4%; left: ${left};}
        }
        </style>`;
}

function removeAnimation2(){
    for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
        if( document.getElementById('card-user-on-board' + i) != null && document.getElementById('card-user-on-board' + i) != undefined)
            document.getElementById('card-user-on-board' + i).style.animation = 'null';
    }
}


function addAnimationOpponent1(){
    document.getElementById('cardOpponentImg' + counterCardsOpponent).style.animation = '2s showOpponent ease';
    if(counterCardsOpponent >= 2){
        for(let i = 1; i < counterCardsOpponent; i++){
            document.getElementById('cardOpponentImg' + i).style.animation = 'null';
        }
    }
}


function addAnimation2Opponent(index){
    let currentCard = document.getElementById('cardOpponentOnBoard' + counterOnBoardCardsOpponent);
    let current;

    if(index == counterCardsOpponent + 1){
        current = document.getElementById('cardOpponentImg' + counterCardsOpponent);
    } else{
        current = document.getElementById('cardOpponentImg' + index);
    }
    currentCard.style.animation = '1s show2Opponent ease';
    let left = 0;
    if(current){
        left = current.style.left;
    }
    else{
        left = '50.5%';
    }
    currentCard.innerHTML += `<style>
        @keyframes show2Opponent {
            from {top: 0%; left: ${left};}
        }
        </style>`;
    if(counterOnBoardCardsOpponent >= 1){
        for(let i = 1; i < counterOnBoardCardsOpponent; i++){
            document.getElementById('cardOpponentOnBoard' + i).style.animation = 'null';
        }
    }
}

function  removeAnimation2Opponent(){
    for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++){
        if( document.getElementById('cardOpponentOnBoard' + i) != null && document.getElementById('cardOpponentOnBoard' + i) != undefined){
            if( document.getElementById('cardOpponentOnBoard' + i) != null && document.getElementById('cardOpponentOnBoard' + i) != undefined){
                document.getElementById('cardOpponentOnBoard' + i).style.animation = 'null';
            }
        }
    }
}

function addHover1(index) {
    let current = document.getElementById('cardUser' + index);
    current.innerHTML += `<style>
    #cardUser${index}:hover {
        top: 72%;  
    }</style>`; 
}

function removeHover1(index) {
    let current = document.getElementById('cardUser' + index);
    current.innerHTML += `<style>
    #cardUser${index}:hover {
        top: 75.3%;              
    }</style>`; 
}   

function reviewHover1() {
    
    for(let i = 1; i < counterCardsUser + 1; i++){
        let current = document.getElementById('cardUser' + i);
        if(document.getElementById('money-user-value1').innerHTML >=  current.querySelector('#price').querySelector('#value').innerHTML){
            //addHover1(i);
            current.innerHTML += `<style>
            #cardUser${i}:hover {
                top: 72%;  
            }</style>`; 
        } 
        else{
            current.innerHTML += `<style>
            #cardUser${i}:hover {
                top: 75.3%;              
            }</style>`; 
        }
    }
}  


function addOpacity(index) {
    let current = document.getElementById('card-user-on-board' + index);
    console.log(index);
    current.style.opacity = '0.6';
}

function removeOpacity(index) {
    let current = document.getElementById('card-user-on-board' + index);
    console.log(index);
    current.style.opacity = '1';
}


function addBorder1(index) {
    let current = document.getElementById('card-user-on-board' + index);
    current.style.border = '3px solid green';
}

function removeBorderAll() {
    for(let i = 1; i < counterOnBoardCardsUser + 1; i++){
        let current = document.getElementById('card-user-on-board' + i);
        current.style.border = '0px';
    }
    
}

function addBorderOpponent() {
    let current = document.getElementById('opponent');
    current.style.border = '0.4vh solid red';
    for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++){
        let card = document.getElementById('cardOpponentOnBoard' + i);
        card.style.border = '0.3vh solid red';
    }
}

function removeBorderOpponent() {
    let current = document.getElementById('opponent');
    current.style.border = '0px';
    for(let i = 1; i < counterOnBoardCardsOpponent + 1; i++){
        let card = document.getElementById('cardOpponentOnBoard' + i);
        card.style.border = '0px';
    }   
}


function addAnimation3(current){
    current.style.animation = '0.5s fade ease';
}

function addAnimation3All(current){
    current.style.animation = '1.5s fade ease';
}

function addAnimation4(current){
    if(current === document.getElementById('card-user-on-board' + counterOnBoardCardsUser)){
        current.style.animation = '1s fadeAway ease';
    }
    else{
        current.style.animation = '1s fadeAwayOpponent ease';
//        console.log('Opponent');
    }
}


function addAnimation5(card, characteristic) {
    switch (characteristic) {
        case 0:
            card.querySelector('#attack').querySelector('#value').style.animation = '1s changeColor ease';
            break;
        case 1:
            card.querySelector('#hp').querySelector('#value').style.animation = '1s changeColor ease';
            break;
        case 2:
            card.querySelector('#price').querySelector('#value').style.animation = '1s changeColor ease';
    }
//    card.children[3].children[characteristic].children[0].style.animation = '1s changeColor ease';
    
}

function removeAnimation5(card, characteristic) {
    switch (characteristic) {
        case 1:
            card.querySelector('#hp').querySelector('#value').style.animation = 'null';
            break;
        case 2:
            card.querySelector('#attack').querySelector('#value').style.animation = 'null';
            break;
        case 3:
            card.querySelector('#price').querySelector('#value').style.animation = 'null';
            break;
    }
//    card.children[3].children[characteristic].children[0].style.animation = 'null';
}

function addAnimation5Main(card) {
    card.children[2].children[0].style.animation = '1s changeColor ease';
    
}

function removeAnimation5Main(card) {
    card.children[2].children[0].style.animation = 'null';
}

function addAnimationFightCard(indexOfCard, indexOfCardOpponent){
    let cardUser = document.getElementById('card-user-on-board' + indexOfCard);
    let cardOpponent = document.getElementById('cardOpponentOnBoard' + indexOfCardOpponent);
        cardUser.animate([
            {
                left: cardUser.style.left,
                top: '50%'
            },
            {
                left: cardOpponent.style.left,
                top: '20%'
            }
        ], 300);
        setTimeout(() =>{
            cardUser.animate([
                {
                    left: cardOpponent.style.left,
                    top: '20%'
                },
                {
                    left: cardUser.style.left,
                    top: '50%'

                }
            ], 250);
        }, 250)
}


function removeAnimationFight(indexOfCard){
        let cardUser = document.getElementById('card-user-on-board' + indexOfCard);
        cardUser.animate([]);
}   

function addAnimationFightMainCard(indexOfCard){
    let cardUser = document.getElementById('card-user-on-board' + indexOfCard);
        cardUser.animate([
            {
                left: cardUser.style.left,
                top: '50%'
            },
            {
                left: '10%',
                top: '20%'
            }
        ], 300);
        setTimeout(() =>{
            cardUser.animate([
                {
                    left: '10%',
                    top: '20%'
                },
                {
                    left: cardUser.style.left,
                    top: '50%'

                }
            ], 250);
        }, 250)
}



function addAnimationFightCardOpponent(indexOfCard, indexOfCardOpponent){
    let cardUser = document.getElementById('card-user-on-board' + indexOfCard);
    let cardOpponent = document.getElementById('cardOpponentOnBoard' + indexOfCardOpponent);
    cardOpponent.animate([     
        {
            left: cardOpponent.style.left,
            top: '20%'
        },
        {
            left: cardUser.style.left,
            top: '50%'

        }
    ], 300);
    setTimeout(() =>{
        cardOpponent.animate([
            {
                left: cardUser.style.left,
                top: '50%'
            },
            {
                left: cardOpponent.style.left,
                top: '20%'
            }
        ], 250);
    }, 220)
}

function addAnimationFightMainCardOpponent(indexOfCard){
    let cardUser = document.getElementById('cardOpponentOnBoard' + indexOfCard);
        cardUser.animate([
            {
                left: cardUser.style.left,
                top: '20%'
            },
            {
                left: '10%',
                top: '50%'
            }
        ], 300);
        setTimeout(() =>{
            cardUser.animate([
                {
                    left: '10%',
                    top: '50%'
                },
                {
                    left: cardUser.style.left,
                    top: '20%'

                }
            ], 250);
        }, 250)
}

function removeAnimationFightOpponent(indexOfCard){
        let cardUser = document.getElementById('cardOpponentOnBoard' + indexOfCard);
        cardUser.animate([]);    
}   


socket.on('leave', () => {
    window.location.href = '/leave';
});


addNewOpponentCard();
addNewOpponentCard();
addNewOpponentCard();

addNewUserCard();
addNewUserCard();
addNewUserCard();

