'use strict';

var SAVE_INTERVAL = 3000;

var NewAgendaController = function ($scope, $location, Agenda) {
    $scope.create_agenda = function () {
        var agenda = $scope.agenda;
        agenda.objectives = [];
        agenda.items = [];
        Agenda.save(agenda, function (new_agenda) {
            $location.path('/agendas/' + new_agenda._id.$oid + '/edit/');
        });
    };
};


var EditAgendaController = function ($scope, $routeParams, $timeout, Agenda) {
    Agenda.get({id: $routeParams.id}, function (agenda) {
        $scope.agenda = agenda;
        update_scope();
    });
    
    var last_commit_requested = get_current_timestamp();
    var recheck_timeout_promise = null;
    var commit_changes_to_remote = function () {
        if (get_current_timestamp() < (last_commit_requested + SAVE_INTERVAL)) {
            if (recheck_timeout_promise) {
                $timeout.cancel(recheck_timeout_promise);
            }
            recheck_timeout_promise = $timeout(
                commit_changes_to_remote,
                SAVE_INTERVAL
            );
        } else {
            last_commit_requested = get_current_timestamp();
            $scope.is_saving = true;
            $scope.agenda.update(function () {
                $scope.is_saving = false;
            });
        }
    };
    
    var update_scope = function () {
        commit_changes_to_remote();
        
        var last_objectives = $scope.agenda.objectives.slice(-2);
        var empty_objective_count = 0;
        angular.forEach(last_objectives, function (objective) {
            if (!(objective && objective.text)) {
                empty_objective_count += 1;
            }
        });
        
        if (empty_objective_count < 1) {
            $scope.agenda.objectives.push({});
        }
        
        var last_agenda_items = $scope.agenda.items.slice(-2);
        var empty_agenda_item_count = 0;
        angular.forEach(last_agenda_items, function (agenda_item) {
            if (!(agenda_item && (agenda_item.text || agenda_item.time))) {
                empty_agenda_item_count += 1;
            }
        });
        
        if (empty_agenda_item_count < 1) {
            $scope.agenda.items.push({});
        }
        
        var total_minutes = 0
        angular.forEach($scope.agenda.items, function (item) {
            if (angular.isNumber(item.time)) {
                total_minutes += item.time;
            }
        });
        $scope.total_time = total_minutes * 60000;
    };
    
    var remove_child_from_agenda = function (key) {
        return function (index) {
            if ($scope.agenda[key]) {
                $scope.agenda[key].splice(index, 1);
                update_scope();
            }
        };
    }
    
    $scope.remove_item = remove_child_from_agenda('items');
    $scope.remove_objective = remove_child_from_agenda('objectives');
    $scope.update_scope = update_scope;
};


var ViewAgendaController = function ($scope, $routeParams, Agenda) {
    Agenda.get({id: $routeParams.id}, function (agenda) {
        var objectives = agenda.objectives;
        agenda.objectives = [];
        angular.forEach(objectives, function (objective) {
            if (objective && objective.text) {
                agenda.objectives.push(objective);
            }
        });
        
        var items = agenda.items;
        agenda.items = [];
        angular.forEach(items, function (item) {
            if (item && item.text) {
                agenda.items.push(item);
            }
        });
        
        $scope.agenda = agenda;
    });
};


// Utilities

var get_current_timestamp = function () {
    return 1 * new Date();
};
