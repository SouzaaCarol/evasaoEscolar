export const completePythonCode = `# ==============================================================================
# PROJETO: IMPACTO DA OFERTA TÉCNICA E CRIMINALIDADE NA EVASÃO ESCOLAR EM SP
# AUTORA: Carolina (atualizado com novas funcionalidades de IA)
# ==============================================================================

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import pearsonr, spearmanr
import statsmodels.api as sm
import unicodedata  # Para normalizar nomes
import numpy as np

# NOVAS DEPENDÊNCIAS DE IA ADICIONADAS
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def normalize_name(name):
    return unicodedata.normalize('NFKD', name.upper()).encode('ascii', 'ignore').decode('utf-8')

# ------------------------------------------------------------------------------
# 1. CARREGAMENTO E TRATAMENTO DOS CRIMES 2024
# ------------------------------------------------------------------------------
caminho_crimes_2024 = r'C:\\Users\\carol\\OneDrive\\Documentos\\evasaoEscolar\\dadosCriminais\\SPDadosCriminais_2024.csv'
df_crimes_2024 = pd.read_csv(
    caminho_crimes_2024, 
    sep=';',  
    encoding='utf-8', 
    quotechar='"', 
    doublequote=True,  # Trata aspas duplas
    on_bad_lines='skip',  # Pula linhas malformadas
    engine='python'  # Mais tolerante a erros
)  

print("Primeiras 5 linhas (2024):")
print(df_crimes_2024.head())
print("\\nColunas disponíveis:")
print(df_crimes_2024.columns.tolist())
print(f"\\nTamanho do DF: {df_crimes_2024.shape[0]} linhas")

df_crimes_2024 = df_crimes_2024[df_crimes_2024['NOME_MUNICIPIO_CIRCUNSCRIÇÃO'] != 'OCULTADO']
df_crimes_2024 = df_crimes_2024[df_crimes_2024['ANO_ESTATISTICA'] == 2024]

df_crimes_2024['MUN_NORM'] = df_crimes_2024['NOME_MUNICIPIO_CIRCUNSCRIÇÃO'].apply(normalize_name)
df_crimes_agg_2024 = df_crimes_2024.groupby('MUN_NORM').size().reset_index(name='crimes_abs_2024')

print(f"Crimes agregados 2024: {len(df_crimes_agg_2024)} municípios")

# ------------------------------------------------------------------------------
# 2. CARREGAMENTO E TRATAMENTO DOS CRIMES 2023
# ------------------------------------------------------------------------------
caminho_crimes_2023 = r'C:\\Users\\carol\\OneDrive\\Documentos\\evasaoEscolar\\dadosCriminais\\SPDadosCriminais_2023.csv'
df_crimes_2023 = pd.read_csv(
    caminho_crimes_2023, 
    sep=';',  
    encoding='utf-8', 
    quotechar='"', 
    doublequote=True,  # Trata aspas duplas
    on_bad_lines='skip',  # Pula linhas malformadas
    engine='python'  # Mais tolerante a erros
)  

print("Primeiras 5 linhas de 2023:")
print(df_crimes_2023.head())
df_crimes_2023 = df_crimes_2023[df_crimes_2023['NOME_MUNICIPIO_CIRCUNSCRIÇÃO'] != 'OCULTADO']
df_crimes_2023 = df_crimes_2023[df_crimes_2023['ANO_ESTATISTICA'] == 2023]

df_crimes_2023['MUN_NORM'] = df_crimes_2023['NOME_MUNICIPIO_CIRCUNSCRIÇÃO'].apply(normalize_name)
df_crimes_agg_2023 = df_crimes_2023.groupby('MUN_NORM').size().reset_index(name='crimes_abs_2023')

print(f"Crimes agregados 2023: {len(df_crimes_agg_2023)} municípios")

# ------------------------------------------------------------------------------
# 3. CARREGAMENTO DOS DADOS DE POPULAÇÃO (IBGE)
# ------------------------------------------------------------------------------
caminho_pop = r'C:\\Users\\carol\\OneDrive\\Documentos\\evasaoEscolar\\dadosPopulacao\\estimativa_dou_2024.xls'
sheet_name = 'MUNICÍPIOS'

df_pop = pd.read_excel(caminho_pop, sheet_name=sheet_name, skiprows=2)

# Filtrar só SP e renomear colunas
df_pop.columns = ['UF', 'COD. UF', 'COD. MUNIC', 'NOME DO MUNICÍPIO', 'POPULAÇÃO ESTIMADA'] 
df_pop = df_pop[df_pop['UF'] == 'SP'] 
df_pop = df_pop.reset_index(drop=True)

# Renomear para as colunas finais
df_pop.columns = ['UF', 'COD_UF', 'COD_MUN', 'NOME_MUN', 'POP_2024'] 

# Garantir que as colunas são numéricas
df_pop['COD_UF'] = pd.to_numeric(df_pop['COD_UF'], errors='coerce')
df_pop['COD_MUN'] = pd.to_numeric(df_pop['COD_MUN'], errors='coerce')
df_pop['POP_2024'] = pd.to_numeric(df_pop['POP_2024'], errors='coerce')

df_pop['CO_MUNICIPIO'] = df_pop['COD_UF'] * 100000 + df_pop['COD_MUN'] 
df_pop['CO_MUNICIPIO'] = df_pop['CO_MUNICIPIO'].astype(int) 
df_pop['MUN_NORM'] = df_pop['NOME_MUN'].apply(normalize_name)
df_pop = df_pop[['CO_MUNICIPIO', 'MUN_NORM', 'POP_2024']].dropna()

print(f"\\nMunicípios SP carregados: {len(df_pop)}")
print(f"População total SP: {df_pop['POP_2024'].sum():,.0f}")

# ------------------------------------------------------------------------------
# 4. PAREAMENTO E CÁLCULO DAS TAXAS DE CRIME (2024 e 2023)
# ------------------------------------------------------------------------------
df_crimes_agg_2024 = df_crimes_agg_2024.merge(df_pop, on='MUN_NORM', how='left')
df_crimes_agg_2024['crimes_taxa_2024'] = (df_crimes_agg_2024['crimes_abs_2024'] / df_crimes_agg_2024['POP_2024']) * 100000
df_crimes_agg_2024 = df_crimes_agg_2024[['MUN_NORM', 'crimes_abs_2024']].copy()

df_crimes_agg_2024 = df_crimes_agg_2024.merge(
    df_pop[['MUN_NORM', 'CO_MUNICIPIO', 'POP_2024']], 
    on='MUN_NORM', 
    how='left'
)
df_crimes_agg_2024['CO_MUNICIPIO'] = df_crimes_agg_2024['CO_MUNICIPIO'].astype('Int64')
df_crimes_agg_2024 = df_crimes_agg_2024.dropna(subset=['POP_2024']) 

df_crimes_agg_2024['crimes_taxa_2024'] = (
    df_crimes_agg_2024['crimes_abs_2024'] / df_crimes_agg_2024['POP_2024']
) * 100000
df_crimes_agg_2024 = df_crimes_agg_2024[['CO_MUNICIPIO', 'MUN_NORM', 'crimes_abs_2024', 'POP_2024', 'crimes_taxa_2024']]

print(f"Crimes 2024 com Taxa e CO_MUNICIPIO: {len(df_crimes_agg_2024)} municípios")

# Taxa de Crimes 2023
df_crimes_agg_2023_taxa = df_crimes_agg_2023[['MUN_NORM', 'crimes_abs_2023']].copy()
df_crimes_agg_2023_taxa = df_crimes_agg_2023_taxa.merge(
    df_pop[['MUN_NORM', 'CO_MUNICIPIO', 'POP_2024']], 
    on='MUN_NORM', 
    how='left'
)
df_crimes_agg_2023_taxa['CO_MUNICIPIO'] = df_crimes_agg_2023_taxa['CO_MUNICIPIO'].astype('Int64')
df_crimes_agg_2023_taxa = df_crimes_agg_2023_taxa.dropna(subset=['POP_2024']) 

df_crimes_agg_2023_taxa['crimes_taxa_2023'] = (
    df_crimes_agg_2023_taxa['crimes_abs_2023'] / df_crimes_agg_2023_taxa['POP_2024']
) * 100000
df_crimes_agg_2023_taxa = df_crimes_agg_2023_taxa[['CO_MUNICIPIO', 'MUN_NORM', 'crimes_taxa_2023']]

print(f"Crimes 2023 com Taxa e CO_MUNICIPIO: {len(df_crimes_agg_2023_taxa)} municípios")

# ------------------------------------------------------------------------------
# 5. CARREGAMENTO DOS DADOS DE EVASÃO ESCOLAR (2024)
# ------------------------------------------------------------------------------
caminho_evasao_2024 = r'C:\\Users\\carol\\OneDrive\\Documentos\\evasaoEscolar\\dadosEvasao\\taxas_transicao_2024.xlsx'
sheet_name = 'MUNICIPIOS '  

df_evasao_2024_bruto = pd.read_excel(caminho_evasao_2024, sheet_name=sheet_name, skiprows=5, header=0, usecols=None) 

df_evasao_2024_sp = df_evasao_2024_bruto[
    (df_evasao_2024_bruto.iloc[:, 0] == 2024) &  
    (df_evasao_2024_bruto.iloc[:, 2] == 'SP')    
].copy()

df_evasao_2024_sp.loc[:, 'CO_MUNICIPIO'] = pd.to_numeric(df_evasao_2024_sp.iloc[:, 3], errors='coerce').astype('Int64')

# Usando índice 57 (BF - Abandono Total Ensino Médio)
df_evasao_2024_sp.loc[:, 'evasao_pct_2024'] = pd.to_numeric(df_evasao_2024_sp.iloc[:, 57], errors='coerce') 
df_evasao_2024_sp = df_evasao_2024_sp.dropna(subset=['evasao_pct_2024', 'CO_MUNICIPIO'])

df_evasao_2024_final = df_evasao_2024_sp.groupby('CO_MUNICIPIO')['evasao_pct_2024'].mean().reset_index()
df_evasao_2024_final['CO_MUNICIPIO'] = df_evasao_2024_final['CO_MUNICIPIO'].astype(int)

print(f"\\nMunicípios SP com evasão: {len(df_evasao_2024_final)}")
print(f"Média de evasão em SP: {df_evasao_2024_final['evasao_pct_2024'].mean():.2f}%")

# ------------------------------------------------------------------------------
# 6. CARREGAMENTO DAS MATRÍCULAS TÉCNICAS (Censo Escolar 2024)
# ------------------------------------------------------------------------------
caminho_tec = r'C:\\Users\\carol\\OneDrive\\Documentos\\evasaoEscolar\\dadosEvasao\\cursos_tecnicos_sp_2024.csv' 
df_tec = pd.read_csv(caminho_tec, sep=',', encoding='utf-8', on_bad_lines='skip') 

df_tec_sp = df_tec[df_tec['SG_UF'] == 'SP'].copy()
df_tec_sp.rename(columns={
    'NO_MUNICIPIO': 'NOME_MUN',
    'QT_MAT_CURSO_TEC': 'MATRICULAS_TECNICAS'
}, inplace=True)

df_tec_sp['MUN_NORM'] = df_tec_sp['NOME_MUN'].apply(normalize_name)
df_tec_agg = df_tec_sp.groupby('MUN_NORM')['MATRICULAS_TECNICAS'].sum().reset_index(name='mat_tec_2024')
df_tec_agg = df_tec_agg.merge(df_pop[['MUN_NORM', 'CO_MUNICIPIO']], on='MUN_NORM', how='inner')
df_tec_agg['CO_MUNICIPIO'] = df_tec_agg['CO_MUNICIPIO'].astype(int)

print(f"\\nMatrículas Técnicas agregadas: {len(df_tec_agg)} municípios")

# ------------------------------------------------------------------------------
# 7. CONSTRUÇÃO DO DATA FRAME INTEGRADO (DF_FINAL)
# ------------------------------------------------------------------------------
df_final = df_evasao_2024_final.merge(
    df_crimes_agg_2024[['CO_MUNICIPIO', 'crimes_taxa_2024', 'POP_2024', 'MUN_NORM']],
    on='CO_MUNICIPIO',
    how='inner'
)
df_final = df_final.merge(
    df_crimes_agg_2023_taxa[['CO_MUNICIPIO', 'crimes_taxa_2023']],
    on='CO_MUNICIPIO',
    how='inner'
)
df_final = df_final.merge(
    df_tec_agg[['CO_MUNICIPIO', 'mat_tec_2024']],
    on='CO_MUNICIPIO',
    how='inner'
)

# Preparação da variável de ensino técnico (logaritmo)
df_final['log_mat_tec'] = np.log(df_final['mat_tec_2024'] + 1)

print(f"\\nUniverso Final após Merges: {len(df_final)} municípios")

# ------------------------------------------------------------------------------
# 8. REGRESSÕES LINEARES OLS (MODELOS EXISTENTES)
# ------------------------------------------------------------------------------
Y = df_final['evasao_pct_2024']

# OLS completo
X_full = df_final[['crimes_taxa_2024', 'crimes_taxa_2023', 'log_mat_tec']]
X_full = sm.add_constant(X_full)
resultado = sm.OLS(Y, X_full, missing='drop').fit()
print("\\n" + "="*50)
print("REGRESSÃO OLS COMPLETA (COM LAG)")
print("="*50)
print(resultado.summary())

# OLS limpo (Sem Lag)
X_clean = df_final[['crimes_taxa_2024', 'log_mat_tec']]
X_clean = sm.add_constant(X_clean)
resultado_clean = sm.OLS(Y, X_clean, missing='drop').fit()
print("\\n" + "="*50)
print("REGRESSÃO OLS - MODELO 1 (SEM VARIÁVEL LAG)")
print("="*50)
print(resultado_clean.summary())

# OLS apenas Lag
X_lag = df_final[['crimes_taxa_2023', 'log_mat_tec']]
X_lag = sm.add_constant(X_lag)
resultado_lag = sm.OLS(Y, X_lag, missing='drop').fit()
print("\\n" + "="*50)
print("REGRESSÃO OLS - MODELO 2 (APENAS LAG 2023)")
print("="*50)
print(resultado_lag.summary())

# ==============================================================================
# NOVO REQUISITO 1: MODELO PREDITIVO DE IMPACTO (RANDOM FOREST REGRESSOR)
# ==============================================================================
print("\\n" + "="*50)
print("NOVA FUNCIONALIDADE IA: MODELO PREDITIVO DE IMPACTO")
print("="*50)

# Treinamos um RandomForestRegressor para lidar com padrões não-lineares
X_rf = df_final[['crimes_taxa_2024', 'crimes_taxa_2023', 'mat_tec_2024']]
y_rf = df_final['evasao_pct_2024']

# Instanciando e treinando o Random Forest
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_rf, y_rf)

def simular_vagas_para_reduzir_evasao(co_municipio, target_evasao=2.0, max_vagas_adicionais=15000):
    \"\"\"
    Simula quantas vagas/matrículas adicionais de ensino técnico são necessárias 
    para reduzir a taxa de evasão escolar para menos de target_evasao%.
    \"\"\"
    linha = df_final[df_final['CO_MUNICIPIO'] == co_municipio]
    if linha.empty:
        print(f"Município {co_municipio} não encontrado.")
        return None
        
    mun_nome = linha.iloc[0]['MUN_NORM']
    vagas_atuais = linha.iloc[0]['mat_tec_2024']
    evasao_atual = linha.iloc[0]['evasao_pct_2024']
    crime_24 = linha.iloc[0]['crimes_taxa_2024']
    crime_23 = linha.iloc[0]['crimes_taxa_2023']
    
    if evasao_atual < target_evasao:
        print(f"[{mun_nome}] Evasão atual ({evasao_atual:.2f}%) já é inferior a meta de {target_evasao}%. Vagas adicionais: 0.")
        return 0, evasao_atual
        
    # Testar iterativamente vagas novas para encontrar o limite
    vagas_adicionais = 0
    # Definimos um passo de simulação pragmático
    passo = 50
    vaga_limite_encontrada = False
    
    while vagas_adicionais <= max_vagas_adicionais:
        test_X = pd.DataFrame([{
            'crimes_taxa_2024': crime_24,
            'crimes_taxa_2023': crime_23,
            'mat_tec_2024': vagas_atuais + vagas_adicionais
        }])
        
        evasao_prevista = rf_model.predict(test_X)[0]
        if evasao_prevista < target_evasao:
            vaga_limite_encontrada = True
            break
        vagas_adicionais += passo
        
    if vaga_limite_encontrada:
        print(f"[{mun_nome}] Simulação RF concluída com SUCESSO:")
        print(f"  - Evasão Atual: {evasao_atual:.2f}% | Vagas Atuais: {vagas_atuais:.0f}")
        print(f"  - Vagas adicionais necessárias: +{vagas_adicionais} novas matrículas")
        print(f"  - Evasão estimada final: {evasao_prevista:.2f}% (Meta < {target_evasao}%)")
        return vagas_adicionais, evasao_prevista
    else:
        # Tenta estender a busca se não encontrou com o limite inicial
        print(f"[{mun_nome}] Aviso: Meta de {target_evasao}% não atingida com limitador de +{max_vagas_adicionais} vagas.")
        # Previsão limite com valor estendido
        test_X_max = pd.DataFrame([{
            'crimes_taxa_2024': crime_24,
            'crimes_taxa_2023': crime_23,
            'mat_tec_2024': vagas_atuais + max_vagas_adicionais
        }])
        evasao_max = rf_model.predict(test_X_max)[0]
        print(f"  - Menor evasão alcançada na simulação: {evasao_max:.2f}%")
        return max_vagas_adicionais, evasao_max

# Exemplo de teste da simulação
municipio_teste = df_final.iloc[0]['CO_MUNICIPIO'] # Pega o primeiro município para teste
simular_vagas_para_reduzir_evasao(municipio_teste)


# ==============================================================================
# NOVO REQUISITO 2: CLUSTERIZAÇÃO DE URGÊNCIA (K-MEANS)
# ==============================================================================
print("\\n" + "="*50)
print("NOVA FUNCIONALIDADE IA: CLUSTERIZAÇÃO DE URGÊNCIA DE ATENDIMENTO")
print("="*50)

# Para identificar municípios com MUITA POPULAÇÃO e POUCA OFERTA TÉCNICA
# Montamos as features relativas: População Absoluta e Proporção de vagas por 10 mil habitantes
df_kmeans = df_final[['POP_2024', 'mat_tec_2024']].copy()
df_kmeans['vagas_por_10k_hab'] = (df_kmeans['mat_tec_2024'] / df_kmeans['POP_2024']) * 10000

# Padronizando as características para evitar que a magnitude altere o KMeans
scaler = StandardScaler()
X_cluster_scaled = scaler.fit_transform(df_kmeans[['POP_2024', 'vagas_por_10k_hab']])

# Executa o algoritmo KMeans para agrupar em 3 grupos
kmeans_sp = KMeans(n_clusters=3, random_state=42, n_init=10)
df_final['CLUSTER_ID'] = kmeans_sp.fit_predict(X_cluster_scaled)

# Classificamos os grupos de forma explicativa, ordenando-os inteligentemente.
# Definimos o "índice de risco/urgência" baseado em População alta com poucas vagas por habitante.
stats_cluster = df_final.groupby('CLUSTER_ID').agg(
    pop_media=('POP_2024', 'mean'),
    vagas_por_10k_media=('mat_tec_2024', lambda x: (x / df_final.loc[x.index, 'POP_2024']).mean() * 10000)
).reset_index()

# Urgência cresce com população e encolhe com vagas abundantes
stats_cluster['urgencia_score'] = stats_cluster['pop_media'] / (stats_cluster['vagas_por_10k_media'] + 0.01)
stats_cluster = stats_cluster.sort_values(by='urgencia_score', ascending=False).reset_index(drop=True)

# Mapeia IDs para os termos solicitados
label_map = {
    stats_cluster.loc[0, 'CLUSTER_ID']: 'Alta Urgência',
    stats_cluster.loc[1, 'CLUSTER_ID']: 'Atenção',
    stats_cluster.loc[2, 'CLUSTER_ID']: 'Estruturado'
}

df_final['PRIORIDADE_URGENCIA'] = df_final['CLUSTER_ID'].map(label_map)

# Exibe resumo analítico dos agrupamentos
print("Média das características por Grupo de Urgência:")
resumo_kmeans = df_final.groupby('PRIORIDADE_URGENCIA').agg(
    total_municipios=('CO_MUNICIPIO', 'count'),
    populacao_media=('POP_2024', 'mean'),
    total_vagas_medio=('mat_tec_2024', 'mean'),
    evasao_media=('evasao_pct_2024', 'mean')
).reindex(['Alta Urgência', 'Atenção', 'Estruturado'])
print(resumo_kmeans)


# ------------------------------------------------------------------------------
# 9. PLOTS E MAPAS ATUALIZADOS (INCORPORANDO OS DOIS REQUISITOS)
# ------------------------------------------------------------------------------

# 9.1. Gráfico de Barras: Evasão por nível de oferta técnica (Existente)
plt.figure(figsize=(9, 6))
df_final['NIVEL_TECNICO'] = pd.qcut(
    df_final['mat_tec_2024'], 
    q=3, 
    labels=['Baixa Oferta', 'Média Oferta', 'Alta Oferta'],
    duplicates='drop' 
)
df_evasao_por_nivel = df_final.groupby('NIVEL_TECNICO')['evasao_pct_2024'].mean().reset_index()
sns.barplot(x='NIVEL_TECNICO', y='evasao_pct_2024', data=df_evasao_por_nivel, palette=['#f8d29b', '#f4a261', '#e76f51'])
plt.title('Evasão Média por Nível de Oferta de Matrícula Técnica', fontsize=14)
plt.ylabel('Taxa de Evasão (%)')
plt.grid(axis='y', linestyle='--', alpha=0.5)

# 9.2. NOVO PLOT: Distribuição Espacial dos Clusters KMeans
plt.figure(figsize=(10, 6))
sns.scatterplot(
    data=df_final, 
    x='POP_2024', 
    y='mat_tec_2024', 
    hue='PRIORIDADE_URGENCIA',
    palette={'Alta Urgência': '#e76f51', 'Atenção': '#f4a261', 'Estruturado': '#2a9d8f'},
    size='evasao_pct_2024', 
    sizes=(20, 200),
    alpha=0.8
)
plt.xscale('log')
plt.yscale('log')
plt.title('Dispersão KMeans: População vs Vagas Técnicas (Tamanho = % Evasão)', fontsize=14)
plt.xlabel('População Estimada 2024 (Escala Log)')
plt.ylabel('Matrículas Técnicas 2024 (Escala Log)')
plt.grid(True, which="both", ls="--", alpha=0.5)
plt.legend(title='Prioridade / Grupo')
plt.tight_layout()

# ------------------------------------------------------------------------------
# 10. GEOPANDAS MAPA DE INTEGRAÇÃO (SE DISPONÍVEL)
# ------------------------------------------------------------------------------
try:
    import geopandas as gpd
    caminho_shp = r'C:\\Users\\carol\\OneDrive\\Documentos\\evasaoEscolar\\SP_Municipios\\SP_Municipios_2024.shp' 
    gdf_sp = gpd.read_file(caminho_shp)
    gdf_sp.rename(columns={'CD_MUN': 'CO_MUNICIPIO'}, inplace=True) 
    gdf_sp['CO_MUNICIPIO'] = pd.to_numeric(gdf_sp['CO_MUNICIPIO'], errors='coerce').astype('Int64')
    
    # Merge
    gdf_final = gdf_sp.merge(df_final, on='CO_MUNICIPIO', how='left')
    gdf_final['Taxa de Evasão (%)'] = gdf_final['evasao_pct_2024'].fillna(0)
    gdf_final['Prioridade Urgência'] = gdf_final['PRIORIDADE_URGENCIA'].fillna('Sem Dados')

    fig, axes = plt.subplots(1, 2, figsize=(20, 10))
    gdf_final.plot(column='Taxa de Evasão (%)', ax=axes[0], legend=True, cmap='OrRd', edgecolor='0.8', linewidth=0.1)
    axes[0].set_title('MAPA 1: Taxa de Evasão no Ensino Médio (%)')
    axes[0].set_axis_off()

    # Mapa mostrando os grupos gerados pela IA (KMeans)
    gdf_final.plot(column='Prioridade Urgência', ax=axes[1], legend=True, 
                   cmap='prism', edgecolor='0.8', linewidth=0.1)
    axes[1].set_title('MAPA 2: Agrupamentos de Urgência KMeans')
    axes[1].set_axis_off()
    
    plt.suptitle('Resultados Espaciais e Agrupamento KMeans (IA)', fontsize=16)
    plt.show()
except Exception as e:
    print(f"\\n[Aviso] Falha ao plotar mapas Geopandas (GeoPandas ou shapefile ausente): {e}")

print("\\nFluxo Completo Executado com Sucesso! Novas funções de IA integradas.")
`;
