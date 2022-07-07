
import { createLogger, format, transports } from "winston";

export const labels = (level: string) => {
  switch (level) {
    case "info":
      return `ℹ️ `;
    case "error":
      return `❌ `;
    case "warn":
      return `⚠️ `;
    case "verbose":
      return `📃`;
    case "debug":
      return `🐛 `;
  }
}

const options = {
  console: {
    format: format.combine(
      format.printf(info => `${labels(info.level)} ${info.level}: ${info.message}`)
    ),
    level: "verbose",
    silent: process.env.NODE_ENV === "test" ? true : false,
  }
}

export const logger = createLogger({
  transports: [
    new transports.Console(options.console)
  ]
})