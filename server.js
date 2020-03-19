const filename = process.argv[2];
const moment = require("moment");
const puppeteer = require('puppeteer')
const fs = require("fs");
const url = "https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6";
function delay(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  
const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("#ember34")
    // console.log(output);
    await delay(1000);
    const holder = await page.$("#ember34");
    const holder2 = await holder.$$(".external-html");
    const data = await Promise.all(holder2.map(h => {
        return Promise.all([
            h.$("h5 span").then(h => h.evaluate(element => parseInt(element.textContent)), h),
            h.$("h5 span:nth-child(3)").then(h => h.evaluate(element => element.textContent), h)
        ])
    }))
    const now = Date.now();
    const result = data.map(d => {
        console.log(d);
        const [total, ...place] = d;
        return {
            total,
            place: place.join(" ").includes("Korea") ? "South Korea" : place.join(" "),
            now
        }
        // const pieces = d.split(" ");
        // const number = pieces[0];
        // const place = pieces.slice(1).join(" ");
        // return {
        //     time:now,
        //     number,
        //     place
        // }
    })
    console.log(result);

    
    const fileData = "Date, Place, Count \n" + 
    result.map(r => `${r.now}, ${r.place}, ${r.total}`).join(",");

    fs.writeFile(filename, fileData, () => {
        console.log(`${filename} updated`);
        browser.close();
    })
};

main();

// Confirmed Cases by Country/Region/Sovereignty
