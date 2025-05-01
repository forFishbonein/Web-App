package com.gym.exception;

import com.gym.enumeration.ErrorCode;
import com.gym.result.RestResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle all CustomExceptions thrown from controllers or services
     */
    @ExceptionHandler(CustomException.class)
    public RestResult<?> handleCustomException(CustomException ex) {
        log.error("CustomException caught: {}", ex.getMessage(), ex);
        ErrorCode errorCode = ex.getErrorCode();
        // You could choose to use either the default message from errorCode or ex.getMessage()
        // If you used the constructor with a custom message, ex.getMessage() might differ from errorCode.getMessage()
        return RestResult.error(ex.getMessage(), errorCode.getCode());
    }

    /**
     * Handle all unexpected exceptions
     */
    @ExceptionHandler(Exception.class)
    public RestResult<?> handleException(Exception ex) {
        log.error("Unknown exception: {}", ex.getMessage(), ex);
        // Return a generic internal server error
        return RestResult.error(ErrorCode.INTERNAL_SERVER_ERROR.getMessage(),
                ErrorCode.INTERNAL_SERVER_ERROR.getCode());
    }

    // ====== New: Handle validation failure exceptions ======
    // Usually occurs when using the @Valid annotation to validate DTOs, throwing an exception if the incoming data from the frontend does not meet the requirements
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public RestResult<?> handleValidationException(MethodArgumentNotValidException ex) {
        // Retrieve all field errors from the exception object
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();

        // Concatenate multiple errors into a single string, or you can return a map
        StringBuilder errorMsg = new StringBuilder("Validation failed: ");
        for (FieldError fieldError : fieldErrors) {
            errorMsg
                    .append("[")
                    .append(fieldError.getField())
                    .append(": ")
                    .append(fieldError.getDefaultMessage()) // This is the message set in the annotation
                    .append("] ");
        }

        log.error("Validation error: {}", errorMsg.toString());

        // Here you can return a 400 status code or a custom ErrorCode
        // Below demonstrates returning 400 and sending the concatenated error message back to the frontend
        return RestResult.error(errorMsg.toString(), 400);
    }
}
