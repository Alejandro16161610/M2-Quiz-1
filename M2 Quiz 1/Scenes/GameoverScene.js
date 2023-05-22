export default class GameoverScene extends Phaser.Scene{
  
  constructor(){
    super("GameoverScene");
  }

  create(){
      this.add.text(20,20,"GAME OVER",{font: "25px Arial",fill: "yellow"});
    }
}