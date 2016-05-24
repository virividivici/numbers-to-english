angular.module('main-app')
	.filter('toEnglish', function() {
	  return function(input) {
	  	
	  	var englishStr = ''
	  	var convert = function(s) {

	  		if (typeof s === "undefined") {
			    return null;
			}

	  		var digits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
		 	var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
			var tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
			var hundreds = ['', 'thousand'];

		    s = s.toString();
		    s = s.replace(/[\, ]/g, '');
		    if (s != parseFloat(s)) {
		    	return 'Please enter a valid number';
		    } 

		    var length = s.indexOf('.');
		    if (length == -1) {
		    	length = s.length;
		    }

		    var num = s.split('');
		    var str = '';
		    var holder = 0;
		    console.log(num);

		    for (var i = 0; i < length; i++) {
		        if ((length - i) % 3 == 2) {
		            if (num[i] == '1') {
		                str += teens[Number(num[i + 1])] + ' ';
		                i++;
		                holder = 1;
		            } else if (num[i] != 0) {
		                str += tens[num[i] - 2] + ' ';
		                holder = 1;
		            }
		        } else if (num[i] != 0) {
		            str += digits[num[i]] + ' ';
		            if ((length - i) % 3 == 0) str += 'hundred and ';
		            holder = 1;
		        }
		        if ((length - i) % 3 == 1) {
		            if (holder) str += hundreds[(length - i - 1) / 3] + ' ';
		            holder = 0;
		        }
		    }
		   
		    return str.replace(/\s+/g, ' '); 
		}
		
		return convert(input);
				 
	  };
	});