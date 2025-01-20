/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * The optional object is used to prevent the usage of undefined.
 *
 * In contrast with an undefined object, the optional is handled by most IDEs, meaning that
 * when a developer uses an optional, he is warned that the object he is handling may be empty.
 *
 * Even more, if the developer attempts to access an undefined value, then the application crashes with
 * a more interesting error message.
 *
 * Example:
 * ```ts
 * const valueOption = Optional.From(1);
 * valueOption.isSome() // true
 * valueOption.isEmpty() // false
 * const value = valueOption.unwrap();
 *
 * const valueOption = Optional.Empty();
 * valueOption.isSome() // false
 * valueOption.isEmpty() // true
 * const value = valueOption.unwrap(); // Error !
 *
 * ```
 */
export class Optional<T> {

    /**
     * The internal value handled by the option.
     *
     * @private
     */
    private value : T | undefined;


    constructor( value ?: T ) {
        this.value = value;
    }

    /**
     * Returns the value inside the optional.
     *
     * @throws Error if the value is not defined.
     */
    unwrap() : T {
        if ( this.value === undefined ) {
            throw new Error("Cannot unwrap an empty optional value!")
        }
        return this.value;
    }


    /**
     * Returns the value inside the optional or a default value if it is not defined.
     *
     * @param defaultValue The default value to be returned if the internal value is undefined.
     */
    unwrapOr( defaultValue : T ) : T {
        if ( this.value === undefined ) { return defaultValue }
        return this.value;
    }

    isEmpty() : boolean {
        return this.value === undefined;
    }

    isSome() : boolean {
        return !this.isEmpty()
    }

    static Empty<T>() : Optional<T> {
        return new Optional<T>( undefined );
    }

    static From<T>(value : T) : Optional<T> {
        return new Optional<T>( value );
    }

}