function getDistanceBetweenCoords(point1, point2, useZ = true) {
    // is X ou [0] is Y ou [1] is Z ou [2]
    const x1 = point1[0] || point1.x || point1.X || point1["x"] || point1["X"];
    const y1 = point1[1] || point1.y || point1.Y || point1["y"] || point1["Y"];
    const z1 = point1[2] || point1.z || point1.Z || point1["z"] || point1["Z"];
    const x2 = point2[0] || point2.x || point2.X || point2["x"] || point2["X"];
    const y2 = point2[1] || point2.y || point2.Y || point2["y"] || point2["Y"];
    const z2 = point2[2] || point2.z || point2.Z || point2["z"] || point2["Z"];
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dz = z1 - z2;
    if (!useZ) {
        return Math.sqrt(dx * dx + dy * dy);
    }
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

exports('getDistanceBetweenCoords', getDistanceBetweenCoords);