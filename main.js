//organized version of the previuos code

//variables
class Building{
    constructor(name, price, point){
        this.name = name;
        this.price = price;
        this.point = point;
        this.count = 0;
        this.multiplierPercentage = 0;
        this.multiplierPrice = price *6;
        this.disabled = true;
    }

    buyBuilding() {
        if(coreData.currentCookies >= this.price){
            coreData.currentCookies -= this.price;
            this.count += 1;
            this.price *= coreData.priceModifier;
            console.log("succesful transaction")
            //refresh()
        }
        else{
            console.error("not enogh cookies");
        }
    }
    //TODO: a refresher function which is capable of refreshing the buildings and multipliers holder
    
}

const coreData = {
    allBakedCookies: 0,
    currentCookies: 0,
    cpsMultiplier: 0,
    singleClickMultiplier: 0,
    priceModifier: 0.15,
    buildingCount: 0,
    multiplierCount: 0,
    singleCLickPoint: 1,
}

const cpsHolder = {
    holder : document.getElementById("cpsHolder"),
    ready : true,
    cps : 0,
    cpsBoosted : 0,
}


const allBuildings = {};


//logic
make_Buildings_And_Fill_allBuildings();
buildHtml();







//functions
function make_Buildings_And_Fill_allBuildings(){
    //contanis all
    let buildingListBuffer = []
    buildingListBuffer.push(new Building("Clicker",40,1), new Building("grandpa",300,10), new Building("Farm",1000,20), new Building("Robot",2000,50))
    
    console.log(buildingListBuffer)
    for(i = 0; i < buildingListBuffer.length; i++){
        const buffer = buildingListBuffer[i];
        allBuildings[buffer.name] = buffer;
    }
    console.log(allBuildings)
}

function buildHtml(){
    const builingHolder = document.getElementById("buildingButtonHolder");
    const multiplierHolder = document.getElementById("modifierHolder");

    for(let name in allBuildings){
        const building = allBuildings[name];
        
        builingHolder.innerHTML +=  "<div class='allButton disabled' id='"+building.name+"ID"+
        "' onclick='buyBuilding(\"" + building.name + "B\")'>buy one " + building.name + " for " + building.price + 
        " cookies<br> gives: +"+ building.point +"<br>you have: "+building.count+"</div><br>";

        multiplierHolder.innerHTML += "<div onclick='buyBuilding(\"" + name+"M" + "\")' id='" + name+"MultiplierID" +"' class='allButton disabled'>"+name+" +20% for " + building.multiplierPrice + " cookies<br>you have +"+building.multiplierPercentage +"%</div><br>";
    }
}

function clickHandler(type){
    if(type == "user"){
        incrementCookies(coreData.singleCLickPoint);
    }
    if(type == "cps"){
        incrementCookies(coreData.cps)
    }
}

function incrementCookies(count){
    coreData.allBakedCookies += count;
    coreData.currentCookies += count
}

function buyBuilding(buildingNameT){
    const buildingType = buildingNameT.substring(buildingNameT.length-1);
    const buildingName = buildingNameT.substring(0, buildingNameT.length-1);

    if(buildingType == "B"){
        allBuildings[buildingName].buyBuilding();
    }
    else if(buildingType == "M"){
        allBuildings[buildingName].buyMultiplier();
    }
    else{
        console.error("Invalid argument");
    }
}