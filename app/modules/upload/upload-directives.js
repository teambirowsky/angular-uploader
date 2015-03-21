angular.module('angular.upload.directives',[])
  .directive('uploadInit', function () {
    function compile(tElement, tAttrs, transclude) {
      return function($scope, iElement, iAttrs) {
        $scope.$upload.setConfig($scope.uploadInit);
        transclude($scope, function(clone) {
          iElement.append(clone);
        });
      };
    }
    return {
      restrict:'A',
      transclude: true,
      scope: {
        uploadInit: '=',
        uploadFeedback:'=?'
      },
      compile:compile,
      controller:'uploadController'
    }
  }).directive('uploadDrop', function () {
    function compile(tElement, tAttrs, transclude) {

      return function($scope, iElement, iAttrs) {
        iElement.on('dragenter',function(e){
          e.preventDefault();
          e.stopPropagation();
          iElement.attr('style',$scope.$upload.config.dragStyle || '');
        });
        iElement.on('dragover',function(e){
          e.preventDefault();
          e.stopPropagation();
          iElement.attr('style',$scope.$upload.config.dragStyle || '');
        });
        iElement.on('dragleave',function(e){
          e.preventDefault();
          e.stopPropagation();
          iElement.attr('style','');
        });
        iElement.on('drop',function(e){
          e.preventDefault();
          e.stopPropagation();
          var files = e.originalEvent.dataTransfer.files;
          $scope.$upload.prepareFiles(files);
          $scope.$apply();
          iElement.attr('style','');
        });
        iElement.on('dragover',function(e){
          e.preventDefault();
          e.stopPropagation();
        });
        transclude($scope, function(clone) {
          iElement.append(clone);
        });
      };
    }

    return {
      restrict:'A',
      transclude: true,
      compile:compile
    }
  }).directive('uploadBtn', function () {
    function link($scope,element){

      element.click(function(e){
        setTimeout(function(){
          element.find('input').trigger('click');
        },0);
      });
      element.find('input').on('change',function(e){
        if(e.target.files.length>0)
          $scope.$upload.prepareFiles(e.target.files);
        $scope.$apply();
      });
    }
    return {
      restrict:'A',
      transclude: true,
      link:link,
      templateUrl:'modules/upload/views/upload-btn.html'
    }
  });
