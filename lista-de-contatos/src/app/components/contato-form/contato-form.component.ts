import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
import { GroupService } from '../../services/group.service';
import { Contato } from '../../models/contato.model';

@Component({
  selector: 'app-contato-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contato-form.component.html',
  styleUrls: ['./contato-form.component.css']
})
export class ContatoFormComponent implements OnInit {
  contato: Contato = {
    nome: '',
    email: '',
    telefone: '',
    id: 0,
    isFavorite: false,
    groups: []
  };
  modoEdicao = false;
  contatoId?: number;
  carregando = false;
  enviando = false;
  erro: string | null = null;
  
  // Novos campos para gerenciar grupos
  availableGroups: string[] = [];
  
  constructor(
    private contatoService: ContatoService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    // Carregar grupos disponíveis
    this.groupService.getGroups().subscribe(groups => {
      this.availableGroups = groups;
    });
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.contatoId = +id;
      this.modoEdicao = true;
      this.carregarContato(this.contatoId);
    }
  }
  
  carregarContato(id: number): void {
    this.carregando = true;
    this.erro = null;
    
    this.contatoService.getContato(id).subscribe({
      next: (contato) => {
        this.contato = {
          ...contato,
          groups: contato.groups || [],
          isFavorite: contato.isFavorite || false
        };
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = `Erro ao carregar contato: ${erro}`;
        this.carregando = false;
        console.error('Erro ao carregar contato:', erro);
      }
    });
  }

  toggleGroup(group: string): void {
    if (!this.contato.groups) {
      this.contato.groups = [];
    }
    
    const index = this.contato.groups.indexOf(group);
    if (index > -1) {
      this.contato.groups.splice(index, 1);
    } else {
      this.contato.groups.push(group);
    }
  }

  isGroupSelected(group: string): boolean {
    return this.contato.groups?.includes(group) || false;
  }

  onSubmit(): void {
    this.enviando = true;
    this.erro = null;

    const dadosContato = {
      nome: this.contato.nome,
      email: this.contato.email,
      telefone: this.contato.telefone,
      isFavorite: this.contato.isFavorite,
      groups: this.contato.groups
    };

    let action;
    if (this.modoEdicao && this.contatoId) {
      action = this.contatoService.updateContato(this.contatoId, {...dadosContato, id: this.contatoId});
    } else {
      action = this.contatoService.createContato(dadosContato);
    }

    action.subscribe({
      next: () => {
        this.enviando = false;
        this.router.navigate(['/contatos']);
      },
      error: (erro) => {
        const operacao = this.modoEdicao ? 'atualizar' : 'criar';
        this.erro = `Erro ao ${operacao} contato: ${erro}`;
        this.enviando = false;
        console.error(`Erro ao ${operacao} contato:`, erro);
      }
    });
  }
}