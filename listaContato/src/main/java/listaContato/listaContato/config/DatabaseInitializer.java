package listaContato.listaContato.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Inicializando banco de dados - verificando coluna favorito");
        
        try {
            // Verifica se existem registros com valor nulo para favorito
            Integer nullCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM nome WHERE favorito IS NULL", Integer.class);
                
            if (nullCount != null && nullCount > 0) {
                logger.info("Atualizando {} registros com favorito NULL para FALSE", nullCount);
                
                // Atualiza todos os registros null para false
                int updatedRows = jdbcTemplate.update(
                    "UPDATE nome SET favorito = false WHERE favorito IS NULL");
                
                logger.info("Atualização concluída: {} registros modificados", updatedRows);
                
                // Depois da atualização, altera a definição da coluna para NOT NULL
                jdbcTemplate.execute("ALTER TABLE nome ALTER COLUMN favorito SET NOT NULL");
                logger.info("Coluna favorito alterada para NOT NULL");
            } else {
                logger.info("Não há registros com favorito NULL para atualizar");
            }
        } catch (Exception e) {
            logger.error("Erro ao atualizar valores nulos para favorito", e);
            // Não lançar exceção para permitir que a aplicação continue iniciando
        }
    }
}