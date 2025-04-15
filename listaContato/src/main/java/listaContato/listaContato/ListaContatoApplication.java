package listaContato.listaContato;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(info = @Info(
        title = "API Rest Full",
        version = "1.0",
        description = "API para gerenciamento de recursos",
        contact = @Contact(name = "Ruan", email = "ruanp9725@gmail.ocm"))
)

@SpringBootApplication
public class ListaContatoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ListaContatoApplication.class, args);
	}

}
