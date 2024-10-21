export default class Guard {
    static PreventUndefined<T>( value: T | undefined ): T {
        if ( value === undefined ) {
            throw new Error("The provided value is undefined. This error was raised by a guard.");
        }
        return value;
    }
}