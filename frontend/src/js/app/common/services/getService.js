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