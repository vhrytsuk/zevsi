define([
        'jquery',
        'BaseAutoSound_Catalog/js/owl.carousel',
    ],
    function ($) {
        'use strict';

        return function (config, element) {
                $(element).owlCarousel({
                    margin: 22,
                    nav: true,
                    items: 5,
                    responsive: {
                        0: {
                            items: 1,
                        },
                        480: {
                            items: 2,
                        },
                        768: {
                            items: 3,
                        },
                        1024: {
                            items: 4,
                        },
                        1200: {
                            items: 5,
                        },
                    }
                });
        }
    });
