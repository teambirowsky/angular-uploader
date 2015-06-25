angular.module('angular.upload.controllers', [])
  .controller('uploadController', ['$scope',function ($scope) {
    $scope.$upload = {};
    $scope.$upload.config = {};
    $scope.$upload.files = [];
    $scope.$upload.prepareFiles = function (files) {
      $scope.$upload.extError = null;
      $scope.$upload.msg = null;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var f = {
          name: file.name,
          size: file.size,
          progress: 0,
          fileObj: file,
          retry: function () {
            sendFilesToServer(this, $scope.$upload.config);
          },
          ext: $scope.$upload.getExtension(file.name)
        };
        if (checkDuplicateFiles($scope.$upload.files, f) && $scope.$upload.config.checkDuplicate != false) {
          $scope.uploadFeedback({success: false, errorMsg: "File already added"});
          $scope.$upload.msg = "File already added";
          return;
        }
        if ($scope.$upload.checkValidExtension(f.ext)) {
          $scope.$upload.files.push(f);
          if(!$scope.$upload.config.target || $scope.$upload.config.client)
            uploadToClient($scope.$upload.files[$scope.$upload.files.length - 1], $scope.$upload.config);
          else sendFilesToServer($scope.$upload.files[$scope.$upload.files.length - 1], $scope.$upload.config);
        }
        else {
          $scope.uploadFeedback({success: false, errorMsg: "File extension not allowed! Allowed extensions: " + $scope.$upload.config.validExt.join(', ')});
          $scope.$upload.extError = "File extension not allowed! Allowed extensions: " + $scope.$upload.config.validExt.join(', ');
        }
      }
    };
    function uploadToClient(file, config) {
      var reader = new FileReader();
      reader.onerror = function (evt) {
        switch (evt.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
          case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
          case evt.target.error.ABORT_ERR:
            break; // noop
          default:
            alert('An error occurred reading this file.');
        }
      };
      reader.onprogress = function (evt) {
        // evt is an ProgressEvent.
        if (evt.lengthComputable) {
          var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
          // Increase the progress bar length.
          file.progress = percentLoaded;
        }
      };
      reader.onabort = function (e) {
        alert('File read cancelled');
      };
      reader.onloadstart = function (e) {
        file.error = false;
        file.uploading = true;
        file.finished = false;
        file.progress = 0;
      };
      reader.onload = function (e) {
        file.finished = true;
        file.uploading = false;
        file.uploadFeedback = $scope.uploadFeedback({success: true, result: e.target.result, file: file.fileObj});
        $scope.$apply();
      };
      if($scope.$upload.config.readAsText)
        reader.readAsText(file.fileObj);
      else
        reader.readAsDataURL(file.fileObj);
    }

    $scope.$upload.setConfig = function (config) {
      $scope.$upload.config = config;
    };
    $scope.$upload.checkValidExtension = function (ext) {
      if (!($scope.$upload.config.validExt) || $scope.$upload.config.validExt.length == 0) return true;
      return $scope.$upload.config.validExt.indexOf(ext) > -1;
    };
    $scope.$upload.getExtension = function (fileName) {
      return fileName.split('.')[fileName.split('.').length - 1];
    };
    function checkDuplicateFiles(files, file) {
      var duplicate = false;
      for (var i = 0; i < files.length; i++) {
        var obj = files[i];
        if (obj.name == file.name && obj.size == file.size) duplicate = true;
      }
      return duplicate;
    }

    function sendFilesToServer(file, config) {
      var fd = new FormData();
      fd.append('file', file.fileObj);
      file.error = false;
      file.uploading = true;
      file.finished = false;
      file.progress = 0;
      var xhr = $.ajax({
        type: "POST",
        url: config.target,
        data: fd,
        success: function (data) {
          file.finished = true;
          file.uploading = false;
          $scope.$apply();
        },
        error: function () {
          file.error = true;
          file.uploading = false;
          $scope.$apply();
        },
        xhr: function () {
          var xhrobj = $.ajaxSettings.xhr();
          if (xhrobj.upload) {
            xhrobj.upload.addEventListener('progress', function (event) {
              var percent = 0;
              var position = event.loaded || event.position;
              var total = event.total;
              if (event.lengthComputable) {
                percent = Math.ceil(position / total * 100);
              }
              //Set progress
              file.progress = percent;
              $scope.$apply();
            }, false);
          }
          return xhrobj;
        },
        processData: false,
        contentType: false
      });
      fd.abort = function () {
        xhr.abort();
      }
    }
  }]);
