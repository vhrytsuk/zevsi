define([
        'jquery',
        'mage/translate',
        'BaseAutoSound_Catalog/js/readmore',
    ],
    function ($) {
        'use strict';

        return function (config, element) {
            $(element).readmore({
                speed: 250,
                maxHeight: config.maxHeight,
                heightMargin: 16,
                moreLink: '<a href="#" class="show-text">'+ config.text +'</a>',
                lessLink: '<a href="#" class="hide-text">Сховать</a>',
            })

        }
    }
);
