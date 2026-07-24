elements.BombPlane = {
    color : "#287800",
    behavior : [
        "XX|XX|XX",
        "M1|XX|M1",
        "XX|CR:bomb%3|XX"
    ],
    state : "solid",
    maxSize : 1,
    category : "machines"
}
elements.BombPlane.renderer = function(pixel,ctx) {
    // Draw three horizontal squares
    drawSquare(ctx,"#287800",pixel.x-1,pixel.y);
    drawSquare(ctx,"#287800",pixel.x,pixel.y);
    drawSquare(ctx,"#287800",pixel.x+1,pixel.y);
    drawSquare(ctx,"#287800",pixel.x,pixel.y+1);
    drawSquare(ctx,"#287800",pixel.x,pixel.y-1);
};