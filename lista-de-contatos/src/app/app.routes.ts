import { Routes } from '@angular/router';
import { ListaContatosComponent } from './components/lista-contatos/lista-contatos.component';
import { ContatoFormComponent } from './components/contato-form/contato-form.component';
import { ContatoDetalheComponent } from './components/contato-detalhe/contato-detalhe.component';

export const routes: Routes = [
  { path: '', redirectTo: '/contatos', pathMatch: 'full' },
  { path: 'contatos', component: ListaContatosComponent },
  { path: 'contatos/novo', component: ContatoFormComponent },
  { path: 'contatos/:id', component: ContatoDetalheComponent },
  { path: 'contatos/:id/editar', component: ContatoFormComponent },
  { path: '**', redirectTo: '/contatos' }
];
