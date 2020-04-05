define([
        'jquery',
        'mage/translate',
    ],
    function ($) {
        'use strict';

        return function () {

            var priceElement = $('.price');

            for (var i=0; i < priceElement.length; i++){
                var text =  priceElement[i].textContent,
                indexSum =  text.length - 3,
                priceProduct = priceElement[i].textContent.slice(0, indexSum),
                currencyProduct = priceElement[i].textContent.substring(text.length, indexSum);

                if (currencyProduct !== 'грн') return;

                $(priceElement[i]).replaceWith("<span class='price'>" + priceProduct + "<span class='currency-product'>" + currencyProduct + "</span></span>");
            }
        }();
    }
);
