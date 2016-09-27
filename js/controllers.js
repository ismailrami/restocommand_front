angular.module('myApp')
 .controller('LoginController',function($scope,$sanitize,$location,Authenticate,Flash,$http)
 {
    $scope.init=function()
    {
        if (sessionStorage.authenticated)
        {
            $location.path('/home') 
        }
        $scope.login = function()
        {
            Authenticate.save({
                    'email': $sanitize($scope.email),
                    'password': $sanitize($scope.password)
            },function(response) 
            {
                $location.path('/home')
                Flash.clear()    
                Flash.show(response.flash)                
                sessionStorage.authenticated = true;
                sessionStorage.csrf=response.token;
                $http.defaults.headers.common['Accept'] = sessionStorage.csrf;
            },function(response)
            {
                    Flash.show(response.email)
                    
            })
        } 
    }      
})
 .controller('RemindController',function(APIURL,$scope,$rootScope,$sanitize,$location,Authenticate,Flash,$http)
 {
    $scope.reset=function()
    {
        $rootScope.email=$scope.email;
        var data = {email: $scope.email};
                
        $http.post(APIURL+"password/remind",data).success(function(data, status) 
        {
            $location.path('/login')
        })         
    }
 })
 .controller('ResetController',function(APIURL,$scope,$rootScope,$sanitize,$location,Authenticate,Flash,$http,$routeParams)
 {

    $scope.reset=function()
    {
        var data = {
                    'email': $sanitize($rootScope.email),
                    'password': $sanitize($scope.password),
                    'password_confirmation': $sanitize($scope.password),
                    'token': $sanitize($routeParams.id)
                };
                
        $http.post(APIURL+"password/reset",data).success(function(data, status) 
        {
            $location.path('/login')
        })         
    }
 })
.controller('LoginRestaurateurController',function($scope,$sanitize,$location,Authenticate,Flash,$http)
 {
    $scope.init=function()
    {
        if (sessionStorage.authenticated)
        {
            $location.path('/plan') 
        }
        $scope.login = function()
        {
            Authenticate.save({
                    'email': $sanitize($scope.email),
                    'password': $sanitize($scope.password)
            },function(response) 
            {
                $location.path('/plan')
                Flash.clear()    
                Flash.show(response.flash)                
                sessionStorage.authenticated = true;
                sessionStorage.csrf=response.token;
                $http.defaults.headers.common['Accept'] = sessionStorage.csrf;
            },function(response)
            {
                    
            })
        } 
    }      
})
.controller('HomeController',function($rootScope,$scope,$location,Authenticate,Flash,Restorer)
{
    $scope.hideModal = function()
    {
        $scope.modalShown = false;
    }
    $scope.yes = function()
    {
        $scope.modalShown = false;
        Restorer.remove({ id:$scope.restaurant.id},function(response) 
            {
                $scope.onSample();
                Flash.clear()    
            },function(response)
            {
                
            });
    }
    $scope.supprimer = function(x)
    { 
        $scope.restaurant=x;
        $scope.modalShown = true;   
    } 
    // pagination
    $scope.curPage = 0;
    $scope.pageSize = 5;
    $scope.onSample = function()
    {
        Restorer.get({},function(response)
        {
            $scope.restorers = response.restorers
        })
    };

    $scope.numberOfPages = function() 
    {
        return Math.ceil($scope.restorers.length / $scope.pageSize);
    };

    $scope.init=function()
    {    

        $scope.modalShown = false;
        $rootScope.init();
        Restorer.get({},function(response)
        {
            $scope.restorers = response.restorers
        })
    }
    $scope.filterFunction = function(element) {
    return element.name.match(/^Ma/) ? true : false;
  };
})
.controller('AddRestorerController',function($scope,$sanitize,$location,Flash,Restorer)
{
    $scope.restorer = new Restorer(); 
    $scope.restorer.passwordComfirmed="";
    $scope.restorer.password="";
    $scope.add = function()
    {
        if($scope.restorer.generateMdp)
        {
            $scope.restorer.password="123456789";
        }
        
        $scope.submitted=true;
        if ($scope.addRestorerForm.$valid) 
        {
            $scope.restorer.$save({},
                function(response) 
                {
                    $location.path('/home')
                    Flash.clear() 
                    $scope.submitted=false;                
                },
                function(response)
                {
                    //Flash.show(response.data[0].email)
                    if(response.data[0].email)
                    {
                        $scope.addRestorerForm.email.$error.required=true;
                    }
                    if(response.data[0].login)
                    {
                        $scope.addRestorerForm.login.$error.required=true;
                    }
                })
        }
    }
})
.controller('UpdateRestorerController',function($scope,$sanitize,$location,$routeParams,Flash,Restorer)
{
    $scope.restorer = new Restorer();
    //window.onresize = console.log("iElement[0].offsetWidth");
    $scope.init=function()
    {
        Restorer.get({ id: $routeParams.id },function(response)
        {
            $scope.restorer = response
        })
    }
    $scope.update = function()
    {
        $scope.submitted=true;
        if ($scope.updateRestorerForm.$valid) 
        {
           $scope.restorer.$update({ id: $routeParams.id},
                function(response) 
                {
                    $location.path('/home')
                    Flash.clear() 
                    $scope.submitted=false;                
                },
                function(response)
                {
                    Flash.show(response.data)
                })
       }
    } 
})
.controller('PlanController',function(SHAPE,$scope,$sanitize,$location,$rootScope,$routeParams,Flash,Areas,Table,Tables,$window)
{
    var w = angular.element($window);
    w.bind('resize', function () {
        $scope.drawTable();
    });
    var shape = {id:0,x: 0, y:0, h: 0, w: 0,fill:'',type:''};
    $rootScope.isSelected=false;
    $rootScope.selection=shape;
    $scope.sel=$rootScope.selection;
    $scope.shapes=SHAPE;
    $rootScope.menuInit=function()
    {
        $rootScope.selectedPlan=true;
    }
    $scope.init=function()
    {  
       // $scope.selectedPlan=true;
        $scope.vide=false;
        $scope.image='assets/img/carre.png';
        $scope.table.shape=$scope.shapes['rectangular'];
        $scope.canvaswhidth="600";
        $scope.show = false;
        $rootScope.selection=null;
        $rootScope.init();
        $rootScope.modalShownArea = false;
        $rootScope.modalShown = false;
        Areas.get({},function(response)
        {
            $scope.areas = response.areas;
            if($scope.areas.length==0)
            {
                $scope.vide=true;
            }
        })
    }
    $scope.hideModal = function()
    {
        $scope.modalShownArea = false;
        $scope.modalShown = false;
    }
    $scope.openModalShownArea=function()
    {
        $scope.modalShownArea = true;
    }
    $scope.drawn=function()
    {
        $scope.modalShown = true;
    }
    $scope.table = new Tables();
    $scope.add=function()
    {
            $scope.submittedTable=true;
            $scope.modalShown = false;
            
            $scope.table.area=$scope.area;
            $scope.table.coordinate_x=10;
            $scope.table.coordinate_y=10;
            console.log($scope.table.shape);
            $scope.table.$save({},
            function(response) 
            {
                $scope.modalShown = false;
                $scope.drawTable();
                console.log(response.url);
                // var file = new Blob([ response.data ], {
                        //type : 'application/png'
                   // });
                    //trick to download store a file having its URL

                    var fileURL = response.url;
                    console.log(fileURL);
                    var a         = document.createElement('a');
                    a.href        = fileURL; 
                    a.target      = '_blank';
                    a.download    = 'yourfilename.png';
                    document.body.appendChild(a);
                    a.click();




                Flash.clear()                 
            },
            function(response)
            {
                Flash.show("")
            })
    }
    $scope.areaAdd=new Areas();
    $scope.addArea=function()
    {
        $scope.submitted=true;
            $scope.areaAdd.$save({},
            function(response) 
            {
                $scope.modalShownArea = false;
                $scope.init();
                Flash.clear()                 
            },
            function(response)
            {
                Flash.show("")
            })
    }
    $scope.change=function()
    {
        if($scope.table.shape==$scope.shapes['rectangular'])
        {
            $scope.image='assets/img/carre.png';    
        }
        else
        {
            $scope.image='assets/img/oval.png'; 
        }
        
    }
    $scope.getTable=function()
    {
        Table.get({ id: $scope.area},function(response)
        {
            $scope.tables = response.tables
        })
    }
    $scope.remove=function()
    {
        Tables.remove({ id:$rootScope.table.id},function(response) 
            {
                $scope.$broadcast('remove');
                Flash.clear();    
            },function(response)
            {
               // alert('response.data.email')
            });
    }
    $scope.drawTable=function()
    {
        $scope.$broadcast('init');
        Table.get({ id: $scope.area},function(response)
        {
            $scope.tables = response.tables;
        })
    }
    $scope.zoomOut=function()
    {
        $scope.$broadcast('zoomOut');
    }
    $scope.zoomIn=function()
    {
        $scope.$broadcast('zoomIn');
    }
    $scope.$watch('tables', function(newValue, oldValue) {
        if($scope.tables!=null)
        {
            for(var i=0 ;i<$scope.tables.length;i++)
            {
                $scope.$broadcast('change',$scope.tables[i].id,$scope.tables[i].width,$scope.tables[i].height,$scope.tables[i].coordinate_x,$scope.tables[i].coordinate_y,$scope.tables[i].shape);
            }
        }
    });
    $rootScope.$watch('selection',function(newValue, oldValue) {
        if( $rootScope.selection!=null && $rootScope.selection.id!=0)
        {
            console.log($rootScope.dragx);
            $scope.table=new Tables();
            $scope.table.coordinate_x = $rootScope.selection.x;
            $scope.table.coordinate_y = $rootScope.selection.y;

            $scope.table.$update({ id: $rootScope.selection.id},
                function(response) 
                {
                    Flash.clear()                 
                },
                function(response)
                {
                    Flash.show()
                })
        }
    });
})







.controller('CategoriesController',function(APIURL,$timeout,$q,COLOR,$http,$rootScope,$scope,$location,$routeParams,Authenticate,Flash,Categorie,Categoriech)
{
    $scope.submitted=false;
    $scope.color = COLOR;
    $scope.load = function()
    {
        var cats = [];
        Categorie.get({ id: $routeParams.id },function(response)
        {
            $scope.categori = response;

            if($scope.categori.is_displayed==1)
            {
                $scope.categori.is_displayed=true;
            }
            else
            {
                $scope.categori.is_displayed=false;
            }
                            
        })

        $http.get(APIURL+"tree").success(
                function(data){
                    $scope.rep = data;
            })   
    }

    $scope.hideModal = function()
    {
        $scope.modalShown = false;
    }
    $scope.yes = function(x)
    {
       
        Categorie.remove({id : $scope.id , attached : x},function(response)
        {
            $scope.modalShown = false;
            $scope.onSample();
        })  
    }

    $scope.supprimer = function(x)
    { 
        $scope.modalShown = true;  
        $scope.id = x.id;
        $scope.catName = x.name;
    } 
    // pagination
    $scope.curPage = 0;
    $scope.pageSize = 5;
    $scope.onSample = function()
    {
        Categorie.get({},function(response)
        {
            var i=0;
            $scope.categories = response.categories
        })
    };

    
    $scope.getChildren=function(id)
    {
        var cats = [];
        $http.get(APIURL+"childrencat/"+id).success(
            function(data){
                for ( var i=0 ;i<data.catchild.length;i++)
                {
                    data.catchild[i].name="-"+data.catchild[i].name;
                    cats.push(data.catchild[i]);
                }
                console.log('catchild'+cats.length);
                //$scope.getcat(cats,0);
            })
        return cats;
    }
    $scope.getcat=function(cat,i,k,deferred)
    {  
        
        if(!deferred)
        {
            deferred = $q.defer();
        }
        var niv='';
        var cats=[];
        var x=false;
        var promise=deferred.promise;
            if(cat.length>i)
            {
                $scope.tabTri.push(cat[i]);
                $http.get(APIURL+"childrencat/"+cat[i].id).success(
                function(data){
                        for ( var d=0 ;d<data.catchild.length;d++)
                        {
                            for(j=0;j<k;j++)
                            {
                                niv=niv+'-';
                            }
                            data.catchild[d].name=niv+data.catchild[d].name;
                            cats.push(data.catchild[d]);
                        }
                        promise=$scope.getcat(cats,0,k+1,deferred);
                        deferred.resolve();
                        promise.then(function()
                        {
                            console.log("then"+i);
                            cat.splice(0,1);
                            promise=$scope.getcat(cat,i,k,deferred);
                        });
                        x=true;
                        return deferred.promise;
                });
            }
            else 
            {
                return deferred.promise;
            }
          //  $timeout();
    }
    $scope.init=function()
    {    
        $scope.modalShown = false;
        $rootScope.init();
        Categorie.get({},function(response)
        {
            var i=0;
            $scope.categories = response.categories
            angular.forEach($scope.categories,function(cat) 
            {
                console.log("onSample");
                if(cat.is_displayed==0)
                {
                    $scope.categories[i].is_displayed="non";
                }
                else
                {
                    $scope.categories[i].is_displayed="oui";
                }
                i++;
            });
        })
        var cats = [];
        $scope.vide=false;
        $scope.tabTri=[];
        $http.get(APIURL+"tree").success(
                function(data){
                    $scope.tabTri = data;
            })   
        

        var subcat_id = $routeParams.id;
        $http.get(APIURL+"childrencat/"+subcat_id).success(
                function(data){
                    var i=0;
                    $scope.subCat = data.catchild;
                    angular.forEach($scope.subCat,function(cat) 
                    {
                        if(cat.is_displayed==0)
                        {
                            $scope.subCat[i].is_displayed="non";
                        }
                        else
                        {
                            $scope.subCat[i].is_displayed="oui";
                        }
                        i++;
                        });
                    if($scope.subCat.length==0)
                    {
                        $scope.vide=true;
                    }
                })   
        
        
        $http.get(APIURL+"breadcrumb/"+subcat_id).success(
                function(data){
                    console.log("breadcrumb");
                    $scope.breadcrumb=data.catparent;
                })           
    }
    $scope.numberOfPages = function() 
    {
        if($scope.categories)
        return Math.ceil($scope.categories.length / $scope.pageSize);
        return 0;
    };
    $scope.filterFunction = function(element) 
    {
    return element.name.match(/^Ma/) ? true : false;
    }

    $scope.cat = new Categorie();
    $scope.addCategorie = function()
    {
        $scope.submitted=true;
        if ($scope.addCategorieForm.$valid) 
        {
            if($scope.cat.is_displayed)
            {

                $scope.cat.is_displayed =1;
            }
            else
            {
                $scope.cat.is_displayed =0;
            }
           // alert($scope.cat.is_displayed)
            $scope.cat.$save({},
                function(response) 
                {
                    $location.path('/allCategorie')
                    Flash.clear() 
                    $scope.submitted=false;                
                },
                function(response)
                {
                    Flash.show()
                })
        }
    }

    $scope.updateCategorie = function()
    {
        $scope.cat.name = $scope.categori.name;
        $scope.cat.color = $scope.categori.color;
        $scope.cat.position = $scope.categori.position;
        $scope.cat.category_id = $scope.categori.category_id;
        $scope.cat.is_displayed = $scope.categori.is_displayed;
        $scope.submitted=true;
        if ($scope.updateCategoryForm.$valid) 
        {
            $scope.cat.$update({ id: $routeParams.id},
                function(response) 
                {
                    $location.path('/allCategorie')
                    Flash.clear()  
                    $scope.submitted=false;               
                },
                function(response)
                {
                    Flash.show()
                })
        }
    }


})

.controller('ProductController',function(APIURL,$http,prodUpload,fileReader,COLOR,$scope,$location,$rootScope,$routeParams,Authenticate,Flash,Products,Options,Tvas,Categorie,Product)
{
    $scope.curPage = 0;
    $scope.pageSize = 5;
    $rootScope.index=0;
    $scope.optTab = [];
    $scope.color = COLOR;
    $scope.optionDeleted = [];



    $scope.init = function()
    {
        
        Options.get({},function(response)
        {
                $rootScope.optionTab = response.option;

                      
        }) 
        $http.get(APIURL+"tree").success(
                function(data){
                    $scope.categoryTab = data;
        })   
        Tvas.get({},function(response)
        {
            $scope.tvaTab = response.tvas;
        })

        Products.get({},function(response)
        {
            var i=0;
            $scope.products = response.products;
            angular.forEach($scope.products,function(pro) 
                    {
                        if(pro.is_displayed==0)
                        {
                            $scope.products[i].is_displayed="non";
                        }
                        else
                        {
                            $scope.products[i].is_displayed="oui";
                        }
                        i++;
                        });

        })
        Product.get({id : $routeParams.id },function(response)
        {
            $scope.updateProduct = response;
            if($scope.updateProduct.is_displayed==1)
            {
                $scope.updateProduct.is_displayed=true;
            }
            else
            {
                $scope.updateProduct.is_displayed=false;
            }
            $scope.options=$scope.updateProduct.options;
            $scope.pictures = $scope.updateProduct.pictures;

        })

    }
    $scope.files=[];
    $scope.filess=[];
    $scope.deleteValue = function  (index) {
        $scope.files.splice(index, 1);
        $scope.filess.splice(index, 1);
    };
    $scope.indexDeleted = [];
    $scope.deleteIndex = function(index , id)
    {
        $scope.pictures.splice(index, 1);
        $scope.indexDeleted.push(id);
    }
    $scope.deleteOption=function(index,id)
    {
        $scope.options.splice(index,1);
        $scope.optionDeleted.push(id);
    }
    $scope.deleteOptionUpdate=function(index)
    {

        $scope.optTab.splice(index,1);
    }

    $scope.valuesSortable = {
    containment : "parent",
    cursor : "move",
    tolerance : "pointer"
    };
    $scope.numberOfPages = function() 
    {
        if($scope.products)
        {
            return Math.ceil($scope.products.length / $scope.pageSize);
        }
        return 0;
    };
    $scope.addfield = function()
    {
        $rootScope.index++;
        $scope.optTab.push(null);
        console.log($rootScope.index);
    }
    $scope.product = new Products();
    $scope.addProduct = function()
    {
        $scope.submitted=true;
        if ($scope.addProductForm.$valid) 
        {
             if($scope.product.is_displayed)
            {
                $scope.product.is_displayed=1;
            }
            else
            {
                $scope.product.is_displayed=0;
            }
            $scope.product.options = $scope.optTab;
            $scope.product.file=$scope.filess;
            //console.log($scope.product.file[1]);
            prodUpload.uploadFile($scope.product);
            $scope.submitted=false;
            $location.path("/allProducts");
            /*$scope.product.$save({},function(){
                $location.path("/allProducts");
            })*/
        }
    }
    $scope.p = new Product()
    $scope.update = function()
    {
        $scope.p.name = $scope.updateProduct.name
        $scope.p.short_name = $scope.updateProduct.short_name
        $scope.p.description = $scope.updateProduct.description
        $scope.p.category = $scope.updateProduct.category
        $scope.p.color = $scope.updateProduct.color
        $scope.p.price = $scope.updateProduct.price
        $scope.p.tva = $scope.updateProduct.tva
        $scope.p.position = $scope.updateProduct.position
        $scope.p.is_displayed = $scope.updateProduct.is_displayed
        
        $scope.p.options = $scope.optTab
        $scope.p.file=$scope.filess
        $scope.p.optionDeleted = $scope.optionDeleted
        $scope.p.indexDeleted = $scope.indexDeleted
        $scope.submitted=true;
        if ($scope.updateProductForm.$valid) 
        {
            $scope.p.$update({id:$routeParams.id},function(){
                $location.path("/allProducts")
                $scope.submitted=false;
            })
        }

    }
    
    $scope.getFile = function () {
        $scope.progress = 0;

        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                        $scope.imageSrc = result;
                        $scope.files.push($scope.imageSrc);
                        $scope.filess.push($scope.file);
                      });
    };
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });




    $scope.uploadFile = function(){
        $scope.file = $scope.myFile;
        console.log('file is ' + JSON.stringify($scope.file));
        var uploadUrl = "/fileUpload";
        
    };

    $scope.changePrice=function()
    {
        var tva;
            if($scope.product.tva)
            {
                Tvas.get({id:$scope.product.tva},function(response)
                {
                    tva= response.tvas[0].value;
                    $scope.priceTTc=$scope.product.price+($scope.product.price*tva/100);
                })
            }
            else
            {
                $scope.priceTTc=$scope.product.price;
            }
    };
    $scope.changeTtc=function()
    {
        var tva;
            if($scope.product.tva)
            {
                Tvas.get({id:$scope.product.tva},function(response)
                {
                    tva= response.tvas[0].value;
                    var cof=100/(tva+100);
                   $scope.product.price= $scope.priceTTc*cof;
                })
            }
            else
            {
                $scope.product.price=$scope.priceTTc;
            }
    };
    $scope.changeTva=function()
    {
        var tva;
            if($scope.product.tva)
            {
                Tvas.get({id:$scope.product.tva},function(response)
                {
                    tva= response.tvas[0].value;
                    $scope.priceTTc=$scope.product.price+($scope.product.price*tva/100);
                })
            }
            else
            {
                $scope.priceTTc=$scope.product.price;
            }
    };

    $scope.hideModal = function()
    {
        $scope.modalShown = false;
    }
    $scope.yes = function()
    {
       
        Product.remove({id : $scope.id},function(response)
        {
            $scope.modalShown = false;
            $scope.init();
        })  
    }

    $scope.supprimer = function(x)
    { 
        $scope.modalShown = true;  
        $scope.id = x.id;
        $scope.productName = x.name;
    } 

})

.controller('OptionController',function($scope,$location,$routeParams,Authenticate,Flash,Options)
{
     $scope.hideModal = function()
    {
        $scope.modalShown = false;
    }
    $scope.deleteValue = function  (index) {
        $scope.listValues.splice(index, 1);
    };
    $scope.valuesSortable = {
    containment : "parent",
    cursor : "move",
    tolerance : "pointer"
    };
    $scope.yes = function()
    {
        
        $scope.modalShown = false;
        Options.remove({ id:$scope.indice},function(response) 
            {
                $scope.init();
                Flash.clear()    
            },function(response)
            {
              //  alert('response.data.email')
            });
    }
    $scope.supprimer = function(x)
    { 
        $scope.modalShown = true;   
        $scope.optionName = x.name;
        $scope.indice =x.id;
    }

    $scope.curPage = 0;
    $scope.pageSize = 5;
     
    var tab = [];

    $scope.init = function()
    {
        var listValue ;
         $scope.data = $scope.opt.is_multiple;
        Options.get({},function(response)
        {
            var i=0;
            $scope.Options = response.option;
            angular.forEach($scope.Options,function(opt) 
                    {
                        if(opt.is_multiple==0)
                        {
                            $scope.Options[i].is_multiple="non";
                        }
                        else
                        {
                            $scope.Options[i].is_multiple="oui";
                        }
                        i++;
                        });
        })
         Options.get({id: $routeParams.id},function(response)
        {
            $scope.option = response.option
                if($scope.option.is_multiple==1)
                {
                            $scope.option.is_multiple="true";
                        }
                        else
                        {
                            $scope.option.is_multiple="false";
                        }
            listValue = $scope.option.values
            if(listValue)
            {
                tab = listValue.split(",");
                $scope.listValues = tab;
            }
        })
    }
    
    
    $scope.numberOfPages = function() 
    {
        if($scope.Options)
        {
            return Math.ceil($scope.Options.length / $scope.pageSize);
        }
        return 0;
    };


    $scope.addOptionList = function()
    {
        if($scope.val)
        {
            tab.push($scope.val);

        }
        else
        {
            //alert("champs vide !!")
        }
    $scope.val ="";
    $scope.listValues = tab;
    }

    $scope.opt = new Options();
    $scope.addOption = function()
    {
        
        $scope.opt.name = $scope.name;
        $scope.opt.values =tab;
        $scope.opt.number_min = $scope.number_min;
        $scope.opt.number_max = $scope.number_max;
        $scope.opt.is_multiple = $scope.data;
        $scope.submitted=true;
        if ($scope.addOptionForm.$valid) 
        {
            $scope.opt.$save({},
                function(response) 
                {
                    $location.path('/allOptions')
                    Flash.clear()
                    $scope.submitted=false;                 
                },
                function(response)
                {
                    Flash.show()
                })
        }
    }
    
    $scope.updateOption = function()
    {


        $scope.opt.name = $scope.option.name;
        $scope.opt.values =tab;
        $scope.opt.number_min = $scope.option.number_min;
        $scope.opt.number_max = $scope.option.number_max;
        $scope.opt.is_multiple = $scope.option.is_multiple;
        $scope.submitted=true;
            $scope.opt.$update({id : $routeParams.id},
                function(response) 
                {
                    $location.path('/allOptions')
                    Flash.clear()  
                     $scope.submitted=false;               
                },
                function(response)
                {
                    Flash.show()
                })
        }
    

})

.controller('WorkerController',function($scope,$location,$routeParams,Authenticate,Flash,Workers,Worker)
{
    $scope.curPage = 0;
    $scope.pageSize = 5;
    $scope.worker = new Workers();
    $scope.work = new Worker();
    $scope.init = function()
    {
        Workers.get({},function(response)
        {
            $scope.workers = response.worker;
        })
        Worker.get({ id : $routeParams.id },function(response)
        {
            $scope.work = response.worker;
            if($scope.work.roles)
            {
                for( var i =0;i<$scope.work.roles.length ; i++)
                {
                    $scope.work.roles[i] = $scope.work.roles[i].id;  
                }
            }
             
        })
    }
    $scope.numberOfPages = function() 
    {
        if($scope.workers)
        return Math.ceil($scope.workers.length / $scope.pageSize);
        return 0;
    };
    $scope.addWorker = function()
    {
        $scope.submitted=true;

        if ($scope.addWorkerForm.$valid) 
        {
            $scope.worker.$save({},function(response)
                {
                    $location.path("/allWorkers");
                    $scope.submitted=false;
                },function(response)
                {
                    $scope.addWorkerForm.login.$error.required=true;
                }
            )
        }
    }
    $scope.$watch('worker.password', function (newVal, oldVal) {

        if($scope.worker.password!=$scope.worker.cpassword)
        {
            $scope.addWorkerForm.cmdp.$error.match=true;
        }
        else
        {
             $scope.addWorkerForm.cmdp.$error.match=false;
        }
    })
    $scope.$watch('worker.cpassword', function (newVal, oldVal) {

        if($scope.worker.password!=$scope.worker.cpassword)
        {
            $scope.addWorkerForm.cmdp.$error.match=true;
        }
        else
        {
             $scope.addWorkerForm.cmdp.$error.match=false;
        }
    })

    $scope.$watch('worke.password', function (newVal, oldVal) {

        if($scope.worke.password!=$scope.worke.cpassword)
        {
            $scope.updateWorkerForm.cmdp.$error.match=true;
        }
        else
        {
             $scope.updateWorkerForm.cmdp.$error.match=false;
        }
    })
    $scope.$watch('worke.cpassword', function (newVal, oldVal) {

        if($scope.worke.password!=$scope.worke.cpassword)
        {
            $scope.updateWorkerForm.cmdp.$error.match=true;
        }
        else
        {
             $scope.updateWorkerForm.cmdp.$error.match=false;
        }
    })

    $scope.updateWorker = function()
    {
        $scope.worker = new Worker();
        $scope.worker.first_name = $scope.work.first_name;
        $scope.worker.last_name = $scope.work.last_name;
        $scope.worker.login = $scope.work.login;
        $scope.worker.password = $scope.work.password;
        $scope.worker.roles = $scope.work.roles;
        $scope.submitted=true;
        if ($scope.updateWorkerForm.$valid) 
        {
            $scope.worker.$update({id : $routeParams.id},function(response)
                {
                    $location.path("/allWorkers");
                    $scope.submitted=false;
                })
        }
    }

    $scope.hideModal = function()
    {
        $scope.modalShown = false;
    }
    $scope.yes = function()
    {
        
        $scope.modalShown = false;
        Worker.remove({ id:$scope.indice },function(response) 
            {
                $scope.init();
                Flash.clear()    
            },function(response)
            {
              //  alert('response.data.email')
            });
    }
    $scope.supprimer = function(x)
    { 
        $scope.modalShown = true;
        $scope.workerName = x.first_name+" "+x.last_name;  
        $scope.indice =x.id;
    }

})

.controller('TvaController',function($rootScope,$scope,$location,$routeParams,Authenticate,Flash,Tvas,Tva)
{
    $scope.curPage = 0;
    $scope.pageSize = 5;
    $scope.tva = new Tva();
    $scope.init = function()
    {
        $rootScope.init();
        Tvas.get({},function(response)
        {
            $scope.tvas = response.tvas;
        })
        Tva.get({id : $routeParams.id },function(response)
        {
            $scope.tva = response.tva;
        })
    }

    $scope.numberOfPages = function() 
    {
        if($scope.tvas)
        return Math.ceil($scope.tvas.length / $scope.pageSize);
    };

    $scope.addTva = function()
    {
        $scope.t = new Tva();
        $scope.t.name = $scope.tva.name;
        $scope.t.value = $scope.tva.value;
        $scope.submitted=true;
        if ($scope.addTvaForm.$valid) 
        {
            $scope.t.$save({},
                function(response)
                {
                    $location.path('/allTvas')
                    $scope.submitted=false;
                }
            )
        }
    }

    $scope.hideModal = function()
    {
        $scope.modalShown = false;
    }
    $scope.yes = function()
    {
        
        $scope.modalShown = false;
        Tva.remove({ id:$scope.indice },function(response) 
            {
                $scope.init();
                Flash.clear()    
            },function(response)
            {
               // alert('response.data.email')
            });
    }
    $scope.supprimer = function(x)
    { 
        $scope.modalShown = true;   
        
        $scope.indice =x.id;
    }
    $scope.modelTva = new Tva();
    $scope.updateTva = function()
    {
        $scope.modelTva.name = $scope.tva.name;
        $scope.modelTva.value = $scope.tva.value; 
        $scope.submitted=true;
        if ($scope.updateTvaForm.$valid) 
        {
            $scope.modelTva.$update({id : $routeParams.id},
                function(response)
                {
                    $location.path('/allTvas')
                    $scope.submitted=false;
                }
            )
        }
    }
})
.controller("MenuController",function(APIURL,$http,$rootScope,$scope,$location,$routeParams,Authenticate,Flash,Menu,Men){
    
    $scope.curPage = 0;
    $scope.pageSize = 5;

    $rootScope.menuIndex =1;
    $rootScope.menuIn =2
    $rootScope.tab=[];
    $scope.products =[];
    $rootScope.tabindex = 1;
    $rootScope.prodIndex =0;
    $scope.steps = [];
    $scope.prod =[];
    $scope.prodd=[];
    $scope.prodIdList=[];
    $scope.prr=[];
    
    $scope.menu = new Menu();
    $scope.addStep = function()
    {
        
    }

    $scope.test = function()
    {
        $scope.pp=[];
        $scope.ppId=[];
        $scope.prodd.push($scope.pp);
        $scope.prodIdList.push($scope.ppId);
        $rootScope.menuIndex++;
        $scope.products.push($scope.prod);
        $scope.prod=[];
        $rootScope.tabindex++;
        
    }
    $scope.men = new Men();
    $scope.init = function(){
        $scope.menu.$get({},function(response)
        {
            $scope.menus = response.menus;

        })
        $scope.men.$get({ id:$routeParams.id },function(response)
        {
            $scope.m = response.menus;
            //$rootScope.i

        })
        $scope.pp=[];
        $scope.prodd.push($scope.pp);
        $scope.ppId=[];
        $scope.prodIdList.push($scope.ppId);
    }
    $scope.delete=function(index,i)
    {
        $scope.prodd[i].splice(index,1);
        $scope.prodIdList[i].splice(index,1);
    }
    $scope.deleteOld=function(index,i)
    {
        $scope.m[i].step.products.splice(index,1);
    }

    $scope.numberOfPages = function() 
    {
        if($scope.menus)
        return Math.ceil($scope.menus.length / $scope.pageSize);
        return 0;
    };

    $scope.change= function(p,i){
        if(p)
        {
            if(p.id)
            {
                
                    $scope.prodSerched =[];
                    $scope.prod.push(p.id);
                    $scope.prodd[i].push(p);
                    $scope.prodIdList[i].push(p.id);
                
                
            }
            else
            {
                $http.get(APIURL+"product/search/"+p).success(function(data){
                $scope.prodSerched = data.product;
                })
            }
        }
    }
     $scope.changeOld= function(p,i){
        if(p)
        {
            if(p.id)
            {
                console.log(i);
                    console.log(p);
                    console.log($scope.m[i].step.products);
                    $scope.m[i].step.products.push(p); 
                    console.log($scope.m[i].step.products);
                    $scope.prodSerched =[]; 
                
            }
            else
            {
                $http.get(APIURL+"product/search/"+p).success(function(data){
                $scope.prodSerched = data.product;
                })
            }
        }
    }
    
    $scope.addMenu = function()
    {
        if($scope.prod.length>0){
            $scope.products.push($scope.prod);
        }   
        $scope.menu.steps = $scope.steps;
        $scope.menu.products = $scope.prodIdList;
        $scope.submitted=true;
        if ($scope.addMenuForm.$valid) 
        {
            $scope.menu.$save({},function(response){
                $location.path("/allMenus");
            })
        }
    }
    $scope.updateMenu = function()
    {
        $scope.menu.steps=[];
        $scope.menu.products =[];
        for (var i = 0; i <$scope.m.length; i++) {
            $scope.menu.steps.push($scope.m[i].step.title);
            for(var j=0;j<$scope.m[i].step.products.length; j++){
                $scope.prr.push($scope.m[i].step.products[j].id);
            }
          $scope.menu.products.push($scope.prr); 
          $scope.prr =[];
        };
        for (var i = 0; i <$scope.steps.length; i++){
            $scope.menu.steps.push($scope.steps[i]);
        }
        for (var i = 1; i <$scope.prodIdList.length; i++){
            $scope.menu.products.push($scope.prodIdList[i]);
        }
        $scope.me = new Men();
        $scope.me.name="youssef";
        $scope.me.products = $scope.menu.products;
        $scope.me.steps = $scope.menu.steps;
        $scope.me.$update({id:$routeParams.id},function(response)
        {
            $location.path("allMenus")
        })
        console.log($scope.menu.products);
        console.log($scope.menu.steps);
    }
})