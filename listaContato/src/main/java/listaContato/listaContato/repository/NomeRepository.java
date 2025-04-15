package listaContato.listaContato.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import listaContato.listaContato.entity.Nome;

@Repository
public interface NomeRepository extends JpaRepository<Nome, Long> {
}
