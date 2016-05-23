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