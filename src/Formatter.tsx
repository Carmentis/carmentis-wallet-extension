export class Formatter {
    static formatDate( ts : number ) : string {
        return new Date(ts * 1000).toLocaleString()
    }
}