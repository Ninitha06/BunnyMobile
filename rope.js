class Rope {
  constructor(nlink, pointA) {
    //No. of small rectangles in the rope
    this.nlink = nlink;
    // Returns the next unique group index for which bodies will collide. Matter.Body.nextGroup([isNonColliding=false])
    //If isNonColliding is true, returns the next unique group index for which bodies will not collide.
    const group = Body.nextGroup(true);
    //Matter.Composites.stack(xx, yy, columns, rows, columnGap, rowGap, callback);
    const rects = Composites.stack(
      100,
      100,
      this.nlink,
      1,
      5,
      5,
      //Collisions between two bodies will obey the following rules:

      //If the two bodies have the same non-zero value of collisionFilter.group, 
      //they will always collide if the value is positive, and they will never collide if the value is negative.
      //If the two bodies have different values of collisionFilter.group or if one (or both) of the bodies has a value of 0, 
      //then the category / mask rules apply .
      function (x, y) {
        return Bodies.rectangle(x, y, 30, 5, {
          collisionFilter: { group: group },
        });
      }
    );

    this.pointA = pointA;
    //Matter.Composites.chain(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) → Composite
    //Chains all bodies in the given composite together using constraints.
    //Loops over each bodies in rects and chains them..while chaining them, what is the offset point from
    //center of body to connect.
    this.body = Composites.chain(rects, 0.1, 0, -0.6, 0, {
      stiffness: 0.1,
      length: 0.1,
      render: { type: "line" },
    });

    World.add(engine.world, this.body);

    Composite.add(
      rects,
      Constraint.create({
        pointA: this.pointA,
        bodyB: rects.bodies[0],
        pointB: { x: -25, y: 0 },
        length: 10,
        stiffness: 0.1,
      })
    );
  }

  break() {
    //Matter.Composite.clear(this.rope,true);
    this.body = null;
  }

  show() {
    if (this.body != null) {
      for (let i = 0; i < this.body.bodies.length - 1; i++) {
        this.drawVertices(this.body.bodies[i].vertices);
      }
    }
  }

  drawVertices(vertices) {
    beginShape();
    fill("#FFF717");
    noStroke();

    for (let i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
  }

  showConstraints(constraints) {
    if (constraints != null) {
      for (let i = 0; i < constraints.length; i++) {
        this.drawConstraint(constraints[i]);
      }
    }
  }

  drawConstraint(constraint) {
    if (constraint != null) {
      const offsetA = constraint.pointA;
      let posA = { x: 0, y: 0 };
      if (constraint.bodyA) {
        posA = constraint.bodyA.position;
      }
      const offsetB = constraint.pointB;
      let posB = { x: 0, y: 0 };
      if (constraint.bodyB) {
        posB = constraint.bodyB.position;
      }
      push();
      strokeWeight(4);
      stroke(255);
      line(
        posA.x + offsetA.x,
        posA.y + offsetA.y,
        posB.x + offsetB.x,
        posB.y + offsetB.y
      );
      pop();
    }
  }
}
