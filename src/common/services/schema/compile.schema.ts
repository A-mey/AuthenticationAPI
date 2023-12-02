import { CommonSchema } from "./schema";

class CompileSchema extends CommonSchema{

    compile = async (schema: object) => {
        return this.ajv.compile(schema);
    }
}

export default new CompileSchema()