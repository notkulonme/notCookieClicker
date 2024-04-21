let allBakedCookies = 0; // all baked cookies so far
let cookies = 0; //current number of cookies
//how many points a single click gives
const priceModifier = 0.15; //modifies the price after evry new building
//-----you have to define all the building in the 2 json------
const points = {
    "singleClick" : 1,
    "Auto Clicker": 1,
    "grandpa" : 100,
    "Farm" : 1000,
    "Robot" : 10000,
};
const prices={
    "Auto Clicker":40,
    "grandpa" : 150,
    "Farm" : 1000,
    "Robot" : 10000,
};
//-----you have to define all the building in the 2 json above------


const multiplier = {
    "multiplier" : 0,//base multiplyer
    "singleClick" : 0,
};
//dont touch it
const count = {
    buildings : 0,
    multiplier : 0,
};

const cpsHolder = {
    holder : document.getElementById("cpsHolder"),
    ready : true,
    cps : 0,
    cpsBoosted : 0,
}
const disabled = {}


fillJSON();//fils the empty objects
loadAllBuilding();// loads all building
loadMultipliers();//loads all multiplier
console.log(Object.values(multiplier["Auto Clicker"]).includes(240));

//handles both user input and automatic clicks
function handleClick(type){
    let newCookies = 0;
    if(type !== "cps" && type !== "singleClick"){
        newCookies = count[type]*points[type] + count[type]*points[type]*(multiplier.multiplier+multiplier[type].multiplier);
    }
    else if(type === "cps"){
        newCookies = cpsHolder.cps + (cpsHolder.cps*multiplier.multiplier);
    }
    else if (type === "singleClick"){
        newCookies = points.singleClick + points.singleClick*(multiplier.singleClick+multiplier.multiplier)
    }
    cookies += newCookies;
    allBakedCookies += newCookies;
    refresh();
}

//refreshes the main value holders
function refresh(){
    document.getElementById("cookieHolder").innerText = "Cookies: "+ Math.round(cookies);
    document.getElementById("allCookieHolder").innerText = "all baked cookies: "+Math.round(allBakedCookies);
    
    recalculateMultiplier();
    cpsHolder.cpsBoosted = cpsHolder.cps + cpsHolder.cps*multiplier.multiplier;
    if(cpsHolder.ready){
        cpsHolder.holder.innerText = "cps: " + cpsHolder.cpsBoosted;
    }
    document.getElementById("cpsPlus").innerText = "current boost: "+(multiplier.multiplier*100).toFixed(2)+"%";
    loadAllBuilding();
    loadMultipliers();
}

//handles buying a new building
function buyBuilding(type){
    if (cookies >= prices[type]){
        //raises the variables
        cookies = cookies - prices[type];
        count.buildings += 1;
        cpsHolder.cps += points[type];
        count[type] += 1;
        //sets new prize for the building
        prices[type] = prices[type] + Math.round(prices[type]*priceModifier) 
        
        
        //refreshes the screen
        refresh();
    }
    else if(count.buildings>0){
        noBuy("not enough cookie");
    }

}

//handles buying a new multiplier
function buyMultiplier(bought){

    if(count[bought]!=0 && cookies >= multiplier[bought].price){
        multiplier[bought].multiplier += 0.2; //+20%
        multiplier[bought].price = multiplier[bought].price * 2; //double those prices

        //recalculates the cps
        recalculateMultiplier();

        cpsHolder.cpsBoosted = cpsHolder.cps + (cpsHolder.cps*multiplier.multiplier);

        refresh();
        count.multiplier += 1;
        
    }
    else if(count.buildings > 0){
        noBuy("you have to buy the building first");
    }
    else{
        noBuy("not enough cookies");
    }

   
}

function recalculateMultiplier(){
    multiplier.multiplier = 0;//because of the recalculation
    for(let key in multiplier){
        if(key != "multiplier" && key != "singleClick" && count[key] > 0){
            multiplier.multiplier += count[key]/count.buildings * multiplier[key].multiplier;;
        }
    }
}

// changes the texts after the first click
function firstClick(){
    handleClick("singleClick");
    setInterval(function(){ handleClick("cps");}, 1000); 
    document.getElementById("clickButtonHolder").innerHTML = '<img src="cookie.png" width="10%" class="rotating" onclick="handleClick(\'singleClick\')">';
}




//writes to cps place holder if the buying has failed
async function noBuy(cause){
    cpsHolder.ready = false;
    document.getElementById("cpsHolder").innerText = cause;
    await sleep(3000);
    document.getElementById("cpsHolder").innerText = "cps: "+cpsHolder.cps;
    cpsHolder.ready = true;
}

function fillJSON(){
    count.buildings = 0;
    for(let key in prices){
        multiplier[key] = {
            "multiplier":0,
            "price": prices[key]+prices[key]*5
            };
        count[key] = 0;
        //should be false to load them to the screen at start
        disabled[key] = false;
        disabled[key+"multiplier"] = false;
    }
}

//draws the multipliers to the screen
function loadMultipliers(){
    
    const multiplierHolder = document.getElementById("modifierHolder");
   
    let shouldRefresh = false;
    
    for(let key in multiplier){
        let previous = disabled[key+"multiplier"];
        if(cookies < multiplier[key].price || count[key] == 0){
            disabled[key+"multiplier"] = true;
        }
        else{
            disabled[key+"multiplier"] = false;
        }
        
        if(previous != disabled[key+"multiplier"]){
            shouldRefresh = true;
        }
    }
    if(shouldRefresh){
        multiplierHolder.innerHTML = "";
        for(let key in multiplier){
            if(key != "multiplier" && key != "singleClick"){
                let isDisabled = "";
                if(disabled[key+"multiplier"]){
                    isDisabled = "disabled"
                }
                let htmlContent = "<div onclick='buyMultiplier(\"" + key + "\")' class='allButton "+isDisabled+"'>"+key+" +20% for " + multiplier[key].price + " cookies<br>you have +"+multiplier[key].multiplier*100+"%</div><br>";
                multiplierHolder.innerHTML += htmlContent;
            }
        }
    }
}

//draws the buildings to the screen
function loadAllBuilding(){
    let loader = document.getElementById("buildingButtonHolder");
    let shouldRefresh = false;
    for(let key in prices){
        const previous = disabled[key];
        if(cookies < prices[key]){
            disabled[key] = true;
        }else{
            disabled[key] = false;
        }
        if(previous != disabled[key]){
            shouldRefresh = true;
        }
    }
    if(shouldRefresh){
        loader.innerHTML = "";
        for(let key in prices){
            let isDisabled = "";
            if(disabled[key]){
                isDisabled = "disabled";
            }
            loader.innerHTML += "<div class='allButton "+isDisabled+"' onclick='buyBuilding(\"" + key + "\")'>buy one " + key + " for " + prices[key] + " cookie<br> gives: +"+ points[key]+"<br>you have: "+count[key]+"</div><br>";
            
        }
    }
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}