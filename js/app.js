angular.module("myApp",['ngResource','ngSanitize','checklist-model','ui.bootstrap','ui.sortable'])
    .constant("COLOR",{
        "Rouge" : "Rouge",
        "Vert" : "Vert",
        "Bleu" : "Bleu",
        "Blanc" : "Blanc",
        "Noir" : "Noir",
        "Jaune" : "Jaune",
        "Oranger" : "Oranger",
        "Violet" :"Violet"
    })
    .constant('SHAPE',{
        "rectangular":"Rectangulaire",
        "oval":"Ovale"
    })
    .constant('APIURL', "http://192.168.0.121/restocommand-api2/public/service/")
    //.constant('APIURL', "http://restocommand-api.web.anypli.com/service/")
    .config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider)
    {
        $routeProvider.when('/allCategorie',{templateUrl:'partials/allCategories.html', controller: 'CategoriesController'})
        $routeProvider.when('/subcategorys/:id',{templateUrl:'partials/subCategories.html', controller: 'CategoriesController'})
        
        $routeProvider.when('/addcategorie',{templateUrl:'partials/addcategorie.html', controller: 'CategoriesController'})
        $routeProvider.when('/plan',{templateUrl:'partials/planTable.html', controller: 'PlanController'})
        $routeProvider.when('/',{templateUrl:'partials/login.html', controller: 'LoginController'})
        $routeProvider.when('/login',{templateUrl:'partials/loginRestaurateur.html', controller: 'LoginRestaurateurController'})
        $routeProvider.when('/home',{templateUrl:'partials/home.html', controller: 'HomeController'})
        $routeProvider.when('/addrestorer',{templateUrl:'partials/addRestorer.html', controller: 'AddRestorerController'})
        $routeProvider.when('/updaterestorer/:id',{templateUrl:'partials/updateRestorer.html', controller: 'UpdateRestorerController'})
        $routeProvider.when('/updatecategories/:id',{templateUrl:'partials/updateCategories.html', controller: 'CategoriesController'})
        
        $routeProvider.when('/allProducts',{templateUrl:'partials/allProducts.html', controller: 'ProductController'})
        $routeProvider.when('/addProduct',{templateUrl:'partials/addProduct.html', controller: 'ProductController'})
        $routeProvider.when('/updateProduct/:id',{templateUrl:'partials/updateProduct.html', controller: 'ProductController'})
        $routeProvider.when('/allOptions',{templateUrl:'partials/allOptions.html', controller: 'OptionController'})
        $routeProvider.when('/addOptions',{templateUrl:'partials/addOption.html', controller: 'OptionController'})
        $routeProvider.when('/updateOption/:id',{templateUrl:'partials/updateOption.html', controller: 'OptionController'})
        $routeProvider.when('/allWorkers',{templateUrl:'partials/allWorker.html', controller: 'WorkerController'})
        $routeProvider.when('/addWorker',{templateUrl:'partials/addWorker.html', controller: 'WorkerController'})
        $routeProvider.when('/updateWorker/:id',{templateUrl:'partials/updateWorker.html', controller: 'WorkerController'})
        $routeProvider.when('/allTvas',{templateUrl:'partials/allTva.html', controller: 'TvaController'})
        $routeProvider.when('/addTva',{templateUrl:'partials/addTva.html', controller: 'TvaController'})
        $routeProvider.when('/updateTva/:id',{templateUrl:'partials/updateTva.html', controller: 'TvaController'})
        $routeProvider.when('/allMenus',{templateUrl:'partials/allMenus.html', controller: 'MenuController'})
        $routeProvider.when('/addMenu',{templateUrl:'partials/addMenu.html', controller: 'MenuController'})
        $routeProvider.when('/updateMenu/:id',{templateUrl:'partials/updateMenu.html', controller: 'MenuController'})
        $routeProvider.when('/reset',{templateUrl:'partials/remindPassword.html', controller: 'RemindController'})
        $routeProvider.when('/reset/:id',{templateUrl:'partials/resetPassword.html', controller: 'ResetController'})
        $routeProvider.otherwise({redirectTo :'/'})
        //$locationProvider.html5Mode(true);
    }])
    
    .config(function($httpProvider,$locationProvider)
    {
        
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        var interceptor = function($rootScope,$location,$q,Flash)
        {
            var success = function(response)
            {
                return response
            }
            var error = function(response)
            {
                if (response.status == "400")
                {
                     response.data.flash = "Adresse email non valide";
                     Flash.show(response.data.flash)
                    return $q.reject(response)
                }
                if (response.status == "401")
                {
                    delete sessionStorage.authenticated;
                    delete sessionStorage.csrf;
                    response.data.flash = "Connexion echoué";
                    $location.path("/login");
                    Flash.show(response.data.flash)
                    return $q.reject(response)
                }
                
            }
            return function(promise)
            {
                return promise.then(success, error)
            }
        }
        
        
        $httpProvider.responseInterceptors.push(interceptor)
    })
    .run(function($http,CSRF_TOKEN)
    {

        //$http.defaults.headers.common['device'] ="web";
        console.log(sessionStorage.csrf);
         $http.defaults.headers.common['Accept'] = sessionStorage.csrf;
         //console.log("run1"+sessionStorage.csrf);
        //config.headers['authorization'] = sessionStorage.csrf;
        //$http.defaults.headers.common['X-Auth-Token'] ="Bearer"+sessionStorage.csrf;
          //$http.defaults.headers.common['csrftoken'] =sessionStorage.csrf;
    })
    .run(function($rootScope,$location,$http,$resource,Authenticate, Restorers,Flash) 
    {
         $http.defaults.headers.common['Accept'] = sessionStorage.csrf;
         //console.log("run2"+sessionStorage.csrf);
        $rootScope.init = function() {
        //translationService.getTranslation($rootScope);  



            

           if (!sessionStorage.authenticated)
            {
                $location.path('/')
                Flash.show("you should be authenticated to access this page")
            }
        };
    })
    .run(function($rootScope,$http,$location,Authenticate, Restorers,Flash) 
    {
        var languageFilePath = "js/translation/translation_fr.json";
            $http.get(languageFilePath).success(function(data){
                console.log(data);
                 $rootScope.translation = data;
                })

        $rootScope.logout = function() 
        {
           Authenticate.get({},function(response)
            {
                delete sessionStorage.authenticated;
                delete sessionStorage.csrf;
                Flash.show(response.flash)
                $location.path('/')
            })
        };
    });


    