define([
        'jquery',
        'mage/translate'
    ],
    function ($) {
        'use strict';


        $.widget('memories.customerJs', {
            options: {
                wrap : document.querySelector('.memories'),
                memoryCart : 'memory-cart',
                gameVictoryBlock: 'gameVictory',
                numberCells : [1,1,2,2],
                numberMoves : 0,
                victory: 0,
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
                completeGame: 'completeGame',
                textButtonCompleteGame: 'Завершити гру',
                textButtonNextLevel : 'Наступний рівень',
                blockButton: 'blockButtonOptions',
                checkOpen : false,
                hasFlippedCard : false,
                firstCard : null,
                secondCard: null
            },

            _create: function () {
                this._startGame();
            },

            _startGame : function(){  //по натисканню кнопки починається гра зявляється поле для вводу
                var buttonActiveGame = this._createElem('button',{'class': this.options.buttonActiveGame},this.options.buttonTextActiveGame),
                     blockNamePlayers = this._createElem('div',{'class': this.options.blockNamePlayers},false),
                     nameInput = this._createElem('input',{'class': this.options.namePlayers,'type': 'text','id': this.options.namePlayers},false),
                    titleInputName = this._createElem('label',{'class': this.options.titleInputName,'for': this.options.namePlayers},'Введіть ваше імя');

                    blockNamePlayers.appendChild(titleInputName);
                    blockNamePlayers.appendChild(nameInput);
                    blockNamePlayers.appendChild(buttonActiveGame);

                    this.options.wrap.appendChild(blockNamePlayers);
                    buttonActiveGame.addEventListener('click', this._goGame.bind(this));
            },

            _goGame : function(e){
                var valueInputName =  e.target.parentNode.querySelector(`.${this.options.namePlayers}`).value;

                if (valueInputName < 3) return;           //якщо введене імя менше 3 символів гра не починається
                else {
                    this._pushName(valueInputName);
                    e.target.parentElement.style.display = 'none';
                    this._createGame();
                    this._flipCart();
                }
            },

            _pushName : function(valueInputName){     //додаємо імя в масив
                this.options.players.push(valueInputName);
            },

            _flipCart: function(){
                var activeMemoryCart = document.querySelectorAll('.memory-cart');   //при кліку на картки вони повертаються і прирівнюються
                activeMemoryCart.forEach(card => card.addEventListener('click', this._activeCartFlip.bind(this)));
            },

            _activeCartFlip : function(e) {          //функція логічного перевертання карток
                var countVictoryBlock = document.querySelector('.blockCount');

                if (this.options.checkOpen) return;

                var target = e.target.parentElement;

                if (target === this.options.firstCard) return;

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
                if (this.options.firstCard.dataset.element === this.options.secondCard.dataset.element){
                    this.options.numberMoves++;
                    this.options.victory +=2;
                    if (this.options.victory === this.options.numberCells.length){
                        this._gameVictory();
                    }
                }
                else {
                    this.options.numberMoves++;
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
                    playerWon = this.options.players[this.options.players.length - 1],
                    gameVictotyBlockText = this._createElem('p',false,`Вітаємо ${playerWon} ти пройшов за ${this.options.numberMoves} ходів`),
                    buttonNextLevel = this._createElem('button',{'class': this.options.nextLevel},this.options.textButtonNextLevel),
                    buttonCompleteGame  = this._createElem('button',{'class': this.options.completeGame},this.options.textButtonCompleteGame),
                    blockButton = this._createElem('div',{'class': this.options.blockButton},false);

                blockButton.appendChild(buttonCompleteGame);
                blockButton.appendChild(buttonNextLevel);

                gameVictotyBlock.appendChild(gameVictotyBlockText);
                gameVictotyBlock.appendChild(blockButton);
                this.options.wrap.appendChild(gameVictotyBlock);

                buttonNextLevel.addEventListener('click', this._nextLevel.bind(this));
                buttonCompleteGame.addEventListener('click', this._resetGame.bind(this));
            },

            _resetGame : function(){ //закінчення гри
                var blockNamePlayers = document.querySelector('.blockNamePlayers'),
                    numberVictory = document.querySelector('.numberVictory'),
                    namePlayers = document.querySelector('.namePlayers');

                blockNamePlayers.style.display = 'flex';
                this.options.checkVictory = false;
                namePlayers.value = null;
                this.options.numberMoves = 0;
                this.options.numberCells = [1,1,2,2];
                numberVictory.remove();
                this._refreshGame();

            },

            _nextLevel : function(){          //при натискані кнопки включається наступний рівень
                var arr = this.options.numberCells;

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
                this._refreshGame();
                this._createGame();
                this._flipCart();
            },

            _refreshGame : function(){               //при активації наступного рівня картки видаляються і створюються по новому
                var cart = document.querySelectorAll('.memory-cart'),
                    gameVictoryBlock = document.querySelector('.gameVictory');

                this.options.victory = 0;
                gameVictoryBlock.remove();

                cart.forEach(cart =>{
                   cart.remove();
                });
            },

            _createGame : function(){      //створення поля гри
                var arr = this.options.numberCells,
                    blockNumberVictory = this._createElem('div',{'class': this.options.blockNumberVictory},'Кількість ходів'),
                    countVictory = this._createElem('span',{'class': this.options.blockCountVictory},`${this.options.victory}`);

                blockNumberVictory.appendChild(countVictory);

                arr = arr.sort(function () {
                    return Math.random() - 0.5;
                });

                for (var i=0; i<arr.length; i++){
                    var blockCart = this._createElem('div',{'class': this.options.memoryCart,'data-element': `${arr[i]}`},false),
                        frontFace = this._createElem('div',{'class': this.options.frontFaceCart},`${arr[i]}`),
                        backFace = this._createElem('div',{'class': this.options.backFaceCart},false);

                    this.options.wrap.appendChild(blockCart);
                    blockCart.appendChild(frontFace);
                    blockCart.appendChild(backFace);
                }
                if (!this.options.checkVictory){
                    this.options.wrap.appendChild(blockNumberVictory);
                    this.options.checkVictory = true;
                }

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
