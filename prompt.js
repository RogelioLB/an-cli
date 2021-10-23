const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on("line",(input)=>console.log(input))

rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});