package listaContato.listaContato.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Nome")
public class Nome {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "telefone", nullable = false)
    private String telefone;

    @Column(name = "grupos", nullable = false)
    private String[] grupos;

    // Temporariamente permite null
    @Column(name = "favorito", nullable = true)
    private Boolean favorito;

    public Nome() {
    }

    public Nome(Long id,String nome, String email, String telefone, String grupos[], Boolean favorito) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.grupos = grupos;
        this.favorito = favorito;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    // Adicione este método para evitar NullPointerException
    public String[] getGrupos() {
        if (grupos == null) {
            return new String[0]; // Retorna array vazio em vez de null
        }
        return grupos;
    }

    public void setGrupos(String grupos[]) {
        this.grupos = grupos;
    }

    public Boolean isFavorito() {
        return favorito != null ? favorito : false;
    }

    public void setFavorito(Boolean favorito) {
        this.favorito = favorito;
    }
    
    @Override
    public String toString() {
        return "Nome [id=" + id + ", nome=" + nome + ", email=" + email + ", telefone=" + telefone + ", grupos="
                + grupos + ", favorito=" + favorito + "]";
    }
}
