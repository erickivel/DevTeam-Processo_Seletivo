
import { createLogger, format, transports } from "winston";

export const labels = {
  "info": `ℹ️ `,
  "verbose": `📃 `,
  "error": `❌ `,
  "warn": `⚠️ `,
  "debug": `🐛 `
};

const options = {
  console: {
    format: format.combine(
      format.printf(info => `${labels[info.level]} ${info.level}: ${info.message}`)
    )
  }
}

export const logger = createLogger({
  transports: [
    new transports.Console(options.console)
  ]
})