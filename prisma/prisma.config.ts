import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "sahakari.db")

export default {
  datasources: {
    db: {
      url: `file:${dbPath}`
    }
  }
}