const {MongoClient} = require('mongodb');
// const { ObjectId } = require('mongodb');

async function main(){

    const uri = "mongodb://localhost:27017/moviesDB";
    const client = new MongoClient(uri);
    const db = client.db();
    
    try{
        await client.connect();

        //exo 1
        const res1 = await db.collection('Films').find({genre: "Aventure", "director.last_name": "Spielberg"},
             {projection: {title: 1, genre: 1, "director.last_name": 1,
            _id: 0}}
        ).toArray();
   
        //exo 2

        const res2 = await db.collection('Films').find({year: 2000}).project({title: 1, year: 1, _id: 0}).toArray();
    //    console.log(res2);

       //exo 3

       const res3 = await db.collection('Films').find({genre: "Action"}).project({title: 1, year: 1, genre: 1, _id: 0}).toArray();
    //    console.log(res3);

    //exo 4
       const res4 = await db.collection('Films').distinct("genre");
    //    console.log("Liste des genres:", res4);
    //    console.log("Nombre de genres:", res4.length);


   // exo 5

    const res5 = await db.collection('Films').find({country: "FR"}).project({title: 1, year: 1, country: 1, _id: 0}).toArray();
    // console.log(res5);
       
//exo 6

    const res6 = await db.collection('Films').find({"actors.last_name": "Thurman", "actors.first_name": "Uma"}).project({title: 1, year: 1, _id: 0}).toArray();

    // console.log(res6);

// agregation

    const res66 = await db.collection('Films').aggregate([
        { $unwind: "$actors" },
        { $match: { "actors.first_name": "Uma", "actors.last_name": "Thurman"} },
        { $project: { title: 1, year: 1, "actors.first_name": 1, "actors.last_name": 1, _id: 0 } }
    ]).toArray();

    // console.log(res66);

//exo 7
    // const res7 = await db.collection('Films').findOne({title: "Memento"},{"director.first_name": 1, "director.last_name": 1,});
    // const director = res7.director;
    // console.log(`Le réalisateur du film "Memento" est ${director}`);
    const res7 = await db.collection('Films').findOne(

        { title: "Memento" },
  
        { projection: { "director.first_name": 1, "director.last_name": 1, _id: 0 } })

        // console.log(`Le réalisateur du film "Memento" est ${res7.director.first_name} ${res7.director.last_name}`);
  


  //exo 8

const res8 = await db

      .collection("Films")

      .find({ title: "Apocalypse Now" })

      .project({

        title: 1,

        "actors.last_name": 1,

        "actors.first_name": 1,

      })

      .toArray();

    // console.dir(exo8, { depth: null });

// exo 9

    const res9 = await db.collection('Films').find({
        year: { $gte: 1968, $lte: 1978 }
    }).project({ title: 1, year: 1, _id: 0 }).sort({year: +1}).toArray();

    // console.log(res9);

    //exo 10

    const res10 = await db.collection('Films').find({
        year: { $lte: 1968}
    }).project({ title: 1, year: 1, _id: 0 }).sort({year: +1}).toArray();
    // console.log(res10);

    //exo 10.2, 11
    const res1011 = await db.collection('Films').find({
        year: { $lt: 1968}
    }).project({ title: 1, year: 1, _id: 0 }).sort({year: -1}).limit(5).toArray();

    // console.log( res1011);


    //exo 12

    const res12 = await db.collection('Films').find({
        genre: { $in: ["Action", "Aventure"] }
    }).sort({ genre: 1 }).project({title: 1, genre: 1,  _id: 0}).toArray();

    // console.log(res12)

    // avec $or
    const res1212 = await db.collection('Films').find({

        $or : [

            {"genre" : "Action"},  

            {"genre" : "Aventure"}

        ]

    })

    .project({ "title": 1,  'year':1, genre:true })

    .sort({"genre" : 1}).toArray();

    // console.log( res1212);


    //exo 13

    const res13 = await db.collection('Films').find({ "director.last_name": {$ne: "Tarantino"}}).project({title: 1, "director.last_name": 1, "director.last_name": 1,
    _id: 0}).toArray();

    // console.log(res13);
    

    //exo 14

    const res14 = await db.collection('Films').aggregate([
        { $group: { _id: "$genre", count: { $sum: 1}}},
        { $sort: {_id: 1}}
    ]).toArray();

    // console.log(res14);


    //exo 15

    const res15 = await db.collection('Films').countDocuments({
        year: { $gte: 2000 }
    });

    // console.log(`Nombre de films sortis à partir de l'année 2000: ${res15}`);


    //exo 16
    const res16 = await db.collection('Films').find({
        summary: { $regex: "la guerre du Vietnam", $options: 'i' }
    }).project({
        title: 1,
        year: 1,
        _id: 0
    }).toArray();
    console.log(res16);

    //agregation

    const res1616 = await db.collection('Films').aggregate([
        {$match: {summary: { $regex: "la guerre du Vietnam", $options: 'i' }}},
        {$project: {title: 1, year: 1, _id: 0}}
    ]).toArray();
    // console.log(res1616);
        }
    
        catch(e){
            console.error(e);
        }
        finally{
            await client.close();
        }
    }
    main().catch(console.error);

    // 17 --------------------------------------------------------

const robertRedford = await db.collection('films').find(
    { "actors.last_name": "Redford", "actors.first_name": "Robert" },
    {
        projection: { title: 1, year: 1, _id: 0 }
    }
).toArray();
// console.log("Films avec Robert Redford :", robertRedford);

const redfordAggreg = await db.collection('films').aggregate([
    {
        $match: {
            "actors.last_name": "Redford",
            "actors.first_name": "Robert"
        }
    },
    {
        $project: {
            title: 1,
            year: 1,
            _id: 0
        }
    }
]).toArray();
// console.log("Films (agrégation) avec Robert Redford :", redfordAggreg)

// 18 ---------------------------------------------------------------------

const family = await db.collection('films').aggregate([
    {
        $match: {
            summary: { $regex: "famille"}
        }
    },
    {
        $project: {
            title: 1,
            _id: 0
        }
    }
]).toArray();
// console.log('Films ayant le mot "famille" dans le résumé :', family)

// 19 ---------------------------------------------------------------------

const starwarsYearUpdated = await db.collection('films').updateOne(
    { title: "La Guerre des étoiles" }, 
    { $set: { year: 1978 } } 
    //upset marche aussi 
);

if (starwarsYearUpdated.modifiedCount > 0) {
    console.log("L'année de sortie du film 'La Guerre des étoiles' a été modifiée avec succès.");
} else {
    console.log("Aucune modification effectuée (le film n'a peut-être pas été trouvé).");
}

// 20 ---------------------------------------------------------------------

const eastwood = await db.collection('films').aggregate([
    {
        $match: {
            "actors.last_name": "Eastwood"
        }
    },
    {
        $project: {
            "titre du film": "$title",
            _id: 0
        }
    }
]).toArray();
// console.log('Films avec Clint Eastwood :', eastwood)

// 21 ---------------------------------------------------------------------

const filmsSF = await db.collection('films').find(
    { genre: "Science-Fiction" },
    { projection: { title: 1, _id: 0 } }
).toArray();


// filmsSF.forEach((film, index) => {
//     console.log(`<${index + 1}> - ${film.title}`);
// });


// 22 ---------------------------------------------------------------------

const addPixels = await db.collection('films').insertOne({
    title: "Pixels",
    year: 2005,
    genre: "Comédie",
    country: "US",
    director: {
        _id: new ObjectId(),  
        last_name: "Columbus",
        first_name: "Chris"
    }
});
// console.log(`Film ajouté avec succès: ${addPixels.insertedId}`);

// 23 ---------------------------------------------------------------------

const addKeaton = await db.collection('films').updateOne(
    { title: "Le Parrain" }, // Critère pour trouver le film
    {
        $push: { // $addToSet évite les doublons
            actors: {
                last_name: "Keaton",
                first_name: "Diane",
                birth_date: 1946
            }
        }
    }
);

// if (addKeaton.modifiedCount > 0) {
//     console.log("Diane Keaton a été ajoutée avec succès au casting du film 'Le Parrain'.");
// } else {
//     console.log("Aucun film n'a été trouvé avec le titre 'Le Parrain', ou l'actrice a déjà été ajoutée.");
// }

// 24 ---------------------------------------------------------------------

const newActors = [
    {
        last_name: "Cazale",
        first_name: "John",
        birth_date: 1935
    },
    {
        last_name: "Conte",
        first_name: "Richard",
        birth_date: 1910
    }
];

const addGodfatherActors = await db.collection('films').updateOne(
    { title: "Le Parrain" }, // Critère pour trouver le film
    {
        $push: { // $addToSet évite les doublons
            actors: { $each: newActors }
        }
    }
);

// if (addGodfatherActors.modifiedCount > 0) {
//     console.log("Les acteurs ont été ajoutés avec succès au casting du film 'Le Parrain'.");
// } else {
//     console.log("Aucun film n'a été trouvé avec le titre 'Le Parrain', ou les acteurs ont déjà été ajoutés.");
// }

// 25 ---------------------------------------------------------------------

const deleteImpitoyable = await db.collection('films').deleteOne({ title: "Impitoyable" });

// if (deleteImpitoyable.deletedCount > 0) {
//     console.log("Le film 'Impitoyable' a été supprimé avec succès.");
// } else {
//     console.log("Aucun film n'a été trouvé avec le titre 'Impitoyable'.");
// }

// 26 ---------------------------------------------------------------------

const delete1970Movies = await db.collection('films').deleteMany({ year: 1970 });

// console.log(`${delete1970Movies.deletedCount} film(s) supprimé(s) de l'année 1970.`);

// 27 ---------------------------------------------------------------------

const renameSFGenre = await db.collection('films').updateMany(
    { genre: "Science Fiction" }, 
    { $set: { genre: "Science-Fiction" } } 
);

// console.log(`${renameSFGenre.modifiedCount} film(s) modifié(s) avec le genre "Science-Fiction".`);


// ------------ PARTIE JOINTURE --------------------------------

// CREATION DE LA COLLECTION 1ERE VERSION -----------------------

const { MongoClient } = require('mongodb');

async function createExploitationCollection() {
    const uri = "mongodb://localhost:27017/exo_films"; // Assurez-vous que l'URI correspond à votre base de données
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(); // Accède à la base de données

        // Création de la nouvelle collection "exploitation"
        const collection = await db.createCollection("exploitation");
        console.log(`Collection '${collection.collectionName}' créée avec succès.`);

        
        // Récupérer les identifiants des films
        const films = await db.collection('films').find({
            title: { $in: ["Ben-Hur", "E.T. l'extra-terrestre", "Mars Attacks!", "Blade Runner", "Predator"] }
        }).toArray();

        // Préparer les données à insérer
        const dataToInsert = [
            { 
                film_id: films.find(f => f.title === "Ben-Hur")._id, 
                box_office_fr: 13850000, 
                box_office_us: 98000000 
            },
            { 
                film_id: films.find(f => f.title === "E.T. l'extra-terrestre")._id, 
                box_office_fr: 9420000, 
                box_office_us: 140000000 
            },
            { 
                film_id: films.find(f => f.title === "Mars Attacks!")._id, 
                box_office_fr: 2150000, 
                box_office_us: 100000000 
            },
            { 
                film_id: films.find(f => f.title === "Blade Runner")._id, 
                box_office_fr: 2130000, 
                box_office_us: 95000000 
            },
            { 
                film_id: films.find(f => f.title === "Predator")._id, 
                box_office_fr: 1500000, 
                box_office_us: 120000000 
            }
        ];

        // Insérer les données dans la collection "exploitation"
        const result = await db.collection('exploitation').insertMany(dataToInsert);
        console.log(`${result.insertedCount} films ajoutés à la collection exploitation avec succès.`);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close(); // Ferme la connexion à la base de données
    }
}

createExploitationCollection().catch(console.error);

// CREATION DE LA COLLECTION 2EME VERSION -----------------------

const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const filmsArray = [
    { title: "Ben-Hur", box_office_fr: 13850000, box_office_us: 98000000 },
    { title: "E.T. l'extra-terrestre", box_office_fr: 9420000, box_office_us: 140000000 },
    { title: "Mars Attacks!", box_office_fr: 2_150_000, box_office_us: 100_000_000 },
    { title: "Blade Runner", box_office_fr: 2130000, box_office_us: 95000000 },
    { title: "Predator", box_office_fr: 1500000, box_office_us: 120000000 }
  ];
  
  async function insertFilms(films) {

const url = 'mongodb://localhost:27017/exo_films';
const client = new MongoClient(url);
const db =  client.db();

try {
    await client.connect();

    for (const film of films) {
      try {
        const filmData = await db.collection('films').findOne({ title: film.title }, { projection: { _id: 1 } });
  
        if (filmData) {
          await db.collection('exploitation2').insertOne({ // créé automatiquement une nouvelle collection
            "Titre du film": film.title,
            box_office_fr: film.box_office_fr,
            box_office_us: film.box_office_us,
            film_id: filmData._id
          });
        } else {
          console.log(`Le film ${film.title} n'a pas été trouvé.`);
        }
      } catch (error) {
        console.error(error);
      }
    }


    
} finally {
    await client.close();

}
  }
  
  insertFilms(filmsArray).catch(console.error);



  // 1 -----------------------------------

  const result = await db.collection('films').aggregate([
    {
        $lookup: {
            from: 'exploitation', // Nom de la collection à joindre
            localField: '_id',   // Champ de la collection films
            foreignField: 'film_id', // Champ de la collection exploitation
            as: 'boxOfficeData' // Nom du champ pour stocker le résultat de la jointure
        }
    },
    {
        $unwind: '$boxOfficeData'
    },
    {
        $project: {
            _id: 0,
            title: 1, 
            box_office_fr: '$boxOfficeData.box_office_fr'
        }
    }
]).toArray();

// Afficher les résultats
// console.log("Titre des films et box-office français :");
// result.forEach(film => {
//     console.log(`Titre: ${film.title}, Box-office FR: ${film.box_office_fr}`);
// });

  // 2 -----------------------------------

  const sommeEntreesFrenchBO = await db.collection('exploitation').aggregate([
    {
        $lookup: {
            from: 'films', 
            localField: 'film_id', 
            foreignField: '_id', 
            as: 'filmData' 
        }
    },
    {
        $unwind: '$filmData' 
    },
    {
        $group: {
            _id: '$filmData.country', 
            totalBoxOfficeFR: { $sum: '$box_office_fr' } 
        }
    },
    {
        $project: {
            _id: 0, 
            country: '$_id', 
            totalBoxOfficeFR: 1 
        }
    },
    {
        $sort: { totalBoxOfficeFR: -1 } 
    }
]).toArray();
// console.log("Somme des entrées au Box-Office Français par pays d'origine :");
        // sommeEntreesFrenchBO.forEach(item => {
        //     console.log(`Pays: ${item.country}, Total Box-office FR: ${item.totalBoxOfficeFR}`);
        // });

        
        
        
// 3 -----------------------------------

const ridleyScott  = await db.collection('exploitation').aggregate([
    {
        $lookup: {
            from: 'films',
            localField: 'film_id',
            foreignField: '_id',
            as: 'box_office_data'
        }
    },
    {
        $unwind: "$box_office_data"
        
    },
    {
        $match: {
            'box_office_data.director.last_name': 'Scott',
            'box_office_data.director.first_name': 'Ridley'
        }
    },
    {
        $project: {
            "title": "$box_office_data.title",
            'box_office_fr': 1,
            'box_office_us': 1
        }
    }
]).toArray();
// console.log(ridleyScott);

// ridleyScott.forEach(movie => {
//     console.log(`Titre: ${movie.title}, Box-office FR: ${movie.box_office_fr}, Box-office US: ${movie.box_office_us}`);
// });


// 4 ----------------------------------------------

const filmsComplets = await db.collection('exploitation').aggregate([
    {
        $lookup: {
            from: 'films',
            localField: 'film_id',
            foreignField: '_id',
            as: 'films_data'
        }
    },
    {
        $unwind: '$films_data' 
    },
    { // addFields ou group marche aussi
        $project: {
            _id: 0,
            titre_film: '$films_data.title',
            box_office_fr: 1,
            box_office_us: 1,
            acteurs: {
                $map: {
                    input: '$films_data.actors', 
                    as: 'acteur',
                    in: {
                        prenom: '$$acteur.first_name',
                        nom: '$$acteur.last_name',
                        age: { 
                            $subtract: [
                                { $year: "$$NOW" },
                                '$$acteur.birth_date'
                            ]
                        }
                    }
                }
            }
        }
    }

]).toArray();
// filmsComplets.forEach(film => {
//     console.log(`Titre: ${film.titre_film}`);
//     console.log(`Box Office (FR): ${film.box_office_fr}`);
//     console.log(`Box Office (US): ${film.box_office_us}`);
//     film.acteurs.forEach(acteur => {
//         console.log(`  Nom complet : ${acteur.prenom} ${acteur.nom}, Âge: ${acteur.age}`);
//     });
//     console.log("- - - - - - - - - - -"); // Ligne vide pour séparer chaque film
// });



// - - - - - - -  AUTRE MANIERE - - - - - - -


const filmsComplets2 = await db.collection('exploitation').aggregate([
{
$lookup: {
    from: 'films',
    localField: 'film_id',
    foreignField: '_id',
    as: 'films_data'
}
},
{
$unwind: '$films_data' 
},
{
$addFields: {
actors_field: {
    $map: {
        input: '$films_data.actors',
        as: 'acteur',
        in: {
            name: { $concat: ["$$acteur.first_name", " ", "$$acteur.last_name"]},
            age: {$subtract: [ new Date().getFullYear(), '$$acteur.birth_date' ]}
        }
    }
}
}
},

{ 
$project: {
    _id: 0,
    titre_film: '$films_data.title',
    box_office_fr: 1,
    box_office_us: 1,
    actors: "$actors_field"
}
}

]).toArray();
// filmsComplets2.forEach(film => {
//     console.log(`Titre: ${film.titre_film}`);
//     console.log(`Box Office (FR): ${film.box_office_fr}`);
//     console.log(`Box Office (US): ${film.box_office_us}`);
//     film.actors.forEach(acteur => {
//         console.log(`  Nom complet : ${acteur.name}, Âge: ${acteur.age}`);
//     });
//     console.log("- - - - - - - - - - -"); // Ligne vide pour séparer chaque film
// });


// 5 -----------------------------------------------

const ageLessThan70 = await db.collection("exploitation").aggregate([
    {
        $lookup: {
            from: "films",
            localField: "film_id",
            foreignField: "_id",
            as: "film_data"
        }
    },
    {
        $unwind: "$film_data"
    },
    {
        $addFields: {
            avg_actor_age: {
                $avg: {
                    $map: {
                        input: "$film_data.actors",
                    as: "acteur",
                        in: {
                            $subtract: [{ $year: "$$NOW" }, "$$acteur.birth_date"]
                        }
                }
            }
        }
    }
},

    {
        $match: { avg_actor_age: { $lt: 70 } }
    },
    {
        $project: {
            _id: 0,
            title: "$film_data.title",
            box_office_fr: 1,
            box_office_us: 1,
            avg_actor_age: 1
        }
    }
]).toArray();

// ageLessThan70.forEach(film => {
//     console.log(`Titre: ${film.title}`);
//     console.log(`Box Office FR: ${film.box_office_fr}`);
//     console.log(`Box Office US: ${film.box_office_us}`);
//     console.log(`Moyenne d'âge des acteurs: ${film.avg_actor_age}`);
//     console.log("- - - - - - - - - - - - - - ");
// });