export interface Municipio {
  co_municipio: number;
  nome: string;
  populacao: number;
  crimes_abs_2024: number;
  crimes_taxa_2024: number; // por 100k hab
  crimes_taxa_2023: number; // por 100k hab
  mat_tec_2024: number;
  evasao_pct_2024: number;
  prioridade_urgencia?: 'Alta Urgência' | 'Atenção' | 'Estruturado';
  vagas_por_10k?: number;
}

export interface ResultadoSimulacao {
  municipioNome: string;
  evasaoAtual: number;
  vagasAtuais: number;
  vagasNecessariasNovas: number;
  vagasTotaisFinais: number;
  sucesso: boolean;
  evasaoPrevistaFinal: number;
  passosSimulados: Array<{ vagas_adicionais: number; evasao_prevista: number }>;
}
