var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        document.querySelector(".sidebar_close").addEventListener("click", this.toggle_sidebar);
        database.get_products();
        this.changeNotification;
    },

    toggle_sidebar : function() {
        console.log('Toogle sidebar');
        document.getElementById('sidebar').classList.toggle('active');
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
};

app.initialize();

$(document).delegate('.ui-page', 'pageshow', function () {
    document.getElementById('sidebar').classList.remove('active');
});