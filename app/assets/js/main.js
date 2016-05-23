// save a reference to the core implementation
var indexOfValue = _.indexOf;

// using .mixin allows both wrapped and unwrapped calls:
// _(array).indexOf(...) and _.indexOf(array, ...)
_.mixin({

    // return the index of the first array element passing a test
    indexOf: function(array, test) {
        // delegate to standard indexOf if the test isn't a function
        if (!_.isFunction(test)) return indexOfValue(array, test);
        // otherwise, look for the index
        for (var x = 0; x < array.length; x++) {
            if (test(array[x])) return x;
        }
        // not found, return fail value
        return -1;
    }

});
// Global site module

angular.module('forecast', ['ngRoute']); 


angular.module('forecast')

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
angular.module('forecast')

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
angular.module('forecast')

    .controller('5dayWeatherCtrl', ['$scope', function ($scope) {
        
        console.log('testing')

    }]);

angular.module('forecast')

	.controller('SampleCtrl', function($scope) {
		$scope.selectedData = null;
		$scope.datas = [
			{"_id":2643743,name:"London","country":"GB","coord":{"lon":-0.12574,"lat":51.50853}},
			{"_id":6455259,name:"Paris","country":"FR","coord":{"lon":2.35236,"lat":48.856461}},
			{"_id":2993458,name:"Monaco","country":"MC","coord":{"lon":7.41667,"lat":43.73333}},
			{"_id":2960313,name:"Grand Duchy of Luxembourg","country":"LU","coord":{"lon":6.16667,"lat":49.75}},
			{"_id":3186886,name:"Zagreb","country":"HR","coord":{"lon":15.97798,"lat":45.814442}},
			{"_id":4192205,name:"Dublin","country":"US","coord":{"lon":-82.903748,"lat":32.54044}},
			{"_id":6458783,name:"Geneva","country":"CH","coord":{"lon":6.12737,"lat":46.208038}},
			{"_id":2761369,name:"Vienna","country":"AT","coord":{"lon":16.37208,"lat":48.208488}},
			{"_id":2267057,name:"Lisbon","country":"PT","coord":{"lon":-9.13333,"lat":38.716671}},
			{"_id":8133876,name:"Dimos Athens","country":"GR","coord":{"lon":23.73604,"lat":37.98888}},
			{"_id":756135,name:"Warsaw","country":"PL","coord":{"lon":21.01178,"lat":52.229771}},
			{"_id":3128832,name:"Barajas de Madrid","country":"ES","coord":{"lon":-3.57777,"lat":40.47366}},
			{"_id":745044,name:"Istanbul","country":"TR","coord":{"lon":28.949659,"lat":41.01384}},
			{"_id":2950159,name:"Berlin","country":"DE","coord":{"lon":13.41053,"lat":52.524368}},
			{"_id":2673722,name:"Stockholms Län","country":"SE","coord":{"lon":18,"lat":59.5}},	
			{"_id":4219762,name:"Rome","country":"US","coord":{"lon":-85.164673,"lat":34.257038}},		
			{"_id":2800865,name:"Arrondissement Brussel","country":"BE","coord":{"lon":4.35,"lat":50.849998}},
			{"_id":2759794,name:"Amsterdam","country":"NL","coord":{"lon":4.88969,"lat":52.374031}}



		];

		$scope.onSelect = function(selection) {
			console.log(selection["_id"]);
			$scope.selectedData = selection;
		};

		$scope.clearInput = function() {
			$scope.$broadcast('simple-autocomplete:clearInput');
		};
	})
'use strict';

angular.module('forecast')
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
/*

    Handle Form field loading

*/

angular.module('forecast')

    .directive('formFieldAutocomplete', function () {

        return {
            restrict: 'E',
            templateUrl: SaaS.location+'/docroot/assets/partials/form-field-autocomplete-tpl.html',
            replace: true,
            require: '^form',
            scope: {

                fieldPath:      '@',
                fieldDesc:      '@', 
                formType:       '@',
                fieldName:      '@',
                fieldTitle:     '@',
                fieldValue:     '@',
                fieldRequired:  '@',
                fieldMaxLength: '@',
                fieldMinLength: '@',
                fieldMax:       '@',
                fieldPattern:   '@', 
                fieldExpiry:    '@',            
                fieldMin:       '@',
                fieldDisabled:  '@',
                match:          '@',
                activator:      '@',
                inputFields:    '=',
                inputRange:     '='
            },
            controller: function($scope) {

                $scope.hasError = false;

                $scope.init = function (value) {

                    this.$parent.inputFields = value;
                    this.inputFields = value;                    

                }

                $scope.$watch('inputRange', function() {
                    if ( typeof $scope.inputRange === 'object' && $scope.inputRange != null ) {
                        //$scope.arrEmployeeId = [];

                        /*for (i = 0; i <= $scope.inputRange.length - 1; i++){
                            //$scope.arrEmployeeId.push( $scope.inputRange[i].employeeId );
                            $scope.arrEmployeeId.push( "{'employeeId:'" + $scope.inputRange[i].employeeId +"','employeeName':'" + $scope.inputRange[i].employeeName +"'}"); 
                        }*/

                        $scope.arrEmployeeId = $scope.inputRange;

                    }
                });

                $scope.onSelect = function ($item, $model, $label) {
                    $scope.hasError = false;
                };
                

            },
            compile: function(tElement, attrs) {

                // Build template based on whether field is required
                // and/or whether field matching validation should occur

                var $label = $(tElement.children()).find('label');
                var $input = $(tElement.children()).find('input');
              
                // Check for field matches
                if (attrs.match) {

                    //add these two line for password match and required field

                     $input.attr('required', 'required');
                     $label.html($label.html() + ' *');


                    // add directive and field name to match
                    $input.attr('field-match', attrs.match);

                    // add error message
                    $(tElement).find('p').html('<span aria-hidden="true" class="icon-Warningation"></span>{{fieldTitle}} field doesn\'t match');
                }
                else if (attrs.fieldRequired && (attrs.fieldRequired === 'required' || attrs.fieldRequired === 'true')) {
                    // Update required fields

                    // update label with *
                    $label.html($label.html() + ' *');

                    // add 'required' to input
                    $input.attr('required', 'required');
                     

                } 

                if (attrs.fieldMaxLength) {

                    //add max-length
                    $input.attr('maxlength', attrs.fieldMaxLength);
                }

                if (attrs.fieldMinLength) {

                    //add max-length
                    $input.attr('minlength', attrs.fieldMinLength);
                }

                 if (attrs.fieldMax) {

                    //add max-length
                    $input.attr('max', attrs.fieldMax);
                }

                if (attrs.fieldMin) {

                    //add max-length
                    $input.attr('min', attrs.fieldMin);
                }

                if (attrs.fieldPattern) {

                    //add max-length
                    $input.attr('ng-pattern', attrs.fieldPattern);
                }

                if (attrs.fieldExpiry) {

                    var currentDate = new Date();
                    var currentMonth = currentDate.getMonth() + 2;
                    var currentYear = currentDate.getFullYear();
                    var regex = currentMonth.toString() + '-' + currentYear;
                    if(currentMonth < 10 ) {
                        regex = '0' + currentMonth + '-' + currentYear;
                    }
                
                    $input.attr('ng-pattern', '/^(' + regex + ')|(((0[1-9])|(1[0-2]))\-((2015)|(2020)|(2021)|(2022)|(2023)|(20[1-2][5-9])))$/');
                }

                if (attrs.fieldDisabled) {

                    //add max-length
                    $input.attr('disabled', attrs.fieldDisabled);
                }

                if (attrs.activator) {

                    //override model
                    $input.attr('field-activator', attrs.activator);
                }

                return function (scope, element, attrs, formController) {

                    var _scope = scope;

                    // Don't do standard validation if a 'match' field
                    if (scope.match) {
                        return false;
                    }

                    // Trigger error check on change/leave of form input
                    $(element).on('blur keyup', '.form-control', function (e) {

                        
                        if (!$(e.currentTarget).hasClass('ng-pristine') && $(e.currentTarget).hasClass('ng-invalid')) {

                            // Error
                            _scope.$apply(function () {
                                _scope.hasError = true;
                            });

                        }
                        else if($(e.currentTarget).hasClass('ng-pristine') && !$(e.currentTarget).val() && $(e.currentTarget).attr('required') == 'required'){
                            
                            // Error for required pristine field
                            _scope.$apply(function () {
                                _scope.hasError = true;
                            });
                            
                        }
                        else {

                            // No error
                            _scope.$apply(function () {
                                _scope.hasError = false;
                            });

                        }

        	        });

	        }
	    }
	    }

    });

angular.module('forecast')
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



//# sourceMappingURL=main.js.map