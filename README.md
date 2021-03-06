# Phaser 3 Dungeon Crawler Tutorial

[TRY IT HERE!](https://gifted-keller-010eef.netlify.app/)

Learning how to use Phaser 3 to build an RPG dungeon crawler.
Based on tutorial series on Ourcade by Tommy Leung aka [@supertommy](https://github.com/supertommy).

[Dungeon Crawler in Phaser 3](https://www.youtube.com/playlist?list=PLumYWZ2t7CRtgjbZK0JMoXHjebeYmT85-)

Tools:

- [Tiled - tilemap editor](https://www.mapeditor.org/)
- [Free Texture Packer](https://free-tex-packer.com/app/)
- [Bitmap Font Generator Online - SnowB BMF](https://snowb.org/)

Assets credits:

- [Dungeon Tileset II - 0x72](https://0x72.itch.io/dungeontileset-ii)
- [Abaddon Font - Caffinate](https://caffinate.itch.io/abaddon)

Setup:

1. `yarn add webpack webpack-cli -D` to install webpack.
2. `npx webpack-cli init` to initialize webpack.
3. `yarn add phaser` to install phaser.
4. `yarn add file-loader -D` to install `file-loader` for webpack.
5. Use `file-loader` in webpack.config.js to serve static images.

Use `yarn serve` to run locally.

Notes:

1. For bottom walls add to the wall_above layer on top as a mask to hide objects like the character weapon that exceeds the character physics body box when it extends pass the walls.

TODO:

1. change string references to consts.
2. Implement restart mechanics.
3. Improve speech system.
4. Touch controls.
5. Add timer.
6. Add end state.
7. Add local high score.
