
export class Optional<T> {

    private value : T | undefined;

    constructor( value ?: T ) {
        this.value = value;
    }

    unwrap() : T {
        if ( this.value === undefined ) {
            throw new Error("Cannot unwrap an empty optional value!")
        }
        return this.value;
    }

    isEmpty() : boolean {
        return this.value === undefined;
    }

    static Empty<T>() : Optional<T> {
        return new Optional<T>( undefined );
    }

    static From<T>(value : T) : Optional<T> {
        return new Optional<T>( value );
    }

}