# pw — pudge wars

## Contents

- [Data Structures](#data-structures)
- [References](#references)
- [Notes](#notes)
  - [PixiJS](#pixijs)
- [Gamer Story](#gamer-story)
- [TODO](#todo)

## Data Structures

- Hook

  ```ts
  const hookEventAnimationDelay = x; // The event’s animation delay; constant.

  const hookEvent = {
    velocity, // The velocity of a hook; fixed.
    length, // The hook’s travel distance; fixed.
    direction, // The direction of a hook; 1–360.
  };
  ```

- Player

  ```ts
  const playerMoveAnimationDelay = x; // The event’s animation delay; constant.

  const playerMoveEvent = {
    velocity, // The velocity of a player; fixed.
    position, // The position of a player; [x, y].
    target, // The target of a player; [x, y].
  };
  ```

## References

### Papers

- [Fast-Paced Multiplayer](https://www.gabrielgambetta.com/client-server-game-architecture.html).
- [Pathfinding Demystified](https://www.gabrielgambetta.com/generic-search.html).
- [Real Time Multiplayer in HTML5](http://buildnewgames.com/real-time-multiplayer/).
- [Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking).
- [Latency Compensating Methods in Client/Server In-game Protocol Design and Optimization](https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization).
- [Gaffer On Games](https://gafferongames.com/).
- [Unreal Networking Architecture](https://docs.unrealengine.com/udk/Three/NetworkingOverview.html#Peer-to-Peer%20model).

### Examples

- [Agar.io clone](https://github.com/owenashurst/agar.io-clone).

## Notes

### PixiJS

- The major components of PixiJS are:

  - renderer — the core of the PixiJS system is the renderer, which displays
    the scene graph and draws it to the screen. PixiJS will automatically
    determine whether to provide you the WebGPU or WebGL renderer under the
    hood;
  - container — main scene object which creates a scene graph: the tree of
    renderable objects to be displayed, such as sprites, graphics and text. See
    Scene Graph for more details;
  - assets — the Asset system provides tools for asynchronously loading
    resources such as images and audio files;
  - ticker — tickers provide periodic callbacks based on a clock. Your game
    update logic will generally be run in response to a tick once per frame.
    You can have multiple tickers in use at one time;
  - application — the Application is a simple helper that wraps a Loader,
    Ticker and Renderer into a single, convenient easy-to-use object. Great for
    getting started quickly, prototyping and building simple projects;
  - events — PixiJS supports pointer-based interaction — making objects
    clickable, firing hover events, etc.

- You can set the minFPS and maxFPS attributes on a Ticker to give PixiJS hints
  as to the range of tick speeds you want to support. Just be aware that due to
  the complex environment, your project cannot guarantee a given FPS. Use the
  passed ticker.deltaTime value in your ticker callbacks to scale any
  animations to ensure smooth playback.

- Call destroy() on any Graphics object you no longer need to avoid memory
  leaks.

- If you want to change the shape of a Graphics object, you don't need to
  delete and recreate it. Instead you can use the clear() function to reset the
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
    eventMode: "passive",
    eventFeatures: {
      move: true,
      // Disables the global move events which can be very expensive in large
      // scenes.
      globalMove: false,
      click: true,
      wheel: true,
    },
  });
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
      image: "images/spritesheet.png",
      format: "RGBA8888",
      size: { w: 128, h: 32 },
      scale: 1,
    },
    animations: {
      enemy: ["enemy1", "enemy2"], //array of frames by name
    },
  };
  ```

- Changing an existing text string requires re-generating the internal render
  of that text, which is a slow operation that can impact performance if you
  change many text objects each frame. If your project requires lots of
  frequently changing text on the screen at once, consider using a BitmapText
  object (explained below) which uses a fixed bitmap font that doesn't require
  re-generation when text changes.

- Order can help, for example sprite / graphic / sprite / graphic is slower
  than sprite / sprite / graphic / graphic.


## Gamer Story

1. A gamer is welcomed by a splash screen where he is offered to either connect
   to a server or to create one.

1. If he chooses to create one, he needs to enter a port.

1. If he chooses to connect to one, he needs to enter an ip address and a port.

1. When a server is just has been either created or joined to, a gamer is
   prompted to enter a username which needs to be unique to the server. To see
   them, one can press the tab key: it will show the player list both before
   joining a game and during it.

1. If the entered username has been already taken, user gets a red error message
   ‘Please Choose Unique Username’ and the input box becomes red.

1. If the entered username hasn’t been taken, a gamer joins the game.

1. After joining the game, a gamer sees a message ‘Press Tab To Choose a Team’.
   Hovering over either side would have an overlay with either dire or radiant
   and write ‘Join the Dire/Radiant Team’.

1. If there is at least one player in each team and the game hasn’t started
   yet, start it.

1. Start a ticker with X (60?) tick/sec. The following events might happen:
   - gamer has connected;
   - gamer has disconnected;
   - gamer has chosen a username;
   - gamer has joined the dire team;
   - gamer has joined the radiant team;
   - gamer has new move target;
   - gamer has thrown a hook;
   - gamer has cancelled throwing of a hook.

## TODO
