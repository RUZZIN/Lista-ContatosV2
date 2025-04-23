export interface Contato {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    groups?: string[]; // novo campo
    isFavorite?: boolean; // novo campo
}