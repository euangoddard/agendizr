(function () {
    
    'use strict';
    
    var MONGOLAB_API_URL = 'https://api.mongolab.com/api/1/databases/agendizr/';
    
    var MONGOLAB_API_KEY = '50c48d11e4b012b961327393';
    
    angular.module('agendizr.backend', ['ngResource'])
        .factory('Agenda', function ($resource) {
            var Agenda = $resource(
                MONGOLAB_API_URL + 'collections/agendas/:id',
                {apiKey: MONGOLAB_API_KEY},
                {update: { method: 'PUT'}}
            );
            
            Agenda.prototype.update = function (callback) {
                var agenda = angular.extend({}, this, {_id: undefined});
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
                
                return Agenda.update(
                    {id: this._id.$oid},
                    agenda,
                    callback
                );
            };
            
            Agenda.prototype.destroy = function (callback) {
                return Agenda.remove({id: this._id.$oid}, callback);
            };
            
            return Agenda;
        });
    
})(); 
