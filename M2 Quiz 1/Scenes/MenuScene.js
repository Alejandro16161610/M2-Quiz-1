export default class MenuScene extends Phaser.Scene{

  constructor(){
    super("MenuScene");
 }

preload(){

}

  create(){
   let starttext = this.add.text(100,100, "Play");
   starttext.setInteractive({usehandcursor:true});
   starttext.on('pointerdown',() => this.startbutton());
  }

startbutton(){
  console.log("LOADING");
  this.scene.start("GameScene");
}

}
