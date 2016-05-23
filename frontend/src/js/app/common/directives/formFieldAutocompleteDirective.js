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
