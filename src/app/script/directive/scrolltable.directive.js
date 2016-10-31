(function () {
    'use strict';
    angular.module('app').directive('scrolltable', scrolltable);

    function scrolltable() {
       return {
        restrict: 'A',
        link: function (scope, ele, attrs) {
            var headerSn = document.getElementById(attrs.horzelem);
            var nextTable = document.getElementById(attrs.nexttable);
            ele.bind('scroll', function () {
                headerSn.scrollLeft = ele[0].scrollLeft;
                nextTable.scrollTop = ele[0].scrollTop;
            });

        }
    };
    }
})();