import { config } from 'dotenv';

try {
  config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
} catch (err) {
  console.error("Erreur lors du chargement des variables d'environnement:", err);
}

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, ORIGIN, SECRET_KEY, ADMIN_KEY, MANTIS_URL, MANTIS_API_URL, MD_TO_HTML_API_URL } = process.env;

export const { LDAP_USER, LDAP_PASSWORD, LDAP_SERVER, LDAP_PORT, LDAP_BASE } = process.env;
