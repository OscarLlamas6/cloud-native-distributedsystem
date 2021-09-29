const URI = process.env.COSMOSDB_CONNECTION

var MongoClient = require('mongodb').MongoClient;

async function collection() {
    try {
        let connection = (await MongoClient.connect(URI)).db("SOPES1").collection("TWEET")
        console.log('Mongo db is connected')
        return connection
    } catch (error) {
        return null
    }
}

export const allTweets = async () => {
    const tweets = await collection()
    const allTweets = await tweets.find({}).toArray()
    //console.log(allTweets)
    return allTweets
}

//allTweets()

export const countTweets = async () => {
    const tweets = await collection()
    const count = await tweets.count({})
    //console.log(count)
    return count
}

//countTweets()
export const countHashTags = async () => {
    let arra = []
    const tweets = await collection()
    const allTweets = await tweets.find({}).toArray()
    for (const tweet of allTweets) {
        if (tweet.hashtags !== null && tweet.hashtags !== undefined && Array.isArray(tweet.hashtags)) {

            for (const iterator of tweet.hashtags) {
                arra.push(iterator)
            }
        }
    }
    let arrb = new Set(arra)
    //console.log(arrb.size)
    return arrb.size
}

//countHashTags()

export const countUpvotes = async () => {
    let count = 0
    const tweets = await collection()
    const allTweets = await tweets.find({}).toArray()
    for (const element of allTweets) {
        if (element.upvotes !== null && element.upvotes !== undefined && !isNaN(element.upvotes)) {
            //console.log(parseInt(element.upvotes))
            count += parseInt(element.upvotes)
        }
    }
    //console.log('Conteo de votos', count)
    return count
}

//countUpvotes()

export const upvotesVSdownvotes = async () => {
    let up_array = {}
    let down_array = {}
    const tweets = await collection()
    const allTweets = await tweets.find({}).toArray()
    for (const element of allTweets) {
        if (element.upvotes !== null && element.upvotes !== undefined && !isNaN(element.upvotes) && element.fecha !== '') {
            if (up_array[element.fecha] === undefined || up_array[element.fecha] === null) up_array[element.fecha] = parseInt(element.upvotes)
            else up_array[element.fecha] += parseInt(element.upvotes)
        }
        if (element.downvotes !== null && element.downvotes !== undefined && !isNaN(element.downvotes) && element.fecha !== '') {
            if (down_array[element.fecha] === undefined || down_array[element.fecha] === null) down_array[element.fecha] = parseInt(element.downvotes)
            else down_array[element.fecha] += parseInt(element.downvotes)
        }
    }

    let arreglo = [up_array, down_array]
    //console.log(arreglo)
    return arreglo
}

//upvotesVSdownvotes()

export const topHashtags = async () => {
    let arr = {}
    const tweets = await collection()
    const allTweets = await tweets.find({}).toArray()
    for (const tweet of allTweets) {
        if (tweet.hashtags !== null && tweet.hashtags !== undefined && Array.isArray(tweet.hashtags)) {

            for (const iterator of tweet.hashtags) {
                if (tweet.upvotes !== null && tweet.upvotes !== undefined && !isNaN(tweet.upvotes)) {
                    if (arr[iterator] === undefined || arr[iterator] === null) arr[iterator] = parseInt(tweet.upvotes)
                    else arr[iterator] += parseInt(tweet.upvotes)
                }
            }
        }
    }

    const sortable = Object.fromEntries(
        Object.entries(arr).sort(([, a], [, b]) => b - a)
    );
    //console.log(sortable);
    return sortable
}

export const recentPosts = async () => {
    const tweets = await collection()
    const count = await tweets.count({})
    const allTweets = await tweets.find({}).skip((count > 5 ? count - 5 : 0)).limit(5).toArray()
    //console.log(allTweets)
    return allTweets
}

//topHashtags()

/*
tweets.find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
    });

MongoClient.connect(URI, function (err, db) {
    if (err) throw err;
    var dbo = db.db("SOPES1");
    dbo.collection("TWEET").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

*/
