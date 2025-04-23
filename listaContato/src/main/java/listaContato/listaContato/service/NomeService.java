package listaContato.listaContato.service;

import java.util.List;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.transaction.Transactional;
import listaContato.listaContato.entity.Nome;
import listaContato.listaContato.repository.NomeRepository;

@Service
public class NomeService {
    
    @Autowired
    private NomeRepository nomeRepository;

    private static final Logger logger = LoggerFactory.getLogger(NomeService.class);

    public NomeService(NomeRepository nomeRepository) {
        this.nomeRepository = nomeRepository;
    }

    public List<Nome> getAllNomes() {
        try {
            List<Nome> nomes = nomeRepository.findAll();
            return nomes != null ? nomes : new ArrayList<>();
        } catch (Exception e) {
            logger.error("Erro ao buscar todos os nomes: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao buscar contatos do banco de dados", e);
        }
    }
    
    public Nome getNomeById(Long id) {
        return nomeRepository.findById(id).orElse(null);
    }

    @Transactional
    public Nome save(Nome nome) {
        return nomeRepository.save(nome);
    }

    @Transactional
    public Nome update(Long id, Nome nome) {
        Nome existingNome = nomeRepository.findById(id).orElse(null);
        if (existingNome != null) {
            existingNome.setNome(nome.getNome());
            existingNome.setEmail(nome.getEmail());
            existingNome.setTelefone(nome.getTelefone());
            existingNome.setGrupos(nome.getGrupos());
            existingNome.setFavorito(nome.isFavorito());
            return nomeRepository.save(existingNome);
        }
        return null;
    }

    @Transactional
    public void deleteNome(Long id) {
        if (nomeRepository.existsById(id)) {
            nomeRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Contato não encontrado com o id: " + id);
        }
    }


}
