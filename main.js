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
        this.disabled = false;
    }
}

const coreData = {
    allBakedCookies: 0,
    currentCookies: 0,
    multiplierSum: 0,
    singleClickMultiplier: 0,
    priceModifier: 0.15,
    buildingCount: 0,
    multiplierCount: 0,
    singleCLickPoint: 0,
}

const allBuildings = {};


//logic
make_Buildings_And_Fill_allBuildings();








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