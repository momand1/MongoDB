const { MongoClient } = require("mongodb");

// Connection URI 
const uri = "mongodb://localhost:27017";

// Database and Collection Name
const dbName = "moviesDB";
const collectionName = "movies";

const movies = [
    {
        title: "Jaws",
        director: "Steven Spielberg",
        genre: "Adventure",
        releaseYear: 1975,
        actors: ["Roy Scheider", "Robert Shaw", "Richard Dreyfuss"],
        summary: "A giant man-eating shark terrorizes a town."
    },
    {
        title: "Memento",
        director: "Christopher Nolan",
        genre: "Thriller",
        releaseYear: 2000,
        actors: ["Guy Pearce", "Carrie-Anne Moss", "Joe Pantoliano"],
        summary: "A man with short-term memory loss hunts for his wife's murderer."
    },
    {
        title: "The Dark Knight",
        director: "Christopher Nolan",
        genre: "Action",
        releaseYear: 2008,
        actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        summary: "Batman faces the Joker in a battle for Gotham City."
    }
];

async function main() {
    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert Data
        const result = await collection.insertMany(movies);
        console.log(`${result.insertedCount} documents were inserted.`);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        // Close the connection
        await client.close();
    }
}

main().catch(console.error);
