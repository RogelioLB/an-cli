const puppeteer = require("puppeteer");

let browser;

((async()=>{
    browser = await puppeteer.launch({headless:true,args:['--disable-features=site-per-process']})
}))()

const getBrowser = () => browser;
const getHtml = async(url) =>{
    const page = await browser.newPage();
    const response = await page.goto(url,{waitUntil:"networkidle2"});
    await page.screenshot({path:"imagen.png"})
    const body = await response.text();
    return body;
}

const getLastIframe = async(url) => {
    const page = await browser.newPage();
    await page.goto(url,{waitUntil:"networkidle2"});
    try{
        const iframe = await page.frames()[1]
        const src = await iframe.url();
        if(!src.includes("http")) return await getLastIframe(url);
        console.log(src)
        if(src){
            return await getLastIframe(src);
        }
    }catch(err){
        await page.waitForSelector(".loading-container svg");
        const button = await page.$(".loading-container svg");
        await button.click();
        await page.waitForSelector("video");
        const video = await page.$("video")
        return await video.getProperty("src").then(x=>x.jsonValue());
    }
}

module.exports ={ getHtml , getBrowser, getLastIframe}