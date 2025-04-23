import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContatoDetalheComponent } from './components/contato-detalhe/contato-detalhe.component';
import { ContatoFormComponent } from './components/contato-form/contato-form.component';
import { ListaContatosComponent } from './components/lista-contatos/lista-contatos.component';
import { ContactGroupsComponent } from './components/contact-groups/contact-groups.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/contatos', pathMatch: 'full' },
  { path: 'contatos', component: ListaContatosComponent },
  { path: 'contatos/novo', component: ContatoFormComponent },
  { path: 'contatos/:id', component: ContatoDetalheComponent },
  { path: 'contatos/:id/editar', component: ContatoFormComponent },
  { path: 'grupos', component: ContactGroupsComponent },
  { path: 'favoritos', redirectTo: '/contatos', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
