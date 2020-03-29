define([
        'jquery',
        'BaseAutoSound_Catalog/js/readmore',
    ],
    function ($) {
        'use strict';

        return function (config, element) {
            $('.readmore-article').readmore({
                speed: 250,
                maxHeight: 200,
                heightMargin: 16,
                moreLink: '<a href="#">Read More</a>',
                lessLink: '<a href="#">Close</a>',
            })
        }
    });
