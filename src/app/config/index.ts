import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  node_env: process.env.NODE_ENV,
  frontend_url: process.env.FRONTEND_URL,
  jwt_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_token_expiration_time:
    process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  jwt_refresh_token_expiration_time:
    process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_id: process.env.SUPER_ADMIN_ID,
  // google_oauth_client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
  // google_oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
};
