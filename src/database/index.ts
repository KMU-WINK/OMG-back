import mysql from "mysql2/promise";
import config from "../utils/config";

const pool = mysql.createPool(config.DB);

export default pool;
