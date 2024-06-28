# pw — pudge wars

## Contents

- [Data Structures](#data-structures)
- [Gamer Story](#gamer-story)
- [References](#references)
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

- [Fast-Paced Multiplayer](https://www.gabrielgambetta.com/client-server-game-architecture.html).
- [Pathfinding Demystified](https://www.gabrielgambetta.com/generic-search.html).
- [Real Time Multiplayer in HTML5](http://buildnewgames.com/real-time-multiplayer/).
- [Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking).
- [Latency Compensating Methods in Client/Server In-game Protocol Design and Optimization](https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization).
- [Gaffer On Games](https://gafferongames.com/).
- [Más Bandwidth](https://mas-bandwidth.com/).
- [Unreal Networking Architecture](https://docs.unrealengine.com/udk/Three/NetworkingOverview.html#Peer-to-Peer%20model).

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
