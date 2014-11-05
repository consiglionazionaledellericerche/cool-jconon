'use strict';

angular.module('flowsApp')
  .controller('TaskCtrl', function ($scope, dataService, $location, $routeParams, $rootScope) {

    //TODO: rinominare
    var step4;

    $scope.hidden = true;

    var s = [
      {
        label: 'azioni',
        key: 'start'
      }
    ];

    function setStep(index) {
        var x = $scope.steps[index];
        x.step = index;
        $scope.step = x;
    }

    $scope.$watch('bulkinfoData', function (val) {

      if (val) {

        if (val.files.main > 0) {
          s.push({
            key: 'docMain',
            label: 'inserimento documenti principali'
          });
        }

        if (val.files.attachments > 0) {
          s.push({
            key: 'docAux',
            label: 'inserimento allegati'
          });
        }

        s.push({
          key: 'metadata',
          label: 'inserimento metadati'
        });
        s.push({
          key: 'summary',
          label: 'riepilogo'
        });

        $scope.steps = s;
        setStep(1);
      }
    });


    $scope.steps = s;

    setStep(0);

    $scope.changeStep = function (n) {
      if ($scope.step.key === 'metadata' && $scope.step.step === n - 1) {
        step4(n);
      } else {
        setStep(n);
      }
    };

    //TODO: gestire l'eventualita' che non sia possibile allegare documenti
    $scope.addMainDocument = true;
    $scope.addAuxDocument = true;

    $rootScope.page = null;
    $scope.tempId = new Date().getTime();

    $scope.urlContent = dataService.urls.content;
    $scope.urlProxy = dataService.urls.proxy;

    var id = $routeParams.id;

    dataService.proxy.api.taskInstances({detailed: true}, id).success(function (data) {
      var task = data.data;
      $scope.task = task;

      dataService.search({
        maxItems: 100,
        skipCount: 0,
        fetchCmisObject: false,
        calculateTotalNumItems: false,
        q: 'SELECT * FROM cmis:document c join wfcnr:parametriFlusso a on c.cmis:objectId = a.cmis:objectId WHERE IN_FOLDER(c, \'' + task.workflowInstance.package + '\') ORDER BY c.cmis:lastModificationDate DESC'
      }).success(function (data) {
        var documents = data.items;
        var main = [], aux = [];
        _.each(documents, function (doc) {
          if (doc['wfcnr:tipologiaDOC'] === 'Principale') {
            main.push(doc);
          } else {
            aux.push(doc);
          }
        });

        $scope.main = main;
        $scope.aux = aux;

      });

      //load transition choices

      dataService.bulkInfo('D:' + task.definition.id).success(function (transitionsData) {
        console.log(transitionsData);

        var outcomeKey =  'wfcnr:reviewOutcome',
          actions = transitionsData['default'],
          transitions = actions[outcomeKey] || actions['wf:reviewOutcome'],
          taskDone = [{
            key: 'Done',
            label: 'Eseguito'
          }]; // 'task done' will be the default transition, if no transition has been defined

        $scope.defaultTransition = transitions['default'];
        $scope.transitions = transitions ? transitions.jsonlist : taskDone;

        $scope.endTask = function (key) {

          $scope.bulkInfoSettings = {
            name: key,
            key: transitionsData.cmisObjectTypeId
          };

          $scope.hidden = false;

          $scope.choice = key;


          step4 = function (n) {

            var content = $scope.bulkinfoData.get();
            content.prop_folder = $scope.folder;
            content.prop_transitions = 'Next';
            content['prop_' + outcomeKey.replace(':', '_')] = key;

            dataService.proxy.api.task.formprocessor(task.id, content)
              .success(function (data) {
                console.log(data);
                $scope.success = {
                  key: key,
                  message: data.message
                };

                setStep(n);
              })
              .error(function (err) {
                console.log(arguments);
                $scope.error = err.message;
              });

          };



        };

      });

    });

  });