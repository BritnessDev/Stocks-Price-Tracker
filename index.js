const express= require('express');
const path=require('path');
require('dotenv').config();
const port =process.env.PORT || 8000;
const request = require('request');
const app = express();
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,"assets")))
app.set('view engine','ejs')
app.get('/', (req,res)=>{
   res.render('home',{marketPrice: null,price:null});
})

app.post('/submit', (req,res)=>{
const {symbol,time} = req.body;
console.log(symbol,time);
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${time}min&apikey=${process.env.KEY}`;
 var marketPrice=0,price=0;
request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, response, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (response.statusCode !== 200) {
      console.log('Status:', response.statusCode);
    } else {
        const resData = data[`Time Series (${time}min)`]
       marketPrice=resData[Object.keys(resData)[0]]['1. open'];
       price=resData[Object.keys(resData)[1]]['1. open'];
    //    console.log(marketPrice, price);
     res.render('home',{marketPrice: marketPrice,price:price});
    }
});

})

app.listen(port,()=>{
    console.log('listening on port',port);
})
