angular.module('yahooServices', ['ngResource']).
	factory('YQL', ['$resource', '$http',
		function($resource, $http) {
            return $resource('https://query.yahooapis.com/v1/public/yql',
            {
            	callback:'JSON_CALLBACK',
            	format: 'json'
            },
            {
				get: {
					method: 'JSONP'
				}
			});
		}
    ]);