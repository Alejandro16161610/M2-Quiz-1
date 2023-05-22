import MS from  "./MenuScene.js";
import GS from "./GameScene.js";
import GOS from "./GameoverScene.js";

let MenuScene = new MS();
let GameScene = new GS();
let GameoverScene = new GOS();

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};

let gaem = new Phaser.Game(config);

gaem.scene.add('MenuScene',MenuScene);
gaem.scene.add('GameScene',GameScene);
gaem.scene.add('GameoverScene',GameoverScene);

gaem.scene.start('MenuScene')