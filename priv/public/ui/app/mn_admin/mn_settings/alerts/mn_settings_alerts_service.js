(function () {
  "use strict";

  angular.module('mnSettingsAlertsService', [
    'mnHttp'
  ]).factory('mnSettingsAlertsService', mnSettingsAlertsService);

  function mnSettingsAlertsService(mnHttp, knownAlerts) {
    var mnSettingsAlertsService = {
      testMail: testMail,
      saveAlerts: saveAlerts,
      getAlerts: getAlerts
    };

    return mnSettingsAlertsService;

    function testMail(params) {
      params = _.clone(params);
      params.alerts = params.alerts.join(',');
      return mnHttp.post('/settings/alerts/testEmail', params);
    }
    function saveAlerts(params) {
      params = _.clone(params);
      params.alerts = params.alerts.join(',');
      return mnHttp.post('/settings/alerts', params);
    }
    function getAlerts() {
      return mnHttp.get('/settings/alerts').then(function (resp) {
        var val = _.clone(resp.data);
        val.recipients = val.recipients.join('\n');
        val.knownAlerts = _.clone(knownAlerts);
        // {auto_failover_node: true, auto_failover_maximum_reached: true ...}
        val.alerts = _.zipObject(val.alerts, _.fill(new Array(val.knownAlerts.length), true, 0, val.knownAlerts.length));

        return val;
      });
    }
  }
})();