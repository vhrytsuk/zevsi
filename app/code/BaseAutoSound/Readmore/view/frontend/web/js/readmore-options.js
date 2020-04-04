define([
        'jquery',
        'mage/translate',
        'BaseAutoSound_Readmore/js/readmore',
    ],
    function ($) {
        'use strict';

        return function (config, element) {
            $(element).readmore({
                speed: 250,
                maxHeight: config.maxHeight,
                heightMargin: 16,
                moreLink: '<a href="#" class="show-text">'+ config.textShow +'</a>',
                lessLink: '<a href="#" class="hide-text">'+ config.textHide +'</a>',
            })

        }
    }
);
