import { CommonSchema } from "./schema";

class CompileSchema extends CommonSchema{

    async compile(schema: object) {
        return this.ajv.compile(schema);
    }
}

export default new CompileSchema()