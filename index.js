#! /usr/bin/node
const inquirer = require("inquirer");
const cp = require("child_process")
const ch = require("cheerio");
const {getBrowser,getHtml, getLastIframe} = require("./utils");

const prompt = inquirer.createPromptModule();

prompt({message:"Ingresa el anime a buscar en https://animeflv.video/",name:"name"}).then(async res=>{
    const html = await getHtml(`https://animeflv.video/?s=${res.name}`)
    let $ = ch.load(html);
    let animes = [];
    $(".Anime").each((i,el)=>{
        const title = $("h3",el).text();
        const link = $("a",el).attr("href");
        animes.push({id:i,name:title,short:title,value:link})
    })
    if(!animes.length) {
        console.log("No hay animes con esa coincidencia.")
        return getBrowser().close()
    }
    const {choosed} = await prompt({
        name:"choosed",
        choices:animes,
        type:"list",
        message:"Escoge tu anime a ver: "
    })
    const animePage = await getHtml(choosed)
    $ = ch.load(animePage);
    let listOfEpisodes = [];
    $("li","ul.ListCaps").each((i,el)=>{
        const episode = $("p",el).text()
        const value = $("a",el).attr("href");
        listOfEpisodes.push({name:episode,value,short:episode})
    });
    listOfEpisodes = listOfEpisodes.map((ep,i,arr)=>{
        return {name:ep.name.replace(arr.length-i,i+1),value:ep.value,short:ep.short.replace(arr.length-i,i+1)}
    });
    const {episode} = await prompt({message:"¿Que capitulo quieres ver?",choices:listOfEpisodes,name:"episode",type:"list"});
    const src = await getLastIframe(episode)
    cp.exec(`mpv "${src}"`)
    getBrowser().close();
})