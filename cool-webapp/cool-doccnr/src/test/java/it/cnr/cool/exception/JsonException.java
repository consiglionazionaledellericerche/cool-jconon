package it.cnr.cool.exception;

public class JsonException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1393032702060017540L;

	public JsonException() {
	}

	public JsonException(String message) {
		super(message);
	}

	public JsonException(Throwable cause) {
		super(cause);
	}

	public JsonException(String message, Throwable cause) {
		super(message, cause);
	}
}
