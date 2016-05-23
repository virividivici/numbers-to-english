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