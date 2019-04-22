var db = false;
var database = {

    // Database Constructor
    initialize: function() {
        var db = window.openDatabase("Controle", "1.0", "Controle de Caixa Web SQL Database", 200000);
        db.transaction(function(tx){
            // criar a tabelas
            tx.executeSql("CREATE TABLE IF NOT EXISTS produtos (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome TEXT, preco FLOAT)");
            tx.executeSql("CREATE TABLE IF NOT EXISTS vendas (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, produto_id INT, quantidade INT, total FLOAT, data DATETIME)");
        });
        console.log('Database Initialized');
    },
    get_products: function() {
        var db = window.openDatabase("Controle", "1.0", "Controle de Caixa Web SQL Database", 200000);
        db.transaction(function(tx){ 
            tx.executeSql( "SELECT * FROM produtos", [], function(tx, result)
            {
                console.log('Deu certo!'); 
                var len = result.rows.length, i; 
                for(i=0;i<len;i++){ 
                    console.log( result.rows.item(i) ); 
                } 
            }, function(tx, error){ 
                console.log('Deu errado!'); 
                console.log(error); 
            });
        });
    },
    get_product: function(id) {
        var db = window.openDatabase("Controle", "1.0", "Controle de Caixa Web SQL Database", 200000);
        db.transaction(function(tx){ 
            tx.executeSql( "SELECT * FROM produtos WHERE id="+id, [], function(tx, result)
            {
                console.log('Deu certo!'); 
                var len = result.rows.length, i; 
                for(i=0;i<len;i++){ 
                    console.log( result.rows.item(i) ); 
                } 
            }, function(tx, error){ 
                console.log('Deu errado!'); 
                console.log(error); 
            });
        });
    },
    get_vendas: function() {
        var db = window.openDatabase("Controle", "1.0", "Controle de Caixa Web SQL Database", 200000);
        db.transaction(function(tx){ 
            tx.executeSql( "SELECT * FROM vendas", [], function(tx, result)
            {
                console.log('Deu certo!'); 
                var len = result.rows.length, i; 
                for(i=0;i<len;i++){ 
                    console.log( result.rows.item(i) ); 
                } 
            }, function(tx, error){ 
                console.log('Deu errado!'); 
                console.log(error); 
            });
        });
    },
    get_venda: function(id) {
        var db = window.openDatabase("Controle", "1.0", "Controle de Caixa Web SQL Database", 200000);
        db.transaction(function(tx){ 
            tx.executeSql( "SELECT * FROM vendas WHERE id="+id, [], function(tx, result)
            {
                console.log('Deu certo!'); 
                var len = result.rows.length, i; 
                for(i=0;i<len;i++){ 
                    console.log( result.rows.item(i) ); 
                } 
            }, function(tx, error){ 
                console.log('Deu errado!'); 
                console.log(error); 
            });
        });
    },
    get_venda_por_data: function(data) {
        var db = window.openDatabase("Controle", "1.0", "Controle de Caixa Web SQL Database", 200000);
        db.transaction(function(tx){ 
            tx.executeSql( "SELECT * FROM vendas WHERE CONVERT(data, DATE)='"+data+"'", [], function(tx, result)
            {
                console.log('Deu certo!'); 
                var len = result.rows.length, i; 
                for(i=0;i<len;i++){ 
                    console.log( result.rows.item(i) ); 
                } 
            }, function(tx, error){ 
                console.log('Deu errado!'); 
                console.log(error); 
            });
        });
    },
    save_venda: function(produto, qty, total) {
        var db = window.openDatabase("Controle", "1.0", "Controle de Caixa Web SQL Database", 200000);
        db.transaction(function(tx){ 
            tx.executeSql('INSERT INTO vendas (id, produto_id, quantidade, total, data) VALUES (?, ?, ?, ?, ?)',
                [[null, produto, qty, total ,new Date().getTime()]], 
                null, null);
        });
    },
    save_produto: function(nome, preco) {
        var db = window.openDatabase("Controle", "1.0", "Controle de Caixa Web SQL Database", 200000);
        db.transaction(function(tx){ 
            tx.executeSql('INSERT INTO produtos (id, nome, preco) VALUES (?, ?, ?)', [[null, nome, preco]], null, null);
        });
    },
};
database.initialize();