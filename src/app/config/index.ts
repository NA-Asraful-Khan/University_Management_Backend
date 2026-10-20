import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || '5000',
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  node_env: process.env.NODE_ENV || 'development',
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
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT || '587',
  smtp_secure: process.env.SMTP_SECURE || 'false',
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
  smtp_from: process.env.SMTP_FROM,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
