angular.module('myApp')
	.directive('modalDialog', function() {
  		return {
    		restrict: 'E',
    		scope: {show: '='},
    		replace: true,
    		transclude: true, 
    		link: function(scope, element, attrs) 
    		{
      		scope.dialogStyle = {};
      		if (attrs.width)
        	 scope.dialogStyle.width = attrs.width;
      		if (attrs.height)
        	 scope.dialogStyle.height = attrs.height;
      		scope.hideModal = function()
          {
              scope.modalShownArea = false;
              scope.show = false;
          }
    		},
    		templateUrl: 'partials/modal.html'
  		};
	})
.directive('ngMatch', function($parse) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ctrl)
      {
        if (!ctrl) return;
        if (!attrs["ngMatch"]) return;
        var firstPassword = $parse(attrs["ngMatch"]);

        var validator = function (value) {
        var temp = firstPassword(scope),
        v = value === temp; 
        ctrl.$setValidity('match', v);
        return value;
        }

        ctrl.$parsers.unshift(validator);
        ctrl.$formatters.push(validator);
        attrs.$observe("ngMatch", function () 
        {
          validator(ctrl.$viewValue);
        });
      },
    };
  })

  .directive("ngFileSelect",function(){
  return {
    link: function($scope,el){
      el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      }) 
    } 
  }
})

  .directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
  })

  .directive("addbuttonsbutton", function(){
  return {
    restrict: "E",
    template: "<a href='' addbuttons ng-click='addfield()''>+ Ajouter une option complémentairea votre plat</a>"
  }
  })
  .directive("addbuttons", function($compile,$rootScope){
  return function(scope,element,attrs,rootScope){
    element.bind("click", function(rootScope){
      scope.count++;
      scope.optionTab=$rootScope.optionTab;
      
      var html="<div ng-repeat='op in optTab'><div class='row form-group' >"
            html+="<div  class='col-lg-2'>"
                html+="<label>Option</label></div>"
                  html+="<div  class='col-lg-10'>"
                    html+="<button type='button' class='close pull-right' aria-hidden='true' ng-click='deleteOptionUpdate($index)'>×</button> "
                    html+="<select class='form-control' name='string' required ng-model='optTab[$index]'>";
      for(var i=0;i<scope.optionTab.length;i++)
      {
        html+="<option value='"+scope.optionTab[i].id+"'>"+scope.optionTab[i].name+"</option>";
      }
      html+="</select> </div></div>";
      angular.element(document.getElementById('space-for-buttons')).html($compile(html)(scope));
    });
  };
  })
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
  .directive("addstepsteps", function(){
  return {
    restrict: "E",
    template: "<a href='' addstep ng-click='test()'>+ Ajouter une etape supplémentaire</a>"
  }
  })
  .directive("addstep", function($compile,$rootScope){
  return function(scope,element,attrs,rootScope){
    element.bind("click", function(rootScope){
      scope.count++;
      scope.optionTab=$rootScope.optionTab;
      var html="<div class='row form-group'><div  class='col-lg-2'><label><b>Etape "+$rootScope.menuIn++ +"</b></label></div></div><div class='row form-group'><div  class='col-lg-2'><label>Titre de l'etape</label></div><div  class='col-lg-10'>";
          html+="<input class='form-control' ng-model='steps["+$rootScope.menuIndex+"]'></div></div>";
          html+="<div class='row form-group'><div  class='col-lg-12'><ul class='list-group' ui-sortable='valuesSortable' ng-model='listValues'>";
          html+=" <li ng-repeat ='x in prodd["+$rootScope.menuIndex+"]' ><label class='todoCheckboxlabel' >{{x.short_name}}</label><button type='button' class='close pull-right' aria-hidden='true' ng-click='delete($index,"+$rootScope.menuIndex+")'>×</button></li></ul>";
          html+="</div> <div class='row form-group'><div  class='col-lg-12'><input class='form-control' type='text' ng-model='tab["+$rootScope.tabindex+"]' ng-change='change(tab["+$rootScope.tabindex+"],"+$rootScope.menuIndex+")' typeahead='t as (t.name) for t in prodSerched | filter:$viewValue' /></div></div>";
      angular.element(document.getElementById('space-for-buttons')).append($compile(html)(scope));
    });
  };
  })

.directive("updatestepsteps", function(){
  return {
    restrict: "E",
    template: "<a href='' updatestep ng-click='test()'>+ Ajouter une etape supplémentaire</a>"
  }
  })
  .directive("updatestep", function($compile,$rootScope){
  return function(scope,element,attrs,rootScope){
    element.bind("click", function(rootScope){
      scope.count++;
      scope.optionTab=$rootScope.optionTab;
      var html="<div class='row form-group'><div  class='col-lg-2'><label><b>Etape "+(scope.m.length-1 +$rootScope.menuIn++) +"</b></label></div></div><div class='row form-group'><div  class='col-lg-2'><label>Titre de l'etape</label></div><div  class='col-lg-10'>";
          html+="<input class='form-control' ng-model='steps["+($rootScope.menuIndex-1) +"]'></div></div>";
          html+="<div class='row form-group'><div  class='col-lg-12'><ul class='list-group' ui-sortable='valuesSortable' ng-model='listValues'>";
          html+=" <li ng-repeat ='x in prodd["+$rootScope.menuIndex +"]' ><label class='todoCheckboxlabel' >{{x.short_name}}</label><button type='button' class='close pull-right' aria-hidden='true' ng-click='delete($index,"+$rootScope.menuIndex+")'>×</button></li></ul>";
          html+="</div> <div class='row form-group'><div  class='col-lg-12'><input class='form-control' type='text' ng-model='tab["+(scope.m.length-1+$rootScope.tabindex)+"]' ng-change='change(tab["+(scope.m.length-1+$rootScope.tabindex)+"],"+$rootScope.menuIndex+")' typeahead='t as (t.name) for t in prodSerched | filter:$viewValue' /></div></div>";
      angular.element(document.getElementById('space-for-buttons')).append($compile(html)(scope));
    });
  };
  })


  .directive('ngCanvas', function($rootScope,SHAPE) {
      return {
        restrict: 'EA',
        scope: true, 
        controller: function($scope,$rootScope) {
            $scope.$on('init', function (event,data) {
              $rootScope.isSelected=false;
              $scope.shapes= [];
              $scope.valid = false;
            });
            $scope.$on('zoomOut', function (event,data) { 
               if($scope.mesure>10)
               {
                $scope.mesure=$scope.mesure-10;
                $scope.valid = false;
               }
            });
            $scope.$on('zoomIn', function (event,data) {
              $scope.mesure=$scope.mesure+10;
              $scope.valid = false;
            });
            $scope.$on('remove', function (event,data) {
              $scope.removeShape($scope.selection);
              $rootScope.isSelected=false;
              $scope.selection=null;
            });
            $scope.$on('change', function (event,id,lX, lY, cX, cY,type,data) {
              $scope.addShape(id,cX,cY,lX,lY,'#797979',type);
            });

        },
        link: function(scope, iElement) {
        scope.mesure=20;
        $rootScope.dragx=0;
        $rootScope.dragy=0;
        $rootScope.isSelected=false;
        scope.constShape = SHAPE; 
        scope.shapes = [];
        scope.valid = false;
        scope.selection = null;

        var ctx = iElement[0].getContext('2d');
        var width = iElement[0].offsetWidth;
        var height = iElement[0].height;
        var selectionColor = '#000000';
        var selectionWidth = 2;  
        var interval = 10;
        var firstClickY=0;
        var firstClickX=0;
        scope.initCan= function(ctx) 
        {
          for (var x = 0; x <width ; x += scope.mesure) 
          {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
          }
          for (var y = 0; y <height ; y += scope.mesure) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
          }
          ctx.strokeStyle = "#ddd";
          ctx.stroke();
        }

        var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
        if (document.defaultView && document.defaultView.getComputedStyle) 
        {
          var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(iElement[0], null)['paddingLeft'], 10)      || 0;
          var stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(iElement[0], null)['paddingTop'], 10)       || 0;
          var styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(iElement[0], null)['borderLeftWidth'], 10)  || 0;
          var styleBorderTop   = parseInt(document.defaultView.getComputedStyle(iElement[0], null)['borderTopWidth'], 10)   || 0;
        }
        var html = document.body.parentNode;
        var htmlTop = html.offsetTop;
        var htmlLeft = html.offsetLeft;
        var dragging = false;
        var dragoffx = 0;
        var dragoffy = 0;
        selectedSel =null;

        iElement[0].addEventListener('mousedown', function(e) {
          var mouse = scope.getMouse(e);
          var mx = mouse.x;
          var my = mouse.y;
          firstClickX=mouse.x;
          firstClickY=mouse.y;
          var shapes =scope.shapes;
          var mySel;
          var l = shapes.length;
          for (var i = l-1; i >= 0; i--) 
          {
            if (scope.contains(shapes[i],mx,my)) 
            {
              mySel = shapes[i];
              if(selectedSel!=i && selectedSel!=null)
              {
                scope.shapes[selectedSel].fill='#797979';
              }
              selectedSel=i;
              scope.shapes[i].fill=selectionColor;
              dragoffx = mx - (mySel.x*scope.mesure);
              dragoffy = my - (mySel.y*scope.mesure);
              dragging = true;
              $rootScope.$apply(function(){
                $rootScope.isSelected=true;
                $rootScope.table=mySel;
              })
              scope.selection = mySel;
              scope.valid = false;
            return;
            } 
            scope.draggingcanvas=true;
            $rootScope.$apply(function(){
                $rootScope.selection=null;
            })
            if(i==0 && selectedSel!=null )
            { 
              scope.shapes[selectedSel].fill='#797979';
              selectedSel=null;
              $rootScope.$apply(function(){
                $rootScope.isSelected=false;
                $rootScope.table=null;
              })
              scope.valid = false;
            }
          }
          
          if(scope.selection) 
          {
            scope.selection = null;
            scope.valid = false;
          }
        }, true);

        iElement[0].addEventListener('mousemove', function(e) {
          if (dragging)
          {
            var mouse = scope.getMouse(e);
            scope.selection.x = (mouse.x - dragoffx)/scope.mesure;
            scope.selection.y = (mouse.y - dragoffy)/scope.mesure;   
            scope.valid = false;
          }
          else
          {
              if(scope.draggingcanvas)
              {
                var mouse = scope.getMouse(e);
                if(mouse.x-firstClickX<0)
                {
                  $rootScope.dragx=$rootScope.dragx-2;
                }
                else
                {
                  if(mouse.x-firstClickX>0)
                  {
                    $rootScope.dragx=$rootScope.dragx+2;
                  }
                }
                if(mouse.y-firstClickY<0)
                {
                  $rootScope.dragy=$rootScope.dragy-2;
                }
                else
                {
                  if(mouse.y-firstClickY>0)
                  {
                    $rootScope.dragy=$rootScope.dragy+2;
                  }
                }
                scope.valid = false;
              }
          }
        }, true);

        iElement[0].addEventListener('mouseup', function(e) {
          if(scope.selection!=null)
          {
            
            $rootScope.$apply(function(){
                $rootScope.selection=scope.selection;
                $rootScope.x=scope.selection.x;
              })
          }
          dragging = false; 
          scope.draggingcanvas=false;
        }, true);

        scope.initCan(ctx);
        setInterval(function() { scope.Canvasdraw(); }, scope.interval);
        
         scope.clear = function() 
        {
          ctx.clearRect(0, 0, width, height);
          scope.initCan(ctx);
          console.log('clear');
        }

        scope.Canvasdraw = function()
        { 
           width = iElement[0].offsetWidth;
           height = iElement[0].height;
          if (!scope.valid) 
          {
            var shapes = scope.shapes;
            scope.clear();
            var l = shapes.length;
            for (var i = 0; i < l; i++) 
            {
              var shape = shapes[i];
              //if (shape.x > width || shape.y > height || shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
              scope.drawShape(shapes[i]);
            }
            scope.valid = true;
          }
        }

        scope.addShape = function(id,x,y,h,w,fill,type) 
        {
          var shape = {id:id,x: x, y:y, h: h, w: w,fill:fill,type:type};
          scope.shapes.push(shape);
          scope.drawShape(shape);
          scope.valid=false;
        }
        scope.drawShape = function(shape) 
        {
          console.log(scope.constShape['rectangular']);
          console.log(shape.type);
          if(shape.type == scope.constShape['rectangular'])
          {

            ctx.beginPath();
            ctx.fillStyle =shape.fill;
            ctx.fillRect(shape.x*scope.mesure+$rootScope.dragx,shape.y*scope.mesure+$rootScope.dragy,shape.w*scope.mesure,shape.h*scope.mesure);
            ctx.strokeStyle = "#ddd";
            ctx.stroke();  
            ctx.closePath();
          }
          else
          {

            var centerx=(shape.x*scope.mesure+$rootScope.dragx) + (shape.h*scope.mesure)/2;
            var centery=(shape.y*scope.mesure+$rootScope.dragy) + (shape.w*scope.mesure)/2;
            ctx.beginPath();
            ctx.fillStyle =shape.fill;
            ctx.moveTo(centerx, centery - (shape.h*scope.mesure)/2);  
            ctx.bezierCurveTo(
            centerx + (shape.w*scope.mesure)/2, centery - (shape.h*scope.mesure)/2, 
            centerx + (shape.w*scope.mesure)/2, centery + (shape.h*scope.mesure)/2,
            centerx, centery + (shape.h*scope.mesure)/2);
            ctx.bezierCurveTo(
                centerx - (shape.w*scope.mesure)/2, centery + (shape.h*scope.mesure)/2,
                centerx - (shape.w*scope.mesure)/2, centery - (shape.h*scope.mesure)/2, 
                centerx, centery - (shape.h*scope.mesure)/2); 
            ctx.fill();
            ctx.closePath();
            ctx.strokeStyle = "#ddd";
            ctx.stroke();   
          }
          
        }
        scope.contains = function(shape,mx, my) 
        {
          var newmesure=Math.round(scope.mesure/(800/width));
          $rootScope.dragxx=Math.round($rootScope.dragx/(800/width));

          return  ((shape.x*newmesure+$rootScope.dragxx) <= mx) 
               && ((shape.x*newmesure+$rootScope.dragxx) + (shape.w*newmesure) >= mx) 
               && ((shape.y*newmesure+$rootScope.dragy) <= my) 
               && ((shape.y*newmesure+$rootScope.dragy) + (shape.h*newmesure) >= my);
          //return  ((shape.x*scope.mesure+$rootScope.dragx) <= mx) && ((shape.x*scope.mesure+$rootScope.dragx) + (shape.w*scope.mesure) >= mx) && ((shape.y*scope.mesure+$rootScope.dragy) <= my) && ((shape.y*scope.mesure+$rootScope.dragy) + (shape.h*scope.mesure) >= my);
        } 

        scope.removeShape = function(shape) 
        {  
          scope.shapes.splice(scope.shapes.indexOf(shape),1); 
          selectedSel =null;
          scope.valid = false;
        }

        scope.getMouse = function(e) 
        {
          var element = iElement[0], offsetX = 0, offsetY = 0, mx, my;
          if (element.offsetParent !== undefined) 
          {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
          }
          offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
          offsetY += stylePaddingTop + styleBorderTop +htmlTop;
          mx = e.pageX - offsetX;
          my = e.pageY - offsetY;
          return {x: mx, y: my};
        }
        },
      };
  });




angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item, comparator) {
    arr = angular.isArray(arr) ? arr : [];
      if(!contains(arr, item, comparator)) {
          arr.push(item);
      }
    return arr;
  }  

  // remove
  function remove(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);

    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;
    var checklistChange = $parse(attrs.checklistChange);

    // value added to list
    var value = $parse(attrs.checklistValue)(scope.$parent);


  var comparator = angular.equals;

  if (attrs.hasOwnProperty('checklistComparator')){
    comparator = $parse(attrs.checklistComparator)(scope.$parent);
  }

    // watch UI checked change
    scope.$watch('checked', function(newValue, oldValue) {
      if (newValue === oldValue) { 
        return;
      } 
      var current = getter(scope.$parent);
      if (newValue === true) {
        setter(scope.$parent, add(current, value, comparator));
      } else {
        setter(scope.$parent, remove(current, value, comparator));
      }

      if (checklistChange) {
        checklistChange(scope);
      }
    });
    
    // declare one function to be used for both $watch functions
    function setChecked(newArr, oldArr) {
        scope.checked = contains(newArr, value, comparator);
    }

    // watch original model change
    // use the faster $watchCollection method if it's available
    if (angular.isFunction(scope.$parent.$watchCollection)) {
        scope.$parent.$watchCollection(attrs.checklistModel, setChecked);
    } else {
        scope.$parent.$watch(attrs.checklistModel, setChecked, true);
    }
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if (tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') {
        throw 'checklist-model should be applied to `input[type="checkbox"]`.';
      }

      if (!tAttrs.checklistValue) {
        throw 'You should provide `checklist-value`.';
      }

      // exclude recursion
      tElement.removeAttr('checklist-model');
      
      // local scope var storing individual checkbox model
      tElement.attr('ng-model', 'checked');

      return postLinkFn;
    }
  };
}]);
