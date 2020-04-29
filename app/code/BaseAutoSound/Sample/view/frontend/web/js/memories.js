define([
        'jquery',
        'mage/translate'
    ],
    function ($) {
        'use strict';


        $.widget('memories.customerJs', {
            options: {
                wrap: document.getElementById('memories'),
                playingField: 'playingField',
                memoryCart: 'memory-cart',
                gameVictoryBlock: 'gameVictory',
                widthPlayingFieldInitially: 600,
                heightPlayingFieldInitially: 600,
                widthCart : 120,
                heightCart : 140,
                numberCells: [1, 1, 2, 2],
                numberMoves: 0,
                victory: 0,
                level: 1,
                levelBlock: 'levelGame',
                players: [],
                checkVictory: false,
                buttonTextActiveGame: 'Почати гру',
                namePlayers: 'namePlayers',
                titleInputName: 'titleInputName',
                blockNamePlayers: 'blockNamePlayers',
                buttonActiveGame: 'buttonActiveGame',
                blockNumberVictory: 'numberVictory',
                blockCountVictory: 'blockCount',
                frontFaceCart: 'front-face',
                backFaceCart: 'back-face',
                flipCartClass: 'flip',
                nextLevel: 'nextLevel',
                blockTable: 'blockTable',
                titleTableRating : 'Топ 3 кожного рівня',
                blockTableCleatText: 'Очистити таблицю',
                buttonTableClear: 'buttonTableClear',
                completeGame: 'completeGame',
                textButtonCompleteGame: 'Завершити гру',
                textButtonNextLevel: 'Наступний рівень',
                textNumberVictory : 'Кількість ходів',
                textLabelInput : 'Введіть ваше імя',
                blockButton: 'blockButtonOptions',
                blockGameComplete : 'blockGameComplete',
                textGameComplete : 'Вітаємо ви пройшли всі рівні',
                textButtonComplete : 'Почати спочатку',
                buttonGameComplete: 'btnGameComplete',
                checkOpen: false,
                hasFlippedCard: false,
                firstCard: null,
                secondCard: null,
                checkNameArr: false,
                playerRating: [],
                nameSweatPlayer: null,
                gameRating: 'ratingGame',
                ratingTable: 'gameRatingTable',
                tableThead: ['Місце', 'Імя', 'Рівень', 'Кількість ходів'],
                stateOfPlay: {
                    namePlay: null,
                    level: null,
                    numberMoves: null,
                    arrNumberCart: [],
                    arrActiveCart: [],
                    pieceGame: null,
                    winningMoves: 0,
                    gameOver: true,
                },
            },

            _create: function () {
                this._startGame();
            },

            _startGame: function () {                        //по натисканню кнопки починається гра зявляється поле для вводу
                var buttonActiveGame = this._createElem('button', {'class': this.options.buttonActiveGame}, $.mage.__(this.options.buttonTextActiveGame)),
                    blockNamePlayers = this._createElem('div', {'class': this.options.blockNamePlayers}, false),
                    nameInput = this._createElem('input', {'class': this.options.namePlayers, 'type': 'text', 'id': this.options.namePlayers}, false),
                    titleInputName = this._createElem('label', {'class': this.options.titleInputName, 'for': this.options.namePlayers}, $.mage.__(this.options.textLabelInput));

                blockNamePlayers.appendChild(titleInputName);
                blockNamePlayers.appendChild(nameInput);
                blockNamePlayers.appendChild(buttonActiveGame);
                this.options.wrap.appendChild(blockNamePlayers);

                buttonActiveGame.addEventListener('click', this._goGame.bind(this));   //активує гру
                this._createTable();
            },

            _goGame: function (e) {             //якщо введене імя менше 3 символів гра не починається
                var valueInputName = e.target.parentNode.querySelector(`.${this.options.namePlayers}`).value;
                var table = document.querySelector(`.${this.options.blockTable}`);

                if (valueInputName.length < 3) return;
                else {
                    this._pushName(valueInputName);
                    this._createGame();
                    table.remove();
                    e.target.parentElement.style.display = 'none';
                }
            },

            _pushName: function (valueInputName) {     //додаємо імя даного гравця в змінну
                this.options.nameSweatPlayer = valueInputName;
            },

            _flipCart: function () {
                var activeMemoryCart = document.querySelectorAll(`.${this.options.memoryCart}`);   //при кліку на картки вони повертаються і прирівнюються
                activeMemoryCart.forEach(card => card.addEventListener('click', this._activeCartFlip.bind(this)));
            },

            _activeCartFlip: function (e) {          //функція логічного перевертання карток
                var countVictoryBlock = document.querySelector(`.${this.options.blockCountVictory}`),
                    flipCart = this.options.flipCartClass,
                    target = e.target.parentElement;

                if (this.options.checkOpen) return;
                if (target === this.options.firstCard) return;     //не прирівнюється одна та сама картка

                if (!target.classList.contains(flipCart)) {        //повторно не можна нажимати на картку в якої є клас flip
                    target.classList.add(flipCart);

                    if (!this.options.hasFlippedCard) {
                        this.options.hasFlippedCard = true;         //якщо ні одна картка не перевернута true
                        this.options.firstCard = target;
                    } else {
                        this.options.secondCard = target;
                        this.options.hasFlippedCard = false;
                        this._checkForMatch();
                        countVictoryBlock.textContent = this.options.numberMoves;
                    }
                }
            },

            _checkForMatch: function () {        //функція порівняння карток а також відслідкування результату
                this.options.numberMoves++;
                if (this.options.firstCard.dataset.element === this.options.secondCard.dataset.element) {
                    this.options.victory += 2;
                    if (this.options.victory === this.options.numberCells.length) {
                        this.options.numberCells.length > 24 ? this._createBlockGameComplete() : this._gameVictory();
                        this._saveDataGame();
                    }
                } else {
                    this._unflipCards();
                }
            },

            _createBlockGameComplete : function(){
                var wrap = this.options.wrap,
                    blockGameComplete = this._createElem('div', {'class': this.options.blockGameComplete}, false),
                    textGameComplete = this._createElem('p', {}, $.mage.__(`Вітаємо ${this.options.nameSweatPlayer} ти пройшов(шла) всі рівні`)),
                    buttonGameComplete = this._createElem('button', {'class': this.options.buttonGameComplete}, $.mage.__(this.options.textButtonComplete));

                blockGameComplete.appendChild(textGameComplete);
                blockGameComplete.appendChild(buttonGameComplete);
                wrap.appendChild(blockGameComplete);

                // this._saveDataGame();
                // this._addToLocalStorage();
                buttonGameComplete.addEventListener('click', this._resetGame.bind(this,blockGameComplete));
            },


            _disableCards: function () {          //заборонено натискати кілька разів на активовану картку
                this.options.firstCard.removeEventListener('click', this._activeCartFlip);
                this.options.secondCard.removeEventListener('click', this._activeCartFlip);
            },

            _unflipCards: function () {                //якщо картки не сходяться то вони закриваються через 1 секуеду
                this.options.checkOpen = true;
                setTimeout(() => {
                    this.options.firstCard.classList.remove(this.options.flipCartClass);
                    this.options.secondCard.classList.remove(this.options.flipCartClass);
                    this._resetBoard();
                }, 1000)
            },

            _resetBoard: function () {             //обнуляє , фіксить баг коли картка стає не активна
                this.options.hasFlippedCard = this.options.checkOpen = false;
                this.options.secondCard = this.options.firstCard = null;
            },

            _gameVictory: function () {                //функція створює блок виграшу коли всі картки відкриті
                var gameVictotyBlock = this._createElem('div', {'class': this.options.gameVictoryBlock}, false),
                    playerWon = this.options.nameSweatPlayer,
                    wrap = this.options.wrap,
                    gameVictotyBlockText = this._createElem('p', false, $.mage.__(`Вітаємо ${playerWon} ти пройшов ${this.options.level} Рівень за ${this.options.numberMoves} ${this.options.numberMoves <= 4 ? 'ходи' : 'ходів'}`)),
                    buttonNextLevel = this._createElem('button', {'class': this.options.nextLevel},$.mage.__(this.options.textButtonNextLevel)),
                    buttonCompleteGame = this._createElem('button', {'class': this.options.completeGame}, $.mage.__(this.options.textButtonCompleteGame)),
                    blockButton = this._createElem('div', {'class': this.options.blockButton}, false);

                blockButton.appendChild(buttonCompleteGame);
                blockButton.appendChild(buttonNextLevel);

                gameVictotyBlock.appendChild(gameVictotyBlockText);
                gameVictotyBlock.appendChild(blockButton);
                wrap.appendChild(gameVictotyBlock);

                // this._saveDataGame();
                // this._addToLocalStorage();

                buttonNextLevel.addEventListener('click', this._nextLevel.bind(this,gameVictotyBlock));         //активація наступного рівня
                buttonCompleteGame.addEventListener('click', this._resetGame.bind(this,gameVictotyBlock));       //завершення гри
            },

            _saveDataGame: function () {       //додаємо дані гри в  масив
                if (localStorage.getItem(this.options.gameRating)) {          //якщо дані уже є в локалстореджі то спочатку приймаємо їх
                    var arrLocalstorage = JSON.parse(localStorage.getItem(this.options.gameRating));
                    this.options.playerRating = arrLocalstorage;
                }
                this.options.playerRating.push({
                    name: this.options.nameSweatPlayer,
                    level: this.options.level,
                    moves: this.options.numberMoves
                });
                this._addToLocalStorage();
            },

            _addToLocalStorage: function () {         //додати в локалсторедж
                localStorage.setItem(this.options.gameRating, JSON.stringify(this.options.playerRating));
            },

            _resetGame: function (deleteBlock) {                                                  // закінчення гри при натискані кнопки
                var blockNamePlayers = document.querySelector(`.${this.options.blockNamePlayers}`),
                    numberVictory = document.querySelector(`.${this.options.blockNumberVictory}`),
                    namePlayers = document.querySelector(`.${this.options.namePlayers}`);

                this._createTable();
                deleteBlock.remove();

                blockNamePlayers.style.display = 'flex';
                namePlayers.value = null;

                if (numberVictory) numberVictory.remove();
                this._initialState();
                this._refreshGame();
            },

            _initialState : function(){
                this.options.checkVictory = false;
                this.options.numberMoves = 0;
                this.options.heightPlayingFieldInitially = 600;
                this.options.widthPlayingFieldInitially = 600;
                this.options.widthCart = 120;
                this.options.heightCart = 140;
                this.options.level = 1;
                this.options.numberCells = [1, 1, 2, 2];  // при закінченні гри вертаємо ігрове поле в початковий стан

            },

            _increasingFieldPlay : function(){
                var arr = this.options.numberCells,
                    countArrCells = arr.length;
                var countCart = 0;

                if (countArrCells < 8){
                    for (var i = countArrCells - 1; i<= countArrCells; i++){
                        arr.push(i,i);
                    }
                }
                else if (countArrCells < 12){
                    for (var i = countArrCells / 2  + 1; i<= countArrCells / 2 + 2; i++){
                                 arr.push(i,i);
                             }
                }
                else if(countArrCells < 16){
                    for (var i = countArrCells / 2  + 1; i<= countArrCells / 2 + 4; i++){
                        arr.push(i,i);
                    }
                    this.options.widthPlayingFieldInitially = 700;
                }
                else if (countArrCells < 21){
                    for (var i = countArrCells / 2  + 1; i<= countArrCells / 2 + 6; i++){
                        arr.push(i,i);
                    }
                    this.options.widthPlayingFieldInitially = 900;
                    this.options.widthCart = 100;
                    this.options.heightCart = 100;
                }
            },

            _nextLevel: function (deleteBlock) {          //при натискані кнопки включається наступний рівень
                this._increasingFieldPlay();
                deleteBlock.remove();
                this.options.level++;
                this.options.numberMoves = 0;
                this._refreshGame();
                this._createGame();
                this._flipCart();
            },

            _refreshGame: function () {               //при активації наступного рівня картки видаляються і створюються по новому
                var playingField = document.querySelector(`.${this.options.playingField}`),
                    numberVictory = document.querySelector(`.${this.options.blockNumberVictory}`);

                if (numberVictory) numberVictory.remove();
                this.options.victory = 0;
                playingField.remove();

            },

            _createGame: function () {      //створення поля гри
                var blockNumberVictory = this._createElem('div', {'class': this.options.blockNumberVictory}, $.mage.__(this.options.textNumberVictory)),
                    countVictory = this._createElem('span', {'class': this.options.blockCountVictory}, `${this.options.victory}`),
                    levelGame = this._createElem('span', {'class': this.options.levelBlock}, $.mage.__(`Рівень ${this.options.level}`)),
                    createCart = this._createCart();

                blockNumberVictory.appendChild(countVictory);
                blockNumberVictory.appendChild(levelGame);

                this.options.wrap.appendChild(blockNumberVictory);
                this.options.wrap.appendChild(createCart);
                this._flipCart();
            },

            _createCart: function () {        //створює  гральне поле та картки
                var arr = this.options.numberCells,
                    playingField = this._createElem('div', {'class': this.options.playingField}, false);

                // this._mixCart(arr);

                for (var i = 0; i < arr.length; i++) {
                    var blockCart = this._createElem('div', {'class': this.options.memoryCart, 'data-element': `${arr[i]}`}, false),
                        frontFace = this._createElem('div', {'class': this.options.frontFaceCart}, `${arr[i]}`),
                        backFace = this._createElem('div', {'class': this.options.backFaceCart}, false);

                    blockCart.appendChild(frontFace);
                    blockCart.appendChild(backFace);
                    playingField.appendChild(blockCart);

                this._cardOptions(blockCart);
                }
                this._fieldParameters(playingField);

                return playingField;
            },

            _cardOptions : function(blockCart){
                blockCart.style.width = this.options.widthCart + 'px';
                blockCart.style.height = this.options.heightCart + 'px';
            },

            _createTable: function () {         //створення таблиці
                var bestPlayers = this._clearArrExcess(),
                    table = this._createElem('table', {'class': this.options.ratingTable}, false),
                    blockTable = this._createElem('div', {'class': this.options.blockTable}, false),
                    buttonTableClear = this._createElem('button', {'class': this.options.buttonTableClear}, $.mage.__(this.options.blockTableCleatText)),
                    thead = this._createElem('thead', {}, false),
                    caption = this._createElem('caption', {}, $.mage.__(this.options.titleTableRating)),
                    tbody = this._createElem('tbody', {}, false),
                    tableHead = this.options.tableThead,
                    trHead = this._createElem('tr', {}, false);

                for (var i = 0; i < tableHead.length; i++) {    //створюємо шапку таблиці
                    var th = this._createElem('th', {}, $.mage.__(tableHead[i]));
                    trHead.appendChild(th);
                }

                table.appendChild(caption);
                thead.appendChild(trHead);
                table.appendChild(thead);

                var playerPlace;

                for (var key in bestPlayers) {    //створюємо таблицю з багатовимірного масива
                    for (var key2 in bestPlayers[key]) {
                        playerPlace = +key2 + 1;
                        var tr = this._createElem('tr', {'class':`place${playerPlace}`}, false),
                            countPlace = this._createElem('td', {}, playerPlace);
                        tr.appendChild(countPlace);
                        for (var key3 in bestPlayers[key][key2]) {
                            var td = this._createElem('td', {}, bestPlayers[key][key2][key3]);
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);
                    }
                }

                table.appendChild(tbody);
                blockTable.appendChild(table);
                blockTable.appendChild(buttonTableClear);
                this.options.wrap.appendChild(blockTable);

                buttonTableClear.addEventListener('click', this._clearTable.bind(this));      //очистка таблиці та локалстореджа
            },

            _clearArrExcess: function () {                  //залишаємо тільки по 3 найкращих гравця кожного рівня
                var multiArr = this._rewriteArr();
                for (var key in multiArr) {
                    if (multiArr[key].length > 3) {
                        multiArr[key].splice(3, multiArr[key].length);
                    }
                }
                return multiArr;
            },

            _rewriteArr: function () {             //переписую масив з одновимірного в багатовимірний
                var sortTable = this._sortTable(),
                     multiArr = [];

                if (sortTable) {
                    for (var i = 0; i < sortTable.length; i++) {
                        for (var j = 0; j < sortTable.length; j++) {
                            if (sortTable[j].level === i + 1) {
                                if (!multiArr[i]) {
                                    multiArr[i] = [sortTable[j]];
                                } else {
                                    multiArr[i].push(sortTable[j]);
                                }
                            }
                        }
                    }
                }
                return multiArr;
            },

            _sortTable: function () {  //відсортовуємо масив по рівням та по кількості ходів
                var localstorageRatingData = this._getSavedData();
                if (localstorageRatingData) {
                    var sortLocalstorageRatingData = localstorageRatingData.sort((a, b) => a.moves < b.moves ? 1 : -1).sort((a, b) => a.level > b.level ? 1 : -1);
                    return sortLocalstorageRatingData;
                }
            },

            _clearTable: function (e) {        //очистить таблицю та локалсторедж
                e.target.parentElement.remove();
                localStorage.removeItem(this.options.gameRating);
                this.options.playerRating = [];
                this._createTable();
            },

            _getSavedData: function () {        //отримати дані з локалсторедж
                var ratingLocalstorage = localStorage.getItem(this.options.gameRating);
                return JSON.parse(ratingLocalstorage);
            },

            _fieldParameters: function (playingField) {        //розміри поля для гри
                playingField.style.width = this.options.widthPlayingFieldInitially + 'px';
                playingField.style.height = this.options.heightPlayingFieldInitially + 'px';
            },

            _mixCart: function (arr) {        //перемішування карток
                arr = arr.sort(function () {
                    return Math.random() - 0.5;
                });
                return arr;
            },

            _createElem: function (elem, attribute, text) {   //метод для створення DOM елементів
                if (!elem) return false;
                elem = document.createElement(elem);
                if (attribute) {
                    for (var key in attribute) {
                        elem.setAttribute(key, attribute[key]);
                    }
                }
                if (text) {
                    elem.textContent = text;
                }
                return elem;
            },

        });
        return $.memories.customerJs;
    }
);
