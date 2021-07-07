class Link {
    constructor(body1, body2) {
        //length-2 as fruit is the last element in composite, we need to establish link for the last rectangle and fruit
        var lastLink = body1.body.bodies.length - 2;
        var options = {
            bodyA: body1.body.bodies[lastLink],
            pointA: { x: 0, y: 0 },
            bodyB: body2,
            pointB: { x: 0, y: 0 },
            length: 0,
            stiffness : 0.01
        }

        this.link = Constraint.create(options);
        World.add(world, this.link);
    }


    detach() {
        World.remove(world, this.link);
    }
}