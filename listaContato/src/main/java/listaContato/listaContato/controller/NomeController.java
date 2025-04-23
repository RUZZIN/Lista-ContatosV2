package listaContato.listaContato.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import listaContato.listaContato.entity.Nome;
import listaContato.listaContato.service.NomeService;

@RestController
@RequestMapping("api/contatos")
@CrossOrigin(origins = "http://localhost:4200")
public class NomeController {
    
    private static final Logger logger = LoggerFactory.getLogger(NomeController.class);
    private final NomeService nomeService;

    // Remover a anotação @Autowired e usar apenas o construtor
    public NomeController(NomeService nomeService) {
        this.nomeService = nomeService;
    }

    @GetMapping
    public ResponseEntity<List<Nome>> getAllNomes() {
        try {
            logger.info("Buscando todos os contatos");
            List<Nome> nomes = nomeService.getAllNomes();
            if (nomes != null && !nomes.isEmpty()) {
                return ResponseEntity.ok(nomes);
            }
            logger.info("Nenhum contato encontrado");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Erro ao buscar contatos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Nome> getNomeById(@PathVariable Long id) {
        Nome nome = nomeService.getNomeById(id);
        if (nome != null) {
            return ResponseEntity.ok(nome);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nome> updateNome(@PathVariable Long id, @RequestBody Nome nome) {
        try {
            Nome updatedNome = nomeService.update(id, nome);
            if (updatedNome != null) {
                return new ResponseEntity<>(updatedNome, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Nome> createNome(@RequestBody Nome nome) {
        try {
            Nome savedNome = nomeService.save(nome);
            return new ResponseEntity<>(savedNome, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteNome(@PathVariable Long id) {
        try {
            nomeService.deleteNome(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/favoritos")
    public ResponseEntity<List<Nome>> getFavoritos() {
        try {
            List<Nome> favoritos = nomeService.getAllNomes().stream()
                    .filter(Nome::isFavorito)
                    .toList();
            return new ResponseEntity<>(favoritos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/grupos/{grupo}")
    public ResponseEntity<List<Nome>> getNomesByGrupo(@PathVariable String grupo) {
        try {
            logger.info("Buscando contatos do grupo: {}", grupo);
            List<Nome> nomes = nomeService.getAllNomes().stream()
                    .filter(nome -> {
                        if (nome.getGrupos() == null) return false;
                        for (String g : nome.getGrupos()) {
                            if (g != null && g.equals(grupo)) return true;
                        }
                        return false;
                    })
                    .collect(Collectors.toList());
            return new ResponseEntity<>(nomes, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Erro ao buscar contatos por grupo: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/favoritos/{id}")
    public ResponseEntity<Nome> getFavoritoById(@PathVariable Long id) {
        Nome nome = nomeService.getNomeById(id);
        if (nome != null && nome.isFavorito()) {
            return ResponseEntity.ok(nome);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/grupos/{grupo}/{id}")
    public ResponseEntity<Nome> getNomeByGrupoAndId(@PathVariable String grupo, @PathVariable Long id) {
        Nome nome = nomeService.getNomeById(id);
        
        // Versão corrigida - evita NullPointerException
        if (nome != null && nome.getGrupos() != null) {
            boolean pertenceAoGrupo = false;
            for (String g : nome.getGrupos()) {
                if (g != null && g.equals(grupo)) {
                    pertenceAoGrupo = true;
                    break;
                }
            }
            
            if (pertenceAoGrupo) {
                return ResponseEntity.ok(nome);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/grupos")
    public ResponseEntity<List<String>> getAllGrupos() {
        try {
            logger.info("Buscando todos os grupos");
            List<String> grupos = new ArrayList<>();
            
            for (Nome nome : nomeService.getAllNomes()) {
                if (nome.getGrupos() != null) {
                    for (String grupo : nome.getGrupos()) {
                        if (grupo != null && !grupo.isEmpty() && !grupos.contains(grupo)) {
                            grupos.add(grupo);
                        }
                    }
                }
            }
            
            return new ResponseEntity<>(grupos, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Erro ao buscar grupos: {}", e.getMessage(), e);
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
