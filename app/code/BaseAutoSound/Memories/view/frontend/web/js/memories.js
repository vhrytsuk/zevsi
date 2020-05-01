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
                widthCart: 120,
                heightCart: 140,
                numberCells: [1, 1, 2, 2],
                numberMoves: 0,
                victory: 0,
                level: 1,
                levelBlock: 'levelGame',
                players: [],
                checkVictory: false,
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
                execButtonGame: 'execGame',
                titleTableRating: 'Топ 3 кожного рівня',
                blockTableCleatText: 'Очистити таблицю',
                buttonTextActiveGame: 'Почати гру',
                textButtonCompleteGame: 'Завершити гру',
                textButtonNextLevel: 'Наступний рівень',
                textNumberVictory: 'Кількість ходів',
                textLabelInput: 'Введіть ваше імя',
                textButtonComplete: 'Почати спочатку',
                textGameComplete: 'Вітаємо ви пройшли всі рівні',
                buttonTableClear: 'buttonTableClear',
                completeGame: 'completeGame',
                blockButton: 'blockButtonOptions',
                blockGameComplete: 'blockGameComplete',
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
                    gameOver: 'cart',
                    widthCart: 0,
                    heightCart: 0,
                    widthField: 0,
                    heightField: 0
                },
                gameNonOverLocalstorage: 'gameNotOver',
                checkingPageReload: true,
            },

            _create: function () {
                this._statePlay();
            },

            _startGame: function () {
                this._createBlockEnterName();
                this._createTable();
            },

            _createBlockEnterName: function () {
                var buttonActiveGame = this._createElem('button', {'class': this.options.buttonActiveGame}, $.mage.__(this.options.buttonTextActiveGame)),
                    blockNamePlayers = this._createElem('div', {'class': this.options.blockNamePlayers}, false),
                    nameInput = this._createElem('input', {
                        'class': this.options.namePlayers,
                        'type': 'text',
                        'id': this.options.namePlayers
                    }, false),
                    titleInputName = this._createElem('label', {
                        'class': this.options.titleInputName,
                        'for': this.options.namePlayers
                    }, $.mage.__(this.options.textLabelInput));

                blockNamePlayers.appendChild(titleInputName);
                blockNamePlayers.appendChild(nameInput);
                blockNamePlayers.appendChild(buttonActiveGame);
                this.options.wrap.appendChild(blockNamePlayers);

                buttonActiveGame.addEventListener('click', this._goGame.bind(this));
            },

            _statePlay: function () {
                var gameNotOver = this._getGameStateLocalstorage();
                if (gameNotOver) {
                    this._runSavedGame(gameNotOver);
                } else {
                    this._startGame();
                }
            },

            _runSavedGame: function (savedGame) {
                var stateGameOver = savedGame.gameOver,
                    namePlay = savedGame.namePlay,
                    level = savedGame.level,
                    numberMoves = savedGame.numberMoves,
                    arrNumberCart = savedGame.arrNumberCart,
                    activeCart = savedGame.arrActiveCart,
                    winningMoves = savedGame.winningMoves,
                    widthCart = savedGame.widthCart,
                    heightCart = savedGame.heightCart,
                    widthField = savedGame.widthField,
                    heightField = savedGame.heightField;


                this.options.nameSweatPlayer = namePlay;
                this.options.numberMoves = numberMoves;
                this.options.level = level;
                this.options.victory = winningMoves;
                this.options.numberCells = arrNumberCart;
                this.options.stateOfPlay.arrActiveCart = activeCart;
                this.options.widthCart = widthCart;
                this.options.heightCart = heightCart;
                this.options.widthPlayingFieldInitially = widthField;
                this.options.heightPlayingFieldInitially = heightField;

                if (stateGameOver === 'gameVictory') {
                    this._gameVictory(savedGame);
                } else {
                    this._createGame(savedGame);
                }
            },

            _goGame: function (e) {
                var valueInputName = e.target.parentNode.querySelector(`.${this.options.namePlayers}`).value,
                    table = document.querySelector(`.${this.options.blockTable}`);


                if (valueInputName.length < 3) return;
                else {
                    this._pushName(valueInputName);
                    this._createGame();

                    table.remove();
                    e.target.parentElement.style.display = 'none';
                }
            },

            _getGameStateLocalstorage: function () {
                if (localStorage.getItem(this.options.gameNonOverLocalstorage)) {
                    return JSON.parse(localStorage.getItem(this.options.gameNonOverLocalstorage));
                } else {
                    return;
                }
            },

            _saveGameState: function () {
                var gameNotOver = this.options.gameNonOverLocalstorage;
                localStorage.setItem(gameNotOver, JSON.stringify(this.options.stateOfPlay));
            },

            _addGameStateArr: function () {
                this.options.stateOfPlay.numberMoves = this.options.numberMoves;
                this.options.stateOfPlay.level = this.options.level;
                this.options.stateOfPlay.namePlay = this.options.nameSweatPlayer;
                this.options.stateOfPlay.arrNumberCart = this.options.numberCells;
                this.options.stateOfPlay.winningMoves = this.options.victory;
                this.options.stateOfPlay.widthCart = this.options.widthCart;
                this.options.stateOfPlay.heightCart = this.options.heightCart;
                this.options.stateOfPlay.widthField = this.options.widthPlayingFieldInitially;
                this.options.stateOfPlay.heightField = this.options.heightPlayingFieldInitially;

                this._saveGameState();
            },

            _pushName: function (valueInputName) {
                this.options.nameSweatPlayer = valueInputName;
            },

            _flipCart: function () {
                var activeMemoryCart = document.querySelectorAll(`.${this.options.memoryCart}`);
                activeMemoryCart.forEach(card => card.addEventListener('click', this._activeCartFlip.bind(this)));
            },

            _activeCartFlip: function (e) {
                var countVictoryBlock = document.querySelector(`.${this.options.blockCountVictory}`),
                    flipCart = this.options.flipCartClass,
                    target = e.target.parentElement;

                if (this.options.checkOpen) return;
                if (target === this.options.firstCard) return;

                if (!target.classList.contains(flipCart)) {
                    target.classList.add(flipCart);

                    if (!this.options.hasFlippedCard) {
                        this.options.hasFlippedCard = true;
                        this.options.firstCard = target;
                    } else {
                        this.options.secondCard = target;
                        this.options.hasFlippedCard = false;
                        this._checkForMatch();
                        countVictoryBlock.textContent = this.options.numberMoves;
                    }
                }
            },

            _checkForMatch: function () {
                this.options.numberMoves++;
                if (this.options.firstCard.dataset.element === this.options.secondCard.dataset.element) {
                    this.options.victory += 2;
                    this.options.stateOfPlay.arrActiveCart.push(this.options.secondCard.dataset.element);
                    if (this.options.victory === this.options.numberCells.length) {
                        this.options.numberCells.length > 24 ? this._createBlockGameComplete() : this._gameVictory();
                        this._saveDataGame();
                    }
                } else {
                    this._unflipCards();
                }
                this._addGameStateArr();
            },

            _createBlockGameComplete: function () {
                var wrap = this.options.wrap,
                    blockGameComplete = this._createElem('div', {'class': this.options.blockGameComplete}, false),
                    textGameComplete = this._createElem('p', {}, $.mage.__(`Вітаємо ${this.options.nameSweatPlayer} ти пройшов(шла) всі рівні`)),
                    buttonGameComplete = this._createElem('button', {'class': this.options.buttonGameComplete}, $.mage.__(this.options.textButtonComplete));

                blockGameComplete.appendChild(textGameComplete);
                blockGameComplete.appendChild(buttonGameComplete);
                wrap.appendChild(blockGameComplete);


                buttonGameComplete.addEventListener('click', this._resetGame.bind(this, blockGameComplete));
            },


            _disableCards: function () {
                this.options.firstCard.removeEventListener('click', this._activeCartFlip);
                this.options.secondCard.removeEventListener('click', this._activeCartFlip);
            },

            _unflipCards: function () {
                this.options.checkOpen = true;
                setTimeout(() => {
                    this.options.firstCard.classList.remove(this.options.flipCartClass);
                    this.options.secondCard.classList.remove(this.options.flipCartClass);
                    this._resetBoard();
                }, 1000)
            },

            _resetBoard: function () {
                this.options.hasFlippedCard = this.options.checkOpen = false;
                this.options.secondCard = this.options.firstCard = null;
            },

            _gameVictory: function (parameter) {
                var gameVictotyBlock = this._createElem('div', {'class': this.options.gameVictoryBlock}, false),
                    playerWon = this.options.nameSweatPlayer,
                    wrap = this.options.wrap,
                    gameVictotyBlockText = this._createElem('p', false,
                        $.mage.__(`Вітаємо  ${parameter ? parameter.namePlay : playerWon} ти пройшов ${parameter ? parameter.level : this.options.level} Рівень за ${parameter ? parameter.numberMoves : this.options.numberMoves} ${this.options.numberMoves <= 4 ? 'ходи' : 'ходів'}`)),
                    buttonNextLevel = this._createElem('button', {'class': this.options.nextLevel}, $.mage.__(this.options.textButtonNextLevel)),
                    buttonCompleteGame = this._createElem('button', {'class': this.options.completeGame}, $.mage.__(this.options.textButtonCompleteGame)),
                    blockButton = this._createElem('div', {'class': this.options.blockButton}, false);

                blockButton.appendChild(buttonCompleteGame);
                blockButton.appendChild(buttonNextLevel);

                gameVictotyBlock.appendChild(gameVictotyBlockText);
                gameVictotyBlock.appendChild(blockButton);
                wrap.appendChild(gameVictotyBlock);

                this.options.stateOfPlay.gameOver = 'gameVictory';
                this._addGameStateArr();

                buttonNextLevel.addEventListener('click', this._nextLevel.bind(this, gameVictotyBlock));         //активація наступного рівня
                buttonCompleteGame.addEventListener('click', this._resetGame.bind(this, gameVictotyBlock));       //завершення гри
            },

            _removeStateGame: function () {
                var saveLocalstorageGame = localStorage.getItem(this.options.gameNonOverLocalstorage);       //якщо дані є в локалстореджі при закінченні гри видаляємо їх
                if (saveLocalstorageGame) {
                    localStorage.removeItem(this.options.gameNonOverLocalstorage);
                }
                this._resetGameState();
            },

            _saveDataGame: function () {
                if (localStorage.getItem(this.options.gameRating)) {
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

            _addToLocalStorage: function () {
                localStorage.setItem(this.options.gameRating, JSON.stringify(this.options.playerRating));
            },

            _resetGame: function (deleteBlock) {
                var blockNamePlayers = document.querySelector(`.${this.options.blockNamePlayers}`),
                    numberVictory = document.querySelector(`.${this.options.blockNumberVictory}`),
                    namePlayers = document.querySelector(`.${this.options.namePlayers}`);

                this._createTable();
                deleteBlock.remove();

                if (blockNamePlayers) {
                    blockNamePlayers.style.display = 'flex';
                    namePlayers.value = null;
                } else {
                    this._createBlockEnterName();
                }

                if (numberVictory) numberVictory.remove();

                this._initialState();
                this._refreshGame();
                this._removeStateGame();
            },

            _resetGameState: function () {
                this.options.stateOfPlay.namePlay = null;
                this.options.stateOfPlay.level = null;
                this.options.stateOfPlay.numberMoves = null;
                this.options.stateOfPlay.arrNumberCart = [];
                this.options.stateOfPlay.arrActiveCart = [];
                this.options.stateOfPlay.pieceGame = null;
                this.options.stateOfPlay.winningMoves = 0;
                this.options.stateOfPlay.gameOver = 'cart';
            },

            _initialState: function () {
                this.options.checkVictory = false;
                this.options.numberMoves = 0;
                this.options.heightPlayingFieldInitially = 600;
                this.options.widthPlayingFieldInitially = 600;
                this.options.widthCart = 120;
                this.options.heightCart = 140;
                this.options.level = 1;
                this.options.numberCells = [1, 1, 2, 2];
            },

            _increasingFieldPlay: function () {
                var arr = this.options.numberCells,
                    countArrCells = arr.length,
                    startCount = countArrCells / 2 + 1,
                    endCount = 2,
                    countHalf = countArrCells / 2;

                if (countArrCells < 8) {
                    for (var i = countArrCells - 1; i <= countArrCells; i++) {
                        arr.push(i, i);
                    }
                } else {
                    for (var i = startCount; i <= countHalf + endCount; i++) {
                        arr.push(i, i);
                    }
                }
                if (countArrCells > 13 && countArrCells < 18) {
                    this.options.widthPlayingFieldInitially = 700;
                } else if (countArrCells > 19) {
                    this.options.widthPlayingFieldInitially = 900;
                    this.options.widthCart = 100;
                    this.options.heightCart = 100;
                }
                endCount += 2;
            },

            _nextLevel: function (deleteBlock) {          //при натискані кнопки включається наступний рівень
                this._increasingFieldPlay();
                deleteBlock.remove();
                this.options.stateOfPlay.arrActiveCart = [];
                this.options.level++;
                this.options.numberMoves = 0;
                this._addGameStateArr();
                this._refreshGame();
                this._createGame();
                this._flipCart();
            },

            _refreshGame: function () {
                var playingField = document.querySelector(`.${this.options.playingField}`),
                    numberVictory = document.querySelector(`.${this.options.blockNumberVictory}`);

                if (numberVictory) numberVictory.remove();
                if (playingField) playingField.remove();
                this.options.victory = 0;
            },

            _createGame: function (parameter) {
                var blockNumberVictory = this._createElem('div', {'class': this.options.blockNumberVictory}, $.mage.__(this.options.textNumberVictory)),
                    countVictory = this._createElem('span', {'class': this.options.blockCountVictory}, `${parameter ? parameter.numberMoves : this.options.victory}`),
                    execGame = this._createElem('button', {'class': this.options.completeGame}, this.options.textButtonCompleteGame),
                    levelGame = this._createElem('span', {'class': this.options.levelBlock}, $.mage.__(`Рівень ${parameter ? parameter.level : this.options.level}`)),
                    createCart = this._createCart(parameter);

                this.options.stateOfPlay.gameOver = 'cart';
                this._addGameStateArr();

                blockNumberVictory.appendChild(countVictory);
                blockNumberVictory.appendChild(levelGame);
                blockNumberVictory.appendChild(execGame);

                this.options.wrap.appendChild(blockNumberVictory);
                this.options.wrap.appendChild(createCart);

                this._checkCardsActivated(parameter);
                this._flipCart();

                execGame.addEventListener('click', this._resetGame.bind(this, createCart));
            },

            _checkCardsActivated: function (parameter) {
                var cart = document.querySelectorAll(`.${this.options.memoryCart}`);
                if (parameter) {
                    var activeCart = parameter.arrActiveCart;

                    cart.forEach((elem) => {
                        for (var i = 0; i < activeCart.length; i++) {
                            if (elem.dataset.element == activeCart[i]) {
                                elem.classList.add(this.options.flipCartClass);
                            }
                        }
                    });
                }
            },

            _createCart: function (parameter) {
                var arr = this.options.numberCells,
                    playingField = this._createElem('div', {'class': this.options.playingField}, false);

                if (parameter) {
                    var arrCart = parameter.arrNumberCart,
                        mixCart = arrCart;
                } else {
                    mixCart = this._mixCart(arr);
                }

                for (var i = 0; i < mixCart.length; i++) {
                    var blockCart = this._createElem('div', {
                            'class': this.options.memoryCart,
                            'data-element': `${mixCart[i]}`
                        }, false),
                        frontFace = this._createElem('div', {'class': this.options.frontFaceCart}, `${mixCart[i]}`),
                        backFace = this._createElem('div', {'class': this.options.backFaceCart}, false);

                    blockCart.appendChild(frontFace);
                    blockCart.appendChild(backFace);
                    playingField.appendChild(blockCart);

                    this._cartOptions(blockCart);
                }

                this._fieldParameters(playingField);

                return playingField;
            },


            _cartOptions: function (blockCart) {
                blockCart.style.width = this.options.widthCart + 'px';
                blockCart.style.height = this.options.heightCart + 'px';
            },

            _createTable: function () {
                var table = this._createElem('table', {'class': this.options.ratingTable}, false),
                    blockTable = this._createElem('div', {'class': this.options.blockTable}, false),
                    buttonTableClear = this._createElem('button', {'class': this.options.buttonTableClear}, $.mage.__(this.options.blockTableCleatText)),
                    thead = this._createElem('thead', {}, false),
                    caption = this._createElem('caption', {}, $.mage.__(this.options.titleTableRating)),
                    tbody = this._createElem('tbody', {}, false),
                    trHead = this._createElem('tr', {}, false),

                    tableHead = this.options.tableThead,
                    bestPlayers = this._clearArrExcess();

                for (var i = 0; i < tableHead.length; i++) {
                    var th = this._createElem('th', {}, $.mage.__(tableHead[i]));
                    trHead.appendChild(th);
                }

                table.appendChild(caption);
                thead.appendChild(trHead);
                table.appendChild(thead);

                var playerPlace;

                for (var key in bestPlayers) {
                    for (var key2 in bestPlayers[key]) {
                        playerPlace = +key2 + 1;
                        var tr = this._createElem('tr', {'class': `place${playerPlace}`}, false),
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

                buttonTableClear.addEventListener('click', this._clearTable.bind(this));
            },

            _clearArrExcess: function () {
                var multiArr = this._rewriteArr();
                for (var key in multiArr) {
                    if (multiArr[key].length > 3) {
                        multiArr[key].splice(3, multiArr[key].length);
                    }
                }
                return multiArr;
            },

            _rewriteArr: function () {
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

            _sortTable: function () {
                var localstorageRatingData = this._getSavedData();
                if (localstorageRatingData) {
                    var sortLocalstorageRatingData = localstorageRatingData.sort((a, b) => a.moves < b.moves ? 1 : -1).sort((a, b) => a.level > b.level ? 1 : -1);
                    return sortLocalstorageRatingData;
                }
            },

            _clearTable: function (e) {
                e.target.parentElement.remove();
                localStorage.removeItem(this.options.gameRating);
                this.options.playerRating = [];
                this._createTable();
            },

            _getSavedData: function () {
                var ratingLocalstorage = localStorage.getItem(this.options.gameRating);
                return JSON.parse(ratingLocalstorage);
            },

            _fieldParameters: function (playingField) {
                playingField.style.width = this.options.widthPlayingFieldInitially + 'px';
                playingField.style.height = this.options.heightPlayingFieldInitially + 'px';
            },

            _mixCart: function (arr) {
                arr = arr.sort(function () {
                    return Math.random() - 0.5;
                });
                return arr;
            },

            _createElem: function (elem, attribute, text) {
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

