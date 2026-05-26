#!/bin/bash

# ============================================================================
# SCRIPT DE DÉPLOIEMENT VPS — LES ÉCLAIREURS SOLIDAIRES
# Auteur : Hugo Delsol
# Description :
#   - Configure un VPS Ubuntu
#   - Installe Node.js, Git, MySQL, PM2 et Nginx
#   - Clone le projet GitHub
#   - Prépare l'environnement de production
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

print_step "[1/8] Mise à jour du système"

sudo apt update && sudo apt upgrade -y

success "Système mis à jour"

# ============================================================================
# ÉTAPE 2 — INSTALLATION DES OUTILS DE BASE
# ============================================================================

print_step "[2/8] Installation de Git, Curl et Node.js"

sudo apt install git curl -y

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt install -y nodejs

success "Node.js installé"

# ============================================================================
# ÉTAPE 3 — INSTALLATION MYSQL
# ============================================================================

print_step "[3/8] Installation de MySQL"

sudo apt install mysql-server -y

success "MySQL installé"

# ============================================================================
# ÉTAPE 4 — CONFIGURATION GIT & SSH
# ============================================================================

print_step "[4/8] Génération de la clé SSH GitHub"

if [ ! -f "$HOME/.ssh/id_ed25519" ]; then
    ssh-keygen -t ed25519 -C "ton.email@exemple.com"
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

print_step "[5/8] Clonage du projet"

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

print_step "[6/8] Installation des dépendances Node.js"

npm install

success "Dépendances installées"

# ============================================================================
# ÉTAPE 7 — CONFIGURATION .ENV
# ============================================================================

print_step "[7/8] Création du fichier .env"

if [ ! -f ".env" ]; then

cat <<EOF > .env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_NAME=les_eclaireurs_solidaires
EOF

success "Fichier .env créé"

else
    echo ".env déjà existant"
fi

# ============================================================================
# ÉTAPE 8 — INSTALLATION PM2 & NGINX
# ============================================================================

print_step "[8/8] Installation de PM2 et Nginx"

sudo npm install -g pm2

pm2 start site/src/index.js --name "$APP_NAME"

pm2 save

sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

sudo apt install nginx -y

# ============================================================================
# CONFIGURATION FIREWALL (UFW)
# ============================================================================

print_step "[X/X] Configuration du pare-feu UFW"

sudo apt install ufw -y

# Politique par défaut
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Autorisations essentielles
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activation du firewall
sudo ufw --force enable

# Affichage du statut
sudo ufw status verbose

success "Pare-feu UFW configuré"

# ============================================================================
# CONFIGURATION NGINX
# ============================================================================

NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

if [ ! -L "/etc/nginx/sites-enabled/$APP_NAME" ]; then
    sudo ln -s $NGINX_CONF /etc/nginx/sites-enabled/
fi

sudo nginx -t

sudo systemctl restart nginx

success "Nginx configuré"

# ============================================================================
# GUIDE DE DÉPLOIEMENT
# ============================================================================

cat <<EOF > DEPLOY_GUIDE.md
# Guide de Déploiement — Les Éclaireurs Solidaires

## Mise à jour du projet

\`\`\`bash
git pull
pm2 reload $APP_NAME
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

## Vérification MySQL

\`\`\`bash
sudo systemctl status mysql
\`\`\`

## Redémarrage serveur

\`\`\`bash
sudo reboot
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

echo "Application : $APP_NAME"
echo "Projet : $PROJECT_NAME"

echo ""
echo "Commandes utiles :"
echo "----------------------------------------------------"
echo "pm2 logs"
echo "pm2 restart $APP_NAME"
echo "git pull && pm2 reload $APP_NAME"
echo "sudo nginx -t"
echo "----------------------------------------------------"