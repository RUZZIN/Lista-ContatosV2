import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { ContatoService } from '../../services/contato.service';
import { Contato } from '../../models/contato.model';

@Component({
  selector: 'app-contact-groups',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-groups.component.html',
  styleUrls: ['./contact-groups.component.css']
})
export class ContactGroupsComponent implements OnInit {
  groups: string[] = [];
  groupCounts: Map<string, number> = new Map();
  groupFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  editingGroup: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private groupService: GroupService,
    private contatoService: ContatoService
  ) { }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
      this.updateGroupCounts();
    });
  }

  updateGroupCounts(): void {
    this.groupCounts.clear();
    
    // Inicializa contador para cada grupo
    this.groups.forEach(group => {
      this.groupCounts.set(group, 0);
    });
    
    // Conta contatos por grupo
    this.contatoService.getContatos().subscribe(contatos => {
      contatos.forEach(contato => {
        if (contato.groups) {
          contato.groups.forEach(group => {
            if (this.groupCounts.has(group)) {
              this.groupCounts.set(group, (this.groupCounts.get(group) || 0) + 1);
            }
          });
        }
      });
    });
  }

  startEditing(group: string): void {
    this.editingGroup = group;
    this.groupFormControl.setValue(group);
    this.errorMessage = null;
  }

  cancelEditing(): void {
    this.editingGroup = null;
    this.groupFormControl.reset();
    this.errorMessage = null;
  }

  saveGroup(): void {
    if (this.groupFormControl.invalid) return;
    
    const groupName = this.groupFormControl.value?.trim() || '';
    
    if (this.editingGroup) {
      // Editando grupo existente
      if (this.groupService.editGroup(this.editingGroup, groupName)) {
        this.updateContactGroupReferences(this.editingGroup, groupName);
        this.cancelEditing();
      } else {
        this.errorMessage = 'Nome de grupo já existe.';
      }
    } else {
      // Adicionando novo grupo
      if (this.groupService.addGroup(groupName)) {
        this.groupFormControl.reset();
        this.errorMessage = null;
      } else {
        this.errorMessage = 'Nome de grupo já existe.';
      }
    }
  }

  removeGroup(group: string): void {
    if (confirm(`Tem certeza que deseja remover o grupo "${group}"?`)) {
      this.groupService.removeGroup(group);
      this.updateContactGroupReferences(group, null);
    }
  }

  // Atualiza referências de grupos nos contatos
  updateContactGroupReferences(oldName: string, newName: string | null): void {
    this.contatoService.getContatos().subscribe(contatos => {
      contatos.forEach(contato => {
        if (contato.groups && contato.groups.includes(oldName)) {
          const updatedGroups = contato.groups.filter(g => g !== oldName);
          if (newName) {
            updatedGroups.push(newName);
          }
          
          const updatedContato: Contato = {
            ...contato,
            groups: updatedGroups
          };
          
          this.contatoService.updateContato(contato.id, updatedContato).subscribe(() => {
            // Atualização bem-sucedida
          });
        }
      });
    });
  }
}