import { LogService } from '../../common/services/logger/log.service'


export const addFunctionNameToLogger = async (LogService: LogService, functionName: string): Promise<LogService> => {
    LogService.addFunctionName(functionName);
    return LogService;
}