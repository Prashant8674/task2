import fetch from 'node-fetch';
import mongoose, { mongo } from 'mongoose';

mongoose.set('strictQuery', true);

mongoose.connect("mongodb://127.0.0.1/FETCH_WEATHER_DATA");

const postSchema = new mongoose.Schema({

    latitude: {
        type: Number,
        required: true
    }
    ,

    longitude: {
        type: Number,
        required: true
    }
    ,

    timezone: {
        type: String,
        required: true
    }
    ,
    currently: [{
        time: {
            type: Number,
            required: true
        },
        temperature: {
            type: Number,
            required: true
        }
    }],
    hourly: [{
        summery: {
            type: String,
            required: true
        }
    }],
    flag: [{
        units: {
            type: String,
            required: true
        }
    }]
});

const Post = mongoose.model('weatherdata', postSchema);

async function fetchedWeatherData() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'a46dd8c803msh6c449b922a7ce29p1c06ccjsndee2b3b66be9',
            'X-RapidAPI-Host': 'dark-sky.p.rapidapi.com'
        }
    };
    const fetchedWeatherData = await fetch("https://dark-sky.p.rapidapi.com/20.593684,78.96288?units=auto&lang=en", options);
    const response1 = await fetchedWeatherData.json();
    //const response2 = JSON.parse(response1);

    const array = [];
    array.push(response1)


    for (let i = 0; i < array.length; i++) {
        const post = new Post({

            latitude: array[i]['latitude'],
            longitude: array[i]['longitude'],
            timezone: array[i]['timezone'],
            currently: array[i][{ 'currently': 'time' }, { 'currently': 'temperature' }],
            hourly: array[i][{ 'hourly': 'summery' }],
            flag: array[i][{ 'flag': 'units' }]
        });
        post.save();
        console.log(post);

    }

}
fetchedWeatherData();