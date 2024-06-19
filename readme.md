# Blaster

L'api qui manipule l'api de mantis mais simplement

J'ai ajouté des fonctionnalités pour la génération de changelog aussi à partir de tickets mantis

## FOR DEV WARNING

Ne jamais lancer de migrate sur le schema mantis 

## Exemple .env

```bash
DATABASE_URL="mysql://user:password@localhost:port/bugtracker"
VOLUME_BLASTER=C:\docker_volumes\blaster
```

- `DATABASE_URL` : infos de connexion à la base mysql de mantis
- `VOLUME_BLASTER` : chemin du volume à connecter sur le conteneur docker. Ce volume contient la base de données sql lite et les logs de l'applications.

## Exemple .env.production.local

```bash
NODE_TLS_REJECT_UNAUTHORIZED='0'

# PORT
PORT = 3076

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true

# AUTH
# You can use: `openssl rand -base64 32` to generate one
SECRET_KEY = ""
ADMIN_KEY = ""

# MANTIS
MANTIS_URL = "https://myurl/mantisbt"
MANTIS_API_URL = "https://myurl/mantisbt/api/rest"

# LDAP
LDAP_USER = ""
LDAP_PASSWORD = ""
LDAP_SERVER = ""
LDAP_PORT = ""
LDAP_BASE = ""
```

## NOTES

L'api peut etre installé en tant que service Windows à l'aide du fichier service.js. Ce n'est pas parfait mais faut voir la doc de `node-windows` qui est jusqu'à présent fonctionnel.

## Evolutions possibles

- Le swagger.yaml n'est pas du tout le bon
- Les seuls tests que j'ai fait sont avec des outils tel que Bruno (ou Postman), ça peut être cool d'ajouter des tests unitaires