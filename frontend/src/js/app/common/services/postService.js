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