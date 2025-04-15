package listaContato.listaContato.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import listaContato.listaContato.entity.Nome;
import listaContato.listaContato.repository.NomeRepository;

@Service
public class NomeService {
    
    @Autowired
    private NomeRepository nomeRepository;

    public NomeService(NomeRepository nomeRepository) {
        this.nomeRepository = nomeRepository;
    }

    public List<Nome> getAllNomes() {
        return nomeRepository.findAll();
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
