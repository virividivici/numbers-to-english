// Global site module

angular.module('main-app', ['ngRoute']); 


angular.module('main-app')

    .factory('getService', function($http) {

        function getData(ajaxURL) {

            return $http({
                    url: ajaxURL,
                    method: "GET",
                })
                .then(function(response) {
                        var returnData = {
                            data: response.data
                        }
                        // success
                        return returnData;
                    },
                    function(response) { // optional
                        // failed
                        return response;
                    }
                );
        }

        return {
            getData: getData
        }

    });
angular.module('main-app')

    .factory('postService', function($http) {

        // Factory to allow posting data to the server and capturing the response

        function postData(ajaxURL, postData, options) {

            var opts = angular.extend({
                token: '',
                header: ''
            }, options);
              // console.log('token',options.token,'header' ,options.header);
            var headers = {};
            headers[opts.header] = opts.token;
            var postData = postData;

            return $http({
                    url: ajaxURL,
                    method: "POST",
                    data: postData,
                    headers: headers
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .then(function(response) {

                        var returnData = {
                            postData: response.config.data,
                            data: response.data
                        }

                        // success
                        return returnData;
                    },
                    function(response) { // optional
                        // failed

                        return response;
                    }
                );
        }

        return {
            postData: postData
        }

    });
angular.module('main-app')

    .controller('5dayWeatherCtrl', ['$scope', function ($scope) {
        
        console.log('testing')

    }]);


'use strict';

angular.module('main-app')
    .directive('autocomplete', ['autocomplete-keys', '$window', '$timeout', function(Keys, $window, $timeout) {
        return {
            template: '<input type="text" class="autocomplete-input" placeholder="{{placeHolder}}"' +
                            'ng-class="inputClass"' +
                            'ng-model="searchTerm"' +
                            'ng-keydown="keyDown($event)"' +
                            'ng-blur="onBlur()" />' +

                        '<div class="autocomplete-options-container">' +
                            '<div class="autocomplete-options-dropdown" ng-if="showOptions">' +
                                '<div class="autocomplete-option" ng-if="!hasMatches">' +
                                    '<span>No matches</span>' +
                                '</div>' +

                                '<ul class="autocomplete-options-list">' +
                                    '<li class="autocomplete-option" ng-class="{selected: isOptionSelected(option)}" ' +
                                        'ng-style="{width: optionWidth}"' +
                                        'ng-repeat="option in matchingOptions"' +
                                        'ng-mouseenter="onOptionHover(option)"' +
                                        'ng-mousedown="selectOption(option)"' +
                                        'ng-if="!noMatches">' +
                                        '<span>{{option[displayProperty]}}</span>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>',
            restrict: 'E',
            scope: {
                options: '=',
                onSelect: '=',
                displayProperty: '@',
                inputClass: '@',
                clearInput: '@',
                placeHolder: '@'
            },
            controller: function($scope){
                $scope.searchTerm = '';
                $scope.highlightedOption = null;
                $scope.showOptions = false;
                $scope.matchingOptions = [];
                $scope.hasMatches = false;
                $scope.selectedOption = null;

                $scope.isOptionSelected = function(option) {
                    return option === $scope.highlightedOption;
                };

                $scope.processSearchTerm = function(term) {
                    // console.log('ch-ch-ch-changin');
                    if (term.length > 0) {
                        if ($scope.selectedOption) {
                            if (term != $scope.selectedOption[$scope.displayProperty]) {
                                $scope.selectedOption = null;
                            } else {
                                $scope.closeAndClear();
                                return;
                            }
                        }

                        var matchingOptions = $scope.findMatchingOptions(term);
                        $scope.matchingOptions = matchingOptions;
                        if (!$scope.matchingOptions.indexOf($scope.highlightedOption) != -1) {
                            $scope.clearHighlight();
                        }
                        $scope.hasMatches = matchingOptions.length > 0;
                        $scope.showOptions = true;
                    } else {
                        $scope.closeAndClear();
                    }
                };

                $scope.findMatchingOptions = function(term) {
                    return $scope.options.filter(function(option) {
                        var searchProperty = option[$scope.displayProperty];
                        if (searchProperty) {
                            var lowerCaseOption = searchProperty.toLowerCase();
                            var lowerCaseTerm = term.toLowerCase();
                            return lowerCaseOption.indexOf(lowerCaseTerm) != -1;
                        }
                        return false;
                    });
                };

                $scope.findExactMatchingOptions = function(term) {
                    return $scope.options.filter(function(option) {
                        var lowerCaseOption = option[$scope.displayProperty].toLowerCase();
                        var lowerCaseTerm = term.toLowerCase();
                        return lowerCaseOption == lowerCaseTerm;
                    });
                };

                $scope.keyDown = function(e) {
                    switch(e.which) {
                        case Keys.upArrow:
                            e.preventDefault();
                            if ($scope.showOptions) {
                                $scope.highlightPrevious();
                            }
                            break;
                        case Keys.downArrow:
                            e.preventDefault();
                            if ($scope.showOptions) {
                                $scope.highlightNext();
                            } else {
                                $scope.showOptions = true;
                                if ($scope.selectedOption) {
                                    $scope.highlightedOption = $scope.selectedOption;
                                }
                            }
                            break;
                        case Keys.enter:
                            e.preventDefault();
                            if ($scope.highlightedOption) {
                                $scope.selectOption($scope.highlightedOption);
                            } else {
                                var exactMatches = $scope.findExactMatchingOptions($scope.searchTerm);
                                if (exactMatches[0]) {
                                    $scope.selectOption(exactMatches[0]);
                                }
                            }
                            break;
                        case Keys.escape:
                            $scope.closeAndClear();
                            break;
                    }
                };
                
                $scope.$watch('searchTerm', function(term){
                    $scope.processSearchTerm(term);
                });

                $scope.highlightNext = function() {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[0];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var nextIndex = currentIndex + 1 == $scope.matchingOptions.length ? 0 : currentIndex + 1;
                        $scope.highlightedOption = $scope.matchingOptions[nextIndex];
                    }
                };

                $scope.highlightPrevious = function() {
                    if (!$scope.highlightedOption) {
                        $scope.highlightedOption = $scope.matchingOptions[$scope.matchingOptions.length - 1];
                    } else {
                        var currentIndex = $scope.currentOptionIndex();
                        var previousIndex = currentIndex == 0 ? $scope.matchingOptions.length - 1 : currentIndex - 1;
                        $scope.highlightedOption = $scope.matchingOptions[previousIndex];
                    }
                };

                $scope.onOptionHover = function(option) {
                    $scope.highlightedOption = option;
                };

                $scope.$on('simple-autocomplete:clearInput', function() {
                    $scope.searchTerm = '';
                });

                $scope.clearHighlight = function() {
                    $scope.highlightedOption = null;
                };

                $scope.closeAndClear = function() {
                    $scope.showOptions = false;
                    $scope.clearHighlight();
                };

                $scope.selectOption = function(option) {
                    // console.log('selected the option');
                    $scope.selectedOption = option;
                    $scope.onSelect(option);

                    if ($scope.clearInput != 'False' && $scope.clearInput != 'false') {
                        $scope.searchTerm = '';
                    } else {
                        $scope.searchTerm = option[$scope.displayProperty];
                    }

                    $scope.closeAndClear();
                };

                $scope.onBlur = function() {
                    $scope.closeAndClear();
                };

                $scope.currentOptionIndex = function() {
                    return $scope.matchingOptions.indexOf($scope.highlightedOption);
                };
            },
            link: function(scope, elem, attrs) {
                scope.optionWidth = '400px';
                var inputElement = elem.children('.autocomplete-input')[0];

                scope.setOptionWidth = function() {
                    // console.log(inputElement.offsetWidth);
                    $timeout(function() {
                        var pixelWidth = inputElement.offsetWidth > 400 ? 400 : inputElement.offsetWidth - 2;
                        scope.optionWidth = pixelWidth + 'px';
                    });
                };

                angular.element(document).ready(function() {
                    scope.setOptionWidth();
                });

                angular.element($window).bind('resize', function() {
                    scope.setOptionWidth();
                });
            }
        };
    }])

    .factory('autocomplete-keys', function() {
        return {
            upArrow: 38,
            downArrow: 40,
            enter: 13,
            escape: 27
        };
    });
angular.module('main-app')
	.filter('toEnglish', function() {
	  return function(input) {
	  	
	  	var englishStr = ''
	  	var convert = function(s) {
	  		if (typeof s === "undefined") {
			    return null;
			}
	  		var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
		 	var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
			var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
			var th = ['', 'thousand', 'million'];
		    s = s.toString();
		    s = s.replace(/[\, ]/g, '');
		    if (s != parseFloat(s)) return 'not a number';
		    var x = s.indexOf('.');
		    if (x == -1) x = s.length;
		    if (x > 15) return 'too big';
		    var n = s.split('');
		    var str = '';
		    var sk = 0;
		    console.log()
		    for (var i = 0; i < x; i++) {
		        if ((x - i) % 3 == 2) {
		            if (n[i] == '1') {
		                str += tn[Number(n[i + 1])] + ' ';
		                i++;
		                sk = 1;
		            } else if (n[i] != 0) {
		                str += tw[n[i] - 2] + ' ';
		                sk = 1;
		            }
		        } else if (n[i] != 0) {
		            str += dg[n[i]] + ' ';
		            if ((x - i) % 3 == 0) str += 'hundred ';
		            sk = 1;
		        }
		        if ((x - i) % 3 == 1) {
		            if (sk) str += th[(x - i - 1) / 3] + ' ';
		            sk = 0;
		        }
		    }
		    if (x != s.length) {
		        var y = s.length;
		        str += 'point ';
		        for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
		    }
		    return str.replace(/\s+/g, ' ');
		}
		
		return convert(input);
				 
	  };
	});

function toWords(s) {
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}
'use strict';


