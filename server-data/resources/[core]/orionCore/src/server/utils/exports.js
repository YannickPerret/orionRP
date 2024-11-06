getActiveCharacter = async (user) => {
    if (user.activeCharacter) {
        const characterRepository = AppDataSource.getRepository("Character");
        return await characterRepository.findOne({
            where: { id: user.activeCharacter, user: user.id },
        });
    }
    return null
}

exports('getActiveCharacter', getActiveCharacter)