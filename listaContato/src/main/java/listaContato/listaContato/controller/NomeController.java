package listaContato.listaContato.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import listaContato.listaContato.entity.Nome;
import listaContato.listaContato.service.NomeService;

@RestController
@RequestMapping("api/contatos")
@CrossOrigin(origins = "http://localhost:4200")
public class NomeController {

    @Autowired
    private NomeService nomeService;

    @GetMapping
    public ResponseEntity<List<Nome>> getAllNomes() {
        try {
            List<Nome> nomes = nomeService.getAllNomes();
            return new ResponseEntity<>(nomes, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Log o erro para depuração
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public NomeController(NomeService nomeService) {
        this.nomeService = nomeService;
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
}
