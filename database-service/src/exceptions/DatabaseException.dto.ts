export class DatabaseException extends Error {
	constructor(message: string) {
		super(message); // Pass the error message to the Error constructor
		this.name = "DatabaseException"; // Set the name of the error
		// Ensure the prototype chain is correct when extending built-in Error
		Object.setPrototypeOf(this, DatabaseException.prototype);
	}
}
