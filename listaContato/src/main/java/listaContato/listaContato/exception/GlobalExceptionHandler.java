package listaContato.listaContato.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.dao.DataAccessException;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("mensagem", "Ocorreu um erro interno no servidor");
        errorResponse.put("detalhe", e.getMessage());
        
        // Log mais detalhado do erro
        logger.error("Erro não tratado: ", e);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, String>> handleDataAccessException(DataAccessException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("mensagem", "Erro ao acessar dados");
        errorResponse.put("detalhe", e.getMessage());
        
        logger.error("Erro de acesso a dados: ", e);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, String>> handleNullPointerException(NullPointerException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("mensagem", "Erro de referência nula");
        errorResponse.put("detalhe", e.getMessage());
        
        logger.error("NullPointerException: ", e);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}