const http = require('http');
const fs = require('fs');

const base = 'http://mek.oszk.hu/adatbazis/magyar-nyelv-ertelmezo-szotara/szotar.php';

let letters = ['A','Á','B','C','Cs','D','Dz','Dzs','E','É','F','G','Gy','H','I','Í','J','K','L','Ly','M','N','Ny','O','Ó','Ö','Ő','P','Q','R','S','Sz','T','Ty','U','Ú','Ü','Ű','V','W','X','Y','Z','Zs'];
let crawl = 0;
let letter = 'A';
let offset = 0;
let dic = new Set();


function walk () {
    http.get(encodeURI(`${base}?kezdobetu=${letter}&offset=${offset}`), res => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        res.on('end', () => {
            let linkR = /<a href=.?\?szo=([^&]*)/g;
            let r;
            let count = 0;
            while ((r = linkR.exec(rawData)) !== null) {
                count++;
                let w = decodeURIComponent(r[1]).replace(/\+\[.*]/, '');
                dic.add(w);
            }
            if (count > 2) {
                offset++;
                setTimeout(walk, 500 + Math.floor(Math.random() * 900));
            } else {
                fs.writeFileSync(`${letter}.tsv`, [...dic].join('\n'));
                offset = 0;
                dic = new Set();
                crawl++;
                letter = letters[crawl];
                if (letter){
                    setTimeout(walk, 500 + Math.floor(Math.random() * 900));
                }
            }
            console.log(letter, offset, count);
        }).on('error', e => {
            console.log(e);
            walk();
        });
    }).on('error', e => {
        console.log(e);
        walk();
    });
}

walk();
