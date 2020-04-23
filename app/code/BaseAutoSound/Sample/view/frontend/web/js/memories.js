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
                numberCells : [1,1,2,2,3,3,4,4,5,5,6,6],
                numberMoves : 0,
                victory: 0,
                buttonTextActiveGame: 'Почати гру',
                buttonActiveGame: 'buttonActiveGame',
                blockNumberVictory: 'numberVictory',
                blockCountVictory: 'blockCount',
                frontFaceCart : 'front-face',
                backFaceCart : 'back-face',
                flipCartClass: 'flip',
                checkOpen : false,
                hasFlippedCard : false,
                firstCard : null,
                secondCard: null
            },

            _create: function () {
                // this._createGame();
                this._startGame();
                this._flipCart();
            },

            _startGame : function(){
                var buttonActiveGame = this._createElem('button',{'class': this.options.buttonActiveGame},this.options.buttonTextActiveGame);
                this.options.wrap.appendChild(buttonActiveGame);
                buttonActiveGame.addEventListener('click', goGame)
            },

            _flipCart: function(){
                var activeMemoryCart = document.querySelectorAll('.memory-cart');   //при кліку на картки вони повертаються і прирівнюються
                activeMemoryCart.forEach(card => card.addEventListener('click', activeCartFlip.bind(this)));

                function activeCartFlip(e) {
                    var countVictoryBlock = document.querySelector('.blockCount');

                    if (this.options.checkOpen) return;

                    var target = e.target.parentElement;

                    if (target === this.options.firstCard) return;

                    target.classList.add('flip');

                    if (!this.options.hasFlippedCard){
                        this.options.hasFlippedCard = true;         //якщо ні одна картка не перевернута true
                        this.options.firstCard = target;
                    }
                    else {
                        this.options.secondCard = target;
                        this.options.hasFlippedCard = false;
                        countVictoryBlock.textContent = this.options.numberMoves;
                        this._checkForMatch();
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
                    this._disableCards();
                }
                else {
                    this.options.numberMoves++;
                    this._unflipCards();
                }

            },

            _gameVictory : function(){                //функція створює блок виграшу коли всі картки відкриті
                var gameVictotyBlock = this._createElem('div',{'class': this.options.gameVictoryBlock},false),
                    gameVictotyBlockText = this._createElem('p',false,`Вітаємо ти пройшов за ${this.options.victory} ходів`);
                gameVictotyBlock.appendChild(gameVictotyBlockText);
                this.options.wrap.appendChild(gameVictotyBlock);
            },

            _disableCards : function() {          //заборонено натискати кілька разів на активовану картку
                this.options.firstCard.removeEventListener('click', this._flipCart.activeCartFlip);
                this.options.secondCard.removeEventListener('click', this._flipCart.activeCartFlip);
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

            _createGame : function(){      //створення гри
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
                this.options.wrap.appendChild(blockNumberVictory)
            },

            _createElem: function(elem, attribute, text) {
                if (!elem) return false;
                elem = document.createElement(elem);
                if (attribute) {
                    for (var key in attribute) {
                        elem.setAttribute(key, attribute[key])
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
