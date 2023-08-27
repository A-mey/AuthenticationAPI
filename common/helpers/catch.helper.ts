// export catchError = async (error: unknown) => {

// }

export const catchError = async (error: unknown) : Promise<string> => {
    if (error instanceof Error) {
        return error.message;
    }
    else {
        return String(error)
    }
}