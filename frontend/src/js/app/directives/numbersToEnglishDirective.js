angular.module('main-app')
	.filter('toEnglish', function() {
	  return function(input) {
	  	
	  	var englishStr = ''
	  	var convert = function(s) {

	  		if (typeof s === "undefined") {
			    return null;
			}

	  		var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
		 	var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
			var tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
			var hundreds = ['', 'thousand'];

		    s = s.toString();
		    s = s.replace(/[\, ]/g, '');
		    if (s != parseFloat(s)) {
		    	return 'Please enter a valid number';
		    } 

		    var x = s.indexOf('.');
		    if (x == -1) {
		    	x = s.length;
		    }

		    var n = s.split('');
		    var str = '';
		    var sk = 0;
		    console.log(n);

		    for (var i = 0; i < x; i++) {
		        if ((x - i) % 3 == 2) {
		            if (n[i] == '1') {
		                str += teens[Number(n[i + 1])] + ' ';
		                i++;
		                sk = 1;
		            } else if (n[i] != 0) {
		                str += tens[n[i] - 2] + ' ';
		                sk = 1;
		            }
		        } else if (n[i] != 0) {
		            str += dg[n[i]] + ' ';
		            if ((x - i) % 3 == 0) str += 'hundred and ';
		            sk = 1;
		        }
		        if ((x - i) % 3 == 1) {
		            if (sk) str += hundreds[(x - i - 1) / 3] + ' ';
		            sk = 0;
		        }
		    }
		   
		    return str.replace(/\s+/g, ' '); 
		}
		
		return convert(input);
				 
	  };
	});