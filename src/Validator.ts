import { GlobalSettings } from "./types"

export class Validator {

    private required(value : string | undefined) : Boolean {
        return value === undefined;
    }

    private isBoolean(value: string | undefined) : Boolean {

        if (value === undefined) {
            return false
        }

        try {
            const parsedValue = JSON.parse(value);

            return typeof parsedValue === "boolean";
        }
        catch (e) {
            return false
        }
    }

    private isArray(value : string | undefined) : Boolean {
        if (value === undefined) {
            return false
        }

        try {
            const parsedData = JSON.parse(value);
            return Array.isArray(parsedData);
        }
        catch (e) {
            return false
        }
    }

    private isIn(value : string | undefined, valuesToCheck : string) : Boolean {

        if (value === undefined) {
            return false
        }

        return valuesToCheck.includes(value);
    }

    private globalPrefixKeysWith(value : string[] | undefined, prefixWithKeys : string) : Boolean {

        if (value === undefined) {
            return true
        }

        return value.every(val => val.startsWith(prefixWithKeys));
    }

    private globalCheckTotalKeys(keys: string[], totalKeys: number, strict?: Boolean) : string {

        if (keys.length < totalKeys) {
            return `Total keys should be ${totalKeys}`
        }

        if (strict && keys.length > totalKeys) {
            return `Can only have total of ${totalKeys} keys when 'strict' is set to true`
        }

        return ''
    }

    private validateKeys(value : string[],allErrors : any, keyToUse : string, envValue : string) {
        value.forEach((validation : string) => {

            const prevData = allErrors[keyToUse];

            switch (true) {

                case /required/i.test(validation):
                    const notExists = this.required(envValue);

                    if (notExists) {
                        allErrors[keyToUse] = {
                            ...prevData,
                            required:`The following key should exists in the .env file`
                        }
                    }

                    break;

                case /boolean/i.test(validation):
                    const isBoolean = this.isBoolean(envValue);

                    if (!isBoolean) {
                        allErrors[keyToUse] = {
                            ...prevData,
                            boolean:`The following key must be of type boolean`
                        }
                    }

                    break;

                case /isin/i.test(validation):

                    const valuesToCheck : string = validation.split(":")[1];

                    if (!Boolean(valuesToCheck)) {
                        throw new Error(`isIn validation require values to be present to check against`);
                    }

                    const isTrue = this.isIn(envValue, valuesToCheck);

                    if (!isTrue) {
                        allErrors[keyToUse] = {
                            ...prevData,
                            isIn:`The following key must be in ${valuesToCheck}`
                        }
                    }

                    break;

                case /isarray/i.test(validation):

                    const isArray = this.isArray(envValue);

                    if (!isArray) {
                        allErrors[keyToUse] = {
                            ...prevData,
                            isArray:`The following key must of array when parsed`
                        }
                    }

                    break;
            }
        })
    }

    public validate(schema : Object, parsed : any, globalSettings: GlobalSettings) : any[] {

        const allErrors : any = {}

        const allKeys = Object.keys(parsed)

        if (globalSettings.prefixKeysWith) {
            const havePrefixWith = this.globalPrefixKeysWith(allKeys, globalSettings.prefixKeysWith);

            if (!havePrefixWith) {
                allErrors["globalSettings"] = {
                    ...allErrors["globalSettings"],
                    "prefixWithKeys":`All keys must prefix with ${globalSettings.prefixKeysWith}`
                }
            }
        }

        if (globalSettings.totalKeys) {
            const validationMessage = this.globalCheckTotalKeys(allKeys, globalSettings.totalKeys, globalSettings.strict);

            if (Boolean(validationMessage)) {
                allErrors["globalSettings"] = {
                    ...allErrors["globalSettings"],
                    "totalKeys": validationMessage
                }
            }
        }

        for (const [key, value] of Object.entries(schema)) {

            const keyToUse = globalSettings.prefixKeysWith
                ? `${globalSettings.prefixKeysWith}${key}`
                : key

            const envValue : string = parsed[keyToUse];

            this.validateKeys(value, allErrors, keyToUse, envValue);
        }

        return allErrors;
    }

}