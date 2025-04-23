import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
import { Contato } from '../../models/contato.model';
import { GroupService } from '../../services/group.service';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-lista-contatos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-contatos.component.html',
  styleUrls: ['./lista-contatos.component.css']
})
export class ListaContatosComponent implements OnInit {
  // Propriedades para o carregamento e tratamento de erros
  carregando = true;
  erro: string | null = null;
  
  // Propriedades para os contatos
  contatos: Contato[] = [];
  filteredContatos: Contato[] = [];
  
  // Propriedades para os filtros
  searchTerm = '';
  selectedGroup: string | null = null;
  showOnlyFavorites = false;
  availableGroups: string[] = [];
  
  // Substituir pelas propriedades antigas se existirem
  contatosFiltrados: Contato[] = [];
  errorMsg: string | null = null;

  constructor(
    private contatoService: ContatoService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.carregarContatos();
    this.carregarGrupos();
  }

  carregarContatos() {
    this.carregando = true;
    this.erro = null;
    
    this.contatoService.getContatos().subscribe({
      next: (data) => {
        this.contatos = data;
        this.filteredContatos = [...data];
        this.carregando = false;
      },
      error: (error) => {
        this.erro = `Erro ao carregar contatos: ${error}`;
        this.carregando = false;
        console.error(this.erro);
      }
    });
  }
  
  carregarGrupos() {
    this.groupService.getGroups().subscribe({
      next: (grupos) => {
        this.availableGroups = grupos;
      },
      error: (erro) => {
        console.error('Erro ao carregar grupos:', erro);
      }
    });
  }

  // Métodos para busca e filtros
  searchContacts() {
    this.applyFilters();
  }
  
  filterByGroup(group: string | null) {
    this.selectedGroup = group;
    this.applyFilters();
  }
  
  toggleFavoriteFilter() {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this.applyFilters();
  }
  
  applyFilters() {
    const termo = this.searchTerm.toLowerCase();
    
    this.filteredContatos = this.contatos.filter(contato => {
      // Filtro por termo de busca
      const matchesTerm = !termo || 
        contato.nome?.toLowerCase().includes(termo) || 
        contato.email?.toLowerCase().includes(termo) || 
        contato.telefone?.toLowerCase().includes(termo);
      
      // Filtro por grupo
      const matchesGroup = !this.selectedGroup || 
        (contato.groups && contato.groups.includes(this.selectedGroup));
      
      // Filtro por favoritos
      const matchesFavorite = !this.showOnlyFavorites || contato.isFavorite;
      
      return matchesTerm && matchesGroup && matchesFavorite;
    });
  }
  
  // Ações nos contatos
  toggleFavorite(contato: Contato, event: Event) {
    event.stopPropagation();
    contato.isFavorite = !contato.isFavorite;
    
    this.contatoService.updateContato(contato.id, contato).subscribe({
      error: (erro) => {
        console.error('Erro ao atualizar favorito:', erro);
        contato.isFavorite = !contato.isFavorite; // reverte em caso de erro
      }
    });
  }
  
  removerContato(id: number) {
    if (confirm('Tem certeza que deseja remover este contato?')) {
      this.contatoService.deleteContato(id).subscribe({
        next: () => {
          this.contatos = this.contatos.filter(c => c.id !== id);
          this.applyFilters();
        },
        error: (erro) => {
          console.error('Erro ao remover contato:', erro);
          this.erro = `Erro ao remover contato: ${erro}`;
        }
      });
    }
  }
}
