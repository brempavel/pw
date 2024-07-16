# pw — pudge wars

## Contents

- [References](#references)
- [Notes](#notes)
- [Player Story](#player-story)
- [Work Log](#work-log)
- [TODO](#todo)

## References

- [Fast-Paced Multiplayer](https://www.gabrielgambetta.com/client-server-game-architecture.html).
- [Agar.io clone](https://github.com/owenashurst/agar.io-clone).
- [Realtime Multiplayer In HTML5](https://github.com/ruby0x1/realtime-multiplayer-in-html5).

## Notes

### [Latency Compensating Methods in Client/Server In-game Protocol Design and Optimization](https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization)

- The client's frame loop looks something like the following:

  1. Sample clock to find start time
  1. Sample user input (mouse, keyboard, joystick)
  1. Package up and send movement command using simulation time
  1. Read any packets from the server from the network system
  1. Use packets to determine visible objects and their state
  1. Render Scene
  1. Sample clock to find end time
  1. End time minus start time is the simulation time for the next frame

  each user command (and the exact time it was generated) is stored on the
  client. The prediction algorithm uses these stored commands.

  For prediction, the last acknowledged movement from the server is used as a
  starting point. The acknowledgement indicates which user command was last
  acted upon by the server and also tells us the exact position (and other state
  data) of the player after that movement command was simulated on the server.
  The last acknowledged command will be somewhere in the past if there is any
  lag in the connection. For instance, if the client is running at 50 frames per
  second (fps) and has 100 milliseconds of latency (roundtrip), then the client
  will have stored up five user commands ahead of the last one acknowledged by
  the server. These five user commands are simulated on the client as a part of
  client-side prediction. Assuming full prediction1, the client will want to
  start with the latest data from the server, and then run the five user
  commands through "similar logic" to what the server uses for simulation of
  client movement. Running these commands should produce an accurate final state
  on the client (final player position is most important) that can be used to
  determine from what position to render the scene during the current frame.

  The server has a somewhat similar loop:

  1. Sample clock to find start time
  1. Read client user input messages from network
  1. Execute client user input messages
  1. Simulate server-controlled objects using simulation time from last full
     pass
  1. For each connected client, package up visible objects/world state and send
     to client
  1. Sample clock to find end time
  1. End time minus start time is the simulation time for the next frame

  a from-to function, which accepts the current state and returns the new one
  (HELLO REDUX), shared among both the client and the server, is a good start

- 30 updates per second from client to server and 20-40 other way around, 100 ms
  interpolation

- depending upon the client's latency and how fast the client is generating user
  commands (i.e., the client's framerate), the client will most often end up
  running the same commands over and over again until they are finally
  acknowledged by the server and dropped from the list (a sliding window in
  Half-Life's case) of commands yet to be acknowledged. The first consideration
  is how to handle any sound effects and visual effects that are created in the
  shared code. Because commands can be run over and over again, it's important
  not to create footstep sounds, etc. multiple times as the old commands are
  re-run to update the predicted position. In addition, it's important for the
  server not to send the client effects that are already being predicted on the
  client. However, the client still must re-run the old commands or else there
  will be no way for the server to correct any erroneous prediction by the
  client. The solution to this problem is easy: the client just marks those
  commands which have not been predicted yet on the client and only plays
  effects if the user command is being run for the first time on the client

- use the last acknowledged state from the server as a starting point, and run
  the prediction user commands "in-place" on that data to arrive at a final
  state (which includes your position for rendering). In this case, you don't
  need to keep all of the intermediate results along the route for predicting
  from the last acknowledged state to the current time. This can be done with a
  sliding window, where the "from state" is at the start and then each time you
  run a user command through prediction, you fill in the next state in the
  window. When the server finally acknowledges receiving one or more commands
  that had been predicted, it is a simple matter of looking up which state the
  server is acknowledging and copying over the data that is totally client side
  to the new starting or "from state"

- Each update contains the server time stamp for when it was generated. From the
  current client time, the client computes a target time by subtracting the
  interpolation time delta (100 ms) If the target time is in between the
  timestamp of the last update and the one before that, then those timestamps
  determine what fraction of the time gap has passed. This fraction is used to
  interpolate any values (e.g., position and angles). This type of interpolation
  (where the client tracks only the last two updates and is always moving
  directly toward the most recent update) requires a fixed time interval between
  server updates

- Each update we receive from the server creates a new position history entry,
  including timestamp and origin/angles for that timestamp. To interpolate, we
  compute the target time as above, but then we search backward through the
  history of positions looking for a pair of updates that straddle the target
  time. We then use these to interpolate and compute the final position for that
  frame. This allows us to smoothly follow the curve that completely includes
  all of our sample points. If we are running at a higher framerate than the
  incoming update rate, we are almost assured of smoothly moving through the
  sample points, thereby minimizing (but not eliminating, of course, since the
  pure sampling rate of the world updates is the limiting factor) the flattening
  problem described above

- You can think of lag compensation as taking a step back in time, on the
  server, and looking at the state of the world at the exact instant that the
  user performed some action. The algorithm works as follows:

  1. Before executing a player's current user command, the server:
     1. Computes a fairly accurate latency for the player
     1. Searches the server history (for the current player) for the world
        update that was sent to the player and received by the player just
        before the player would have issued the movement command
     1. From that update (and the one following it based on the exact target
        time being used), for each player in the update, move the other players
        backwards in time to exactly where they were when the current player's
        user command was created. This moving backwards must account for both
        connection latency and the interpolation amount the client was using
        that frame.
  1. Allow the user command to execute (including any weapon firing commands,
     etc., that will run ray casts against all of the other players in their
     "old" positions).
  1. Move all of the moved/time-warped players back to their correct/current
     positions

  Note that in the step where we move the player backwards in time, this might
  actually require forcing additional state info backwards, too (for instance,
  whether the player was alive or dead or whether the player was ducking). The
  end result of lag compensation is that each local client is able to directly
  aim at other players without having to worry about leading his or her target
  in order to score a hit. Of course, this behavior is a game design tradeoff

### [Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking)

- By default, the client receives about 20 snapshot per second. If the objects
  (entities) in the world were only rendered at the positions received by the
  server, moving objects and animation would look choppy and jittery. Dropped
  packets would also cause noticeable glitches. The trick to solve this problem
  is to go back in time for rendering, so positions and animations can be
  continuously interpolated between two recently received snapshots. With 20
  snapshots per second, a new update arrives about every 50 milliseconds. If the
  client render time is shifted back by 50 milliseconds, entities can be always
  interpolated between the last received snapshot and the snapshot before that.

  Source defaults to an interpolation period ('lerp') of 100-milliseconds
  (cl_interp 0.1); this way, even if one snapshot is lost, there are always two
  valid snapshots to interpolate between

  If more than one snapshot in a row is dropped, interpolation can't work
  perfectly because it runs out of snapshots in the history buffer. In that case
  the renderer uses extrapolation (cl_extrapolate 1) and tries a simple linear
  extrapolation of entities based on their known history so far. The
  extrapolation is done only for 0.25 seconds of packet loss
  (cl_extrapolate_amount), since the prediction errors would become too big
  after that. This doesn't mean you have to lead your aiming when shooting at
  other players since the server-side lag compensation knows about client entity
  interpolation and corrects this error

  Instead of waiting for the server to update your own position, the local
  client just predicts the results of its own user commands. Therefore, the
  client runs exactly the same code and rules the server will use to process the
  user commands. After the prediction is finished, the local player will move
  instantly to the new location while the server still sees him at the old
  place.

  After 150 milliseconds, the client will receive the server snapshot that
  contains the changes based on the user command he predicted earlier. Then the
  client compares the server position with his predicted position. If they are
  different, a prediction error has occurred. This indicates that the client
  didn't have the correct information about other entities and the environment
  when it processed the user command. Then the client has to correct its own
  position, since the server has final authority over client-side prediction

- Let's say a player shoots at a target at client time 10.5. The firing
  information is packed into a user command and sent to the server. While the
  packet is on its way through the network, the server continues to simulate the
  world, and the target might have moved to a different position. The user
  command arrives at server time 10.6 and the server wouldn't detect the hit,
  even though the player has aimed exactly at the target. This error is
  corrected by the server-side lag compensation.

  The lag compensation system keeps a history of all recent player positions for
  one second. If a user command is executed, the server estimates at what time
  the command was created as follows:

  ```
  Command Execution Time = Current Server Time - Packet Latency - Client View Interpolation
  ```

  Then the server moves all other players - only players - back to where they
  were at the command execution time. The user command is executed and the hit
  is detected correctly. After the user command has been processed, the players
  revert to their original positions

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
  simple version of the game and created good enough references of the character
  to make animation sprites out of it. George researched more articles and came
  to conclusion it would be easier to use PixiJS, a part of Phaser responsible
  for rendering. Actually, its old and a bit dated version. We can’t use its
  physics engine, and everything else it provides is easy to re-implement.
  George have started the project’s battle field and went to bed at 5am.

- 29 Jun 24, george, Pavel, implementation. George finished (not really) the
  resising auto-fitting logic. Pavel bootstrapped the logic for controlling the
  character. PixiJS seems like the right bet: bigger community, better docs,
  more hands-on and **useful** examples with up-to-date PixiJS’ code.

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

- 13 Jul. Forgot to use delta time for player movement \*facepalm\*. Now it
  seems to have roughly the same speed in all directions. Also checked out the
  articles for an inspiration and opened the article on the unreal engine
  networking architecture. They have

  ```
  Position += Velocity * DeltaTime
  ```

  as one of the few code examples/snippets on the page.

- 13–14 Jul. Read through the articles, copy-paste the most important parts from
  that. I believe i’m at the stage where it’s worth to understand client-server
  interaction at least a little bit.

- 15–16 Jul. Organise the notes and links to resources.

## TODO

- connect the server with the ui:
  1. player:
     - make player animated when he walks;
     - make player respect world boundaries;
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
  1. Player:
     - create a 3D model based off the current sprite;
       - try to use it in game to make it possible to turn into any direction:
         - if it didn’t work, create a sprite off screenshots of the model doing
           different actions.
