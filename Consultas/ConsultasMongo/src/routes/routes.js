// Creación De Rutas

// Variables Y Constantes
const ExpressAuxiliar = require('express');
const Tweet = require('../models/tweet');
const config = require('../db/config');

// Inicializar Router
const RouterAuxiliar = ExpressAuxiliar.Router();

// Pagina Principal
RouterAuxiliar.get('/', (req, res) => {
	
    // Show Message 
    res.json({"Message": "Bienvenido Al Servidor Mongo - Practica  2"})
   	
});

// Add Tweet
RouterAuxiliar.post('/addtweet', async (req, res) => {

    // Try 
    try {

        // Body Data
        const data = req.body;            
		
		// Make Post
        await Tweet.create({
        
			nombre: data.nombre,
            comentario: data.comentario,
            fecha: data.fecha,
            hashtags: data.hashtags,
            upvotes: data.upvotes,
            downvotes: data.downvotes
        
		});   
		
        // Send Message 
        res.json({"state": true, "Response": "Tweet Agregado"});

    } catch (error) {
		
        // Send Message
        res.json({"state": false, "Error": error});
    
	}

});

// Split Hashtags
RouterAuxiliar.get('/splithashtags', async (req, res) => {

    // Query
    var query = await Tweet.find();

    // Auxiliares 
    var arrayAuxiliar = [];
    var objectAuxiliar = {};
    
    // For Each 
    for(let counter = 0; counter < query.length; counter++) {

        // Split Hashtags
        var hashtagsArray = query[counter]["hashtags"].split(",");

        // Recorrer Hashtags
        for(let counter_ = 0; counter_ < hashtagsArray.length; counter_++) {

            // Agregar Objecto
            objectAuxiliar.nombre = query[counter]["nombre"];
            objectAuxiliar.comentario = query[counter]["comentario"];
            objectAuxiliar.fecha = query[counter]["fecha"];
            objectAuxiliar.hashtag = hashtagsArray[counter_];
            objectAuxiliar.upvotes = query[counter]["upvotes"];
            objectAuxiliar.downvotes = query[counter]["downvotes"];
  
            // Agregar A Array
            arrayAuxiliar.push(objectAuxiliar);

            // Vaciar Array 
            objectAuxiliar = {};

        }

    }

    // Send Message
    res.json({"Response": arrayAuxiliar});

});

// Total Noticias
RouterAuxiliar.get('/totalnoticias', async (req, res) => {

    // Query
    var query = await Tweet.count({});
     
    // Send Message
    res.json({"Response": query});         

});

// Total Hashtags
RouterAuxiliar.get('/totalhashtags', async (req, result) => {

    // Query
    Tweet.aggregate([ { $match: {} }, { $group:
       { _id : null, sum : { $sum: "$upvotes" } }
    }])
    .then(res => result.json({"Response": res[0].sum})); 

});

// Total Hashtags V2
RouterAuxiliar.get('/totalhashtagsv2', async (req, res) => {

    // Query
    var query = await Tweet.find();

    // Auxiliares 
    var arrayAuxiliar = [];
    var objectAuxiliar = {};
    var sumupvotes = 0;
    
    // For Each 
    for(let counter = 0; counter < query.length; counter++) {

        // Split Hashtags
        var hashtagsArray = query[counter]["hashtags"].split(",");

        // Recorrer Hashtags
        for(let counter_ = 0; counter_ < hashtagsArray.length; counter_++) {

            // Agregar Objecto
            objectAuxiliar.nombre = query[counter]["nombre"];
            objectAuxiliar.comentario = query[counter]["comentario"];
            objectAuxiliar.fecha = query[counter]["fecha"];
            objectAuxiliar.hashtag = hashtagsArray[counter_];
            objectAuxiliar.upvotes = query[counter]["upvotes"];
            objectAuxiliar.downvotes = query[counter]["downvotes"];
  
            // Agregar A Array
            arrayAuxiliar.push(objectAuxiliar);

            // Vaciar Array 
            objectAuxiliar = {};

        }

    }

    // Recorrer Array 
    for(let counter = 0; counter < arrayAuxiliar.length; counter++) {

        // Split Hashtags
        sumupvotes = sumupvotes + arrayAuxiliar[counter]["upvotes"];

    }

    // Send Message
    res.json({"Response": sumupvotes});

});

// Top 5 Hashtags
RouterAuxiliar.get('/top5hashtags', async (req, res) => {

    // Query
    var query = await Tweet.find();

    // Auxiliares 
    var objectHashAuxiliar = {};
    var hashtagsAuxiliar = [];
    
    // For Each 
    for(let counter = 0; counter < query.length; counter++) {

        // Split Hashtags
        var hashtagsArray = query[counter]["hashtags"].split(",");

        // Recorrer Hashtags
        for(let counter_ = 0; counter_ < hashtagsArray.length; counter_++) {

            // Verificar Si Incluye 
            if(hashtagsAuxiliar.findIndex(x => x.hashtag === hashtagsArray[counter_]) === -1) { 
            
                // Agregar Objeco  
                objectHashAuxiliar.hashtag = hashtagsArray[counter_];
                objectHashAuxiliar.upvotes = query[counter]["upvotes"];

                // Agregar A Array
                hashtagsAuxiliar.push(objectHashAuxiliar); 

                // Limpiar Object
                objectHashAuxiliar = {};
            
            } else {

                // Index 
                var index = hashtagsAuxiliar.findIndex(x => x.hashtag === hashtagsArray[counter_]);

                // Sumar Upvotes 
                hashtagsAuxiliar[index]["upvotes"] = hashtagsAuxiliar[index]["upvotes"] + query[counter]["upvotes"];

            }

        }

    }

    // Ordenar Array 
    var result = hashtagsAuxiliar.sort((a, b) => b.upvotes - a.upvotes).slice(0,5);    
    
    // Send Message
    res.json({"Response": result});

});

// Upvotes Y Downvotes Por Dia
RouterAuxiliar.get('/updownvotesdia', async (req, res) => {

    // Query 
    Tweet.aggregate(
        [
          {
            $group: {
              _id: { fecha: "$fecha" },
              upvotes: { $sum: "$upvotes"},
              downvotes: { $sum: "$downvotes"}
            }
          }
        ],
    
        function(err, result) {
            
            if (err) {

                // Send Error 
                res.json({"Error": err});
            
            } else {
            
                // Send Message
                res.json({"Response": result});
            
            }

        }
    );   

});

// Exportar Modulo
module.exports = RouterAuxiliar;