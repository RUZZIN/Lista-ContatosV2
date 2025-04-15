import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
import { Contato } from '../../models/contato.model';

@Component({
  selector: 'app-lista-contatos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-contatos.component.html',
  styleUrl: './lista-contatos.component.css'
})
export class ListaContatosComponent implements OnInit {
  contatos: Contato[] = [];
  carregando: boolean = false;
  erro: string | null = null;

  constructor(private contatoService: ContatoService) {}

  ngOnInit() {
    this.carregarContatos();
  }

  carregarContatos() {
    this.carregando = true;
    this.erro = null;
    
    this.contatoService.getContatos().subscribe({
      next: (contatos: Contato[]) => {
        this.contatos = contatos;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = `Erro ao carregar contatos: ${erro}`;
        this.carregando = false;
        console.error('Erro ao carregar contatos:', erro);
      }
    });
  }

  removerContato(id: number) {
    if (confirm('Tem certeza que deseja remover este contato?')) {
      this.carregando = true;
      
      this.contatoService.deleteContato(id).subscribe({
        next: () => {
          this.carregando = false;
          this.carregarContatos();
        },
        error: (erro) => {
          this.erro = `Erro ao remover contato: ${erro}`;
          this.carregando = false;
          console.error('Erro ao remover contato:', erro);
        }
      });
    }
  }
}
