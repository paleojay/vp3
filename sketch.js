//Create variables here
var dog,dogi;
var happyDog;
var database;
var foodS;
var foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var changState;
var readState; 
var bedroom, garden, washroom;

function preload(){
 bedroom=loadImage("image/image/bedroom.png")
 garden =loadImage("image/image/garden.png")
 washroom=loadImage("image/image/washroom.png")

	dogi=loadImage("image/image/dog.png")
	happyDog=loadImage("image/image/happydog.png")
}

function setup() {
  database=firebase.database();
    console.log(database);
	createCanvas(500, 500);
  
	dog=createSprite(width/2, 80, 50,50);
	dog.addImage(dogi)
  dog.scale=0.2
  
  foodObj = new Food();

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  var foodStock=database.ref('ball/position');
  foodStock.on("value",readStock);

  var readState  = database.ref('gameState');
  readState.on("value",function(data){
    readState = data.val();
  })
}


function draw() {  
  background("white");

  var fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    playercount=data.val()
  })
  fill(255,255,244)
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM",350,30);
  }else if(lastFed>=0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+ "AM",350,30);
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}

currentTime=hour();
if(currentTime==(LastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(LastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(LastFed+2) && currentTime<=(LastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}

  addFoods();
  readStock();
  writeStock();
  feedDog();

foodObj.Display();
  drawSprites();
  //add styles here
  textPrint(foodStock);
  textSize(20);
  textfill("white");
  textstroke(5);
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
   x=x-1;
  }
  database.ref('/').update({
      Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog)


  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  FoodS++;
  database.ref('/').update({
    Food:FoodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}



