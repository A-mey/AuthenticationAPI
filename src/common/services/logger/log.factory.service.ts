import { LogService } from './log.service'

class LogFactory {
    getLog = async (LogService: LogService, functionName: string): Promise<LogService> => {
        LogService.addFunctionName(functionName);
        return LogService;
    }
}

export default new LogFactory();