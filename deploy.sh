#!/bin/bash

# ============================================================================
# SCRIPT DE DÉPLOIEMENT VPS — LES ÉCLAIREURS SOLIDAIRES
# Auteur : Hugo Delsol
# Description :
#   - Configure un VPS Ubuntu
#   - Installe Node.js, Git, MySQL, PM2 et Nginx
#   - Clone le projet GitHub
#   - Prépare l'environnement de production et la base de données
# ============================================================================

set -e

# ============================================================================
# VARIABLES
# ============================================================================

PROJECT_NAME="Les-Eclaireurs-Solidaires"
GITHUB_SSH="git@github.com:HugoDelsol/Les-Eclaireurs-Solidaires.git"
APP_NAME="les-eclaireurs-solidaires"
APP_PORT="3000"
GIT_NAME="Alias Github"
GIT_EMAIL="email.github@exemple.com"

# Configuration BDD automatique pour le script
DB_NAME="les_eclaireurs_solidaires"
DB_USER="root"
DB_PASS="votre_mot_de_passe" # À modifier impérativement

# ============================================================================
# COULEURS
# ============================================================================

GREEN="\e[32m"
BLUE="\e[34m"
RED="\e[31m"
NC="\e[0m"

# ============================================================================
# FONCTIONS
# ============================================================================

print_step() {
    echo -e "\n${BLUE}================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================================${NC}"
}

success() {
    echo -e "${GREEN}✔ $1${NC}"
}

error() {
    echo -e "${RED}✘ $1${NC}"
}

# ============================================================================
# ÉTAPE 1 — MISE À JOUR DU SYSTÈME
# ============================================================================

print_step "[1/12] Mise à jour du système"

sudo apt update && sudo apt upgrade -y

success "Système mis à jour"

# ============================================================================
# ÉTAPE 2 — INSTALLATION DES OUTILS DE BASE
# ============================================================================

print_step "[2/12] Installation de Git, Curl et Node.js"

sudo apt install git curl -y

curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

sudo apt install -y nodejs

success "Node.js installé"

# ============================================================================
# ÉTAPE 3 — INSTALLATION MYSQL
# ============================================================================

print_step "[3/12] Installation de MySQL"

sudo apt install mysql-server -y

success "MySQL installé"

# ============================================================================
# ÉTAPE 4 — CONFIGURATION GIT & SSH
# ============================================================================

print_step "[4/12] Génération de la clé SSH GitHub"

if [ ! -f "$HOME/.ssh/id_ed25519" ]; then
    ssh-keygen -t ed25519 -C "$GIT_EMAIL" -N "" -f "$HOME/.ssh/id_ed25519"
else
    echo "Clé SSH déjà existante"
fi

echo ""
echo "================= CLÉ SSH PUBLIQUE ================="
cat ~/.ssh/id_ed25519.pub
echo "===================================================="
echo ""
echo "Ajoute cette clé dans GitHub :"
echo "GitHub > Settings > SSH and GPG keys"
echo ""

read -p "Appuie sur Entrée quand la clé a été ajoutée à GitHub..."

git config --global user.email "$GIT_EMAIL"
git config --global user.name "$GIT_NAME"

# ============================================================================
# ÉTAPE 5 — CLONAGE DU PROJET
# ============================================================================

print_step "[5/12] Clonage du projet"

cd $HOME

if [ ! -d "$PROJECT_NAME" ]; then
    git clone $GITHUB_SSH
else
    echo "Le dossier du projet existe déjà"
fi

cd $PROJECT_NAME

git remote set-url origin $GITHUB_SSH

success "Projet cloné"

# ============================================================================
# ÉTAPE 6 — INSTALLATION DES DÉPENDANCES
# ============================================================================

print_step "[6/12] Installation des dépendances Node.js"

npm install

success "Dépendances installées"

# ============================================================================
# ÉTAPE 7 — CONFIGURATION .ENV
# ============================================================================

print_step "[7/12] Création du fichier .env"

if [ ! -f ".env" ]; then

cat <<EOF > .env
PORT=$APP_PORT
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASS=$DB_PASS
DB_NAME=$DB_NAME
EOF

success "Fichier .env créé"

else
    echo ".env déjà existant"
fi

# ============================================================================
# ÉTAPE 8 — INITIALISATION DE LA BASE DE DONNÉES
# ============================================================================

print_step "[8/12] Configuration et initialisation de la base de données"

# Configuration du mot de passe root et sécurisation basique (méthode non-interactive)
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASS'; FLUSH PRIVILEGES;"

# Création de la base de données si elle n'existe pas
sudo mysql -u root -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Importation du schéma SQL applicatif
if [ -f "site/src/config/schema.sql" ]; then
    sudo mysql -u root -p"$DB_PASS" $DB_NAME < site/src/config/schema.sql
    success "Schéma SQL initialisé avec succès"
else
    error "Fichier site/src/config/schema.sql introuvable. Importation manuelle requise."
fi

# ============================================================================
# ÉTAPE 9 — INSTALLATION PM2 & NGINX
# ============================================================================

print_step "[9/12] Installation de PM2 et nginx"

sudo npm install -g pm2

pm2 start site/src/index.js --name "$APP_NAME" || pm2 restart "$APP_NAME"

pm2 save

sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

sudo apt install nginx -y

# ============================================================================
# CONFIGURATION FIREWALL (UFW)
# ============================================================================

print_step "[10/12] Configuration du pare-feu UFW"

sudo apt install ufw -y

sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

sudo ufw --force enable
sudo ufw status verbose

success "Pare-feu UFW configuré"

# ============================================================================
# CONFIGURATION NGINX
# ============================================================================

print_step "[11/12] Configuration du serveur Reverse Proxy Nginx"

NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
        listen 80;
        server_name votre_domaine_ou_ip;

        # Optimisation Éco-conception : Compression Gzip active
        gzip on;
        gzip_types text/plain text/css application/javascript application/json image/svg+xml;
        gzip_min_length 1000;

        # Servir les assets statiques directement via Nginx pour soulager Node.js
        location ~* \.(webp|png|jpg|jpeg|css|js|ico|svg)$ {
                root /var/www/$APP_NAME/public;
                expires 30d;
                add_header Cache-Control "public, no-transform";
                try_files \$uri @node_backend;
        }

        location / {
                try_files \$uri @node_backend;
        }

        location @node_backend {
                proxy_pass http://localhost:$APP_PORT;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host \$host;
                proxy_cache_bypass \$http_upgrade;
                proxy_set_header X-Real-IP \$remote_addr;
                proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        }
}
EOF

# Désactivation de la configuration par défaut de Nginx
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Liaison et validation de la configuration
if [ ! -L "/etc/nginx/sites-enabled/$APP_NAME" ]; then
    sudo ln -s $NGINX_CONF /etc/nginx/sites-enabled/
fi

sudo nginx -t

sudo systemctl restart nginx

success "Nginx configuré et redémarré"

# ============================================================================
# GUIDE DE DÉPLOIEMENT
# ============================================================================

print_step "[12/12] Génération du guide de maintenance (DEPLOY_GUIDE.md)"

cat <<EOF > DEPLOY_GUIDE.md
# Guide de Déploiement — Les Éclaireurs Solidaires

## Mise à jour du projet

\`\`\`bash
git pull
npm install
pm2 reload $APP_NAME
\`\`\`

## Réinitialisation Base de Données

\`\`\`bash
mysql -u root -p $DB_NAME < site/src/config/schema.sql
\`\`\`

## Vérification PM2

\`\`\`bash
pm2 list
pm2 logs
\`\`\`

## Vérification Nginx

\`\`\`bash
sudo nginx -t
sudo systemctl status nginx
\`\`\`
EOF

success "DEPLOY_GUIDE.md généré"

# ============================================================================
# FIN
# ============================================================================

echo ""
echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}DÉPLOIEMENT TERMINÉ AVEC SUCCÈS${NC}"
echo -e "${GREEN}====================================================${NC}"
echo ""
