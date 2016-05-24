angular.module('main-app', [])
.filter('reverse',[function(){
    return function(string){
        return string.split('').reverse().join('');
    }
}])