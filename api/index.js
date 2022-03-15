import server from './server/index.js'
import { logger } from './util/index.js'
import config from './config/index.js'


server.listen(config.port)
.on('listening', _ => logger.info(`Server is running on port ${config.port}`))