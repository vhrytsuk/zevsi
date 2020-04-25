define([
        'jquery',
        'mage/translate'
    ],
    function ($) {
        'use strict';


        $.widget('memories.customerJs', {
            options: {
                wrap : document.getElementById('memories'),
                playingField : 'playingField',
                memoryCart : 'memory-cart',
                gameVictoryBlock: 'gameVictory',
                widthPlayingFieldInitially: 600,
                heightPlayingFieldInitially: 150,
                numberCells : [1,1,2,2],
                numberMoves : 0,
                victory: 0,
                level: 1,
                levelBlock : 'levelGame',
                players: [],
                checkVictory : false,
                buttonTextActiveGame: 'Почати гру',
                namePlayers : 'namePlayers',
                titleInputName: 'titleInputName',
                blockNamePlayers: 'blockNamePlayers',
                buttonActiveGame: 'buttonActiveGame',
                blockNumberVictory: 'numberVictory',
                blockCountVictory: 'blockCount',
                frontFaceCart : 'front-face',
                backFaceCart : 'back-face',
                flipCartClass: 'flip',
                nextLevel : 'nextLevel',
                blockTable : 'blockTable',
                blockTableCleatText : 'Очистити таблицю',
                buttonTableClear : 'buttonTableClear',
                completeGame: 'completeGame',
                textButtonCompleteGame: 'Завершити гру',
                textButtonNextLevel : 'Наступний рівень',
                blockButton: 'blockButtonOptions',
                checkOpen : false,
                hasFlippedCard : false,
                firstCard : null,
                secondCard: null,
                checkNameArr:false,
                playerRating: [],
                nameSweatPlayer: null,
                gameRating: 'ratingGame',
                ratingTable: 'gameRatingTable',
                tableThead : ['Імя','Рівень','Кількість ходів'],
            },

            _create: function () {
                this._startGame();
            },

            _startGame : function(){                        //по натисканню кнопки починається гра зявляється поле для вводу
                var buttonActiveGame = this._createElem('button',{'class': this.options.buttonActiveGame},this.options.buttonTextActiveGame),
                     blockNamePlayers = this._createElem('div',{'class': this.options.blockNamePlayers},false),
                     nameInput = this._createElem('input',{'class': this.options.namePlayers,'type': 'text','id': this.options.namePlayers},false),
                    titleInputName = this._createElem('label',{'class': this.options.titleInputName,'for': this.options.namePlayers},'Введіть ваше імя');

                    blockNamePlayers.appendChild(titleInputName);
                    blockNamePlayers.appendChild(nameInput);
                    blockNamePlayers.appendChild(buttonActiveGame);

                    this.options.wrap.appendChild(blockNamePlayers);
                    buttonActiveGame.addEventListener('click', this._goGame.bind(this));
                    this._createTable();
            },

            _goGame : function(e){
                var valueInputName =  e.target.parentNode.querySelector(`.${this.options.namePlayers}`).value;
                var table = document.querySelector('.blockTable');

                if (valueInputName < 3) return;           //якщо введене імя менше 3 символів гра не починається
                else {
                    this._pushName(valueInputName);
                    this._createGame();
                    this._flipCart();
                    table.remove();
                    e.target.parentElement.style.display = 'none';
                }
            },

            _pushName : function(valueInputName){     //додаємо імя даного гравця в змінну
                this.options.nameSweatPlayer = valueInputName ;
            },

            _flipCart: function(){
                var activeMemoryCart = document.querySelectorAll('.memory-cart');   //при кліку на картки вони повертаються і прирівнюються
                activeMemoryCart.forEach(card => card.addEventListener('click', this._activeCartFlip.bind(this)));
            },

            _activeCartFlip : function(e) {          //функція логічного перевертання карток
                var countVictoryBlock = document.querySelector('.blockCount'),
                    target = e.target.parentElement;

                if (this.options.checkOpen) return;
                if (target === this.options.firstCard) return;     //не прирівнюється одна та сама картка

                if (!target.classList.contains('flip')){        //повторно не можна нажимати на картку в якої є клас flip
                    target.classList.add('flip');

                    if (!this.options.hasFlippedCard){
                        this.options.hasFlippedCard = true;         //якщо ні одна картка не перевернута true
                        this.options.firstCard = target;
                    }
                    else {
                        this.options.secondCard = target;
                        this.options.hasFlippedCard = false;
                        this._checkForMatch();
                        countVictoryBlock.textContent = this.options.numberMoves;
                    }
                }
            },

            _checkForMatch : function(){        //функція порівняння карток а також відслідкування результату
                this.options.numberMoves++;
                if (this.options.firstCard.dataset.element === this.options.secondCard.dataset.element){
                    this.options.victory +=2;
                    if (this.options.victory === this.options.numberCells.length){
                        this._gameVictory();
                    }
                }
                else {
                    this._unflipCards();
                }
            },

            _disableCards : function() {          //заборонено натискати кілька разів на активовану картку
                this.options.firstCard.removeEventListener('click', this._activeCartFlip);
                this.options.secondCard.removeEventListener('click', this._activeCartFlip);
            },

            _unflipCards : function(){                //якщо картки не сходяться то вони закриваються через 1 секуеду
                this.options.checkOpen = true;
                setTimeout(() => {
                    this.options.firstCard.classList.remove('flip');
                    this.options.secondCard.classList.remove('flip');
                    this._resetBoard();
                },1000)
            },

            _resetBoard : function(){             //обнуляє , фіксить баг коли картка стає не активна
                this.options.hasFlippedCard = this.options.checkOpen = false;
                this.options.secondCard = this.options.firstCard = null;
            },

            _gameVictory : function(){                //функція створює блок виграшу коли всі картки відкриті
                var gameVictotyBlock = this._createElem('div',{'class': this.options.gameVictoryBlock},false),
                    playerWon = this.options.nameSweatPlayer,
                    gameVictotyBlockText = this._createElem('p',false,`Вітаємо ${playerWon} ти пройшов ${this.options.level} Рівень за ${this.options.numberMoves} ${this.options.numberMoves <= 4 ? 'ходи' : 'ходів' } `),
                    buttonNextLevel = this._createElem('button',{'class': this.options.nextLevel},this.options.textButtonNextLevel),
                    buttonCompleteGame  = this._createElem('button',{'class': this.options.completeGame},this.options.textButtonCompleteGame),
                    blockButton = this._createElem('div',{'class': this.options.blockButton},false);

                blockButton.appendChild(buttonCompleteGame);
                blockButton.appendChild(buttonNextLevel);

                gameVictotyBlock.appendChild(gameVictotyBlockText);
                gameVictotyBlock.appendChild(blockButton);
                this.options.wrap.appendChild(gameVictotyBlock);

                this._saveDataGame();
                this._addToLocalStorage();

                buttonNextLevel.addEventListener('click', this._nextLevel.bind(this));         //активація наступного рівня
                buttonCompleteGame.addEventListener('click', this._resetGame.bind(this));       //завершення гри
            },

            _saveDataGame : function(){       //додаємо дані гри в  масив
                if (localStorage.getItem(this.options.gameRating)){          //якщо дані уже є в локалстореджі то спочатку приймаємо їх
                    var arrLocalstorage = JSON.parse(localStorage.getItem(this.options.gameRating));
                    this.options.playerRating = arrLocalstorage;
                }
                this.options.playerRating.push({
                    name : this.options.nameSweatPlayer,
                    level : this.options.level,
                    moves : this.options.numberMoves
                });
            },

            _addToLocalStorage : function(){         //додати в локалсторедж
                    localStorage.setItem(this.options.gameRating, JSON.stringify(this.options.playerRating));
            },

            _resetGame : function(){                                                  // закінчення гри при натискані кнопки
                var blockNamePlayers = document.querySelector('.blockNamePlayers'),
                    numberVictory = document.querySelector('.numberVictory'),
                    namePlayers = document.querySelector('.namePlayers');

                this._createTable();

                blockNamePlayers.style.display = 'flex';
                this.options.checkVictory = false;
                namePlayers.value = null;
                this.options.numberMoves = 0;
                this.options.heightPlayingFieldInitially = 150;
                this.options.level = 1;
                this.options.numberCells = [1,1,2,2];
                numberVictory.remove();
                this._refreshGame();
            },

            _nextLevel : function(){          //при натискані кнопки включається наступний рівень
                this._saveDataGame();
                var arr = this.options.numberCells;
                this.options.heightPlayingFieldInitially += 150;

                if (arr.length < 5){
                    for (var i = 3; i <= 4; i++){
                        arr.push(i,i);
                    }
                }
                else if(arr.length < 9){
                    for (var i = 5; i <= 6; i++){
                        arr.push(i,i);
                    }
                }
                else if(arr.length < 13){
                    for (var i = 7; i <= 8; i++){
                        arr.push(i,i);
                    }
                }
                else if(arr.length < 17){
                    for (var i = 9; i <= 10; i++){
                        arr.push(i,i);
                    }
                    this.options.widthPlayingFieldInitially += 130;
                }
                this.options.level++;
                this.options.numberMoves = 0;
                this._refreshGame();
                this._createGame();
                this._flipCart();
            },

            _refreshGame : function(){               //при активації наступного рівня картки видаляються і створюються по новому
                var cart = document.querySelectorAll('.memory-cart'),
                    gameVictoryBlock = document.querySelector('.gameVictory'),
                    playingField = document.querySelector('.playingField'),
                    numberVictory = document.querySelector('.numberVictory');

                this.options.victory = 0;
                gameVictoryBlock.remove();
                playingField.remove();
                if (numberVictory) numberVictory.remove();
            },

            _createGame : function(){      //створення поля гри
                var blockNumberVictory = this._createElem('div',{'class': this.options.blockNumberVictory},'Кількість ходів'),
                    countVictory = this._createElem('span',{'class': this.options.blockCountVictory},`${this.options.victory}`),
                    levelGame = this._createElem('span',{'class': this.options.levelBlock},`Рівень ${this.options.level}`);

                blockNumberVictory.appendChild(countVictory);
                blockNumberVictory.appendChild(levelGame);

                this.options.wrap.appendChild(blockNumberVictory);
                this.options.wrap.appendChild(this._createCart());
            },

            _createCart : function(){
                var arr = this.options.numberCells,
                     playingField = this._createElem('div',{'class': this.options.playingField},false);

                // this._mixCart(arr);

                for (var i=0; i<arr.length; i++){
                    var blockCart = this._createElem('div',{'class': this.options.memoryCart,'data-element': `${arr[i]}`},false),
                        frontFace = this._createElem('div',{'class': this.options.frontFaceCart},`${arr[i]}`),
                        backFace = this._createElem('div',{'class': this.options.backFaceCart},false);

                    blockCart.appendChild(frontFace);
                    blockCart.appendChild(backFace);
                    playingField.appendChild(blockCart);
                }
                this._fieldParameters(playingField);

                return playingField;
            },

            _createTable : function(){
                var localstorageRatingData = this._getSavedData(),
                    table = this._createElem('table',{'class': this.options.ratingTable},false),
                    blockTable = this._createElem('div',{'class': this.options.blockTable},false),
                    buttonTableClear = this._createElem('button',{'class': this.options.buttonTableClear},this.options.blockTableCleatText),
                    thead = this._createElem('thead',{},false),
                    caption = this._createElem('caption',{},'Рейтинг гривців'),
                    tbody = this._createElem('tbody',{},false),
                    tableHead = this.options.tableThead,
                    trHead = this._createElem('tr',{},false);


                    for (var i =0; i < tableHead.length; i++){    //шапка таблиці
                        var th = this._createElem('th',{},tableHead[i]);
                        trHead.appendChild(th);
                    }
                    table.appendChild(caption);
                    thead.appendChild(trHead);
                    table.appendChild(thead);

                    for (var key in localstorageRatingData){
                            var tr = this._createElem('tr',{},false);
                        for (var key2 in localstorageRatingData[key]){
                            var td = this._createElem('td',{}, localstorageRatingData[key][key2]);
                                    tr.appendChild(td);
                        }
                            tbody.appendChild(tr);
                    }
                    var asa = function (){
                        if (localstorageRatingData){
                            return localstorageRatingData.sort((a,b) => a.moves < b.moves ? 1 : -1);
                        }
                    };
                    var el =  asa().sort((a,b) => a.level > b.level ? 1: -1);

                    console.log(el);
                    table.appendChild(tbody);
                    blockTable.appendChild(table);
                    blockTable.appendChild(buttonTableClear);
                    this.options.wrap.appendChild(blockTable);

                buttonTableClear.addEventListener('click', this._clearTable.bind(this));
            },

            _clearTable : function(e){        //очистить таблицу
               localStorage.removeItem(this.options.gameRating);
               this.options.playerRating = [];
               e.target.parentElement.remove();
               this._createTable();
            },

            _getSavedData : function(){        //отримати дані з локалсторедж
               var ratingLocalstorage =  localStorage.getItem(this.options.gameRating);
                return  JSON.parse(ratingLocalstorage);
            },

            _fieldParameters : function(playingField){
                playingField.style.width = this.options.widthPlayingFieldInitially + 'px';
                playingField.style.height = this.options.heightPlayingFieldInitially + 'px';
            },

            _mixCart : function(arr){        //сортування карток
                arr = arr.sort(function () {
                    return Math.random() - 0.5;
                });
                return arr;
            },

            _createElem: function(elem, attribute, text) {
                if (!elem) return false;
                elem = document.createElement(elem);
                if (attribute) {
                    for (var key in attribute) {
                        elem.setAttribute(key, attribute[key]);
                    }
                }
                if (text){
                    elem.textContent = text;
                }
                return elem;
            },

        });
        return $.memories.customerJs;
    }
);
