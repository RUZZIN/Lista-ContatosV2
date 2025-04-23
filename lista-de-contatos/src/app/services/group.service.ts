import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups: string[] = [];
  private groupsSubject = new BehaviorSubject<string[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Só acessa localStorage se estiver no navegador
    if (this.isBrowser) {
      const savedGroups = localStorage.getItem('contact-groups');
      if (savedGroups) {
        this.groups = JSON.parse(savedGroups);
        this.groupsSubject.next(this.groups);
      }
    }
  }

  getGroups(): Observable<string[]> {
    return this.groupsSubject.asObservable();
  }

  addGroup(name: string): boolean {
    // Verificar se o grupo já existe
    if (this.groups.includes(name)) {
      return false;
    }
    
    this.groups.push(name);
    this.saveGroups();
    return true;
  }

  editGroup(oldName: string, newName: string): boolean {
    if (oldName !== newName && this.groups.includes(newName)) {
      return false;
    }
    
    const index = this.groups.indexOf(oldName);
    if (index !== -1) {
      this.groups[index] = newName;
      this.saveGroups();
      return true;
    }
    return false;
  }

  removeGroup(name: string): boolean {
    const index = this.groups.indexOf(name);
    if (index !== -1) {
      this.groups.splice(index, 1);
      this.saveGroups();
      return true;
    }
    return false;
  }

  private saveGroups() {
    // Só salva no localStorage se estiver no navegador
    if (this.isBrowser) {
      localStorage.setItem('contact-groups', JSON.stringify(this.groups));
    }
    this.groupsSubject.next([...this.groups]);
  }
}