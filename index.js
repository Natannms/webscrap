const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const axios = require('axios');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/webscrap/element', async (req, res) => {
    //launch browser in headless mode
    const browser = await puppeteer.launch()
    //browser new page
    const page = await browser.newPage()
    //launch URL
    await page.goto('https://sylnifty.com/?page_id=1839&lang=pt')
    //identify element
    const f = await page.$("[class='exad-advance-tab-content-description']")

    //get all text in <p> in  the element
    const text2 = await page.evaluate(() => Array.from(document.querySelectorAll("[class='exad-advance-tab-content-description'] p"), element => element.textContent));

    const myarray = text2.map(function (item) {
        //retornar novo array separando cada elemento por (titulo:conteudo)
        return item.split(':');
    })
    const objectRequest = [];

    myarray.forEach(element => {
        if (element.length === 2) {
            objectRequest.push(
                [
                    element[0],
                    element[1]
                ]
            );
        }
    });

    //request with axios from laravel
    await axios.post('http://127.0.0.1:8000/api/wiki', objectRequest)
        .then(function (response) {
            const ToJson = JSON.stringify(response.data);
            res.send(ToJson)
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});