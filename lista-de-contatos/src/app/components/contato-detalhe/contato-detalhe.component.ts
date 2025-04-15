import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
import { Contato } from '../../models/contato.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contato-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contato-detalhe.component.html',
  styleUrls: ['./contato-detalhe.component.css']
})
export class ContatoDetalheComponent implements OnInit {
  contato?: Contato;
  carregando = false;
  erro: string | null = null;
  excluindo = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contatoService: ContatoService
  ) { }
  
  ngOnInit(): void {
    this.carregarContato();
  }
  
  carregarContato(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregando = true;
      this.erro = null;
      
      this.contatoService.getContato(+id).subscribe({
        next: (contato: Contato) => {
          this.contato = contato;
          this.carregando = false;
        },
        error: (erro) => {
          this.erro = `Erro ao carregar contato: ${erro}`;
          this.carregando = false;
          console.error('Erro ao carregar detalhes do contato:', erro);
        }
      });
    }
  }
  
  removerContato(): void {
    if (confirm('Tem certeza que deseja remover este contato?') && this.contato) {
      this.excluindo = true;
      this.erro = null;
      
      this.contatoService.deleteContato(this.contato.id).subscribe({
        next: () => {
          this.excluindo = false;
          this.router.navigate(['/contatos']);
        },
        error: (erro) => {
          this.excluindo = false;
          this.erro = `Erro ao remover contato: ${erro}`;
          console.error('Erro ao remover contato:', erro);
        }
      });
    }
  }

  editarContato(): void {
    if (this.contato) {
      // Navega para a página de edição com o ID correto
      this.router.navigate(['/contatos', this.contato.id, 'editar']);
    }
  }
}
