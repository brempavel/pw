# pw — pudge wars

## Contents

- [Data Structures](#data-structures)
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

- https://github.com/phaserjs/phaser-by-example/tree/main/runner;
- https://github.com/phaserjs/phaser-by-example/tree/main/dungeon;
- https://github.com/pxai/phasergames/tree/master/lucky;
- https://github.com/pxai/phasergames/tree/master/ufish;
- https://github.com/phaserjs/phaser-by-example/tree/main/blastemup;
- https://github.com/pxai/phasergames/tree/master/warchat;
- https://github.com/phaserjs/phaser-by-example/tree/main/mars;
- https://github.com/phaserjs/phaser-by-example/tree/main/starshipped;
- https://github.com/phaserjs/phaser-by-example/tree/main/starshipped;

## TODO

- go through [examples](labs.phaser.io/index.html) together and link here all
  the relevant examples (https://github.com/phaserjs/examples);
