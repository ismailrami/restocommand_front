angular.module('myApp')
.filter('pagination', function()
{
 return function(input, start)
 {
  start = +start;
  if(input)
  {
  	return input.slice(start);
  }
  return "";
 };
})

.filter('reverse', function()
{
 return function(items)
 {
  if(items)
  {
  	return items.slice().reverse();
  }
  return "";
 };
});