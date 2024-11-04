const setEntityOrphanMode = typeof SetEntityOrphanMode !== 'undefined' ? SetEntityOrphanMode : () => {};

module.exports = {
    spawn(model, coords, heading = undefined) {
        const entityId = CreateVehicleServerSetter(model, GetVehicleNetworkType(model), coords.x, coords.y, coords.z, heading || 0)
        setEntityOrphanMode(entityId, 2)

        return entityId;
    },
    loadVehicleState(vehicleEntity) {
        const vehicleId = NetworkGetNetworkIdFromEntity(vehicleEntity);
        const vehicle = Entity(vehicleId);

        vehicle.state.set('vehicleState', {
            model: GetEntityModel(vehicleEntity),
            fuelLevel: GetVehicleFuelLevel(vehicleEntity),
            health: GetEntityHealth(vehicleEntity),
            owner: vehicle.state.owner,
        }, true);
    }
}