class Game {
  constructor(){
  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",car1_img);
    car1.scale = 0.5;
    car2 = createSprite(300,200);
    car2.addImage("car2",car2_img);
    car2.scale = 0.5;
    car3 = createSprite(500,200);
    car3.addImage("car3",car3_img);
    car3.scale = 0.5;

    car4 = createSprite(700,200);
    car4.addImage("car4",car4_img);
    car4.scale = 0.5;
    cars = [car1, car2, car3, car4];

    Coins = new Group();
    this.addSprites(Coins, 18, coinImage, 0.09);

    Obstacles = new Group();
    this.addSprites(Obstacles, 6, obstacleImg, 0.03);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++){
      var x, y;

      if (positions.length > 0){
        x = positions[i].x;
        y = positions[i].y;
      } else {
        x = random(width / 4.5, width - 225);
        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(ground);
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 175 ;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        var names=allPlayers[plr].name;
        console.log(names);

        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,80,60);

          this.handleCoins(index);
          this.handleObstacles(index);

          fill("white");
          textSize(20);
          text(names,x,y-70);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
          
          fill("white");
          textSize(40);
          text("Score: " + allPlayers[plr].name + " - " + allPlayers[plr].score, 200, y);
          text("Score: " + allPlayers[plr].name + " - " + allPlayers[plr].score, 200, y);
          text("Score: " + allPlayers[plr].name + " - " + allPlayers[plr].score, 200, y);
          text("Score: " + allPlayers[plr].name + " - " + allPlayers[plr].score, 200, y);
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    if(player.distance > 4340){
      gameState = 2;
      player.rank +=1;
      Player.updateCarsAtEnd(player.rank);
      swal({
        title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
        //score: `Score:${"\n"}${allPlayers[plr].score}`,
        text: "You have successfully reached the finish.",
        imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok",
      });
    }
   
    drawSprites();
  }

  handleCoins(index){
    cars[index - 1].overlap(Coins, function(collector, collected) {
      player.score +=21;
      player.update();
      collected.remove();
    })
  }

  handleObstacles(index){
    cars[index - 1].collide(Obstacles, function(collector, collected) {
      gameState = 2;
      image(blast, 0, 0, 600, 600);
      collected.remove();
    })
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}
