import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
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
    id: 0
  };
  modoEdicao = false;
  contatoId?: number;
  carregando = false;
  enviando = false;
  erro: string | null = null;
  
  constructor(
    private contatoService: ContatoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
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
        this.contato = contato;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = `Erro ao carregar contato: ${erro}`;
        this.carregando = false;
        console.error('Erro ao carregar contato:', erro);
      }
    });
  }

  onSubmit(): void {
    this.enviando = true;
    this.erro = null;

    const dadosContato = {
      nome: this.contato.nome,
      email: this.contato.email,
      telefone: this.contato.telefone
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