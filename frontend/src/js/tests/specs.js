describe('Filters', function(){ //describe your object type
    beforeEach(module('main-app')); //load module
   
    describe('toEnglish',function(){ //describe your app name
    
        var toEnglish;    
        beforeEach(inject(function($filter){ //initialize your filter
            toEnglish = $filter('toEnglish',{});
        }));
        
        it('Should convert numbers to gramatically correct english', function(){  //write tests
            expect(toEnglish('823')).toBe('eight hundred and twenty three '); //pass
            expect(toEnglish('12')).toBe('twelve '); //pass
            expect(toEnglish('1000')).toBe('one thousand '); //pass
            expect(toEnglish('22')).toBe('twenty two '); //pass
            expect(toEnglish('6')).toBe('six '); //pass
            //expect(reverse('45')).toBe('four five '); // this test should fail
        }); 
    
    });

    
});