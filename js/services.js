angular.module('myApp')
    .factory('Authenticate', function($resource,APIURL){
        return $resource(APIURL+"authenticate")
    })
   
    .factory('Restorers', function($resource,APIURL){
        return $resource(APIURL+"restorer")
    })
        .factory('Areas', function($resource,APIURL){
        return $resource(APIURL+"area")
    })
    

    .factory("Restorer", function($resource,APIURL){
        return $resource(APIURL+"restorer/:id",{id: "@id" },
        {
            "update": {method: "PUT"},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })
   .factory("Table", function($resource,APIURL){
        return $resource(APIURL+"area/:id",{id: "@id" },
        {
            "update": {method: "PUT"},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })   
    .factory("Tables", function($resource,APIURL){
        return $resource(APIURL+"table/:id",{id: "@id" },
        {
            "update": {method: "PUT"},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })
    
    
    .factory('Categories', function($resource,APIURL){
        return $resource(APIURL+"category")
    })
    .factory("Categorie", function($resource,APIURL){
        return $resource(APIURL+"category/:id",{id: "@id" },
        {
            "update": {method: "PUT",header:{'Content-Type' : 'application/json'}},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })
    
    .factory("Categoriech", function($resource,APIURL){
        return $resource(APIURL+"childrencat/:id",{id: "@id" },
        {
            "update": {method: "PUT"},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })



    .factory('Products', function($resource,APIURL){
        return $resource(APIURL+"product")
    })
    .factory("Product", function($resource,APIURL){
        return $resource(APIURL+"product/:id",{id: "@id" },
        {
            "update": {method: "PUT"},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })


    .factory('Option', function($resource,APIURL){
        return $resource(APIURL+"option")
    })
    .factory("Options", function($resource,APIURL){
        return $resource(APIURL+"option/:id",{id: "@id" },
        {
            "update": {method: 'PUT'},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })

    .factory('Flash', function($rootScope){
        return {
            show: function(message){
                $rootScope.flash = message
            },
            clear: function(){
                $rootScope.flash = ""
            }
        }
    })

    .factory('Workers', function($resource,APIURL){
        return $resource(APIURL+"worker")
    })
    .factory("Worker", function($resource,APIURL){
        return $resource(APIURL+"worker/:id",{id: "@id" },
        {
            "update": {method: "PUT"},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })

    .factory('Tvas', function($resource,APIURL){
        return $resource(APIURL+"tva")
    })
    .factory("Tva", function($resource,APIURL){
        return $resource(APIURL+"tva/:id",{id: "@id" },
        {
            "update": {method: "PUT"},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })

    .factory('Menu', function($resource,APIURL){
        return $resource(APIURL+"menu")
    })
    .factory("Men", function($resource,APIURL){
        return $resource(APIURL+"menu/:id",{id: "@id" },
        {
            "update": {method: "PUT"},
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        });
    })
    .factory('Step', function($resource,APIURL){
        return $resource(APIURL+"step")
    })
    .service('prodUpload',['$http',function($http,APIURL)
    {
        var fd = new FormData();
        this.pars=function(data)
        {
            angular.forEach(data, function(value, key)
            {
                if(key=='file')
                {
                     
                    angular.forEach(data.file, function(value, key)
                    {
                        fd.append('file[]', value);
                    });   
                }
                else
                {
                    if(key=="options"){
                        angular.forEach(data.options, function(value, key)
                        {
                         fd.append('options[]', value);
                        });
                    }
                    else
                    {
                        if(key=="optionDeleted")
                        {
                           angular.forEach(data.optionDeleted, function(value, key)
                            {
                             fd.append('optionDeleted[]', value);
                            }); 
                        }
                        else
                        {
                           if(key=="indexDeleted"){
                             angular.forEach(data.indexDeleted, function(value, key)
                            {
                             fd.append('indexDeleted[]', value);
                            });
                           }
                           else
                           {
                            if(key=="roles")
                            {
                                angular.forEach(data.roles, function(value, key)
                                {
                                 fd.append('roles[]', value);
                                });
                            }
                            else{
                                fd.append(key, value);
                            }
                            }
                        }
                    }
                    
                }
            });
            return fd;
        }



        this.uploadFile=function(data)
        {

            if (data === undefined)
            return data;
            this.pars(data);
            $http.post("http://192.168.0.121/restocommand-api2/public/service/"+"product",fd,{
                transformRequest: angular.identity,
                headers:{'Content-Type':undefined}
            })
            .success(function(){
                
            })
            .error(function(){
                
            });
        }
    }]);