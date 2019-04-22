
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        document.addEventListener("offline", this.is_offline, false);
        document.addEventListener("online", this.is_online, false);
        document.getElementById("take_foto").addEventListener("click", this.takePhoto);
        document.getElementById("share_foto").addEventListener("click", this.sharePhoto);
        document.getElementById("novo_cadastro").addEventListener("click", this.resetForm);
        document.getElementById("reset_cadastro").addEventListener("click", this.resetForm);

        //Get fileSystem
        window.requestFileSystem(window.PERSISTENT, 0, function(fileSystem){
            //Enter / create fodler Elsevier and move the photo to it.
            fileSystem.root.getDirectory("elsevier", { create : true } );
            //Read incritos
            fileSystem.root.getFile('elsevier/inscritos.txt', {create: true}, function(fileEntry) { 
                fileEntry.file( function(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        document.getElementById('temp_data').value = evt.target.result;
                    };
                    reader.readAsText(file);
                }, function(error) { console.log(error)});
            },  function(error) { console.log(error);});
            //Read HashTag
            fileSystem.root.getFile('elsevier/texto_instagram.txt', {create: true}, function(fileEntry) { 
                fileEntry.file( function(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var temp_tag = evt.target.result;
                        if (temp_tag != ''){
                            document.getElementById('temp_tag').value = temp_tag;
                        } else {
                            document.getElementById('temp_tag').value = '#ElsevierNaUnigranrio';
                        }
                    };
                    reader.readAsText(file);
                }, function(error) { console.log(error)});
            },  function(error) { console.log(error);});
        },  function(error) { console.log(error);});

        this.changeNotification;
    },

    checkConnection : function (){
        var networkState = navigator.connection.type;
        if (networkState !== Connection.NONE) {
            return true;
        } else{
            return false;
        }
    },

    changeNotification : function (){
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Aviso", // title
                    'OK'        // buttonName
              );
            };
        }
    },

    is_online : function(){
        document.getElementById("take_foto").style.display = 'inline';
        document.getElementById("offline_message").style.display = 'none';
    },

    is_offline : function(){
        document.getElementById("take_foto").style.display = 'none';
        document.getElementById("offline_message").style.display = 'block';
    },

    resetForm : function(){
        document.getElementById("novo_cadastro").style.display = 'none';
        document.getElementById("step1").style.display = 'inline-block';
        document.getElementById("step2").style.display = 'none';
        document.getElementById("nome").value = '';
        document.getElementById("email").value = '';
    },
    
    takePhoto: function(){

        if (document.getElementById("email").value == '' || document.getElementById("nome").value == '') { 
            alert('Por favor preencha os dados para continuar.');
            return false;
        }

        document.getElementById("step2").style.display = 'none';

        navigator.camera.getPicture(
        //onSuccess
        function(imageData) {
            // var image = document.getElementById('myImage').src = "data:image/jpeg;base64," + imageData;
            var image = document.getElementById('myImage').src = imageData;
            document.getElementById("step1").style.display = 'none';
            document.getElementById("step2").style.display = 'inline-block';

            var gotImageFileEntry = function(fileEntry) {
                // alert("got image file entry: " + fileEntry.fullPath);
                var gotFileSystem = function(fileSystem) {
                    //Enter / create fodler Elsevier and move the photo to it.
                    fileSystem.root.getDirectory("elsevier", {
                        create : true
                    }, function(dataDir) {
                        var nname = new Date().getTime()+'.jpg';    
                        document.getElementById('myImage').setAttribute('rel', nname);
                        // copy the file
                        fileEntry.file(function(file) {
                            var reader = new FileReader();
                            reader.onloadend = function(event) {
                                document.getElementById('myImage').src = reader.result;
                                //post data
                                var nome        = document.getElementById('nome').value;
                                var email       = document.getElementById('email').value;
                                var nname       = document.getElementById('myImage').getAttribute('rel');

                                cordovaHTTP.post("http://apis.agenteresolve.com.br/elsevier/save_data/abe6db4c9f5484fae8d79f2e868a673c", {
                                    image : reader.result, image_name : nname, nome : nome, email : email
                                }, { Authorization: "OAuth2: token" }, function(response) {
                                    console.log(response.status);
                                }, function(response) {
                                    console.error(response.error);
                                });
                            };
                            reader.readAsDataURL(file);
                        });
                        fileEntry.copyTo(dataDir, nname, null, fsFail);

                    }, dirFail);

                    //Save inscritos to file
                    fileSystem.root.getFile('elsevier/inscritos.txt', {create: true}, function(fileEntry) {
                        
                        var image    =  document.getElementById('myImage');
                        var $nome    =  document.getElementById("nome");
                        var $email   =  document.getElementById("email");
                        var $data    =  document.getElementById('temp_data');

                        Inscritos = new Array(); //create new

                        if ($data.value != ''){
                            Inscritos = JSON.parse($data.value);
                        }
                        Inscritos.push({image: image.getAttribute("rel"), nome: $nome.value, email: $email.value});
                        $data.value = JSON.stringify(Inscritos);

                        fileEntry.createWriter(function(fileWriter) {
                            fileWriter.onwriteend = function(e) {
                               // alert('Write completed.');
                            };

                            fileWriter.onerror = function(e) {
                               alert('Write failed: ' + e.toString());
                            };

                            var blob = new Blob([ document.getElementById('temp_data').value ], {type: 'text/plain'});
                                fileWriter.write(blob);
                            }, fsFail);
                    }, fsFail);

                };
                // get file system to copy or move image file to
                window.requestFileSystem(window.PERSISTENT, 0, gotFileSystem, fsFail);
            };
            // resolve file system for image
            window.resolveLocalFileSystemURI(imageData, gotImageFileEntry, fsFail);

            // file system fail
            var fsFail = function(error) {
                alert("failed with error code: " + error.code);

            };

            var dirFail = function(error) {
                alert("Directory error code: " + error.code);

            };
        },
        //onFail
        function(error_message){
             alert('Failed because: ' + message);
        },
        //cameraOptions
        {
            // Some common settings are 20, 50, and 100
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,// Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            cameraDirection: Camera.Direction.BACK,
            targetWidth : 1050,
            targetHeight : 1050,
            saveToPhotoAlbum: true,
            correctOrientation: true  //Corrects Android orientation quirks
        });  

    },

    sharePhoto: function(){

        Instagram.isInstalled(function (err, installed) {
            if (!installed){
                alert("Aplicativo Instagram não encontrado."); return false;
            }
        });

        //Compartilhando a foto
        Instagram.share(document.getElementById('myImage').src, document.getElementById('temp_tag').value, function (err) {
            if (err) {
                alert("Foto não compartilhada.");
            } else {
                alert("Foto compartilhada com sucesso.");
            }
        });
    },
};

app.initialize();