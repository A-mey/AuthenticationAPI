export class NullException extends Error {
    constructor() {
      super("Null Exception");
      this.name = "NullException";
    }
}