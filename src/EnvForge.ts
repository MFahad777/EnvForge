import dotEnv, {DotenvConfigOptions, DotenvConfigOutput, DotenvParseOutput} from "dotenv";

import { Validator } from "./Validator";

import { GlobalSettings } from "./types"

export class EnvForge {

    private dotEnvOutput: DotenvConfigOutput;

    private envSchema : Object = {};

    private readonly validator: Validator;

    private globalSettings : GlobalSettings = {};

    constructor(options? : DotenvConfigOptions) {
        this.dotEnvOutput = dotEnv.config(options);
        this.validator = new Validator()
    }

    /**
     * Get All Keys
     */
    public getAllKeys() {
        return process.env;
    }

    /**
     * Validates the keys and return them if all validation passes
     */
    public getParsedKeys() : DotenvParseOutput {
        return <DotenvParseOutput>this.dotEnvOutput.parsed;
    }

    /**
     * Start validating data
     */
    public validate() : void {
        const validate = this.validator.validate(this.envSchema,this.dotEnvOutput.parsed, this.globalSettings);

        if (JSON.stringify(validate) === "{}") {
            return;
        }

        throw new Error(JSON.stringify(validate))
    }

    public createSchema(schema: object, globalSettings : GlobalSettings = {}) {
        this.envSchema = schema;
        this.globalSettings = globalSettings;
    }

}