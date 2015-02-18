package it.cnr.flows.exception;

/**
 * Created by francesco on 17/02/15.
 */
public class DropException extends Exception {
    public DropException(String s, Exception e) {
        super(s, e);
    }

    public DropException(String message) {
        super(message);
    }
}
