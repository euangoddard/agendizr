'use strict';


angular.module('agendizr', ['agendizr.backend']).
  config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/new.html', controller: NewAgendaController});
    $routeProvider.when('/agendas/:id/edit/', {templateUrl: 'partials/edit.html', controller: EditAgendaController});
    $routeProvider.when('/agendas/:id/view/', {templateUrl: 'partials/view.html', controller: ViewAgendaController});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
