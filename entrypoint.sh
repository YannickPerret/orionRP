#!/bin/bash

# Fonction pour générer un mot de passe aléatoire
generate_password() {
    tr -dc A-Za-z0-9 </dev/urandom | head -c 16
}

# Fonction pour attendre que MySQL soit prêt
wait_for_mysql() {
    if [[ -n "$MYSQL_HOST" ]]; then
        echo "Attente de MySQL ($MYSQL_HOST:$MYSQL_PORT)..."
        while ! nc -z "$MYSQL_HOST" "${MYSQL_PORT:-3306}"; do
            echo "MySQL n'est pas encore prêt. Attente de 5 secondes..."
            sleep 5
        done
        echo "MySQL est prêt !"
    fi
}

# Attendre MySQL si configuré
wait_for_mysql

# Créer la configuration par défaut si elle n'existe pas et NO_DEFAULT_CONFIG n'est pas défini
if [[ -z "$NO_DEFAULT_CONFIG" && ! -f /config/server.cfg && ! -f /opt/fivem/server.cfg ]]; then
    echo "Création de la configuration par défaut..."

    # Générer un mot de passe RCON si non fourni
    if [[ -z "$RCON_PASSWORD" ]]; then
        RCON_PASSWORD=$(generate_password)
        echo "Mot de passe RCON généré: $RCON_PASSWORD"
    fi

    cat > /config/server.cfg << EOF
# Configuration FiveM générée automatiquement

# Nom du serveur
sv_hostname "OrionRP Server"

# Slots maximum
sv_maxclients 32

# Informations du serveur
sets tags "roleplay, custom, orionrp"
sets locale "fr-FR"

# Configuration RCON
rcon_password "$RCON_PASSWORD"

# Configuration réseau
endpoint_add_tcp "0.0.0.0:30120"
endpoint_add_udp "0.0.0.0:30120"

# Configuration de base
start mapmanager
start chat
start spawnmanager
start sessionmanager
start basic-gamemode
start hardcap

# Ressources par défaut
start rconlog
start playernames

# Ressources personnalisées OrionRP
$(find /opt/fivem/resources -maxdepth 2 -name "fxmanifest.lua" -o -name "__resource.lua" | sed 's|/opt/fivem/resources/||' | sed 's|/[^/]*$||' | sort -u | grep -v "^\[" | sed 's/^/start /')

# Configuration OneSync (si pas désactivé)
$(if [[ -z "$NO_ONESYNC" ]]; then echo "onesync on"; fi)

# Licence (si pas désactivée via NO_LICENSE_KEY)
$(if [[ -z "$NO_LICENSE_KEY" && -n "$LICENSE_KEY" ]]; then echo "sv_licenseKey \"$LICENSE_KEY\""; fi)
EOF

    echo "Configuration créée dans /config/server.cfg"
    echo "Mot de passe RCON: $RCON_PASSWORD"
fi

# Déterminer quel fichier de config utiliser
CONFIG_FILE=""
if [[ -f /config/server.cfg ]]; then
    CONFIG_FILE="/config/server.cfg"
elif [[ -f /opt/fivem/server.cfg ]]; then
    CONFIG_FILE="/opt/fivem/server.cfg"
    echo "Utilisation du fichier server.cfg existant"
else
    echo "ERREUR: Aucun fichier de configuration trouvé"
    exit 1
fi

# Vérifier la licence si nécessaire
if [[ -z "$NO_LICENSE_KEY" && -z "$LICENSE_KEY" ]]; then
    echo "ERREUR: LICENSE_KEY est requis ou définissez NO_LICENSE_KEY pour utiliser une licence dans le fichier de config"
    exit 1
fi

# Afficher les informations de démarrage
echo "Démarrage du serveur FiveM..."
echo "Configuration: /config/server.cfg"
echo "Données txAdmin: /txData"
echo "Ressources personnalisées: /opt/fivem/resources-custom"

# Lancer le serveur FiveM
cd /opt/fivem
exec ./run.sh +exec "$CONFIG_FILE"