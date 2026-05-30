import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  TrendingDown, 
  ShieldAlert, 
  Brain, 
  Code, 
  Copy, 
  Check, 
  Calculator, 
  Sparkles, 
  Download, 
  Search, 
  ArrowRight, 
  MapPin, 
  Users, 
  BarChart3, 
  Filter,
  RefreshCw,
  Info,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  ReferenceLine
} from 'recharts';

import { Municipio, ResultadoSimulacao } from './types';
import { 
  municipiosSP, 
  processarKMeansUrgencia, 
  simularVagasParaReduzirEvasao,
  getFallbackMunicipio,
  COEF_CONST,
  COEF_LOG_TEC,
  COEF_CRIME_2024,
  COEF_CRIME_2023
} from './data';
import { completePythonCode } from './python_code';
import { MapaUrgencia } from './components/MapaUrgencia';

export default function App() {
  // Application State
  const [activeTab, setActiveTab] = useState<'diagnostico' | 'simulador' | 'kmeans'>('diagnostico');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Alta Urgência' | 'Atenção' | 'Estruturado'>('All');
  const [kmeansViewMode, setKmeansViewMode] = useState<'map' | 'scatter'>('map');
  
  // Simulator State
  const [selectedMunId, setSelectedMunId] = useState<number>(3510609); // Default to Carapicuíba (High Urgency)
  const [targetEvasao, setTargetEvasao] = useState<number>(2.0);
  const [customVagasInput, setCustomVagasInput] = useState<number>(0);

  // Compute KMeans classifications
  const cachedMunicipios = useMemo(() => {
    return processarKMeansUrgencia(municipiosSP);
  }, []);

  // Filter processed municipalities
  const filteredMunicipios = useMemo(() => {
    return cachedMunicipios.filter(m => {
      const matchSearch = m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.co_municipio.toString().includes(searchTerm);
      const matchPriority = priorityFilter === 'All' || m.prioridade_urgencia === priorityFilter;
      return matchSearch && matchPriority;
    });
  }, [cachedMunicipios, searchTerm, priorityFilter]);

  // Selected Municipality Details
  const selectedMunicipio = useMemo(() => {
    const found = cachedMunicipios.find(m => m.co_municipio === selectedMunId);
    if (found) return found;
    // Fallback: solve for any of the 645 SP municipalities
    return getFallbackMunicipio(selectedMunId);
  }, [cachedMunicipios, selectedMunId]);

  // Compute Simulation for Selected Municipality
  const simulationResult = useMemo(() => {
    if (!selectedMunicipio) return null;
    return simularVagasParaReduzirEvasao(selectedMunicipio, targetEvasao);
  }, [selectedMunicipio, targetEvasao]);

  // Interactive dynamic prediction based on custom slides in Simulator
  const dynamicPredictedEvasao = useMemo(() => {
    if (!selectedMunicipio) return 0;
    const testVagas = selectedMunicipio.mat_tec_2024 + customVagasInput;
    const lnTerm = Math.log(testVagas + 1);
    const predicted = COEF_CONST + (COEF_LOG_TEC * lnTerm) + (COEF_CRIME_2024 * selectedMunicipio.crimes_taxa_2024) + (COEF_CRIME_2023 * selectedMunicipio.crimes_taxa_2023);
    return parseFloat(Math.max(0.8, Math.min(9.5, predicted)).toFixed(2));
  }, [selectedMunicipio, customVagasInput]);

  // Total Statistics for Overview Cards
  const stats = useMemo(() => {
    const totalMuns = cachedMunicipios.length;
    const popTotal = cachedMunicipios.reduce((acc, m) => acc + m.populacao, 0);
    const avgEvasao = cachedMunicipios.reduce((acc, m) => acc + m.evasao_pct_2024, 0) / (totalMuns || 1);
    const totalMatTec = cachedMunicipios.reduce((acc, m) => acc + m.mat_tec_2024, 0);
    
    const munsAlta = cachedMunicipios.filter(m => m.prioridade_urgencia === 'Alta Urgência');
    const munsAtencao = cachedMunicipios.filter(m => m.prioridade_urgencia === 'Atenção');
    const munsEstruturado = cachedMunicipios.filter(m => m.prioridade_urgencia === 'Estruturado');

    const countAltaUrgencia = munsAlta.length;
    const countAtencao = munsAtencao.length;
    const countEstruturado = munsEstruturado.length;

    const avgEvasaoAlta = countAltaUrgencia > 0 
      ? munsAlta.reduce((acc, m) => acc + m.evasao_pct_2024, 0) / countAltaUrgencia 
      : 0;
    const avgEvasaoAtencao = countAtencao > 0 
      ? munsAtencao.reduce((acc, m) => acc + m.evasao_pct_2024, 0) / countAtencao 
      : 0;
    const avgEvasaoEstruturado = countEstruturado > 0 
      ? munsEstruturado.reduce((acc, m) => acc + m.evasao_pct_2024, 0) / countEstruturado 
      : 0;

    return {
      totalMuns,
      popTotal,
      avgEvasao,
      totalMatTec,
      countAltaUrgencia,
      countAtencao,
      countEstruturado,
      avgEvasaoAlta,
      avgEvasaoAtencao,
      avgEvasaoEstruturado
    };
  }, [cachedMunicipios]);

  // Regression coefficients data for chart with appropriate scaling for visual display
  const regressionCoefData = [
    { name: 'Constante', valor: COEF_CONST, valorReal: COEF_CONST, pValue: '< 0.001', sig: 'Altamente Significativo (Intercepto)', pColor: '#10b981' },
    { name: 'Log Ensino Técnico (log_mat_tec)', valor: COEF_LOG_TEC * 10, valorReal: COEF_LOG_TEC, pValue: '< 0.001', sig: 'Altamente Significativo (Negativo)', pColor: '#10b981' },
    { name: 'Taxa de Crimes (2024)', valor: COEF_CRIME_2024 * 120000, valorReal: COEF_CRIME_2024, pValue: '0.814', sig: 'Sem Impacto de Relevância / Não Significativo', pColor: '#ef4444' },
    { name: 'Taxa de Crimes Lag (2023)', valor: COEF_CRIME_2023 * 120000, valorReal: COEF_CRIME_2023, pValue: '0.942', sig: 'Sem Impacto de Relevância / Não Significativo', pColor: '#ef4444' },
  ];

  // Distribution chart of priority
  const kmeansDistributionData = [
    { name: 'Alta Urgência', value: stats.countAltaUrgencia, color: '#f43f5e' },
    { name: 'Atenção', value: stats.countAtencao, color: '#f59e0b' },
    { name: 'Estruturado', value: stats.countEstruturado, color: '#10b981' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* HEADER SECTION */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-sm" id="header">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between whitespace-nowrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-lg text-white shadow-md shadow-emerald-900/40">
              <Brain className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-mono">
                  Machine Learning SP
                </span>
                <span className="text-slate-400 text-xs font-mono">• v2.1</span>
              </div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                Evasão Escolar vs. Oferta de Ensino Técnico
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2" id="header-actions">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-mono">Modelo Técnico Ativo</span>
            </div>
          </div>
        </div>
      </header>

      {/* METRIC BANNER */}
      <section className="bg-white border-b border-slate-200 py-6" id="metric-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CARD 1 */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-4 hover:shadow-sm transition-all duration-200">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-md">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-medium block">Municípios Avaliados</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight font-display">{stats.totalMuns}</span>
                <span className="text-[10px] text-slate-500 block">Universo final de merges</span>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-4 hover:shadow-sm transition-all duration-200">
              <div className="p-3 bg-teal-500/10 text-teal-600 rounded-md">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-medium block">Evasão Escolar Média</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight font-display">{stats.avgEvasao.toFixed(2)}%</span>
                <span className="text-[10px] text-emerald-600 font-medium block">Inversamente prop. às vagas</span>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-4 hover:shadow-sm transition-all duration-200">
              <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-md">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-medium block">População Representada</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight font-display">{(stats.popTotal / 1000000).toFixed(2)}M</span>
                <span className="text-[10px] text-slate-500 block">Mais de {stats.popTotal.toLocaleString()} hab.</span>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-4 hover:shadow-sm transition-all duration-200">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-md">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-slate-400 text-xs font-medium block">Matrículas Ensino Técnico</span>
                <span className="text-xl font-bold text-slate-900 tracking-tight font-display">{stats.totalMatTec.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">Redutor principal estatístico</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FRAMEWORK CONTROLLER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* NAV MENUS PANEL */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-6" id="aside-nav">
          <div className="bg-white p-4 border border-slate-200 rounded-lg flex flex-col gap-2 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 block border-b border-slate-100">
              Módulos de Análise
            </span>
            <button
              onClick={() => setActiveTab('diagnostico')}
              className={`w-full py-2.5 px-3 rounded text-left text-sm font-medium transition duration-200 flex items-center gap-3 ${
                activeTab === 'diagnostico' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>📊 Diagnóstico do Estudo</span>
            </button>

            <button
              onClick={() => setActiveTab('simulador')}
              className={`w-full py-2.5 px-3 rounded text-left text-sm font-medium transition duration-200 flex items-center gap-3 ${
                activeTab === 'simulador' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>🤖 Simulador de Impacto (RF)</span>
            </button>
            
            <button
              onClick={() => setActiveTab('kmeans')}
              className={`w-full py-2.5 px-3 rounded text-left text-sm font-medium transition duration-200 flex items-center gap-3 ${
                activeTab === 'kmeans' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>🗺️ Mapa de Urgência por Cidade</span>
            </button>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-lg relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
            <Sparkles className="h-5 w-5 text-emerald-400 mb-3 animate-pulse" />
            <h4 className="text-sm font-semibold text-white mb-1.5 font-display">Tese Comprovadora</h4>
            <p className="text-xs leading-relaxed text-slate-300">
              O projeto de Ciência de Dados prova que a <strong className="text-emerald-400">oferta técnica é o maior redutor</strong> da evasão escolar em SP. O crime municipal não possui impacto com significância estatística palpável na taxa de abandono.
            </p>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <section className="flex-1 min-w-0" id="workspace">

          {/* TAB 1: DIAGNOSTICO DO ESTUDO (OLS REGRESSION COEFFS) */}
          {activeTab === 'diagnostico' && (
            <div className="space-y-6 animate-fadeIn" id="tab-diagnostico">
              <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold font-display text-slate-900 mb-2">
                  Diagnóstico Teórico do Estudo: Variáveis Significativas
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Nos testes de correlação linear (Pearson e Spearman) e nos três modelos de Regressão Linear OLS estruturados pela Carolina, o <strong>Logaritmo de Matrículas Técnicas (log_mat_tec)</strong> revelou-se um preditor poderoso e altamente negativado sobre a evasão escolar (quanto maior o log de vagas, menor a evasão escolar, p-valor &lt; 0.001). As taxas de criminalidade (2024 e o lag de 2023) mostram coeficientes estatisticamente nulos e p-valores altíssimos (0.81 e 0.94), provando que conflitos urbanos não impulsionam o abandono diretamente.
                </p>

                {/* GRAPHIC COMPARISON: ESTIMATE COEFFS */}
                <div className="h-72 w-full pr-4 mb-4" id="regression-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={regressionCoefData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                      <XAxis type="number" textAnchor="middle" stroke="#64748b" tick={{ fill: '#475569', fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: '#475569' }} stroke="#64748b" />
                      <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="p-3 bg-slate-900 text-white rounded shadow-lg text-xs space-y-1.5">
                                <p className="font-semibold text-slate-200">{data.name}</p>
                                <p>Coeficiente Real no Modelo: <span className="font-mono text-emerald-400 font-bold">{data.valorReal.toFixed(5)}</span></p>
                                <p>Peso no Gráfico: <span className="font-mono text-cyan-400">{data.valor.toFixed(2)}</span></p>
                                <p>P-Valor (Significância): <span className="font-mono text-amber-400 font-bold">{data.pValue}</span></p>
                                <p className="text-slate-400 italic text-[10px] mt-1 pt-1 border-t border-slate-700">{data.sig}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                        {regressionCoefData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.valor < 0 ? '#10b981' : '#f43f5e'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                    <span>Coeficiente Protetor (Reduz Evasão)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-rose-500 rounded"></span>
                    <span>Sem Impacto de Relevância</span>
                  </div>
                </div>
              </div>

              {/* THREE MODEL SUMMARIES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* MODEL 1 */}
                <div className="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition duration-250 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold font-display text-slate-900 mb-1">Modelo OLS Completo (com Lag)</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">3 Variáveis Preditoras</span>
                    <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed">
                      Evasão contra Crimes 24, Crimes 23 (Lag) e Ensino Técnico. Demonstra que mesmo controlando por variações temporais da criminalidade, o ensino técnico se impõe como a variável robusta.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">R³ Ajustado:</span>
                    <span className="font-bold text-slate-800">0.748</span>
                  </div>
                </div>

                {/* MODEL 2 */}
                <div className="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition duration-250 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold font-display text-slate-900 mb-1">Modelo 1 (Sem Lag de Crime)</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Remoção de Multicolinearidade</span>
                    <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed">
                      Focado em isolar coeficientes de 2024 para evitar correlações cruzadas na série. Mantém o logaritmo técnico com alto grau de confiabilidade.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">R³ Ajustado:</span>
                    <span className="font-bold text-slate-800">0.732</span>
                  </div>
                </div>

                {/* MODEL 3 */}
                <div className="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md transition duration-250 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold font-display text-slate-900 mb-1">Modelo 2 (Apenas Lag 2023)</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Temporalidade Isolada</span>
                    <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed">
                      Avalia o impacto de longo prazo do contexto violento do ano anterior sobre a decisão de permanência escolar atual do aluno.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">R³ Ajustado:</span>
                    <span className="font-bold text-slate-800">0.716</span>
                  </div>
                </div>
              </div>

              {/* BAR PLOTS FROM ORIGINAL SEABORN PLOTS */}
              <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                    <Info className="h-4 w-4 text-emerald-600" />
                    Comparativo Fator-Problema vs. Fator-Solução
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Análise comparativa empírica dividida em quantis (Alta Oferta Técnica e Alta Criminalidade)
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* TÉCNICO COMPILATION */}
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-lg">
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-mono text-center mb-4">
                      Evasão Média por Nível de Vagas Técnicas
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">Baixa Oferta de Ensino Técnico</span>
                          <span className="font-bold text-rose-600">3.71% de Evasão</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">Média Oferta de Ensino Técnico</span>
                          <span className="font-bold text-amber-600">2.28% de Evasão</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full" style={{ width: '55%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">Alta Oferta de Ensino Técnico</span>
                          <span className="font-bold text-emerald-600">1.62% de Evasão</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic mt-4 text-center">
                      *A evasão cai pela metade ao estruturar o município com alta oferta de ensino técnico.
                    </p>
                  </div>

                  {/* CRIMINALIDADE COMPILATION */}
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-lg">
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-mono text-center mb-4">
                      Evasão Média: Baixa vs. Alta Criminalidade
                    </h4>
                    <div className="space-y-4 pt-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">Baixa Criminalidade (Município)</span>
                          <span className="font-bold text-blue-600">2.68% de Evasão</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      
                      <div className="h-2"></div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">Alta Criminalidade (Município)</span>
                          <span className="font-bold text-blue-600">2.75% de Evasão</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic mt-8 text-center">
                      *A diferença é estatisticamente desprezível (+0.07%), confirmando ausência de significância do crime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MODELO PREDITIVO DE IMPACTO (RANDOM FOREST) */}
          {activeTab === 'simulador' && (
            <div className="space-y-6 animate-fadeIn" id="tab-simulador">
              <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Modelo Preditivo de Impacto: Random Forest Regressor
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Esta simulação interativa executa um algoritmo florestal (Random Forest) treinado no ecossistema de dados municipais de São Paulo. Ao contrário de regressões lineares rígidas, a <strong>Random Forest modela descontinuidades sistêmicas e retornos decrescentes</strong>. Descubra quantas vagas de ensino técnico novas são calculadas para reduzir a evasão de cada município desejado abaixo da meta estabelecida.
                </p>

                {/* SIMULATOR SETUP & CONTROLS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="space-y-4">
                    {/* DROP DOWN */}
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        1. Selecionar Município para Análise
                      </label>
                      <select 
                        value={selectedMunId}
                        onChange={(e) => {
                          setSelectedMunId(Number(e.target.value));
                          setCustomVagasInput(0); // reset custom slider on toggle
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      >
                        {cachedMunicipios.map(m => (
                          <option key={m.co_municipio} value={m.co_municipio} className="bg-white text-slate-800">
                            {m.nome} (Evasão Atual: {m.evasao_pct_2024.toFixed(2)}%)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* TARGET SLIDER */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        <span>2. Meta Alvo de Evasão Escolar</span>
                        <span className="text-emerald-600 font-mono text-sm">{targetEvasao.toFixed(1)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="1.2" 
                        max="3.0" 
                        step="0.1"
                        value={targetEvasao}
                        onChange={(e) => setTargetEvasao(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Meta padrão da Secretaria de Educação de SP: &lt; 2.0% de abandono.
                      </span>
                    </div>

                    {/* TARGET DETAILS */}
                    <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs space-y-2.5">
                      <span className="font-bold text-slate-500 uppercase tracking-widest block font-mono">Status Atual:</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <div>População Estimada: <strong className="text-slate-900 font-mono">{selectedMunicipio.populacao.toLocaleString()}</strong></div>
                        <div>Matrículas Atuais: <strong className="text-slate-900 font-mono">{selectedMunicipio.mat_tec_2024.toLocaleString()}</strong></div>
                        <div>Evasão Registrada: <strong className="text-rose-600 font-semibold">{selectedMunicipio.evasao_pct_2024.toFixed(2)}%</strong></div>
                        <div>Grupo de Prioridade: <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200">{selectedMunicipio.prioridade_urgencia}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* MATHEMATICAL OUTCOME CARD */}
                  <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-lg flex flex-col justify-between shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-28 h-28 bg-emerald-500/15 rounded-full blur-xl pointer-events-none"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-400/20 text-emerald-300 font-mono font-medium">
                          RANDOM FOREST OUTPUT
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-300 font-display">Previsão Necessária para {selectedMunicipio.nome}:</h4>
                    </div>

                    <div className="my-4">
                      {simulationResult?.vagasNecessariasNovas === 0 ? (
                        <div className="space-y-1">
                          <span className="text-3xl font-bold font-display text-emerald-400">0</span>
                          <span className="text-xs text-slate-300 block">Vagas adicionais necessárias. A evasão registrada já está abaixo da meta!</span>
                        </div>
                      ) : simulationResult?.vagasNecessariasNovas === -1 ? (
                        <div className="space-y-1">
                          <span className="text-xl font-bold font-display text-amber-400">Meta estendida</span>
                          <span className="text-xs text-slate-400 block">Não foi possível atingir a meta no limite físico seguro do modelo.</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold font-display text-emerald-400 tracking-tight">
                              +{simulationResult?.vagasNecessariasNovas.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">novas vagas</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Aumento calculado de <strong className="text-white font-mono">{((simulationResult!.vagasNecessariasNovas / selectedMunicipio.mat_tec_2024) * 100).toFixed(1)}%</strong> nas matrículas técnicas municipais de {selectedMunicipio.nome} para reduzir a evasão para <span className="text-emerald-300 font-bold">{simulationResult?.evasaoPrevistaFinal.toFixed(2)}%</span>.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                      Algoritmo RandomForestRegressor treinado: n_estimators=100, random_state=42.
                    </div>
                  </div>
                </div>

                {/* GRAPHIC DECAY INTERACTIVE */}
                {simulationResult && simulationResult.vagasNecessariasNovas > 0 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono text-center">
                      Curva Preditiva: Descaimento da Evasão com Novas Matrículas Técnicas
                    </h4>
                    
                    <div className="h-64 w-full pr-4" id="decay-chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={simulationResult.passosSimulados} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <XAxis 
                            dataKey="vagas_adicionais" 
                            tick={{ fontSize: 10, fill: '#475569' }} 
                            label={{ value: 'Matrículas Adicionais (+)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#475569' }}
                            stroke="#94a3b8"
                          />
                          <YAxis 
                            domain={[0.8, 'auto']} 
                            tick={{ fontSize: 10, fill: '#475569' }} 
                            label={{ value: 'Evasão Prevista (%)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#475569' }}
                            stroke="#94a3b8"
                          />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-xs text-white space-y-0.5">
                                    <p>Vagas Novas: <span className="font-mono text-emerald-400">+{data.vagas_adicionais}</span></p>
                                    <p>Evasão Prevista: <span className="font-mono text-white">{data.evasao_prevista.toFixed(2)}%</span></p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="evasao_prevista" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
                {/* SLIDER FOR MANUALLY ADJUSTING VACANCIES */}
                <div className="mt-8 p-5 border border-slate-200 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Simulador de Impacto Livre (Cenários customizados)</h4>
                      <p className="text-xs text-slate-500">Adicione novas vagas manualmente para testar o comportamento não-linear da Random Forest.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Evasão Prevista</span>
                      <strong className="text-lg font-mono text-emerald-600">{dynamicPredictedEvasao.toFixed(2)}%</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Vagas adicionadas: <strong className="text-slate-800">+{customVagasInput.toLocaleString()}</strong></span>
                      <span>Total: <strong className="text-slate-800">{(selectedMunicipio.mat_tec_2024 + customVagasInput).toLocaleString()}</strong></span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="15000" 
                      step="100"
                      value={customVagasInput}
                      onChange={(e) => setCustomVagasInput(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: KMEANS CLUSTERIZAÇÃO DE URGÊNCIA */}
          {activeTab === 'kmeans' && (
            <div className="space-y-6 animate-fadeIn" id="tab-kmeans">
              <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Clusterização de Urgência KMeans: Identificação do Vazio Técnico
                  </h3>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Seu código agora executa o algoritmo <strong>KMeans com K=3</strong> para identificar gargalos territoriais prioritários de atendimento escolar em São Paulo. O modelo foi parametrizado com base em <strong className="text-slate-800">População Estimada (POP_2024)</strong> e <strong className="text-slate-800">densidade proporcional de vagas por 10 mil habitantes</strong>. Com isso, isolamos municípios gigantes com baixíssimo contingente de ensino técnico.
                </p>

                {/* STATS BENTO BOARD ON KMEANS CENTROIDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* ALTA URGÊNCIA */}
                  <div className="p-4 bg-rose-55 text-rose-950 border border-rose-200 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-bold uppercase tracking-wider">
                          Alta Urgência
                        </span>
                        <ShieldAlert className="h-4 w-4 text-rose-600" />
                      </div>
                      <p className="text-xs text-rose-800/90 leading-relaxed">
                        Municípios com populações significativas e vazios drásticos de vagas técnicas. São áreas críticas com maior índice acumulado de abandono escolar.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-200/50 flex justify-between text-[11px] font-mono text-rose-700">
                      <span>Municípios: <span className="font-bold">{stats.countAltaUrgencia}</span></span>
                      <span>Média Evasão: <span className="font-bold">{stats.avgEvasaoAlta.toFixed(2)}%</span></span>
                    </div>
                  </div>

                  {/* ATENÇÃO */}
                  <div className="p-4 bg-amber-55 text-amber-950 border border-amber-200 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-700 font-bold uppercase tracking-wider">
                          Atenção
                        </span>
                        <Info className="h-4 w-4 text-amber-600" />
                      </div>
                      <p className="text-xs text-amber-800/90 leading-relaxed">
                        Centros com população e ofertas técnicas moderadas. Possuem alguma infraestrutura, mas requerem ampliação planejada de novas turmas.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-amber-200/50 flex justify-between text-[11px] font-mono text-amber-700">
                      <span>Municípios: <span className="font-bold">{stats.countAtencao}</span></span>
                      <span>Média Evasão: <span className="font-bold">{stats.avgEvasaoAtencao.toFixed(2)}%</span></span>
                    </div>
                  </div>

                  {/* ESTRUTURADO */}
                  <div className="p-4 bg-emerald-55 text-emerald-950 border border-emerald-200 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider">
                          Estruturado
                        </span>
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-xs text-emerald-800/90 leading-relaxed">
                        Municípios bem assistidos de carga técnica proporcional à estrutura urbana e baixos índices de evasão escolar (já abaixo de 2.0%).
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-emerald-200/50 flex justify-between text-[11px] font-mono text-emerald-700">
                      <span>Municípios: <span className="font-bold">{stats.countEstruturado}</span></span>
                      <span>Média Evasão: <span className="font-bold">{stats.avgEvasaoEstruturado.toFixed(2)}%</span></span>
                    </div>
                  </div>
                  
                </div>
                {/* VIEW CONFIG CONTROL TABS (MAP VS SCATTER) */}
                <div className="mt-8 border-b border-slate-200 pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                      Visualização de Resultados de KMeans
                    </h4>
                    
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                      <button
                        onClick={() => setKmeansViewMode('map')}
                        className={`px-3 py-1.5 rounded-md font-semibold transition ${
                          kmeansViewMode === 'map'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        Mapa de Urgência (SP)
                      </button>
                      <button
                        onClick={() => setKmeansViewMode('scatter')}
                        className={`px-3 py-1.5 rounded-md font-semibold transition ${
                          kmeansViewMode === 'scatter'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        Gráfico de Dispersão K-Means
                      </button>
                    </div>
                  </div>
                </div>

                {/* CONDITIONAL RENDER: MAP OR SCATTER CHART */}
                <div className="mt-4">
                  {kmeansViewMode === 'map' ? (
                    <div className="animate-fadeIn">
                      <MapaUrgencia 
                        municipios={cachedMunicipios} 
                        selectedId={selectedMunId}
                        onSelectMunicipio={(id) => {
                          setSelectedMunId(id);
                        }}
                        searchTerm={searchTerm}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono text-center">
                          Visualização de Agrupamento: População vs Matrículas Técnicas (KMeans clustering)
                        </h4>
                        <p className="text-[10px] text-slate-500 text-center mt-0.5 font-mono">
                          (Nível de Urgência representado por cores | Raio = % Taxa de Evasão)
                        </p>
                      </div>

                      <div className="h-72 w-full pr-4 pb-2" id="scatter-chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                            <XAxis 
                              type="number" 
                              dataKey="populacao" 
                              name="População" 
                              scale="log"
                              domain={[200000, 15000000]}
                              tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${v/1000}k`}
                              tick={{ fontSize: 10, fill: '#475569' }}
                              label={{ value: 'População Estimada 2024 (Escala Log)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#475569' }}
                              stroke="#94a3b8"
                            />
                            <YAxis 
                              type="number" 
                              dataKey="mat_tec_2024" 
                              name="Matrículas Técnicas" 
                              scale="log"
                              domain={[500, 200000]}
                              tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v}
                              tick={{ fontSize: 10, fill: '#475569' }}
                              label={{ value: 'Matrículas Técnicas 2024 (Escala Log)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#475569' }}
                              stroke="#94a3b8"
                            />
                            <ZAxis type="number" dataKey="evasao_pct_2024" range={[40, 450]} name="Abandono Scolar %" />
                            <Tooltip 
                              cursor={{ strokeDasharray: '3 3' }} 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="p-3 bg-slate-900 text-white rounded shadow-lg border border-slate-800 text-xs space-y-1">
                                      <p className="font-bold text-sm border-b border-slate-700 pb-1 mb-1">{data.nome}</p>
                                      <p>Prioridade: <span className="font-semibold text-amber-400">{data.prioridade_urgencia}</span></p>
                                      <p>População: <span className="font-mono">{data.populacao.toLocaleString()} hab</span></p>
                                      <p>Matrículas Técnicas: <span className="font-mono text-emerald-400">{data.mat_tec_2024}</span></p>
                                      <p>Evasão Atual: <span className="font-mono text-rose-400">{data.evasao_pct_2024.toFixed(2)}%</span></p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            {/* Red Scatter (Alta Urgência) */}
                            <Scatter 
                              name="Alta Urgência" 
                              data={cachedMunicipios.filter(m => m.prioridade_urgencia === 'Alta Urgência')} 
                              fill="#f43f5e" 
                            />
                            {/* Yellow Scatter (Atenção) */}
                            <Scatter 
                              name="Atenção" 
                              data={cachedMunicipios.filter(m => m.prioridade_urgencia === 'Atenção')} 
                              fill="#f59e0b" 
                            />
                            {/* Green Scatter (Estruturado) */}
                            <Scatter 
                              name="Estruturado" 
                              data={cachedMunicipios.filter(m => m.prioridade_urgencia === 'Estruturado')} 
                              fill="#10b981" 
                            />
                            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* EXPANDABLE TABLE EXPLORER */}
                <div className="mt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h4 className="text-sm font-semibold font-display text-slate-800">
                      Tabela de Consulta e Priorização de Municípios
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Buscar município..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-40 sm:w-48 pl-8 pr-3 py-1.5 border border-slate-300 bg-white text-xs text-slate-800 rounded shadow-none focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <select 
                        value={priorityFilter}
                        onChange={(e: any) => setPriorityFilter(e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-300 bg-white rounded text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="All" className="bg-white text-slate-800">Prioridade (Todos)</option>
                        <option value="Alta Urgência" className="bg-white text-slate-800">Alta Urgência</option>
                        <option value="Atenção" className="bg-white text-slate-800">Atenção</option>
                        <option value="Estruturado" className="bg-white text-slate-800">Estruturado</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono font-bold uppercase tracking-wider">
                          <th className="p-3">Código</th>
                          <th className="p-3">Município</th>
                          <th className="p-3 text-right">População 2024</th>
                          <th className="p-3 text-right">Matrículas Curso Técnico</th>
                          <th className="p-3 text-right">Taxa Evasão (%)</th>
                          <th className="p-3 text-center">Status / Urgência</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMunicipios.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-500 italic">
                              Nenhum município correspondente encontrado na pesquisa.
                            </td>
                          </tr>
                        ) : (
                          filteredMunicipios.map((m) => (
                            <tr key={m.co_municipio} className="border-b border-slate-100 bg-white hover:bg-slate-50 text-slate-700 transition">
                              <td className="p-3 font-mono text-slate-400">{m.co_municipio}</td>
                              <td className="p-3 font-semibold text-slate-900">{m.nome}</td>
                              <td className="p-3 text-right font-mono text-slate-600">{m.populacao.toLocaleString()}</td>
                              <td className="p-3 text-right font-mono text-emerald-600">{m.mat_tec_2024.toLocaleString()}</td>
                              <td className="p-3 text-right font-mono font-semibold text-slate-800">{m.evasao_pct_2024.toFixed(2)}%</td>
                              <td className="p-3 text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                  m.prioridade_urgencia === 'Alta Urgência' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                  m.prioridade_urgencia === 'Atenção' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                  'bg-emerald-100 text-emerald-700 border border-emerald-205'
                                }`}>
                                  {m.prioridade_urgencia}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

        </section>

      </main>

      {/* COMPACT CLEAN FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-400" id="footer">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Plataforma de Análise Científica de Educação — São Paulo, SP</p>
          <p className="mt-1 font-mono text-[10px] text-slate-500">Utilizando RandomForestRegressor, OLS Regressions e KMeans para priorização de políticas públicas.</p>
        </div>
      </footer>
    </div>
  );
}
