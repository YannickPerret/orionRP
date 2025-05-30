# Utiliser Ubuntu comme base
FROM ubuntu:20.04

# Éviter les prompts interactifs
ENV DEBIAN_FRONTEND=noninteractive

# Variables d'environnement FiveM
ENV LICENSE_KEY=""
ENV RCON_PASSWORD=""
ENV NO_DEFAULT_CONFIG=""
ENV NO_LICENSE_KEY=""
ENV NO_ONESYNC=""

# Installer les dépendances
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    tar \
    xz-utils \
    ca-certificates \
    netcat \
    && rm -rf /var/lib/apt/lists/*

# Créer un utilisateur non-root
RUN useradd -m -s /bin/bash fivem

# Créer les répertoires nécessaires
RUN mkdir -p /opt/fivem /config /txData /opt/fivem/resources-custom \
    && chown -R fivem:fivem /opt/fivem /config /txData

# Télécharger et installer FiveM server
WORKDIR /opt/fivem

# Utiliser la dernière version Linux stable
RUN echo "Téléchargement de FiveM server..." && \
    wget -O fx.tar.xz "https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/15488-567a140029a648637e8f3f9145a961fded2b8259/fx.tar.xz" && \
    tar -xf fx.tar.xz && \
    rm fx.tar.xz && \
    chmod +x run.sh && \
    ls -la && \
    chown -R fivem:fivem /opt/fivem

# Copier le script d'entrée
COPY --chown=fivem:fivem entrypoint.sh /opt/fivem/entrypoint.sh
RUN chmod +x /opt/fivem/entrypoint.sh

# Copier les ressources depuis server-data
COPY --chown=fivem:fivem server-data/resources/ /opt/fivem/resources/

# Copier le fichier server.cfg s'il existe
COPY --chown=fivem:fivem server-data/server.cfg /opt/fivem/server.cfg

# Exposer les ports
EXPOSE 30120/tcp 30120/udp 40120/tcp

# Volumes
VOLUME ["/config", "/txData"]

# Changer vers l'utilisateur fivem
USER fivem

# Point d'entrée
ENTRYPOINT ["/opt/fivem/entrypoint.sh"]