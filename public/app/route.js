var app = angular.module('appRoutes', ['ngRoute'])

// Configure Routes; 'authenticated = true' means the user must be logged in to access the route
.config(function($routeProvider, $locationProvider) {

    // AngularJS Route Handler
    $routeProvider

    // Route: Home             
        .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    // Route: About Us (for testing purposes)
    .when('/about', {
        templateUrl: 'app/views/pages/about.html'
    })

    // Route: User Registration
    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })

    // Route: User Login
    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })

    // Route: User Profile
    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    })