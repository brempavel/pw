# pw — pudge wars

## Contents

- [Data Structures](#data-structures)
- [References](#references)
  - [Papers](#papers)
  - [Examples](#examples)
- [Notes](#notes)
  - [PixiJS](#pixijs)
- [Player Story](#player-story)
- [Work Log](#work-log)
- [TODO](#todo)

## Data Structures

- Hook

  ```ts
  const hookEventAnimationDelay = x // The event’s animation delay; constant.

  const hookEvent = {
    velocity, // The velocity of a hook; fixed.
    length, // The hook’s travel distance; fixed.
    direction, // The direction of a hook; 1–360.
  }
  ```

- Player

  ```ts
  const playerMoveAnimationDelay = x // The event’s animation delay; constant.

  const playerMoveEvent = {
    velocity, // The velocity of a player; fixed.
    position, // The position of a player; [x, y].
    target, // The target of a player; [x, y].
  }
  ```

## References

### Papers

- [Fast-Paced Multiplayer](https://www.gabrielgambetta.com/client-server-game-architecture.html).
- [Pathfinding Demystified](https://www.gabrielgambetta.com/generic-search.html).
- [Real Time Multiplayer in HTML5](http://buildnewgames.com/real-time-multiplayer/).
- [Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking).
- [Latency Compensating Methods in Client/Server In-game Protocol Design and Optimization](https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization).
- [Unreal Networking Architecture](https://docs.unrealengine.com/udk/Three/NetworkingOverview.html#Peer-to-Peer%20model).

### Examples

- [Agar.io clone](https://github.com/owenashurst/agar.io-clone).

## Notes

### PixiJS

- The major components of PixiJS are:

  - renderer — the core of the PixiJS system is the renderer, which displays the
    scene graph and draws it to the screen. PixiJS will automatically determine
    whether to provide you the WebGPU or WebGL renderer under the hood;
  - container — main scene object which creates a scene graph: the tree of
    renderable objects to be displayed, such as sprites, graphics and text. See
    Scene Graph for more details;
  - assets — the Asset system provides tools for asynchronously loading
    resources such as images and audio files;
  - ticker — tickers provide periodic callbacks based on a clock. Your game
    update logic will generally be run in response to a tick once per frame. You
    can have multiple tickers in use at one time;
  - application — the Application is a simple helper that wraps a Loader, Ticker
    and Renderer into a single, convenient easy-to-use object. Great for getting
    started quickly, prototyping and building simple projects;
  - events — PixiJS supports pointer-based interaction — making objects
    clickable, firing hover events, etc.

- You can set the minFPS and maxFPS attributes on a Ticker to give PixiJS hints
  as to the range of tick speeds you want to support. Just be aware that due to
  the complex environment, your project cannot guarantee a given FPS. Use the
  passed ticker.deltaTime value in your ticker callbacks to scale any animations
  to ensure smooth playback.

- Call destroy() on any Graphics object you no longer need to avoid memory
  leaks.

- If you want to change the shape of a Graphics object, you don't need to delete
  and recreate it. Instead you can use the clear() function to reset the
  contents of the geometry list, then add new primitives as desired. Be careful
  of performance when doing this every frame.

- Graphics objects are generally quite performant. However, if you build highly
  complex geometry, you may pass the threshold that permits batching during
  rendering, which can negatively impact performance. It's better for batching
  to use many Graphics objects instead of a single Graphics with many shapes.
  Graphics objects are fastest when they are not modified constantly (not
  including the transform, alpha or tint). Graphics objects are batched when
  under a certain size (100 points or smaller). Small Graphics objects are as
  fast as Sprites

- Hit testing requires walking the full object tree, which in complex projects
  can become an optimization bottleneck. To mitigate this issue, PixiJS
  Container-derived objects have a property named interactiveChildren. If you
  have Containers or other objects with complex child trees that you know will
  never be interactive, you can set this property to false and the hit testing
  algorithm will skip those children when checking for hover and click events.
  The EventSystem can also be customised to be more performant:

  ```ts
  const app = new Application({
    eventMode: 'passive',
    eventFeatures: {
      move: true,
      // Disables the global move events which can be very expensive in large
      // scenes.
      globalMove: false,
      click: true,
      wheel: true,
    },
  })
  ```

- WebGL rendering speed scales roughly with the number of draw calls made.
  Batching multiple Sprites, etc. into a single draw call is the main secret to
  how PixiJS can run so blazingly fast. Maximizing batching is a complex topic,
  but when multiple Sprites all share a common BaseTexture, it makes it more
  likely that they can be batched together and rendered in a single call.
  Sprites can be batched with up to 16 different textures (dependent on
  hardware).

  Spritesheets support configurations like:

  ```ts
  const atlasData = {
    frames: {
      enemy1: {
        frame: { x: 0, y: 0, w: 32, h: 32 },
        sourceSize: { w: 32, h: 32 },
        spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
      },
      enemy2: {
        frame: { x: 32, y: 0, w: 32, h: 32 },
        sourceSize: { w: 32, h: 32 },
        spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
      },
    },
    meta: {
      image: 'images/spritesheet.png',
      format: 'RGBA8888',
      size: { w: 128, h: 32 },
      scale: 1,
    },
    animations: {
      enemy: ['enemy1', 'enemy2'], //array of frames by name
    },
  }
  ```

- Changing an existing text string requires re-generating the internal render of
  that text, which is a slow operation that can impact performance if you change
  many text objects each frame. If your project requires lots of frequently
  changing text on the screen at once, consider using a BitmapText object
  (explained below) which uses a fixed bitmap font that doesn't require
  re-generation when text changes.

- Order can help, for example sprite / graphic / sprite / graphic is slower than
  sprite / sprite / graphic / graphic.

- Wrap any group in a container.

- Don’t change `scale` property of a container just because you think you need
  it. Always first try changing just `width` & `height`, and `x` & `y`
  optionally, then work from there.

## Player Story

1. A player is welcomed by a splash screen where he is offered to either connect
   to a server or to create one.

1. If he chooses to create one, he needs to enter a port.

1. If he chooses to connect to one, he needs to enter an ip address and a port.

1. When a server is just has been either created or joined to, a player is
   prompted to enter a username which needs to be unique to the server. To see
   them, one can press the tab key: it will show the player list both before
   joining a game and during it.

1. If the entered username has been already taken, user gets a red error message
   ‘Please Choose Unique Username’ and the input box becomes red.

1. If the entered username hasn’t been taken, a player joins the game.

1. After joining the game, a player sees a message ‘Press Tab To Choose a Team’.
   Hovering over either side would have an overlay with either dire or radiant
   and write ‘Join the Dire/Radiant Team’.

1. If there is at least one player in each team and the game hasn’t started yet,
   start it.

1. Start a ticker with X (60?) tick/sec. The following events might happen:
   - player has connected;
   - player has disconnected;
   - player has chosen a username;
   - player has joined the dire team;
   - player has joined the radiant team;
   - player has new move target;
   - player has thrown a hook;
   - player has cancelled throwing of a hook.

## Work Log

- 22 Jun 24, george, the idea was born

- 23–28 Jun 24, george, research. Phaser has been considered and tossed due to
  lack of desire to dig and figure out how to port it (at least partially) to
  the server. A Go implementation of the server is in our plans, to replace the
  current, Node.js, one which has been choosen just for a prototype: converting
  something you haven’t written to another language is at least a bit harder
  than converting something you have created. And we want to implement our own
  server using
  [WebTransport datagrams](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API),
  own reconcilation and interpolation (and prediction on client). First we are
  building client figuring out which events we would like to have coming from
  server, then building a simple WebSockets server for POC. Then we will figure
  something out from there.

- 28 Jun 24, george, Pavel, research. Played with Phaser, Pavel implemented a
  simple version of the game and created good enough references of Pudge to make
  animation sprites out of it. George researched more papers and came to
  conclusion it would be easier to use PixiJS, a part of Phaser responsible for
  rendering. Actually, its old and a bit dated version. We can’t use its physics
  engine, and everything else it provides is easy to re-implement. George have
  started the project’s battle field and went to bed at 5am.

- 29 Jun 24, george, Pavel, implementation. George finished (not really) the
  resising auto-fitting logic. Pavel bootstrapped the logic for controlling
  Pudge. PixiJS seems like the right bet: bigger community, better docs, more
  hands-on and **useful** examples with up-to-date PixiJS’ code.

- 29 Jun–7 Jul, george. Pavel has left the project, now it’s only George, i.e.
  only one person to talk about, so i won’t use any names since now because
  there is no point in that anymore. I searched for examples of how people
  organize their PixiJS apps and came to conclusion that implementing a fairly
  standard class-based architecture with everything as a component seems to be
  the most suitable for my needs. Objects map fine to UI domain, and i have had
  a long exposure to Angular and i like it. There were 4 re-writes between 29
  Jun and 7 Jul, until i finally settled down with the simplest approach. Also
  resizing issue is gone due to bisecting what is really needed for a proper
  auto-fitting-on-resize logic. The current implementation of scaling on resize
  is exactly what i wanted to achieve. I checked Dota 2 and there a user cannot
  change the size of a window running the game, so first i thought just to
  hard-code all the screen sizes and scaling coefficients for them for each
  object on screen. Then i checked Agar.io and they allow any window size, but
  due to the game setting of it which doesn’t allow you to see the whole map,
  its resizing logic wasn’t a perfect example to replicate from to me. But (x2)
  it has inspired me to make pw trully screen size agnostic and adapt to any.
  Also i have decided to replace the water sprite with a fire one. It’s now
  called `River` to be a more generic name (and because of that, i also renamed
  `Grass` to `Ground`). Also i have hot-change game config in plans, so anyone
  can customize looks of the game if she wants.

- 7–9 Jul. Some code refactorings, slowly introducing the player to the game.
  Figuring out the best way of encoding the player’s direction, movements,
  actions, etc.

- 10–12 Jul. Came up with the player turning algorithm so it can turn towards
  the target automatically; implemented a basic movement algorithm.

## TODO

- connect the server with the ui:
  1. Pudge/player:
     - make Pudge able to walk in straight lines. For a start it’s ok if the
       lines can be only parallel to X or Y axises;
     - make Pudge animated when he walks;
     - make it possible to go into any direction if not possible yet;
     - make Pudge respect world boundaries;
     - make it possible to throw a simple hook;
     - refine hooking until it’s good enough;
     - figure out what events we need.
  1. the server:
     - investigate the agar.io clone’s server and take it as a start;
     - implement all the events, make (at least their types) them shared across
       the server and the client;
     - make a naive server.
  1. the client:
     - create a connection mechanism via console;
     - create an API client.
- add game sound, kills voice-over, better & more sprites:
  1. Pudge/player:
     - create a 3D model based off the current sprite;
       - try to use it in game to make it possible to turn into any direction:
         - if it didn’t work, create a sprite off screenshots of the model doing
           different actions.
